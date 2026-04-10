type Project = {
  id: string;
  name: string;
  product?: {
    name: string;
  };
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white p-5 rounded-xl border hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{project.name}</h3>

      <p className="text-sm text-gray-500 mt-1">
        {project.product?.name}
      </p>

      <button className="mt-4 text-sm text-blue-600">
        Open →
      </button>
    </div>
  );
}