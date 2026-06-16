export default function SecurityPage() {

  return (

    <div className="max-w-5xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Security
        </h1>

        <p className="text-slate-500 mt-2">
          Manage passwords, authentication and account protection.
        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-semibold mb-6">
          Change Password
        </h2>

        <div className="space-y-4">

          <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border rounded-2xl p-4"
          />

          <button
            className="
            px-6
            py-3
            bg-orange-600
            text-white
            rounded-2xl
            "
          >
            Update Password
          </button>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-xl font-semibold mb-4">
          Two Factor Authentication
        </h2>

        <p className="text-slate-500 mb-5">
          Protect your account with 2FA.
        </p>

        <button
          className="
          px-5
          py-3
          border
          rounded-2xl
          "
        >
          Enable 2FA
        </button>

      </div>

    </div>

  )

}