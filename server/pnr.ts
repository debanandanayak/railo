import { baseUrl } from "@/lib/utils";
import { headers } from "./constants";

export async function getPnrStatus(pnr: string): Promise<PnrStatus> {
  const response = await fetch(
    `${baseUrl}/eticketing/protected/mapps1/pnrenq/${pnr}?pnrEnqType=E`,
    {
      method: "POST",
      headers,
    },
  );
  console.log(response);

  const result = await response.json();
  return result;
}

export interface PnrStatus {
  pnrNumber: string;
  dateOfJourney: string;
  trainStartDate: string;
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  destinationStation: string;
  reservationUpto: string;
  boardingPoint: string;
  journeyClass: string;
  numberOfpassenger: string;
  chartStatus: string;
  informationMessage: string | undefined[];
  passengerList: PassengerList[];
  serverId: string;
  timeStamp: string;
  bookingFare: string;
  ticketFare: string;
  quota: string;
  reasonType: string;
  vikalpMessage: string;
  vikalpStatus: string;
  delay: string;
  bookingDate: string;
  trainSiteId: string;
  ticketType: string;
  connectingPnrFlag: string;
  linkPnrFlag: string;
  departureTime: string;
  timeTableChangeFlag: string;
  dateOfArrivalDestination: string;
  arrivalTimeDestination: string;
}

export interface PassengerList {
  passengerSerialNumber: string;
  passengerAge: string;
  passengerIcardFlag: string;
  passengerNationality: string;
  fareChargedPercentage: string;
  validationFlag: string;
  bookingStatusIndex: string;
  bookingStatus: string;
  bookingBerthNo: string;
  bookingStatusDetails: string;
  currentStatusIndex: string;
  currentStatus: string;
  currentBerthNo: string;
  currentStatusDetails: string;
  psgnwlType: string;
  dropWaitlistFlag: string;
}
