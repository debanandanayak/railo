import { NextResponse } from "next/server";
import { baseUrl, headers } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(
    `${baseUrl}/eticketing/protected/mapps1/allLapAvlEnq`,
    {
      headers: {
        ...headers,
        "cache-control": "no-cache",
        priority: "u=1, i",
      },
      body: JSON.stringify(body),
      method: "POST",
    },
  );
  console.log(response.statusText);
  const data = await response.json();
  console.log(data);
  return NextResponse.json(data);
}
