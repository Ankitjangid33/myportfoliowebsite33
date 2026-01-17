"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to delete project");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            fetchProjects();
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-3">{project.description}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingProject(project);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="bg-slate-800/50 p-12 rounded-xl border border-purple-500/20 text-center">
            <p className="text-gray-400 text-lg">No projects yet</p>
            <p className="text-gray-500 mt-2">
              Click "Add Project" to create your first project
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
  onSuccess,
}: {
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    technologies: project?.technologies.join(", ") || "",
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    featured: project?.featured || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      technologies: formData.technologies.split(",").map((t) => t.trim()),
    };

    try {
      const url = project ? `/api/projects/${project._id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
      <h3 className="text-xl font-bold text-white mb-4">
        {project ? "Edit Project" : "Add New Project"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Title
          </label>
          <input
            type="text"
            placeholder="My Awesome Project"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe your project..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Technologies (comma separated)
          </label>
          <input
            type="text"
            placeholder="React, Node.js, MongoDB"
            value={formData.technologies}
            onChange={(e) =>
              setFormData({ ...formData, technologies: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Live URL
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            value={formData.liveUrl}
            onChange={(e) =>
              setFormData({ ...formData, liveUrl: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            placeholder="https://github.com/username/repo"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData({ ...formData, githubUrl: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <label className="flex items-center gap-3 text-white cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-5 h-5 rounded border-purple-500/20 bg-slate-900"
          />
          <span className="text-sm">Mark as Featured Project</span>
        </label>
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 font-medium"
          >
            {loading
              ? "Saving..."
              : project
                ? "Update Project"
                : "Create Project"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
