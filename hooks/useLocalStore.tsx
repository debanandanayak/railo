import { useEffect, useState } from "react";
import { getStations, getTrains, type Station } from "@/server/stationData";

const STATIONS_KEY = "stations";
const TRAINS_KEY = "trains";
const STATIONS_EXPIRES_KEY = "stations_expires_at";
const TRAINS_EXPIRES_KEY = "trains_expires_at";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export function useLocalStore() {
  const [stations, setStations] = useState<Station[]>([]);
  const [trains, setTrains] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = Date.now();

    const stationsExpiry = Number(
      localStorage.getItem(STATIONS_EXPIRES_KEY) || 0,
    );

    const trainsExpiry = Number(localStorage.getItem(TRAINS_EXPIRES_KEY) || 0);

    const stationsLocal = localStorage.getItem(STATIONS_KEY);
    const trainsLocal = localStorage.getItem(TRAINS_KEY);

    const stationsValid = stationsLocal && stationsExpiry > now;

    const trainsValid = trainsLocal && trainsExpiry > now;

    // Load stations
    if (stationsValid) {
      try {
        setStations(JSON.parse(stationsLocal));
      } catch {
        localStorage.removeItem(STATIONS_KEY);
        localStorage.removeItem(STATIONS_EXPIRES_KEY);
      }
    } else {
      getStations()
        .then((data) => {
          setStations(data);

          localStorage.setItem(STATIONS_KEY, JSON.stringify(data));

          localStorage.setItem(
            STATIONS_EXPIRES_KEY,
            String(Date.now() + ONE_WEEK),
          );
        })
        .catch((error) => {
          console.error("Failed to load stations:", error);
        });
    }

    // Load trains
    if (trainsValid) {
      try {
        setTrains(JSON.parse(trainsLocal));
      } catch {
        localStorage.removeItem(TRAINS_KEY);
        localStorage.removeItem(TRAINS_EXPIRES_KEY);
      }
    } else {
      getTrains()
        .then((data) => {
          setTrains(data);

          localStorage.setItem(TRAINS_KEY, JSON.stringify(data));

          localStorage.setItem(
            TRAINS_EXPIRES_KEY,
            String(Date.now() + ONE_WEEK),
          );
        })
        .catch((error) => {
          console.error("Failed to load trains:", error);
        });
    }
  }, []);

  return {
    stations,
    trains,
  };
}
