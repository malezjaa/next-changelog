import {getNextJsReleases} from "@/utils/api";
import FilteredReleases from "./FilteredReleases";

export default async function FrameworkReleases() {
    const releases = await getNextJsReleases()

    return <FilteredReleases releases={releases} />
}