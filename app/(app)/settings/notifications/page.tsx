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