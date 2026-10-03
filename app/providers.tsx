"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import MswProvider from "@/mocks/msw-provider";
import { getQueryClient } from "./get-query-client";

const queryClient = getQueryClient();
export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <MswProvider>{children}</MswProvider>
    </QueryClientProvider>
  );
}
