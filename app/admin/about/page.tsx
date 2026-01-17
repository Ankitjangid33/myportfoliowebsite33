"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/about");
        if (response.ok) {
          const data = await response.json();
          if (data.about) {
            setBio(data.about.bio || "");
            setTitle(data.about.title || "");
            setSkills(data.about.skills?.join(", ") || "");
            setExperience(data.about.experience || "");
            setEducation(data.about.education || "");
          }
        }
      } catch (error) {
        console.error("Error fetching about:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchAbout();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          title,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          experience,
          education,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("About information updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to update about information");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">About Me</h1>
        <p className="text-gray-400 mt-1">
          Manage your personal information and bio
        </p>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Full Stack Developer, Software Engineer"
              className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            />
            <p className="text-sm text-gray-400 mt-1">
              Write a brief introduction about yourself
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, TypeScript, MongoDB (comma separated)"
              className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-sm text-gray-400 mt-1">
              Enter your skills separated by commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Experience
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Describe your work experience..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Education
            </label>
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="Describe your educational background..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.includes("success")
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
        <div className="space-y-4">
          {title && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Title</h3>
              <p className="text-white text-lg font-semibold">{title}</p>
            </div>
          )}

          {bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Bio</h3>
              <p className="text-gray-300 leading-relaxed">{bio}</p>
            </div>
          )}

          {skills && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {experience && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Experience
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {experience}
              </p>
            </div>
          )}

          {education && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">
                Education
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {education}
              </p>
            </div>
          )}

          {!title && !bio && !skills && !experience && !education && (
            <p className="text-gray-400 text-center py-8">
              Fill in the form above to see a preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
