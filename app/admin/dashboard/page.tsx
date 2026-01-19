"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  MessageSquare,
  Zap,
  Bell,
  Star,
  ExternalLink,
  Github,
  Mail,
  Eye,
  CheckCircle,
  Settings,
  Globe,
  TrendingUp,
  Loader2,
  Folder,
  Inbox,
} from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

interface Notification {
  _id: string;
  type: "contact" | "project" | "system";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();

      // Auto-refresh every 5 seconds
      const intervalId = setInterval(() => {
        fetchData();
      }, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [projectsRes, contactsRes, notificationsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/contact"),
        fetch("/api/notifications"),
      ]);

      const [projectsData, contactsData, notificationsData] = await Promise.all(
        [projectsRes.json(), contactsRes.json(), notificationsRes.json()],
      );

      if (projectsData.success) setProjects(projectsData.data);
      if (contactsData.success) setContacts(contactsData.data);
      if (notificationsData.success) setNotifications(notificationsData.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTopTechnologies = () => {
    const techCount: Record<string, number> = {};
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });
    return Object.entries(techCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getRecentActivity = () => {
    const activities: Array<{
      id: string;
      type: string;
      message: string;
      time: string;
      icon: string;
      color: string;
    }> = [];

    contacts.slice(0, 3).forEach((contact) => {
      activities.push({
        id: contact._id,
        type: "contact",
        message: `New message from ${contact.name}`,
        time: new Date(contact.createdAt).toLocaleDateString(),
        icon: "mail",
        color: "text-green-400",
      });
    });

    projects
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 2)
      .forEach((project) => {
        activities.push({
          id: project._id,
          type: "project",
          message: `Project "${project.title}" created`,
          time: new Date(project.createdAt).toLocaleDateString(),
          icon: "folder",
          color: "text-purple-400",
        });
      });

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-9 w-48 bg-slate-700 rounded-lg mb-2"></div>
            <div className="h-5 w-64 bg-slate-700 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-slate-700 rounded-lg"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
                <div className="w-6 h-6 bg-slate-700 rounded"></div>
              </div>
              <div className="h-9 w-16 bg-slate-700 rounded mb-1"></div>
              <div className="h-3 w-20 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Projects Skeleton */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <div className="h-7 w-40 bg-slate-700 rounded"></div>
                <div className="h-5 w-20 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 p-4 rounded-lg border border-slate-700"
                  >
                    <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
                    <div className="h-4 w-full bg-slate-700 rounded mb-3"></div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="h-6 w-16 bg-slate-700 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Status Skeleton */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <div className="h-7 w-36 bg-slate-700 rounded"></div>
                <div className="h-5 w-20 bg-slate-700 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 p-4 rounded-lg border border-slate-700"
                  >
                    <div className="w-8 h-8 bg-slate-700 rounded mb-2"></div>
                    <div className="h-8 w-12 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-900/50 p-3 rounded-lg border border-slate-700"
                  >
                    <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-48 bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 w-full bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions Skeleton */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="h-7 w-32 bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-600 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 w-28 bg-slate-600 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-slate-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Technologies Skeleton */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="h-7 w-40 bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-slate-700 rounded mb-1"></div>
                      <div className="w-full bg-slate-700 rounded-full h-2"></div>
                    </div>
                    <div className="h-4 w-6 bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="h-7 w-36 bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="w-5 h-5 bg-slate-700 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-slate-700 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const topTechnologies = getTopTechnologies();
  const recentActivity = getRecentActivity();
  const newContactsCount = contacts.filter((c) => c.status === "new").length;
  const readContactsCount = contacts.filter((c) => c.status === "read").length;
  const repliedContactsCount = contacts.filter(
    (c) => c.status === "replied",
  ).length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const ActivityIcon = ({ type }: { type: string }) => {
    if (type === "mail") return <Mail className="w-5 h-5" />;
    if (type === "folder") return <Folder className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back, {session?.user?.name || "Admin"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/projects")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-sm font-medium"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Total Projects</h3>
            <FolderKanban className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {projects.length}
          </p>
          <p className="text-xs text-purple-400">
            {projects.filter((p) => p.featured).length} featured
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">New Messages</h3>
            <MessageSquare className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400 mb-1">
            {newContactsCount}
          </p>
          <p className="text-xs text-green-400">
            {contacts.length} total contacts
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Technologies</h3>
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400 mb-1">
            {topTechnologies.length}
          </p>
          <p className="text-xs text-blue-400">
            {topTechnologies[0]?.[0] || "None"} most used
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Notifications</h3>
            <Bell className="w-6 h-6 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-orange-400 mb-1">
            {unreadNotifications}
          </p>
          <p className="text-xs text-orange-400">
            {notifications.length} total
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Recent Projects</h2>
              <button
                onClick={() => router.push("/admin/projects")}
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No projects yet</p>
                  <button
                    onClick={() => router.push("/admin/projects")}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    Create Your First Project
                  </button>
                </div>
              ) : (
                projects.slice(0, 4).map((project) => (
                  <div
                    key={project._id}
                    className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition cursor-pointer"
                    onClick={() => router.push("/admin/projects")}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded flex items-center gap-1">
                              <Star className="w-3 h-3" /> Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300 transition"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-gray-300 transition"
                            title="GitHub"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Contact Status</h2>
              <button
                onClick={() => router.push("/admin/contacts")}
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <Inbox className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-green-400">
                  {newContactsCount}
                </p>
                <p className="text-sm text-gray-400">New</p>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <Eye className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-blue-400">
                  {readContactsCount}
                </p>
                <p className="text-sm text-gray-400">Read</p>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                <CheckCircle className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-purple-400">
                  {repliedContactsCount}
                </p>
                <p className="text-sm text-gray-400">Replied</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {contacts.slice(0, 3).map((contact) => (
                <div
                  key={contact._id}
                  className="bg-slate-900/50 p-3 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition cursor-pointer"
                  onClick={() => router.push("/admin/contacts")}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white text-sm">
                          {contact.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            contact.status === "new"
                              ? "bg-green-500/20 text-green-400"
                              : contact.status === "read"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {contact.email}
                      </p>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-1">
                        {contact.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/admin/projects")}
                className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-left"
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-sm">Manage Projects</h3>
                    <p className="text-xs text-purple-200">View and edit</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push("/admin/contacts")}
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-left"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-sm">View Messages</h3>
                    <p className="text-xs text-green-200">Check contacts</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => router.push("/admin/settings")}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-left"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-sm">Settings</h3>
                    <p className="text-xs text-blue-200">Configure site</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => window.open("/", "_blank")}
                className="w-full p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-left"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-sm">View Portfolio</h3>
                    <p className="text-xs text-gray-300">Live site</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Top Technologies
            </h2>
            <div className="space-y-3">
              {topTechnologies.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No technologies yet
                </p>
              ) : (
                topTechnologies.map(([tech, count], index) => (
                  <div key={tech} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {tech}
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(count / projects.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-purple-500/10"
                  >
                    <div className={activity.color}>
                      <ActivityIcon type={activity.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${activity.color}`}>
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
