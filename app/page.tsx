"use client";

import { useEffect, useState } from "react";
import ContactSection from "./components/ContactSection";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
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
  });

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
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-purple-400">&lt;</span>
              DevAnkit-AJ
              <span className="text-purple-400">/&gt;</span>
            </h1>
            <div className="hidden md:flex space-x-8">
              <a
                href="#home"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                About
              </a>
              <a
                href="#skills"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              WD
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Hi, I&apos;m{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Your Name
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {about.title || "Full Stack Web Developer | UI/UX Enthusiast"}
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#projects"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white rounded-lg transition"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            About <span className="text-purple-400">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Who I Am
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {about.bio ||
                  "I&apos;m a passionate web developer with expertise in creating modern, responsive, and user-friendly websites. With a strong foundation in both frontend and backend technologies, I bring ideas to life through clean code and creative design.\n\nI love solving complex problems and continuously learning new technologies to stay at the forefront of web development."}
              </p>
            </div>
            <div className="space-y-4">
              {about.experience && (
                <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
                  <h4 className="text-xl font-semibold text-purple-400 mb-2">
                    🎯 Experience
                  </h4>
                  <p className="text-gray-300 whitespace-pre-line">
                    {about.experience}
                  </p>
                </div>
              )}
              {about.education && (
                <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
                  <h4 className="text-xl font-semibold text-purple-400 mb-2">
                    🎓 Education
                  </h4>
                  <p className="text-gray-300 whitespace-pre-line">
                    {about.education}
                  </p>
                </div>
              )}
              {!about.experience && !about.education && (
                <>
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
                    <h4 className="text-xl font-semibold text-purple-400 mb-2">
                      🎯 Experience
                    </h4>
                    <p className="text-gray-300">
                      5+ years building web applications
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
                    <h4 className="text-xl font-semibold text-purple-400 mb-2">
                      💼 Projects
                    </h4>
                    <p className="text-gray-300">50+ completed projects</p>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20">
                    <h4 className="text-xl font-semibold text-purple-400 mb-2">
                      😊 Clients
                    </h4>
                    <p className="text-gray-300">
                      30+ satisfied clients worldwide
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            My <span className="text-purple-400">Skills</span>
          </h2>
          {about.skills && about.skills.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {about.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-6 py-3 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition"
                >
                  <span className="text-lg text-white font-medium">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Frontend
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• React / Next.js</li>
                  <li>• TypeScript / JavaScript</li>
                  <li>• HTML5 / CSS3</li>
                  <li>• Tailwind CSS</li>
                  <li>• Responsive Design</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Backend
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Node.js / Express</li>
                  <li>• Python / Django</li>
                  <li>• RESTful APIs</li>
                  <li>• Database Design</li>
                  <li>• Authentication</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition">
                <div className="text-4xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Tools & Others
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Git / GitHub</li>
                  <li>• Docker</li>
                  <li>• AWS / Vercel</li>
                  <li>• Figma / Design</li>
                  <li>• Agile / Scrum</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Featured <span className="text-purple-400">Projects</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-slate-800/50 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition group"
                >
                  <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <span className="text-6xl">🚀</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition"
                        >
                          Live Demo →
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-300 transition"
                        >
                          GitHub →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
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
      <footer className="py-8 px-6 border-t border-purple-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2026 Your Name. All rights reserved.
            </p>
            <div className="flex gap-6 items-center">
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
