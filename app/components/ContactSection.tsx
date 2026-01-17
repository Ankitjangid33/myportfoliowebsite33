"use client";

import { useState, useEffect } from "react";

interface ProfileData {
  email: string;
  mobile: string;
  address: string;
  linkedin: string;
  github: string;
  twitter: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState<ProfileData>({
    email: "your.email@example.com",
    mobile: "+1 (555) 123-4567",
    address: "Your City, Country",
    linkedin: "",
    github: "",
    twitter: "",
  });

  useEffect(() => {
    // Fetch profile data
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile({
            email: data.profile.email || "your.email@example.com",
            mobile: data.profile.mobile || "+1 (555) 123-4567",
            address: data.profile.address || "Your City, Country",
            linkedin: data.profile.linkedin || "",
            github: data.profile.github || "",
            twitter: data.profile.twitter || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 px-6 bg-slate-900/50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Get In <span className="text-purple-400">Touch</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">
              Let's Work Together
            </h3>
            <p className="text-gray-300 mb-8">
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white hover:text-purple-400 transition"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <a
                    href={`tel:${profile.mobile}`}
                    className="text-white hover:text-purple-400 transition"
                  >
                    {profile.mobile}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">{profile.address}</p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "success" && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                ✗ {errorMessage}
              </div>
            )}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={5}
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
            ></textarea>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
