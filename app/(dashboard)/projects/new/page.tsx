export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Create Project</h1>

      <form className="mt-4 space-y-3">
        <input
          placeholder="Project name"
          className="border p-2 w-full"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Create Project
        </button>
      </form>
    </div>
  );
}