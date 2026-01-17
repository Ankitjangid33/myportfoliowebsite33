import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String },
  achievements: [String],
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  gpa: { type: String },
});

const SkillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  skills: [String],
});

const ResumeSchema = new mongoose.Schema(
  {
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      location: { type: String },
      website: { type: String },
      linkedin: { type: String },
      github: { type: String },
      summary: { type: String },
    },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillSchema],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        url: String,
      },
    ],
    languages: [
      {
        language: String,
        proficiency: String,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
