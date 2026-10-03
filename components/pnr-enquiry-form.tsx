"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { cn } from "cn";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "./ui/toast";

const formSchema = z.object({
  number: z
    .string()
    .regex(/^\d{10}$/, { error: "PNR number must be of 10 digit" }),
});

export function PnrEnquiryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const pnrQuery = useSearchParams().get("number");
  const form = useForm({
    defaultValues: {
      number: pnrQuery || "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      const pnr = value.number.trim();
      if (!pnr) return;

      const params = new URLSearchParams();
      params.set("number", pnr.trim());

      router.replace(`/pnr-enquiry?${params.toString()}`);
      toast.add({
        title: "You submitted the following values:",
        description: "Sunday, December 3 at 9:00 AM",
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        id="pnr-check-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="number">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Check PNR status</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter PNR number (10 digits)"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </form>
      <Button type="submit" form="pnr-check-form">
        Check PNR
      </Button>
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
