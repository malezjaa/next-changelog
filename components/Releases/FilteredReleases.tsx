'use client'

import { useState, useMemo } from 'react'
import ReleaseFilter, { FilterOptions } from './ReleaseFilter'
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import Link from "next/link"
import moment from 'moment'
import Image from "next/image"
import React from "react"
import { FiExternalLink } from "react-icons/fi"
import { Release } from "@/utils/api"
import "./markdown.css"

interface FilteredReleasesProps {
  releases: Release[]
}

const getReleaseType = (release: Release): string => {
  const tagName = release.tag_name.toLowerCase()
  const name = release.name.toLowerCase()
  
  if (tagName.includes('canary') || name.includes('canary')) return 'canary'
  return 'stable'
}

export default function FilteredReleases({ releases }: FilteredReleasesProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    showStable: true,
    showCanary: false,
  })

  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      const releaseType = getReleaseType(release)
      
      switch (releaseType) {
        case 'stable':
          return filters.showStable
        case 'canary':
          return filters.showCanary
        default:
          return filters.showStable 
      }
    }).slice(0, 15)
  }, [releases, filters])

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ReleaseFilter onFilterChange={handleFilterChange} />
      
      <div className="w-full min-h-[400px]">
        {filteredReleases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-400">No releases match the current filter criteria.</p>
            <p className="text-sm text-gray-500 mt-2">Try enabling more release types in the filter above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredReleases.map((release) => (
              <div
                key={release.id}
                className="flex flex-col justify-center w-full h-full p-4 border-accent2 border rounded-lg bg-dark relative"
              >
              <div className="absolute top-2 right-2">
                <span className={`badge badge-sm ${
                  getReleaseType(release) === 'stable' ? 'badge-success' : 'badge-warning'
                }`}>
                  {getReleaseType(release).toUpperCase()}
                </span>
              </div>
              
              <div className={"flex flex-row justify-between pr-16"}>
                <h3 className={"text-xl font-bold"}>{release.name}</h3>
                <Link href={release.html_url} rel={"nofollow"} target={"_blank"} aria-label={"Go to release"} title={"Go to release"}>
                  <FiExternalLink className={"w-5 h-5 cursor-pointer"}/>
                </Link>
              </div>
              <div className={"flex flex-row flex-wrap items-center mt-3"}>
                <Image
                  src={release.author.avatar_url}
                  alt={"author image"}
                  className={"w-7 h-7 rounded-full mr-2"}
                  width={100}
                  height={100}
                />
                <p>
                  <b>{release.author.login}</b> released this{" "}
                  {moment(release.created_at).fromNow()}
                </p>
                <p className={"ml-2 text-blue-500"}>
                  <Link
                    href={`https://github.com/vercel/next.js/commit/${release.target_commitish}`}
                    rel={"nofollow"}
                    target={"blank"}
                  >
                    {release.target_commitish.startsWith("canary") ? release.target_commitish : release.target_commitish.substring(0, 6)}
                  </Link>
                </p>
              </div>
              <div className="divider"></div>
              <div className={"markdown-body"}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    li: ({ children }: any) => {
                      const text = children[0];
                      const newText = text.split(' ').map((word: string)=> {
                        if (word.startsWith('#')) {
                          return <Link key={word} href={`https://github.com/vercel/next.js/pull/${word.replaceAll("#", "")}`} rel={"nofollow"} target={"_blank"}>
                            <span className={"text-blue-500"}>{word}</span>
                          </Link>
                        } else {
                          return word;
                        }
                      }).reduce((acc: React.ReactNode, curr: React.ReactNode) => <>{acc} {curr}</>, null);

                      return <li>{newText}</li>
                    },
                    p: ({ children }: any) => {
                      const text = children[0];
                      const newText = text.split(' ').map((word: string)=> {
                        if (word.startsWith('@')) {
                          if (word.endsWith(',')) {
                            return <><Link key={word} href={`https://github.com/${word.slice(0, -1).replaceAll("@", "")}`} rel={"nofollow"} target={"_blank"}>
                              <span className={"text-blue-500"}>{word.slice(0, -1)}</span>
                            </Link>,</>
                          } else {
                            return <Link key={word} href={`https://github.com/${word.replaceAll("@", "")}`} rel={"nofollow"} target={"_blank"}>
                              <span className={"text-blue-500"}>{word}</span>
                            </Link>
                          }
                        } else {
                          return word;
                        }
                      }).reduce((acc: React.ReactNode, curr: React.ReactNode) => <>{acc} {curr}</>, null);

                      return <p>{newText}</p>
                    },
                  }}
                >
                  {release.body}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}