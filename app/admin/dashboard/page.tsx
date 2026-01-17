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

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
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
    fetchContacts();
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

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts");
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          Overview of your portfolio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
            Total Projects
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {projects.length}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
            Featured
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {projects.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-green-500/20">
          <h3 className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
            New Messages
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-400">
            {contacts.filter((c) => c.status === "new").length}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
            Total Contacts
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">
            {contacts.length}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/admin/projects")}
            className="p-3 sm:p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-left"
          >
            <h3 className="text-sm sm:text-base font-semibold mb-1">
              Manage Projects
            </h3>
            <p className="text-xs sm:text-sm text-purple-200">
              View and edit all projects
            </p>
          </button>
          <button
            onClick={() => router.push("/admin/contacts")}
            className="p-3 sm:p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-left"
          >
            <h3 className="text-sm sm:text-base font-semibold mb-1">
              View Messages
            </h3>
            <p className="text-xs sm:text-sm text-green-200">
              Check contact submissions
            </p>
          </button>
          <button
            onClick={() => window.open("/", "_blank")}
            className="p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-left sm:col-span-2 md:col-span-1"
          >
            <h3 className="text-sm sm:text-base font-semibold mb-1">
              View Portfolio
            </h3>
            <p className="text-xs sm:text-sm text-blue-200">
              See your live portfolio site
            </p>
          </button>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Recent Projects
          </h2>
          <button
            onClick={() => router.push("/admin/projects")}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            View All →
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

        <div className="space-y-3 sm:space-y-4">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project._id}
              className="bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-purple-500/20"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 sm:ml-4 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="px-3 py-1.5 sm:py-1 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base text-gray-400">
                No projects yet
              </p>
              <button
                onClick={() => router.push("/admin/projects")}
                className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 text-sm sm:text-base bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Create Your First Project
              </button>
            </div>
          )}
        </div>
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
    <div className="bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/20 mb-4 sm:mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
        {project ? "Edit Project" : "Add New Project"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <input
          type="text"
          placeholder="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
          rows={3}
          required
        />
        <input
          type="text"
          placeholder="Technologies (comma separated)"
          value={formData.technologies}
          onChange={(e) =>
            setFormData({ ...formData, technologies: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        />
        <input
          type="url"
          placeholder="Live URL"
          value={formData.liveUrl}
          onChange={(e) =>
            setFormData({ ...formData, liveUrl: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        />
        <input
          type="url"
          placeholder="GitHub URL"
          value={formData.githubUrl}
          onChange={(e) =>
            setFormData({ ...formData, githubUrl: e.target.value })
          }
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        />
        <label className="flex items-center gap-2 text-sm sm:text-base text-white cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="w-4 h-4"
          />
          Featured Project
        </label>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
