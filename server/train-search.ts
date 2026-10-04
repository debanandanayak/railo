import "server-only";
import { addMinutes, compareAsc, format, parse } from "date-fns";
import { z } from "zod/v4";
import { baseUrl, headers } from "./constants";
import { TrainApiError } from "./train-api-error";
export async function getTrainsByRoute(
  input: TrainSearchInput,
) {
  const body = trainSearchSchema.parse(input);

  const response = await fetch(
    `${baseUrl}/eticketing/protected/mapps1/altAvlEnq/TC`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    let message = `Train API failed with ${response.status}`;

    try {
      const errorBody = await response.text();

      if (errorBody) {
        message = errorBody;
      }
    } catch {
      message = "Search unavailable";
    }

    throw new TrainApiError(message, response.status);
  }

  const json: unknown = await response.json();

  const data = availableTrainInfoSchema.parse(json);

  return normalizeAvailableTrains(data, body.jrnyDate);
}

export type NormalizedAvailableTrainInfo =
  ReturnType<typeof normalizeAvailableTrains>;

export function normalizeAvailableTrains(
  data: z.infer<typeof availableTrainInfoSchema>,
  requestedJourneyDate: string,
) {
  return {
    ...data,

    trainBtwnStnsList: data.trainBtwnStnsList
      .map((train) => normalizeTrain(train, requestedJourneyDate))
      .sort((a, b) => compareAsc(a.departureDateTime, b.departureDateTime)),

    alternateTrainBtwnStnsList: data.alternateTrainBtwnStnsList
      .map((train) => normalizeTrain(train, train.journeyDate))
      .sort((a, b) => compareAsc(a.departureDateTime, b.departureDateTime)),
  };
}

export type NormalizedTrain = TrainSchema & {
  journeyDate: string;
  departureDateTime: Date;
  arrivalDateTime: Date;
};

function normalizeTrain(
  train: TrainSchema,
  journeyDate: string,
): NormalizedTrain {
  const departureDateTime = parse(
    `${journeyDate} ${train.departureTime}`,
    "yyyyMMdd HH:mm",
    new Date(),
  );

  const [hours, minutes] = train.duration.split(":").map(Number);

  const arrivalDateTime = addMinutes(departureDateTime, hours * 60 + minutes);

  return {
    ...train,
    journeyDate,
    departureDateTime,
    arrivalDateTime,
  };
}

export const trainSearchSchema = z.object({
  sconcessionBooking: z.boolean().default(false),
  srcStn: z
    .string()
    .trim()
    .min(1, "Source station is required")
    .transform((value) => value.split("-")[0].trim()),
  destStn: z
    .string()
    .trim()
    .min(1, "Destination station is required")
    .transform((value) => value.split("-")[0].trim()),
  jrnyClass: z.string().default(""),
  jrnyDate: z.coerce.date().transform((date) => format(date, "yyyyMMdd")),
  quotaCode: z.string().default("GN"),
  currentBooking: z.string().default("false"),
  flexiFlag: z.boolean().default(true),
  handicapFlag: z.boolean().default(false),
  ticketType: z.string().default("E"),
  loyaltyRedemptionBooking: z.boolean().default(false),
  ftBooking: z.boolean().default(false),
});

export type TrainSearchInput = z.input<typeof trainSearchSchema>;
export type TrainSearch = z.output<typeof trainSearchSchema>;

const trainSchema = z.object({
  trainNumber: z.string(),
  trainName: z.string(),
  fromStnCode: z.string(),
  toStnCode: z.string(),
  arrivalTime: z.string(),
  departureTime: z.string(),
  distance: z.string(),
  duration: z.string(),
  runningMon: z.string(),
  runningTue: z.string(),
  runningWed: z.string(),
  runningThu: z.string(),
  runningFri: z.string(),
  runningSat: z.string(),
  runningSun: z.string(),
  avlClasses: z.array(z.string()),
  trainType: z.array(z.string()),
  atasOpted: z.string(),
  flexiFlag: z.string(),
  trainOwner: z.string(),
  trainsiteId: z.string(),
});
export type TrainSchema = z.infer<typeof trainSchema>;

const alternateTrainSchema = trainSchema.extend({
  journeyDate: z.string(),
});
export type AltTrainSchema = z.infer<typeof alternateTrainSchema>;

export const availableTrainInfoSchema = z.object({
  trainBtwnStnsList: z.array(trainSchema),
  alternateTrainBtwnStnsList: z.array(alternateTrainSchema),
  quotaList: z.array(z.string()),

  serverId: z.string(),
  timeStamp: z.string(),

  vikalpInSpecialTrainsAccomFlag: z.string(),
  serveyFlag: z.string(),
  alternateEnquiryFlag: z.string(),
});

// export type AvailableTrainInfo = z.infer<typeof availableTrainInfoSchema>;
