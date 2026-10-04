import { HttpResponse, http } from "msw/http";
import pnr from "./fixtures/pnr.json" with { type: "json" };
import availableTrains from "./fixtures/available-trains.json" with { type: "json" };
import bookingAvailability from "./fixtures/ticket-availability.json" with { type: "json" };
export const baseUrl = "https://www.irctc.co.in";
export const handlers = [
  http.post<{ number: string }>(
    `${baseUrl}/eticketing/protected/mapps1/pnrenq/:number?pnrEnqType=E`,
    ({ params }) => {
      const { number } = params;
      return HttpResponse.json({ ...pnr, pnrNumber: number });
    },
  ),
  http.post(
    `${baseUrl}/eticketing/protected/mapps1/altAvlEnq/TC`,
    ({ params }) => {
      return HttpResponse.json(availableTrains);
    },
  ),
  http.post(
    `${baseUrl}/eticketing/protected/mapps1/allLapAvlEnq`,
    ({ params }) => {
      return HttpResponse.json(bookingAvailability);
    },
  ),
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
