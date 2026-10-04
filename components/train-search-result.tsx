"use client";
import { useMutation } from "@tanstack/react-query";
import { format, isSameDay, parse, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";
import { checkBooking } from "@/server/check-booking";
import type { NormalizedTrain, } from "@/server/train-search";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function TrainSearchresult({ train }: { train: NormalizedTrain }) {
  const router = useSearchParams();
  const mutation = useMutation({
    mutationFn: checkBooking,
    mutationKey: [train.trainNumber],
  });
  return (
    <Card className="w-full min-w-sm">
      <CardHeader className="flex flex-col justify-between w-full">
        <CardTitle className="text-sm">
          <span className="text-muted-foreground">{train.trainNumber} </span>
          {train.trainName}
        </CardTitle>
        <CardTitle className="gap-1 w-full flex">
          {[
            ["M", "Mon", train.runningMon],
            ["T", "Tue", train.runningTue],
            ["W", "Wed", train.runningWed],
            ["T", "Thu", train.runningThu],
            ["F", "Fri", train.runningFri],
            ["S", "Sat", train.runningSat],
            ["S", "Sun", train.runningSun],
          ].map(([_, day, running]) => (
            <Badge
              key={`${day}-${train.trainNumber}`}
              aria-disabled={running !== "Y"}
              variant={running === "Y" ? "default" : "ghost"}
              className="font-bold"
            >
              {day}
            </Badge>
          ))}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex w-full justify-between items-end">
          <div className="w-full">
            <h1 className="font-black text-2xl">{train.departureTime}</h1>
            <h2 className="font-bold">{format(train.departureDateTime, "dd MMM, EEEE")}</h2>
            <h3 className="mt-4 font-bold">{train.fromStnCode}</h3>
          </div>
          <div className="w-full text-end">
            <h1 className="font-black text-2xl">{train.arrivalTime}</h1>
            <h2 className="font-bold">{format(train.arrivalDateTime,"dd MMM, EEEE")}</h2>
            <h3 className="mt-4 font-bold">{train.toStnCode}</h3>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-2 mt-4">
          {/*<Badge variant="secondary">{data.journeyClass}</Badge>
        <Badge variant="secondary">{data.quota}</Badge>
        <Badge>{data.chartStatus}</Badge>*/}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        {/*<Link href={`/live-train?number=${train.trainNumber} - ${train.trainName}`}>*/}
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => {
            mutation.mutate({
              alternateAvlInputDTO: [
                {
                  trainNo: train.trainNumber,
                  srcStn: train.fromStnCode,
                  destStn: train.toStnCode,
                  jrnyDate: router.get("jrnyDate"),
                  avlClasses: train.avlClasses,
                },
              ],
              ticketType: "E",
            });
          }}
        >
          Check availability
        </Button>
        {/*</Link>*/}
        {mutation.isSuccess && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {mutation.data.trainBtwnStnsList.flatMap((bookingTrain) =>
                bookingTrain.classAvlDTO.flatMap((availClass) =>
                  availClass.avlDayList
                    .filter((day) => {
                      const journeyDate = parseISO(bookingTrain.journeyDate);

                      const availabilityDate = parse(
                        day.availablityDate,
                        "d-MM-yyyy",
                        new Date(),
                      );

                      console.log(isSameDay(journeyDate, availabilityDate))
                      return isSameDay(journeyDate, availabilityDate);
                    })
                    .map((ticket) => (
                      <TableRow
                        key={`${bookingTrain.trainNumber}-${availClass.enqClass}-${ticket.availablityDate}`}
                      >
                        <TableCell>{availClass.enqClass}</TableCell>

                        <TableCell>
                          {ticket.availablityStatus}
                        </TableCell>

                        <TableCell>
                          ₹{availClass.totalFare}
                        </TableCell>

                        <TableCell>
                          {ticket.availablityType !== "0" && (
                            <Button>Book</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )),
                ),
              )}
            </TableBody>
          </Table>
        )}
      </CardFooter>
    </Card>
  );
}
