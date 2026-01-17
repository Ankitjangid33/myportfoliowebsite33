"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [initials, setInitials] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
            setDisplayName(data.about.displayName || "");
            setInitials(data.about.initials || "");
            setProfileImage(data.about.profileImage || "");
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
          displayName,
          initials,
          profileImage,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfileImage(data.url);
        setMessage("Image uploaded successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Failed to upload image");
      }
    } catch (error) {
      setMessage("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">About Me</h1>
          <p className="text-gray-400 mt-1">
            Manage your personal information and bio
          </p>
        </div>
        <a
          href="/#about"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Live Page
        </a>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., DevAnkit-AJ"
                className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-sm text-gray-400 mt-1">
                Your name as it appears on the homepage
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Initials
              </label>
              <input
                type="text"
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="e.g., WD"
                maxLength={3}
                className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-sm text-gray-400 mt-1">
                2-3 letters for the profile circle
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Image
            </label>
            <div className="space-y-3">
              {profileImage && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 relative">
                    <Image
                      src={profileImage}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileImage("")}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </span>
                </label>
                {isUploading && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm">Uploading to Cloudinary...</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Upload your profile photo (max 5MB). Recommended: 400x400px
                square image
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Enter Image URL Manually
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              disabled={isUploading}
              className="w-full px-4 py-3 bg-slate-900 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
            <p className="text-sm text-gray-400 mt-1">
              Leave empty to use initials instead of an image
            </p>
          </div>

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
          {(displayName || initials || profileImage) && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Profile Avatar
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white overflow-hidden relative">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{initials || "WD"}</span>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {displayName || "Your Name"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {profileImage
                      ? "Using profile image"
                      : `Using initials: ${initials || "WD"}`}
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {!displayName &&
            !initials &&
            !profileImage &&
            !title &&
            !bio &&
            !skills &&
            !experience &&
            !education && (
              <p className="text-gray-400 text-center py-8">
                Fill in the form above to see a preview
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
