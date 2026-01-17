"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Trash2, Eye, Clock } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export default function ContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchContacts();
        if (selectedContact?._id === id) {
          setSelectedContact(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete contact");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchContacts();
        if (selectedContact?._id === id) {
          setSelectedContact({ ...selectedContact, status: status as any });
        }
      }
    } catch (error) {
      console.error("Failed to update contact");
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === "new") {
      await handleStatusChange(contact._id, "read");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "read":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "replied":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-56 bg-slate-700/50 rounded animate-pulse"></div>
          <div className="h-5 w-72 bg-slate-700/30 rounded mt-2 animate-pulse"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20"
            >
              <div className="h-5 w-32 bg-slate-700/30 rounded animate-pulse mb-2"></div>
              <div className="h-9 w-16 bg-slate-700/50 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-40 bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="h-4 w-48 bg-slate-700/30 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-16 bg-slate-700/30 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-slate-700/30 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-slate-700/20 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-slate-700/30 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2 flex-1">
                  <div className="h-8 w-48 bg-slate-700/50 rounded animate-pulse"></div>
                  <div className="h-5 w-56 bg-slate-700/30 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-slate-700/30 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-700/30 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-slate-700/30 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-700/30 rounded animate-pulse"></div>
                  <div className="h-5 w-40 bg-slate-700/30 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 flex-1 bg-slate-700/30 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-20 bg-slate-700/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
        <p className="text-gray-400 mt-1">
          Manage messages from your contact form
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-gray-400 mb-2">Total Messages</h3>
          <p className="text-3xl font-bold text-white">{contacts.length}</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-green-500/20">
          <h3 className="text-gray-400 mb-2">New Messages</h3>
          <p className="text-3xl font-bold text-green-400">
            {contacts.filter((c) => c.status === "new").length}
          </p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-gray-400 mb-2">Replied</h3>
          <p className="text-3xl font-bold text-purple-400">
            {contacts.filter((c) => c.status === "replied").length}
          </p>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="bg-slate-800/50 p-12 rounded-xl border border-purple-500/20 text-center">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No contact messages yet</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                className={`bg-slate-800/50 p-6 rounded-xl border transition-all cursor-pointer ${
                  selectedContact?._id === contact._id
                    ? "border-purple-500"
                    : "border-purple-500/20 hover:border-purple-500/40"
                }`}
                onClick={() => handleViewContact(contact)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                      {contact.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{contact.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}
                  >
                    {contact.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                  {contact.message}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(contact.createdAt)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact._id);
                    }}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:sticky lg:top-6 h-fit">
          {selectedContact ? (
            <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedContact.name}
                  </h2>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-purple-400 hover:text-purple-300 transition"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedContact.status)}`}
                >
                  {selectedContact.status}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-gray-400 text-sm mb-2">Message</h3>
                <p className="text-white leading-relaxed">
                  {selectedContact.message}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-gray-400 text-sm mb-2">Received</h3>
                <p className="text-white">
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-400 text-sm">Actions</h3>
                <div className="flex gap-3">
                  <select
                    value={selectedContact.status}
                    onChange={(e) =>
                      handleStatusChange(selectedContact._id, e.target.value)
                    }
                    className="flex-1 px-4 py-2 bg-slate-700 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
                  >
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 p-12 rounded-xl border border-purple-500/20 text-center">
              <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
