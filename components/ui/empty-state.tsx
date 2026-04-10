export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      
      <div className="w-16 h-16 bg-gray-100 rounded-full mb-4" />

      <h2 className="text-lg font-semibold">No projects yet</h2>

      <p className="text-sm text-gray-500 mt-1">
        Create your first AI project to get started
      </p>

      <button className="mt-6 px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition">
        Create Project
      </button>
    </div>
  );
}