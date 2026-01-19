"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Download,
  Edit,
  Trash2,
  Loader2,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Code,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import ResumePreview from "../components/ResumePreview";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Skill {
  category: string;
  skills: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface Language {
  language: string;
  proficiency: string;
}

interface Resume {
  _id: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ResumePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    resumeId: string;
    resumeName: string;
  }>({
    show: false,
    resumeId: "",
    resumeName: "",
  });

  const [formData, setFormData] = useState<Partial<Resume>>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    isActive: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchResumes();

      // Auto-refresh every 5 seconds
      const intervalId = setInterval(() => {
        fetchResumes();
      }, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDownloadMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".download-menu-container")) {
          setShowDownloadMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDownloadMenu]);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      if (data.success) {
        setResumes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/resume/${editingId}` : "/api/resume";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchResumes();
        setShowForm(false);
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/resume/${deleteModal.resumeId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchResumes();
        setDeleteModal({ show: false, resumeId: "", resumeName: "" });
      }
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ show: true, resumeId: id, resumeName: name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, resumeId: "", resumeName: "" });
  };

  const handleEdit = (resume: Resume) => {
    setFormData(resume);
    setEditingId(resume._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        summary: "",
      },
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      languages: [],
      isActive: true,
    });
  };

  const downloadResume = (resume: Resume) => {
    const content = generateResumeText(resume);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = (resume: Resume) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Helper function to add text with word wrap
    const addText = (
      text: string,
      fontSize: number,
      isBold: boolean = false,
      color: number[] = [0, 0, 0],
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.5 + 5;
    };

    const checkPageBreak = (requiredSpace: number = 20) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Header
    addText(resume.personalInfo.fullName, 22, true, [75, 0, 130]);
    addText(`${resume.personalInfo.email} | ${resume.personalInfo.phone}`, 10);
    addText(resume.personalInfo.location, 10);

    if (resume.personalInfo.website)
      addText(`Website: ${resume.personalInfo.website}`, 9);
    if (resume.personalInfo.linkedin)
      addText(`LinkedIn: ${resume.personalInfo.linkedin}`, 9);
    if (resume.personalInfo.github)
      addText(`GitHub: ${resume.personalInfo.github}`, 9);

    yPosition += 5;
    doc.setDrawColor(75, 0, 130);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Summary
    if (resume.personalInfo.summary) {
      checkPageBreak(30);
      addText("SUMMARY", 14, true, [75, 0, 130]);
      addText(resume.personalInfo.summary, 10);
      yPosition += 5;
    }

    // Experience
    if (resume.experience.length > 0) {
      checkPageBreak(30);
      addText("EXPERIENCE", 14, true, [75, 0, 130]);
      resume.experience.forEach((exp) => {
        checkPageBreak(40);
        addText(`${exp.position} at ${exp.company}`, 12, true);
        addText(
          `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
          9,
          false,
          [100, 100, 100],
        );
        if (exp.description) addText(exp.description, 10);
        if (exp.achievements.length > 0) {
          exp.achievements.forEach((ach) => {
            checkPageBreak(15);
            addText(`• ${ach}`, 9);
          });
        }
        yPosition += 5;
      });
    }

    // Education
    if (resume.education.length > 0) {
      checkPageBreak(30);
      addText("EDUCATION", 14, true, [75, 0, 130]);
      resume.education.forEach((edu) => {
        checkPageBreak(30);
        addText(`${edu.degree} in ${edu.field}`, 12, true);
        addText(edu.institution, 10);
        const eduDate = `${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`;
        addText(eduDate, 9, false, [100, 100, 100]);
        yPosition += 5;
      });
    }

    // Skills
    if (resume.skills.length > 0) {
      checkPageBreak(30);
      addText("SKILLS", 14, true, [75, 0, 130]);
      resume.skills.forEach((skill) => {
        checkPageBreak(15);
        addText(`${skill.category}: ${skill.skills.join(", ")}`, 10);
      });
      yPosition += 5;
    }

    // Certifications
    if (resume.certifications.length > 0) {
      checkPageBreak(30);
      addText("CERTIFICATIONS", 14, true, [75, 0, 130]);
      resume.certifications.forEach((cert) => {
        checkPageBreak(20);
        addText(`${cert.name} - ${cert.issuer} (${cert.date})`, 10);
        if (cert.url) addText(cert.url, 8, false, [0, 0, 255]);
      });
      yPosition += 5;
    }

    // Languages
    if (resume.languages.length > 0) {
      checkPageBreak(30);
      addText("LANGUAGES", 14, true, [75, 0, 130]);
      resume.languages.forEach((lang) => {
        checkPageBreak(15);
        addText(`${lang.language}: ${lang.proficiency}`, 10);
      });
    }

    doc.save(`${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    setShowDownloadMenu(null);
  };

  const downloadAsDOC = async (resume: Resume) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: resume.personalInfo.fullName,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `${resume.personalInfo.email} | ${resume.personalInfo.phone}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: resume.personalInfo.location,
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            ...(resume.personalInfo.website
              ? [
                  new Paragraph({
                    text: `Website: ${resume.personalInfo.website}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                  }),
                ]
              : []),
            ...(resume.personalInfo.linkedin
              ? [
                  new Paragraph({
                    text: `LinkedIn: ${resume.personalInfo.linkedin}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                  }),
                ]
              : []),
            ...(resume.personalInfo.github
              ? [
                  new Paragraph({
                    text: `GitHub: ${resume.personalInfo.github}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                  }),
                ]
              : []),

            // Summary
            ...(resume.personalInfo.summary
              ? [
                  new Paragraph({
                    text: "SUMMARY",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                  }),
                  new Paragraph({
                    text: resume.personalInfo.summary,
                    spacing: { after: 300 },
                  }),
                ]
              : []),

            // Experience
            ...(resume.experience.length > 0
              ? [
                  new Paragraph({
                    text: "EXPERIENCE",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                  }),
                  ...resume.experience.flatMap((exp) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exp.position} at ${exp.company}`,
                          bold: true,
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      text: `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
                      spacing: { after: 100 },
                    }),
                    ...(exp.description
                      ? [
                          new Paragraph({
                            text: exp.description,
                            spacing: { after: 100 },
                          }),
                        ]
                      : []),
                    ...exp.achievements.map(
                      (ach) =>
                        new Paragraph({
                          text: `• ${ach}`,
                          spacing: { after: 100 },
                        }),
                    ),
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                  ]),
                ]
              : []),

            // Education
            ...(resume.education.length > 0
              ? [
                  new Paragraph({
                    text: "EDUCATION",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                  }),
                  ...resume.education.flatMap((edu) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${edu.degree} in ${edu.field}`,
                          bold: true,
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      text: edu.institution,
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      text: `${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
                      spacing: { after: 200 },
                    }),
                  ]),
                ]
              : []),

            // Skills
            ...(resume.skills.length > 0
              ? [
                  new Paragraph({
                    text: "SKILLS",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                  }),
                  ...resume.skills.map(
                    (skill) =>
                      new Paragraph({
                        text: `${skill.category}: ${skill.skills.join(", ")}`,
                        spacing: { after: 100 },
                      }),
                  ),
                ]
              : []),

            // Certifications
            ...(resume.certifications.length > 0
              ? [
                  new Paragraph({
                    text: "CERTIFICATIONS",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                  }),
                  ...resume.certifications.flatMap((cert) => [
                    new Paragraph({
                      text: `${cert.name} - ${cert.issuer} (${cert.date})`,
                      spacing: { after: 100 },
                    }),
                    ...(cert.url
                      ? [
                          new Paragraph({
                            text: cert.url,
                            spacing: { after: 100 },
                          }),
                        ]
                      : []),
                  ]),
                ]
              : []),

            // Languages
            ...(resume.languages.length > 0
              ? [
                  new Paragraph({
                    text: "LANGUAGES",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 },
                  }),
                  ...resume.languages.map(
                    (lang) =>
                      new Paragraph({
                        text: `${lang.language}: ${lang.proficiency}`,
                        spacing: { after: 100 },
                      }),
                  ),
                ]
              : []),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(
      blob,
      `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.docx`,
    );
    setShowDownloadMenu(null);
  };

  const generateResumeText = (resume: Resume) => {
    let text = `${resume.personalInfo.fullName}\n`;
    text += `${resume.personalInfo.email} | ${resume.personalInfo.phone}\n`;
    text += `${resume.personalInfo.location}\n`;
    if (resume.personalInfo.website)
      text += `Website: ${resume.personalInfo.website}\n`;
    if (resume.personalInfo.linkedin)
      text += `LinkedIn: ${resume.personalInfo.linkedin}\n`;
    if (resume.personalInfo.github)
      text += `GitHub: ${resume.personalInfo.github}\n`;
    text += `\n${"=".repeat(60)}\n\n`;

    if (resume.personalInfo.summary) {
      text += `SUMMARY\n${"-".repeat(60)}\n${resume.personalInfo.summary}\n\n`;
    }

    if (resume.experience.length > 0) {
      text += `EXPERIENCE\n${"-".repeat(60)}\n`;
      resume.experience.forEach((exp) => {
        text += `\n${exp.position} at ${exp.company}\n`;
        text += `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}\n`;
        if (exp.description) text += `${exp.description}\n`;
        if (exp.achievements.length > 0) {
          text += `Achievements:\n`;
          exp.achievements.forEach((ach) => (text += `  • ${ach}\n`));
        }
      });
      text += `\n`;
    }

    if (resume.education.length > 0) {
      text += `EDUCATION\n${"-".repeat(60)}\n`;
      resume.education.forEach((edu) => {
        text += `\n${edu.degree} in ${edu.field}\n`;
        text += `${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.endDate}`;
        if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
        text += `\n`;
      });
      text += `\n`;
    }

    if (resume.skills.length > 0) {
      text += `SKILLS\n${"-".repeat(60)}\n`;
      resume.skills.forEach((skill) => {
        text += `${skill.category}: ${skill.skills.join(", ")}\n`;
      });
      text += `\n`;
    }

    if (resume.certifications.length > 0) {
      text += `CERTIFICATIONS\n${"-".repeat(60)}\n`;
      resume.certifications.forEach((cert) => {
        text += `${cert.name} - ${cert.issuer} (${cert.date})\n`;
        if (cert.url) text += `  ${cert.url}\n`;
      });
      text += `\n`;
    }

    if (resume.languages.length > 0) {
      text += `LANGUAGES\n${"-".repeat(60)}\n`;
      resume.languages.forEach((lang) => {
        text += `${lang.language}: ${lang.proficiency}\n`;
      });
    }

    return text;
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...(formData.experience || []),
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: [],
        },
      ],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...(formData.education || []),
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...(formData.skills || []), { category: "", skills: [] }],
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-9 w-56 bg-slate-700/50 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-5 w-72 bg-slate-700/30 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-36 bg-slate-700/50 rounded-lg animate-pulse"></div>
        </div>

        {/* Resume Cards Skeleton */}
        <div className="grid gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-8 w-48 bg-slate-700/50 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-64 bg-slate-700/30 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-40 bg-slate-700/20 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-24 bg-slate-700/50 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-10 bg-slate-700/50 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-10 bg-slate-700/50 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-slate-700/30 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-12 bg-slate-700/50 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Resume Manager</h1>
          <p className="text-gray-400 mt-1">Create and manage your resumes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Resume
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl p-6 max-w-7xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? "Edit Resume" : "Create Resume"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left Side - Resume Preview */}
                <div className="order-2 lg:order-1">
                  <ResumePreview formData={formData} />
                </div>

                {/* Right Side - Form Fields */}
                <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-4 order-1 lg:order-2">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.personalInfo?.fullName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              fullName: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.personalInfo?.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              email: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={formData.personalInfo?.phone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={formData.personalInfo?.location || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              location: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                      />
                      <input
                        type="url"
                        placeholder="Website"
                        value={formData.personalInfo?.website || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              website: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn"
                        value={formData.personalInfo?.linkedin || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              linkedin: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                      />
                      <input
                        type="url"
                        placeholder="GitHub"
                        value={formData.personalInfo?.github || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              github: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
                      />
                    </div>
                    <textarea
                      placeholder="Professional Summary"
                      value={formData.personalInfo?.summary || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          personalInfo: {
                            ...formData.personalInfo!,
                            summary: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 outline-none mt-4"
                    />
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Experience
                      </h3>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                      >
                        + Add
                      </button>
                    </div>
                    {formData.experience?.map((exp, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 bg-slate-800 rounded-lg"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...(formData.experience || [])];
                              newExp[index].company = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => {
                              const newExp = [...(formData.experience || [])];
                              newExp[index].position = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const newExp = [...(formData.experience || [])];
                              newExp[index].startDate = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => {
                              const newExp = [...(formData.experience || [])];
                              newExp[index].endDate = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                            disabled={exp.current}
                          />
                        </div>
                        <label className="flex items-center gap-2 text-white mt-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              const newExp = [...(formData.experience || [])];
                              newExp[index].current = e.target.checked;
                              setFormData({ ...formData, experience: newExp });
                            }}
                            className="rounded"
                          />
                          Currently working here
                        </label>
                        <textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...(formData.experience || [])];
                            newExp[index].description = e.target.value;
                            setFormData({ ...formData, experience: newExp });
                          }}
                          rows={2}
                          className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none mt-2"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        Education
                      </h3>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                      >
                        + Add
                      </button>
                    </div>
                    {formData.education?.map((edu, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 bg-slate-800 rounded-lg"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index].institution = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index].degree = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Field of Study"
                            value={edu.field}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index].field = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index].startDate = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index].endDate = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="GPA (optional)"
                            value={edu.gpa}
                            onChange={(e) => {
                              const newEdu = [...(formData.education || [])];
                              newEdu[index].gpa = e.target.value;
                              setFormData({ ...formData, education: newEdu });
                            }}
                            className="px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Skills
                      </h3>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                      >
                        + Add Category
                      </button>
                    </div>
                    {formData.skills?.map((skill, index) => (
                      <div
                        key={index}
                        className="mb-3 p-3 bg-slate-800 rounded-lg"
                      >
                        <input
                          type="text"
                          placeholder="Category (e.g., Frontend)"
                          value={skill.category}
                          onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            newSkills[index].category = e.target.value;
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none mb-2"
                        />
                        <input
                          type="text"
                          placeholder="Skills (comma separated)"
                          value={skill.skills.join(", ")}
                          onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            newSkills[index].skills = e.target.value
                              .split(",")
                              .map((s) => s.trim());
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-purple-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? "Update" : "Create"} Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {resumes.length === 0 ? (
          <div className="bg-slate-800/50 p-12 rounded-xl border border-purple-500/20 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first resume to get started
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create Resume
            </button>
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {resume.personalInfo.fullName}
                  </h3>
                  <p className="text-gray-400">{resume.personalInfo.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="relative download-menu-container">
                    <button
                      onClick={() =>
                        setShowDownloadMenu(
                          showDownloadMenu === resume._id ? null : resume._id,
                        )
                      }
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-1"
                      title="Download Resume"
                    >
                      <Download className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {showDownloadMenu === resume._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-slate-700 rounded-lg shadow-lg border border-slate-600 z-10">
                        <button
                          onClick={() => downloadAsPDF(resume)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-slate-600 rounded-t-lg transition flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          PDF
                        </button>
                        <button
                          onClick={() => downloadAsDOC(resume)}
                          className="w-full px-4 py-2 text-left text-white hover:bg-slate-600 rounded-b-lg transition flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          DOC
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(resume)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    title="Edit Resume"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      openDeleteModal(resume._id, resume.personalInfo.fullName)
                    }
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-semibold">Experience</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {resume.experience.length}
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm font-semibold">Education</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {resume.education.length}
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-semibold">Skills</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {resume.skills.length}
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      Certifications
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {resume.certifications.length}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
                  Delete Resume
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
                Are you sure you want to delete the resume for{" "}
                <span className="font-semibold text-white">
                  {deleteModal.resumeName}
                </span>
                ? This will permanently remove the resume from your database.
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
