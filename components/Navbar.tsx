"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, update } = useSession();

  const [projects, setProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const switchProject = async (projectId: string) => {
    await update({ projectId }); // ✅ updates JWT
    setOpen(false);
  };

  const currentProject = projects.find(
    (p) => p.id === session?.projectId
  );

  return (
    <div className="flex justify-between p-4 bg-white border-b">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <span className="font-bold">KoniqTech</span>

        {/* PROJECT DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1 border rounded"
          >
            {currentProject?.name || "Select Project"}
          </button>

          {open && (
            <div className="absolute top-10 bg-white border shadow w-60">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => switchProject(p.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {p.name} ({p.product?.name})
                </div>
              ))}

              <div className="border-t p-2 text-blue-600 cursor-pointer">
                + Create Project
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div>
        {session?.user?.email}
      </div>
    </div>
  );
}