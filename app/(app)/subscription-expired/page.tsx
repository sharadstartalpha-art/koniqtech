export default function SubscriptionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border bg-white p-10 shadow">

        <h1 className="text-3xl font-bold text-red-600">
          Subscription Expired
        </h1>

        <p className="mt-4 text-gray-600">
          Your organization's subscription has expired.
        </p>

        <p className="mt-2 text-gray-600">
          Please contact your administrator or renew your plan.
        </p>

      </div>
    </div>
  );
}