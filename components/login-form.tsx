"use client";

import { cn } from "cn";
import { TrainFrontIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <TrainFrontIcon className="size-6" />
              </div>
              <span className="sr-only">Better rail.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Better-rail</h1>
            {/* <FieldDescription>
              Don&apos;t have an account? <a href="#">Sign up</a>
            </FieldDescription> */}
          </div>
          <Field>
            <FieldLabel htmlFor="userId">Email</FieldLabel>
            <Input id="userId" type="userId" placeholder="jhon_doe" required />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Email</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="password"
              required
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="/">Terms of Service</a>{" "}
        and <a href="/">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
