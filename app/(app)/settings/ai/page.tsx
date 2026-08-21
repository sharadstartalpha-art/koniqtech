export default function AISettingsPage() {

  return (

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          AI Settings
        </h1>

        <p className="text-slate-500 mt-2">
          Configure AI assistants and automations.
        </p>


        <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
  <h3 className="font-semibold text-orange-700">
    AI Configuration
  </h3>

  <p className="mt-2 text-sm text-slate-600">
    AI features are managed by your KoniqTech subscription and cannot
    be modified from the dashboard. Contact support if you need to
    enable additional AI capabilities.
  </p>
</div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="space-y-6">

          <label className="flex items-center justify-between">

            <span>
              Enable AI Assistant
            </span>

           <input
  type="checkbox"
  checked
  disabled
  className="h-5 w-5 cursor-not-allowed"
/>

          </label>

          <label className="flex items-center justify-between">

            <span>
              AI Lead Scoring
            </span>

            <input type="checkbox" defaultChecked />

          </label>

          <label className="flex items-center justify-between">

            <span>
              AI Quote Generation
            </span>

            <input type="checkbox" defaultChecked />

          </label>

          <label className="flex items-center justify-between">

            <span>
              AI Dispatch Suggestions
            </span>

            <input
  type="checkbox"
  disabled
  className="h-5 w-5 cursor-not-allowed"
/>

          </label>

        </div>

      </div>

    </div>

  )

}