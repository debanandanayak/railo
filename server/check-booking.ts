import { format } from "date-fns";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod/v4";
import { TrainApiError } from "./train-api-error";
export async function checkBooking(
  input: CheckBookingInput,
): Promise<CheckBookingResponse> {
  const {
    data: body,
    success,
    error,
  } = checkBookingInputSchema.safeParse(input);
  if (!success) {
    throw new ApiError(400, error.message);
  }
  const response = await fetch("/api/check-booking", {
    body: JSON.stringify(body),
    method: "POST",
  });

  if (!response.ok) {
    let message = `Booking API failed with ${response.status}`;

    try {
      const errorBody = await response.text();

      if (errorBody) {
        message = errorBody;
      }
    } catch {
      message = "Booking unavailable";
    }

    throw new TrainApiError(message, response.status);
  }

  const data: unknown = await response.json();
  return checkBookingResponseSchema.parse(data);
}

export const checkBookingInputSchema = z.object({
  alternateAvlInputDTO: z.array(
    z.object({
      trainNo: z.string(),
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
      jrnyDate: z.coerce.date().transform((date) => format(date, "yyyyMMdd")),
      quotaCode: z.string().default("GN"),
      ftBooking: z.boolean().default(false),
      avlClasses: z.array(z.string()).default(["SL", "3E", "1A", "2A", "3A"]),
      concessionPassengers: z.boolean().default(false),
    }),
  ),
  autoUpgradationSelected: z.boolean().default(true),
  ticketType: z.string().default("E"),
});
const avlDay = z.object({
  availablityDate: z.string(),
  availablityStatus: z.string(),
  reasonType: z.string(),
  availablityType: z.string(),
  currentBkgFlag: z.string(),
  wlType: z.string(),
  delayFlag: z.string(),
  delay: z.string(),
});

const informationMessage = z.object({
  message: z.string(),
  popup: z.string(),
  paramName: z.string(),
});

const classAvl = z.object({
  distance: z.string(),
  enqClass: z.string(),
  trainOwner: z.string(),

  baseFare: z.string(),
  reservationCharge: z.string(),
  superfastCharge: z.string(),
  fuelAmount: z.string(),
  totalConcession: z.string(),
  tatkalFare: z.string(),
  serviceTax: z.string(),
  otherCharge: z.string(),
  cateringCharge: z.string(),
  dynamicFare: z.string(),
  totalFare: z.string(),

  otpAuthenticationFlag: z.string(),
  cateringFlag: z.string(),

  avlDayList: z.array(avlDay),

  informationMessage: z.array(informationMessage),

  // Not present in every response
  lastUpdateTime: z.string().optional(),

  avlFound: z.string(),
});

const stationDTO = z.object({
  stationCode: z.string(),
  dayCount: z.string(),
  departureTime: z.string(),
});

const train = z.object({
  trainNumber: z.string(),
  fromStnCode: z.string(),
  toStnCode: z.string(),
  distance: z.string(),

  avlClasses: z.array(z.string()),

  journeyDate: z.string(),

  atasOpted: z.string(),
  flexiFlag: z.string(),
  quotaCode: z.string(),

  classAvlDTO: z.array(classAvl),

  // Some trains return this, some don't
  stationDTO: z.array(stationDTO).optional(),
});

export const checkBookingResponseSchema = z.object({
  trainBtwnStnsList: z.array(train),

  serverId: z.string(),
  timeStamp: z.string(),

  vikalpInSpecialTrainsAccomFlag: z.string(),
  alternateEnquiryFlag: z.string(),
});


export type CheckBookingInput = z.input<typeof checkBookingInputSchema>;

export type CheckBookingResponse = z.infer<typeof checkBookingResponseSchema>;
export type Train = z.infer<typeof train>;
