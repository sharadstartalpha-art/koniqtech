"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext<any>(null);

export function ProjectProvider({ children }: any) {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState<any>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();

    setProjects(data);

    const saved = localStorage.getItem("projectId");

    const current =
      data.find((p: any) => p.id === saved) || data[0];

    if (current) {
      setActiveProject(current);
      localStorage.setItem("projectId", current.id);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const switchProject = (project: any) => {
    setActiveProject(project);
    localStorage.setItem("projectId", project.id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        switchProject,
        refreshProjects: fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);