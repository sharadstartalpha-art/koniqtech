export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">

      <h1 className="text-5xl font-bold mb-4">
        KoniqTech
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Build smarter. Work faster. Scale your business with AI tools.
      </p>

    <a href="/api/auth/signin">
  <button className="bg-black text-white px-6 py-3 rounded-lg">
    Login with GitHub
  </button>
</a>

    </main>
  );
}