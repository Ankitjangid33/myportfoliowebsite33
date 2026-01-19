"use client";

import { useEffect, useState } from "react";
import ContactSection from "./components/ContactSection";
import { Menu, X, Target, GraduationCap, Rocket } from "lucide-react";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

interface ProfileData {
  linkedin: string;
  github: string;
  twitter: string;
}

interface AboutData {
  bio: string;
  title: string;
  skills: string[];
  experience: string;
  education: string;
  displayName: string;
  initials: string;
  profileImage: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<ProfileData>({
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [about, setAbout] = useState<AboutData>({
    bio: "",
    title: "",
    skills: [],
    experience: "",
    education: "",
    displayName: "",
    initials: "",
    profileImage: "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, number>>({});

  // Function to get screenshot URL with fallback services
  const getScreenshotUrl = (url: string, attempt: number = 0) => {
    const services = [
      `https://image.thum.io/get/width/400/crop/600/${url}`,
      `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(url)}&width=400&height=300`,
      `https://shot.screenshotapi.net/screenshot?token=demo&url=${encodeURIComponent(url)}&width=400&height=300&output=image&file_type=png&wait_for_event=load`,
    ];
    return services[attempt] || services[0];
  };

  const handleImageError = (projectId: string) => {
    setImageErrors(prev => {
      const currentAttempt = prev[projectId] || 0;
      return { ...prev, [projectId]: currentAttempt + 1 };
    });
  };

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data.slice(0, 6));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile({
            linkedin: data.profile.linkedin || "",
            github: data.profile.github || "",
            twitter: data.profile.twitter || "",
          });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.about) {
          setAbout(data.about);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-sm z-50 border-b border-purple-500/20">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              <span className="text-purple-400">&lt;</span>
              DevAnkit-AJ
              <span className="text-purple-400">/&gt;</span>
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4 lg:space-x-8">
              <a
                href="#home"
                className="text-gray-300 hover:text-purple-400 transition text-sm lg:text-base"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-purple-400 transition text-sm lg:text-base"
              >
                About
              </a>
              <a
                href="#skills"
                className="text-gray-300 hover:text-purple-400 transition text-sm lg:text-base"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="text-gray-300 hover:text-purple-400 transition text-sm lg:text-base"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-purple-400 transition text-sm lg:text-base"
              >
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-purple-400 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-purple-400 transition py-2"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-purple-400 transition py-2"
              >
                About
              </a>
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-purple-400 transition py-2"
              >
                Skills
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-purple-400 transition py-2"
              >
                Projects
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-purple-400 transition py-2"
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 relative overflow-hidden"
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${i % 3 === 0
                  ? "bg-purple-500/30"
                  : i % 3 === 1
                    ? "bg-pink-500/30"
                    : "bg-blue-500/30"
                  }`}
                style={{
                  boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-center relative z-10 max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8 relative">
            {/* Animated rings around avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 sm:w-36 md:w-40 sm:h-36 md:h-40 border-2 border-purple-500/30 rounded-full animate-ping-slow" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 sm:w-32 md:w-36 sm:h-32 md:h-36 border-2 border-pink-500/30 rounded-full animate-ping-slow"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <div className="w-20 h-20 sm:w-28 md:w-32 sm:h-28 md:h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white relative animate-pulse-glow overflow-hidden">
              {about.profileImage ? (
                <Image
                  src={about.profileImage}
                  alt={about.displayName || "Profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{about.initials}</span>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 px-4">
            <span className="inline-flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="mb-6 slide-in-text inline-block">Hi, I&apos;m</span>
              <span className="relative inline-block">
                {/* Glowing orbs around the name */}
                <div className="absolute -inset-4 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-0 w-3 h-3 bg-purple-500 rounded-full animate-orbit-1 blur-sm" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full animate-orbit-2 blur-sm" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full animate-orbit-3 blur-sm" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-500 rounded-full animate-orbit-4 blur-sm" />
                </div>

                {/* Animated gradient text with glow and continuous typing effect */}
                <span className=" pb-4 typing-text text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  {about.displayName || "Ankit Jangid"}
                </span>

                {/* Sparkle effects */}
                <div className="absolute inset-0 overflow-visible pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-sparkle" />
                  <div
                    className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-sparkle"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <div
                    className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full animate-sparkle"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </span>
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 animate-fade-in-up px-4">
            {about.title}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href="#projects"
              className="px-6 sm:px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition transform hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] text-center text-sm sm:text-base"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 sm:px-8 py-3 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white rounded-lg transition transform hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] text-center text-sm sm:text-base"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            About <span className="text-purple-400">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 sm:p-8 rounded-2xl border border-purple-500/20">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                Who I Am
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                {about.bio}
              </p>
            </div>
            <div className="space-y-4">
              {about.experience && (
                <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
                  <h4 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Experience
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">
                    {about.experience}
                  </p>
                </div>
              )}
              {about.education && (
                <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
                  <h4 className="text-lg sm:text-xl font-semibold text-purple-400 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line">
                    {about.education}
                  </p>
                </div>
              )}
              {!about.experience && !about.education && (
                <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/20">
                  <p className="text-sm sm:text-base text-gray-400 text-center py-6 sm:py-8">
                    Add your experience and education from the admin panel to
                    display them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-900/50"
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            My <span className="text-purple-400">Skills</span>
          </h2>
          {about.skills && about.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {about.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition"
                >
                  <span className="text-sm sm:text-base lg:text-lg text-white font-medium">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 sm:p-8 rounded-2xl border border-purple-500/20">
              <p className="text-sm sm:text-base text-gray-400 text-center py-6 sm:py-8">
                Add your skills from the admin panel to display them here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
            Featured <span className="text-purple-400">Projects</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.length > 0 ? (
              projects.map((project) => {
                const errorAttempt = imageErrors[project._id] || 0;
                const showFallback = errorAttempt >= 3;

                return (
                  <div
                    key={project._id}
                    className="bg-slate-800/50 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition group"
                  >
                    <div className="h-40 sm:h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : project.liveUrl && !showFallback ? (
                        <Image
                          src={getScreenshotUrl(project.liveUrl, errorAttempt)}
                          alt={project.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={() => handleImageError(project._id)}
                        />
                      ) : (
                        <Rocket className="w-20 h-20 sm:w-24 sm:h-24 text-purple-400" />
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400 mb-4">
                        {project.description}
                      </p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 sm:gap-4 flex-wrap">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-base text-purple-400 hover:text-purple-300 transition"
                          >
                            Live Demo →
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm sm:text-base text-gray-400 hover:text-gray-300 transition"
                          >
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                No projects yet. Add some from the admin panel!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-purple-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-base text-gray-400 text-center md:text-left">
              © 2026 {about.displayName}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition flex items-center gap-2"
                  title="GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition flex items-center gap-2"
                  title="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition flex items-center gap-2"
                  title="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
