import { noop, QueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { PnrEnquiryForm } from "@/components/pnr-enquiry-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { minutesToTime } from "@/lib/healpers";
import { getPnrStatus } from "@/server/pnr";
import { getQueryClient } from "../get-query-client";

export default async function PnrEnquiry({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const number = resolvedParams.number as string;

  let data = null;
  if (number) {
    data = await getPnrStatus(number);
  }

  console.log(data);
  return (
    <div className="flex min-h-svh flex-col items-center  gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <PnrEnquiryForm />
        {data && (
          <div className="flex flex-col">
            <Table className="mt-10">
              <TableHeader>
                <TableRow>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Booking status</TableHead>
                  <TableHead>Current ststus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.passengerList.map((passenger) => {
                  return (
                    <TableRow key={passenger.passengerSerialNumber}>
                      <TableCell>{passenger.passengerSerialNumber}</TableCell>
                      <TableCell>{passenger.bookingStatusDetails}</TableCell>
                      <TableCell>{passenger.currentStatusDetails}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Card className="w-full max-w-sm mt-8">
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-sm">
                  <span className="text-muted-foreground">
                    {data.trainNumber} -{" "}
                  </span>
                  {data.trainName}
                </CardTitle>
                <CardTitle>
                  <Badge variant="secondary" className="font-bold">
                    PNR: {data.pnrNumber}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="flex w-full justify-between items-end">
                  <div className="w-full">
                    <h1 className="font-black text-2xl">
                      {minutesToTime(data.departureTime)}
                    </h1>
                    <h2 className="font-bold">
                      {format(data.dateOfJourney, "EEEE, dd MMMM")}
                    </h2>
                    <h3 className="mt-4">
                      {data.sourceStation} - {data.boardingPoint}
                    </h3>
                  </div>
                  <div className="w-full text-end">
                    <h1 className="font-black text-2xl">
                      {minutesToTime(data.arrivalTimeDestination)}
                    </h1>
                    <h2 className="font-bold">
                      {format(data.dateOfArrivalDestination, "EEEE, dd MMMM")}
                    </h2>
                    <h3 className="mt-4">{data.destinationStation}</h3>
                  </div>
                </div>
                <div className="flex w-full flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">{data.journeyClass}</Badge>
                  <Badge variant="secondary">{data.quota}</Badge>
                  <Badge>{data.chartStatus}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/live-train?number=${data.trainNumber}`}>
                  <Button variant="outline" type="button" className="w-full">
                    Track your train
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
