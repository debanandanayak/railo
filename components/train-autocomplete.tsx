"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { LoaderCircleIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/reui/autocomplete";
import { useLocalStore } from "@/hooks/useLocalStore";

export function TrainAutoComplete({ ...props }) {
  const [searchValue, setSearchValue] = useState("");
  const { trains } = useLocalStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
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

    async function fetchTrains() {
      try {
        const results = await searchTrains(trains, searchValue, contains);
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

    const timeoutId = setTimeout(fetchTrains, 300);

    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  }, [searchValue, contains, trains]);

  let status: ReactNode = "";

  if (isLoading) {
    status = (
      <div className="flex items-center gap-2">
        <LoaderCircleIcon className="size-4 animate-spin" aria-hidden />
        Searching trains...
      </div>
    );
  } else if (error) {
    status = error;
  } else if (searchResults.length === 0 && searchValue) {
    status = `No trains found for "${searchValue}"`;
  } else if (searchResults.length > 0) {
    status = `${searchResults.length} trains${searchResults.length === 1 ? "" : "s"} found`;
  } else if (!searchValue) {
    status = "Start typing to search trains...";
  }

  const shouldRenderPopup = searchValue !== "";

  return (
    <div className="w-full">
      <Autocomplete
        autoHighlight
        items={searchResults}
        value={searchValue}
        onValueChange={setSearchValue}
        itemToStringValue={(item) => item}
        filter={null}
        {...props}
      >
        <AutocompleteInput
          placeholder="Enter train name or number"
          showTrigger
          showClear
        />
        {shouldRenderPopup && (
          <AutocompleteContent>
            <AutocompleteStatus>{status}</AutocompleteStatus>
            <AutocompleteList>
              {(item) => (
                <AutocompleteItem
                  key={item}
                  value={item}
                  className="rounded-lg"
                >
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  );
}

async function searchTrains(
  trains: string[],
  query: string,
  filter: (item: string, query: string) => boolean,
): Promise<string[]> {
  return trains.filter((train) => filter(train, query));
}
