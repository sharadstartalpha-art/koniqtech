type Project = {
  id: string;
  name: string;
  product?: { name: string };
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white border border-gray-200 p-5 rounded-xl hover:shadow-lg transition cursor-pointer">
      
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {project.product?.name}
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        AI-powered tool project
      </p>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Updated just now
        </span>

        <span className="text-sm text-black group-hover:underline">
          Open →
        </span>
      </div>
    </div>
  );
}