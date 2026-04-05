"use client";

import { useProject } from "@/components/ProjectProvider";
import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectSwitcher() {
  const { projects, activeProject, switchProject, refreshProjects } =
    useProject();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCreated = async (p: any) => {
    await refreshProjects();
    switchProject(p);
  };

  return (
    <div className="relative">
      {/* ACTIVE */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border px-3 py-2 rounded"
      >
        <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs">
          {activeProject?.name?.[0] || "P"}
        </div>
        {activeProject?.name || "Select Project"}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white shadow-xl rounded border z-50">
          {projects.map((p: any) => (
            <div
              key={p.id}
              onClick={() => {
                switchProject(p);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.name}
            </div>
          ))}

          <div className="border-t my-2"></div>

          <button
            onClick={() => {
              setOpen(false);
              setShowModal(true);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            ➕ New Project
          </button>
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}