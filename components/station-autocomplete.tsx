import {
  Autocomplete as AutocompletePrimitive,
  type AutocompleteRootChangeEventDetails,
} from "@base-ui/react/autocomplete";
import type { BaseUIEvent } from "@base-ui/react/types";
import { LoaderCircleIcon } from "lucide-react";
import { type FocusEvent, type ReactNode, useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { toSentenseCase } from "@/lib/healpers";
import type { Station } from "@/server/stationData";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "./reui/autocomplete";
import { Badge } from "./ui/badge";

interface StationAutocompleteProps {
  keyPrefix: string;
  id: string;
  placeholder: string;
  searchValue: string;
  onValueChange?:
    | ((
        value: string,
        eventDetails: AutocompleteRootChangeEventDetails,
      ) => void)
    | undefined;
  onBlur?:
    | ((event: BaseUIEvent<FocusEvent<HTMLInputElement, Element>>) => void)
    | undefined;
  isInvalid: boolean;
  fieldError?: ReactNode;
}

export default function StationAutocomplete({
  keyPrefix,
  id,
  placeholder,
  searchValue,
  onValueChange,
  onBlur,
  isInvalid,
  fieldError,
}: StationAutocompleteProps) {
  const { stations } = useLocalStore();
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: "base" });

  useEffect(() => {
    if (!searchValue) {
      setSearchResults([]);
      setIsLoading(false);
      return undefined;
    }
    setIsLoading(true);
    setError(null);
    let ignore = false;
    async function fetchDevelopers() {
      try {
        const results = await searchStations(stations, searchValue, contains);
        if (!ignore) {
          setSearchResults(results);
        }
      } catch {
        if (!ignore) {
          setError("Failed to fetch developers. Please try again.");
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    const timeoutId = setTimeout(fetchDevelopers, 300);
    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  }, [searchValue, contains, stations]);

  let status: ReactNode = "";

  if (isLoading) {
    status = (
      <div className="flex items-center gap-2">
        <LoaderCircleIcon className="size-4 animate-spin" />
        Searching stations...
      </div>
    );
  } else if (error) {
    status = error;
  } else if (searchResults.length === 0 && searchValue) {
    status = `No stations found for "${searchValue}"`;
  } else if (searchResults.length > 0) {
    status = `${searchResults.length} station${searchResults.length === 1 ? "" : "s"} found`;
  } else if (!searchValue) {
    status = "Start typing to search station...";
  }

  const shouldRenderPopup = searchValue !== "";

  return (
    <Autocomplete
      id={id}
      name={id}
      autoHighlight="always"
      highlightItemOnHover
      value={searchValue}
      onValueChange={onValueChange}
      items={searchResults}
      itemToStringValue={(item) => `${item.sc} - ${toSentenseCase(item.en)}`}
      filter={null}
    >
      <AutocompleteInput
        aria-invalid={isInvalid}
        onBlur={onBlur}
        placeholder={placeholder}
        showTrigger
        showClear
      />
      {fieldError}
      {shouldRenderPopup && (
        <AutocompleteContent>
          <AutocompleteStatus>{status}</AutocompleteStatus>
          <AutocompleteList>
            {(station: Station) => (
              <AutocompleteItem
                key={`${keyPrefix} ${station.sc}`}
                value={station}
                className="rounded-lg"
              >
                <div className="flex items-center gap-2.5 truncate w-full">
                  <div className="flex flex-row justify-between w-full">
                    <div className="font-semibold">
                      {toSentenseCase(station.en)},{" "}
                      <span className="text-muted-foreground font-normal">
                        {toSentenseCase(station.se ?? "")}
                      </span>
                    </div>
                    <Badge>{station.sc}</Badge>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      )}
    </Autocomplete>
  );
}

async function searchStations(
  stations: Station[],
  query: string,
  filter: (item: string, query: string) => boolean,
): Promise<Station[]> {
  const [rawCode = "", rawStationName = ""] = query.split("-");

  const code = rawCode.trim();
  const stationName = rawStationName.trim();
  const normalizedQuery = query.trim();
  return stations.filter(
    (station) =>
      (stationName !== "" && filter(station.en, stationName)) ||
      filter(station.sc, normalizedQuery) ||
      filter(station.sc, code.trim()) ||
      filter(station.en, normalizedQuery) ||
      filter(station.ec ?? "", normalizedQuery) ||
      filter(station.sc ?? "", normalizedQuery),
  );
}
