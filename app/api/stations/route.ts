import { NextResponse } from "next/server";
import { baseUrl } from "@/lib/utils";

export async function GET() {
  const headers = {
    "sec-fetch-dest": "document",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
  };
  const response = await fetch(
    `${baseUrl}/eticketing/protected/mapps1/stationData`,
    {
      method: "GET",
      headers,
    },
  );
  const result = await response.json();
  return NextResponse.json(result);
}
