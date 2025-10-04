import Image from "next/image";
import NextJsIcon from "@/components/Icons/NextJsIcons";
import Link from "next/link";
import { BsDiscord, BsGithub } from "react-icons/bs";

export default function Navbar() {
  return (
    <div className="navbar bg-black border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="navbar-start">
        <Link href={"/"} className="flex normal-case text-xl ml-3 hover:scale-105 transition-transform duration-200">
          <NextJsIcon />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <span className="text-sm text-gray-400">
          Track all Next.js releases in one place
        </span>
      </div>
      <div className="navbar-end">
        <div className="flex items-center flex-row gap-3 mr-2">
          <Link
            href={"https://github.com/malezjaa/next-changelog"}
            rel="nofollow"
            target="_blank"
            title="Github"
            className="hover:text-gray-400 transition-colors duration-200"
          >
            <BsGithub className={"w-6 h-6 cursor-pointer"} />
          </Link>
          <Link
            href={"https://nextjs.org/discord"}
            rel="nofollow"
            target="_blank"
            title="Discord"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            <BsDiscord className={"w-6 h-6 cursor-pointer"} />
          </Link>
        </div>
      </div>
    </div>
  );
}
