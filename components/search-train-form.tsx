"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { cn } from "cn";
import { addDays, format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { useLocalStore } from "@/hooks/useLocalStore";
import StationAutocomplete from "./station-autocomplete";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";


export function SearchTrainForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useSearchParams()
  const [date, setDate] = React.useState<Date>(new Date(params.get("jrnyDate") ?? Date.now()));
  const [open, setOpen] = React.useState(false);
  const { stations } = useLocalStore();
  const router = useRouter();


  const form = useForm({
    defaultValues: {
      srcStn: params.get("srcStn")??"",
      destStn: params.get("destStn")??"",
      jrnyDate: date,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const params = new URLSearchParams();
      params.set("srcStn", value.srcStn);
      params.set("destStn", value.destStn);
      params.set("jrnyDate", value.jrnyDate.toDateString());
      router.replace(`/?${params.toString()}`);
      // router.push(`/trains?${params.toString()}`)
      // toast.add({
      //   title: "You submitted the following values:",
      //   description: "Sunday, December 3 at 9:00 AM",
      // });
    },
  });

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <form
        id="search-train-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="srcStn"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) {
                  return { message: "Source is required" };
                }
                const code = value.split("-")[0].trim();
                const isValidStation = stations.filter(
                  (station) => station.sc === code,
                )[0];
                if (!isValidStation) {
                  return {
                    message: "Select a valid station",
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
                  <FieldLabel htmlFor={field.name}>From</FieldLabel>
                  <StationAutocomplete
                    keyPrefix="source"
                    placeholder="Select source station"
                    searchValue={field.state.value}
                    onValueChange={field.handleChange}
                    onBlur={field.handleBlur}
                    id={field.name}
                    isInvalid={isInvalid}
                    fieldError={
                      isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )
                    }
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="destStn"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) {
                  return { message: "Source is required" };
                }
                const code = value.split("-")[0].trim();
                const isValidStation = stations.filter(
                  (station) => station.sc === code,
                )[0];
                if (!isValidStation) {
                  return {
                    message: "Select a valid station",
                  };
                }
                if (value === form.state.values.srcStn) {
                  return {
                    message: "Destination cannot be the same as source",
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
                  <FieldLabel htmlFor={field.name}>To</FieldLabel>
                  <StationAutocomplete
                    keyPrefix="destination"
                    placeholder="Select destination station"
                    searchValue={field.state.value}
                    onValueChange={field.handleChange}
                    onBlur={field.handleBlur}
                    id={field.name}
                    isInvalid={isInvalid}
                    fieldError={
                      isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )
                    }
                  />
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="jrnyDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger
                      id={field.name}
                      render={
                        <Button
                          variant={"outline"}
                          data-empty={!date}
                          className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Card className="mx-auto w-fit max-w-75" size="sm">
                        <CardContent>
                          <Calendar
                            mode="single"
                            selected={field.state.value}
                            onDayBlur={field.handleBlur}
                            onSelect={(date) => {
                              if (date) {
                                setDate(date);
                                field.handleChange(date);
                              }
                              setOpen(false);
                            }}
                            defaultMonth={date}
                            disabled={(date) =>
                              date < new Date(addDays(new Date(), -1)) ||
                              date > new Date(addDays(new Date(), 63))
                            }
                            className="p-0 [--cell-size:--spacing(9.5)]"
                          />
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-2 border-t">
                          {[
                            { label: "Today", value: 0 },
                            { label: "Tomorrow", value: 1 },
                            { label: "In 3 days", value: 3 },
                            { label: "In a week", value: 7 },
                            { label: "In 60 days", value: 60 },
                          ].map((preset) => (
                            <Button
                              key={preset.value}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                const newDate = addDays(
                                  new Date(),
                                  preset.value,
                                );
                                setDate(newDate);
                                field.handleChange(newDate);
                              }}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </CardFooter>
                      </Card>
                    </PopoverContent>
                  </Popover>
                </Field>
              );
            }}
          </form.Field>
          <Field>
            <Button type="submit" form="search-train-form">
              Search
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldSeparator>Or</FieldSeparator>
      <Field className="grid gap-4 sm:grid-cols-2">
        <Link href={"/pnr-enquiry"}>
          <Button variant="outline" type="button" className="w-full">
            Check PNR status
          </Button>
        </Link>
        <Link href={"/live-train"}>
          <Button variant="outline" type="button" className="w-full">
            Track your train
          </Button>
        </Link>
      </Field>
    </div>
  );
}
