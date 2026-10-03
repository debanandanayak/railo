import { HttpResponse, http } from "msw/http";
import pnr from "./fixtures/pnr.json" with { type: "json" };
export const baseUrl = "https://www.irctc.co.in";
export const handlers = [
  http.post<{ number: string }>(
    `${baseUrl}/eticketing/protected/mapps1/pnrenq/:number?pnrEnqType=E`,
    ({ params }) => {
      const { number } = params;
      return HttpResponse.json({ ...pnr, pnrNumber: number });
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
