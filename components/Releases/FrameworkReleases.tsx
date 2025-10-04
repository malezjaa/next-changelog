import { getNextJsReleases } from "@/utils/api";
import FilteredReleases from "./FilteredReleases";

export const revalidate = 300;
export const dynamic = "force-static";

export default async function FrameworkReleases() {
  try {
    const releases = await getNextJsReleases();
    return <FilteredReleases releases={releases} />;
  } catch (error: any) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-400">Failed to load releases</p>
        <p className="text-sm text-gray-500 mt-2">
          {error.message || "Please try again later"}
        </p>
      </div>
    );
  }
}
