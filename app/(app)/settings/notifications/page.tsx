export default function NotificationSettingsPage() {

  return (

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

        <p className="text-slate-500 mt-2">
          Control how notifications are delivered.
        </p>

<div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">

  <h3 className="font-semibold text-orange-700">
    Notification Preferences
  </h3>

  <p className="mt-2 text-sm text-slate-600">
    Notification preferences are managed by your organization and
    will become configurable in a future release. Default notification
    settings are currently applied automatically.
  </p>

</div>


      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="space-y-6">

          <label className="flex justify-between">

            <span>Email Notifications</span>

            <input
              type="checkbox"
              defaultChecked
            />

          </label>

          <label className="flex justify-between">

            <span>SMS Notifications</span>

            <input
              type="checkbox"
            />

          </label>

          <label className="flex justify-between">

            <span>Lead Alerts</span>

            <input
              type="checkbox"
              defaultChecked
            />

          </label>

          <label className="flex justify-between">

            <span>Invoice Alerts</span>

            <input
              type="checkbox"
              defaultChecked
            />

          </label>

        </div>

      </div>

    </div>

  )

}