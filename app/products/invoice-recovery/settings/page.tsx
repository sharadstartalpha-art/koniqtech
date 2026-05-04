
export default function SettingsPage() {
  return (
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Auto Reminder Settings</h2>

  {["friendly", "firm", "final"].map((type) => (
    <div key={type} className="flex items-center gap-3">
      <span className="capitalize w-20">{type}</span>

      <input
        type="number"
        placeholder="Days"
        className="border px-2 py-1 rounded w-20"
      />

      <span>days after due date</span>
    </div>
  ))}
</div>
);
}