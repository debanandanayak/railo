"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { useForm } from "@tanstack/react-form-nextjs";
import { cn } from "cn";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useLocalStore } from "@/hooks/useLocalStore";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "./reui/autocomplete";
import { toast } from "./ui/toast";

export function LiveTrainForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useSearchParams();
  const router = useRouter();
  const { trains } = useLocalStore();
  const form = useForm({
    defaultValues: {
      number: params.get("number") || "",
    },
    onSubmit: async ({ value }) => {
      const pnr = value.number.trim();
      if (!pnr) return;

      const params = new URLSearchParams();
      params.set("number", pnr.trim());

      router.replace(`/live-train?${params.toString()}`);
      toast.add({
        title: "You submitted the following values:",
        description: value.number,
      });
    },
  });

  const [searchValue, setSearchValue] = useState("");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        id="live-status-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="number"
            validators={{
              onSubmit: ({ value }) => {
                if (!trains.includes(value.trim())) {
                  return {
                    message: "Choose a valid train from list",
                  };
                }
                return undefined;
              },
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Check train live status
                  </FieldLabel>
                  <Autocomplete
                    autoHighlight
                    items={searchResults}
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      setSearchValue(value);
                    }}
                    itemToStringValue={(item) => item}
                    filter={null}
                    {...props}
                  >
                    <AutocompleteInput
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      placeholder="Enter train name or number"
                      showTrigger
                      showClear
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </form>
      <Field>
        <Button type="submit" form="live-status-form">
          Track
        </Button>
      </Field>

      <FieldDescription className="px-6 text-center">
        If any issues, please{" "}
        <a href="https://www.irctc.co.in/eticket/booking/live-train">
          visit IRCTC
        </a>
        .
      </FieldDescription>
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
