import { Suspense } from "react";
import { SearchTrainForm } from "@/components/search-train-form";
import { TrainSearchresult } from "@/components/train-search-result";
import { getTrainsByRoute } from "@/server/train-search";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-svh gap-6 bg-background p-6 md:p-10">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <SearchTrainForm />
        </div>
      </div>
      <Suspense fallback={<p>Loading</p>}>
        <TrainResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

type Props = {
  searchParams: PageProps<"/">["searchParams"];
};

export async function TrainResults({ searchParams }: Props) {
  const params = await searchParams;

  if (!params.srcStn || !params.destStn || !params.jrnyDate) {
    return null;
  }

  function getParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  }

  const data = await getTrainsByRoute({
    srcStn: getParam(params.srcStn),
    destStn: getParam(params.destStn),
    jrnyDate: getParam(params.jrnyDate),
  });

  return (
    <div className="flex justify-center mt-8">

      <div className="w-full flex flex-col gap-4 items-center justify-center">
        {data.trainBtwnStnsList.map((train) => (
          <TrainSearchresult
            key={`${train.trainNumber} ${getParam(params.jrnyDate)}`}
            train={train}
          />
        ))}
      </div>
    </div>
  );
}
