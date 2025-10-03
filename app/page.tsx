import Link from "next/link";
import FrameworkReleases from "@/components/Releases/FrameworkReleases";

export default function Page() {
  return (
    <main className="flex items-center justify-between p-5 sm:p-16 text-zinc-200 w-full">
        <div className="flex flex-col items-center justify-center w-full">
            <div className={"flex flex-col bg-bgSVG bg-no-repeat bg-center justify-center items-center h-[400px]"}>
                <h1 className={"font-extrabold text-[3rem] sm:text-[4rem] text-center"}>Next.js Changelog</h1>
                <p className={"text-center"}>Site to browse latest releases of NextJs framework and packages.</p>
                <div className={"mt-5"}>
                    <Link href={"https://nextjs.org/"} target={"_blank"} rel={"nofollow"}>
                        <button className="btn bg-white text-black hover:bg-gray-200 border-none transition-colors duration-200 ease-in-out">Visit NextJS</button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-[4rem] w-full max-w-7xl mx-auto">
                <h2 className={"font-extrabold text-[2rem] sm:text-[3rem] text-center mb-8"}>Framework</h2>
                <div className="w-full px-4">
                    <FrameworkReleases/>
                </div>
            </div>
        </div>
    </main>
  )
}
