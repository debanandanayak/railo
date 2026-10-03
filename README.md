This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API mocking with MSW

Add `NEXT_PUBLIC_MSW_ENABLED=true` to `.env.local` and run `bun dev`.
For a new checkout, `.env.example` contains the setting. Restart the dev
server after changing it. Set it to `false` (or remove it from all `.env`
files) to use real APIs. Mocking is always disabled in production builds.

The browser provider waits for the service worker before mounting the app.
The development config starts MSW early for outgoing Node.js requests,
including requests from Server Components and Server Actions. Edge runtime
requests are not mocked. Both environments share `mocks/handlers.ts`.

Keep `msw` and `@mswjs/interceptors` in `serverExternalPackages` in
`next.config.ts`. The config starts interception before Next.js captures the
fetch reference it restores on hot reload. `instrumentation.ts` shares the
same server and can initialize it in other Node.js server contexts without
starting it twice. Restart `bun dev` after changing mock handlers or this
configuration. Use Node.js 22.18+ for the native TypeScript imports in the config.

The included example handles `GET https://api.example.com/user`. With the
app open on localhost, run this in the browser console:

```js
await fetch("https://api.example.com/user").then((response) => response.json());
// { id: "abc-123", firstName: "John", lastName: "Maverick" }
```

Add API handlers in `mocks/handlers.ts` using `http` and `HttpResponse` from
`msw/http` (MSW 3). Unmatched requests pass through to the network; the train
APIs are not mocked by the example handler.

Keep the generated `public/mockServiceWorker.js` in version control.
After upgrading MSW, refresh it with `bunx msw init public --save`.
Browser mocking requires localhost or HTTPS.

See the [MSW browser integration guide](https://mswjs.io/guides/integrations/browser)
and [Node.js integration guide](https://mswjs.io/guides/integrations/node).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
