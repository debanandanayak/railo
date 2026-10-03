import { HttpResponse, http } from "msw/http";
import { baseUrl } from "@/lib/utils";
import pnr from "../fixtures/pnr.json" with { type: "json" };
export const pnrHandler = http.get(
  `${baseUrl}/pnrenq/:number?pnrEnqType=E`,
  ({ params }) => {
    const { number } = params;
    return HttpResponse.json({ ...pnr, pnrNumber: number });
  },
);
