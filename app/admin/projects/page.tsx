"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  X,
  Plus,
  Search,
  Star,
  ExternalLink,
  Github,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Upload,
  Folder,
  Code,
  TrendingUp
} from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    projectId: string;
    projectTitle: string;
  }>({
    show: false,
    projectId: "",
    projectTitle: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (filterFeatured !== null) {
      filtered = filtered.filter((project) => project.featured === filterFeatured);
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, filterFeatured]);

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

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/projects/${deleteModal.projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProjects();
        setDeleteModal({ show: false, projectId: "", projectTitle: "" });
      }
    } catch (error) {
      console.error("Failed to delete project");
    }
  };

  const openDeleteModal = (id: string, title: string) => {
    setDeleteModal({ show: true, projectId: id, projectTitle: title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, projectId: "", projectTitle: "" });
  };

  const stats = {
    total: projects.length,
    featured: projects.filter((p) => p.featured).length,
    withLiveUrl: projects.filter((p) => p.liveUrl).length,
    withGithub: projects.filter((p) => p.githubUrl).length,
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-9 w-48 bg-slate-700/50 rounded animate-pulse"></div>
            <div className="h-5 w-64 bg-slate-700/30 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="h-12 w-36 bg-slate-700/50 rounded-lg animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
              <div className="h-4 w-20 bg-slate-700/30 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-12 bg-slate-700/50 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden"
            >
              <div className="h-48 bg-slate-700/50 animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 w-3/4 bg-slate-700/50 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-slate-700/30 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Folder className="w-8 h-8 text-purple-400" />
            Projects
          </h1>
          <p className="text-gray-400 mt-1">Manage and showcase your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition font-medium flex items-center gap-2 shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 p-6 rounded-xl border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Featured</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.featured}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-xl border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Live Demos</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.withLiveUrl}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">On GitHub</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.withGithub}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Github className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 p-4 rounded-xl border border-purple-500/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterFeatured(filterFeatured === true ? null : true)}
              className={`px-4 py-3 rounded-lg transition font-medium flex items-center gap-2 ${filterFeatured === true
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                : "bg-slate-900 text-gray-400 border border-purple-500/20 hover:border-purple-500/40"
                }`}
            >
              <Star className="w-4 h-4" />
              Featured
            </button>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="px-4 py-3 bg-slate-900 text-gray-400 border border-purple-500/20 hover:border-purple-500/40 rounded-lg transition font-medium"
            >
              {viewMode === "grid" ? "List" : "Grid"}
            </button>
          </div>
        </div>
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

      {/* Projects Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="group bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-900/20 to-pink-900/20 overflow-hidden flex items-center justify-center">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code className="w-16 h-16 text-purple-400/30" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs font-medium border border-purple-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-slate-700/50 text-gray-400 rounded text-xs font-medium">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 mb-4 text-sm">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-purple-500/10">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(project._id, project.title)}
                    className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Project Image */}
                <div className="relative w-full md:w-64 h-48 bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex-shrink-0 flex items-center justify-center">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code className="w-12 h-12 text-purple-400/30" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-white">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setShowForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition font-medium text-sm flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(project._id, project.title)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition font-medium text-sm flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm font-medium border border-purple-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 text-sm">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="bg-slate-800/50 p-12 rounded-xl border border-purple-500/20 text-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-gray-400 text-lg font-medium mb-2">
            {searchQuery || filterFeatured !== null ? "No projects found" : "No projects yet"}
          </p>
          <p className="text-gray-500">
            {searchQuery || filterFeatured !== null
              ? "Try adjusting your search or filters"
              : 'Click "Add Project" to create your first project'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={closeDeleteModal}
          ></div>

          {/* Modal */}
          <div
            className="relative bg-slate-800 rounded-2xl border border-red-500 border-opacity-30 shadow-2xl max-w-md w-full"
            style={{ animation: "scaleIn 0.2s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-start gap-4 p-6 pb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Delete Project
                </h3>
                <p className="text-gray-400 text-sm">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <p className="text-gray-300 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  {deleteModal.projectTitle}
                </span>
                ? This will permanently remove the project from your portfolio.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
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
    imageUrl: project?.imageUrl || "",
    featured: project?.featured || false,
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.liveUrl && !formData.liveUrl.match(/^https?:\/\/.+/)) {
      newErrors.liveUrl = "Please enter a valid URL";
    }

    if (formData.githubUrl && !formData.githubUrl.match(/^https?:\/\/.+/)) {
      newErrors.githubUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, imageUrl: "Please select an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, imageUrl: "Image size should be less than 5MB" });
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setErrors({ ...errors, imageUrl: "" });
      } else {
        setErrors({ ...errors, imageUrl: "Failed to upload image" });
      }
    } catch (error) {
      setErrors({ ...errors, imageUrl: "Failed to upload image" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const data = {
      ...formData,
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
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
      } else {
        setErrors({ submit: "Failed to save project" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to save project" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-slate-800 rounded-2xl border border-purple-500/30 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-purple-500/20 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            {project ? (
              <>
                <Edit2 className="w-6 h-6 text-purple-400" />
                Edit Project
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-purple-400" />
                Add New Project
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Project Image
            </label>
            <div className="flex gap-4 items-start">
              {formData.imageUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                  <Image
                    src={formData.imageUrl}
                    alt="Project preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/50 transition bg-slate-900/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-2" />
                      <p className="text-gray-400">Uploading...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-gray-300 font-medium">Click to upload image</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              )}
            </div>
            {errors.imageUrl && (
              <p className="text-red-400 text-sm mt-2">{errors.imageUrl}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="My Awesome Project"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: "" });
                }}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition ${errors.title ? "border-red-500" : "border-purple-500/20"
                  }`}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                placeholder="Describe your project in detail..."
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: "" });
                }}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none ${errors.description ? "border-red-500" : "border-purple-500/20"
                  }`}
                rows={4}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Technologies */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies
              </label>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB, TypeScript"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
              <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
            </div>

            {/* Live URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Live URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.liveUrl}
                onChange={(e) => {
                  setFormData({ ...formData, liveUrl: e.target.value });
                  setErrors({ ...errors, liveUrl: "" });
                }}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition ${errors.liveUrl ? "border-red-500" : "border-purple-500/20"
                  }`}
              />
              {errors.liveUrl && (
                <p className="text-red-400 text-sm mt-1">{errors.liveUrl}</p>
              )}
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={(e) => {
                  setFormData({ ...formData, githubUrl: e.target.value });
                  setErrors({ ...errors, githubUrl: "" });
                }}
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition ${errors.githubUrl ? "border-red-500" : "border-purple-500/20"
                  }`}
              />
              {errors.githubUrl && (
                <p className="text-red-400 text-sm mt-1">{errors.githubUrl}</p>
              )}
            </div>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-900 transition">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-5 h-5 rounded border-purple-500/20 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800"
            />
            <div className="flex-1">
              <span className="text-white font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Mark as Featured Project
              </span>
              <p className="text-gray-500 text-sm">Featured projects appear first on your portfolio</p>
            </div>
          </label>

          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-purple-500/20">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : project ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
