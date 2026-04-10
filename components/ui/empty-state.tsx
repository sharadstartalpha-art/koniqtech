export default function EmptyState() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold">No projects yet</h2>
      <p className="text-gray-500 mt-2">
        Create your first project to get started
      </p>

      <button className="mt-4 px-4 py-2 bg-black text-white rounded">
        Create Project
      </button>
    </div>
  );
}