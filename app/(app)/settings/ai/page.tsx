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

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <div className="space-y-6">

          <label className="flex items-center justify-between">

            <span>
              Enable AI Assistant
            </span>

            <input type="checkbox" defaultChecked />

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

            <input type="checkbox" />

          </label>

        </div>

      </div>

    </div>

  )

}