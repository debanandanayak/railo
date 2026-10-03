import { LiveTrainForm } from "@/components/live-train-form";

export default async function LiveTrain({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LiveTrainForm />
      </div>
    </div>
  );
}
