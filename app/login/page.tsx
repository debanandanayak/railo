import { LoginForm } from "@/components/login-form";

const bookingInquiry = {
  concessionBooking: false,
  srcStn: "HYB",
  destStn: "PUNE",
  jrnyClass: "",
  jrnyDate: "20261001",
  quotaCode: "GN",
  currentBooking: "false",
  flexiFlag: true,
  handicapFlag: false,
  ticketType: "E",
  loyaltyRedemptionBooking: false,
  ftBooking: false,
};

export default async function LoginPage() {
  // const stations  = await tc.getStations()
  // const routes = await tc.getTrainsByRoute(bookingInquiry)
  // console.log(routes);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
