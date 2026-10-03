import { baseUrl } from "@/lib/utils";

export async function getStations(): Promise<Station[]> {
  const headers = {
    "sec-fetch-dest": "document",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
  };
  const response = await fetch("/api/stations");
  const result = await response.json();
  return result;
}

export async function getTrains(): string[] {
  const headers = {
    "sec-fetch-dest": "document",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
  };

  const response = await fetch(`/api/trains`);
  const result = await response.json();

  return result;
}

export interface Station {
  sc: string;
  en: string;
  hi?: string;
  ps?: boolean;
  ec?: string;
  hc?: string;
  se?: string;
  sh?: string;
  tg?: string;
}
