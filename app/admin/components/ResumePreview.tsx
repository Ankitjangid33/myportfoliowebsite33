import { FileText } from "lucide-react";

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

interface ResumeData {
  personalInfo?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  languages?: Language[];
}

interface ResumePreviewProps {
  formData: ResumeData;
}

export default function ResumePreview({ formData }: ResumePreviewProps) {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-purple-500/20 p-6 overflow-y-auto max-h-[calc(90vh-120px)] sticky top-0">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Live Preview
      </h3>
      <div className="bg-white text-black p-8 rounded-lg shadow-lg min-h-[600px]">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b-2 border-purple-600 pb-4">
            <h1 className="text-3xl font-bold text-purple-700">
              {formData.personalInfo?.fullName || "Your Name"}
            </h1>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              {formData.personalInfo?.email && (
                <p>{formData.personalInfo.email}</p>
              )}
              {formData.personalInfo?.phone && (
                <p>{formData.personalInfo.phone}</p>
              )}
              {formData.personalInfo?.location && (
                <p>{formData.personalInfo.location}</p>
              )}
              {formData.personalInfo?.website && (
                <p className="text-blue-600">{formData.personalInfo.website}</p>
              )}
              {formData.personalInfo?.linkedin && (
                <p className="text-blue-600">
                  {formData.personalInfo.linkedin}
                </p>
              )}
              {formData.personalInfo?.github && (
                <p className="text-blue-600">{formData.personalInfo.github}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          {formData.personalInfo?.summary && (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                SUMMARY
              </h2>
              <p className="text-sm text-gray-700">
                {formData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {formData.experience && formData.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                EXPERIENCE
              </h2>
              <div className="space-y-3">
                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="text-sm">
                    <h3 className="font-bold text-gray-800">
                      {exp.position || "Position"}{" "}
                      {exp.company && `at ${exp.company}`}
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {exp.startDate || "Start"} -{" "}
                      {exp.current ? "Present" : exp.endDate || "End"}
                    </p>
                    {exp.description && (
                      <p className="text-gray-700 mt-1">{exp.description}</p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside mt-1 text-gray-700">
                        {exp.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {formData.education && formData.education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="text-sm">
                    <h3 className="font-bold text-gray-800">
                      {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-700">
                      {edu.institution || "Institution"}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {edu.startDate || "Start"} - {edu.endDate || "End"}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {formData.skills && formData.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-2">SKILLS</h2>
              <div className="space-y-2">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-bold text-gray-800">
                      {skill.category || "Category"}:
                    </span>{" "}
                    <span className="text-gray-700">
                      {skill.skills && skill.skills.length > 0
                        ? skill.skills.join(", ")
                        : "Skills"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {formData.certifications && formData.certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                CERTIFICATIONS
              </h2>
              <div className="space-y-2">
                {formData.certifications.map((cert, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-gray-800">
                      <span className="font-bold">
                        {cert.name || "Certification"}
                      </span>
                      {cert.issuer && ` - ${cert.issuer}`}
                      {cert.date && ` (${cert.date})`}
                    </p>
                    {cert.url && (
                      <p className="text-blue-600 text-xs">{cert.url}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {formData.languages && formData.languages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-2">
                LANGUAGES
              </h2>
              <div className="space-y-1">
                {formData.languages.map((lang, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    <span className="font-bold">
                      {lang.language || "Language"}:
                    </span>{" "}
                    {lang.proficiency || "Proficiency"}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
