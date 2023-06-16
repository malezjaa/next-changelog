import Image from "next/image";
import NextJsIcon from "@/components/Icons/NextJsIcons";
import Link from "next/link";
import {BsDiscord, BsGithub} from "react-icons/bs";

export default function Navbar() {
    return (
        <div className="navbar bg-black">
            <div className="navbar-start">
                <Link href={"/"} className="flex normal-case text-xl ml-3">
                   <NextJsIcon/>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">

            </div>
            <div className="navbar-end">
                <div className="flex items-center flex-row gap-3 mr-2">
                    <Link href={"https://github.com/malezjaa/next-changelog"}
                          rel="nofollow"
                          target="_blank"
                          title="Github">
                        <BsGithub className={"w-6 h-6 cursor-pointer"}/>
                    </Link>
                    <Link href={"https://nextjs.org/discord"}
                          rel="nofollow"
                          target="_blank"
                          title="Discord">
                        <BsDiscord className={"w-6 h-6 cursor-pointer"} />
                    </Link>
                </div>
            </div>
        </div>
    )
}