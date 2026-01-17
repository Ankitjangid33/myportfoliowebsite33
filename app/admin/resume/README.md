# Resume Manager

## Overview

The Resume Manager allows admins to create, edit, and manage professional resumes directly from the admin panel.

## Features

### 1. Create & Edit Resumes

- **Personal Information**: Name, email, phone, location, website, LinkedIn, GitHub, and professional summary
- **Experience**: Add multiple work experiences with company, position, dates, descriptions, and achievements
- **Education**: Track educational background with institution, degree, field of study, dates, and GPA
- **Skills**: Organize skills by categories (e.g., Frontend, Backend, Tools)
- **Certifications**: List professional certifications with issuer, date, and verification URLs
- **Languages**: Add language proficiencies

### 2. Download Resume

- Generate and download resume in multiple formats:
  - **PDF**: Professional PDF format with formatted sections and styling
  - **DOC**: Microsoft Word format (.docx) for easy editing
- Click the download button and select your preferred format
- File naming: `[FullName]_Resume.pdf` or `[FullName]_Resume.docx`

### 3. MongoDB Storage

- All resumes are saved to MongoDB
- Timestamps for creation and updates
- Support for multiple resume versions

## Usage

### Access the Resume Manager

Navigate to `/admin/resume` from the admin panel or click "Resume" in the sidebar.

### Create a New Resume

1. Click the "New Resume" button
2. Fill in the personal information (required: name and email)
3. Add experience entries using the "+ Add" button
4. Add education entries
5. Add skill categories and skills
6. Optionally add certifications and languages
7. Click "Create Resume" to save

### Edit a Resume

1. Click the edit icon (pencil) on any resume card
2. Modify the fields as needed
3. Click "Update Resume" to save changes

### Download a Resume

Click the download button (green button with down arrow) on any resume card, then select your preferred format:

- **PDF**: Best for sharing and printing
- **DOC**: Best for further editing in Microsoft Word

### Delete a Resume

Click the delete icon (trash) on any resume card. Confirmation required.

## API Endpoints

### GET `/api/resume`

Fetch all resumes

### POST `/api/resume`

Create a new resume (requires authentication)

### GET `/api/resume/[id]`

Fetch a specific resume by ID

### PUT `/api/resume/[id]`

Update a resume (requires authentication)

### DELETE `/api/resume/[id]`

Delete a resume (requires authentication)

## Database Schema

```typescript
{
  personalInfo: {
    fullName: String (required),
    email: String (required),
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    summary: String
  },
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    achievements: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String
  }],
  skills: [{
    category: String,
    skills: [String]
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    url: String
  }],
  languages: [{
    language: String,
    proficiency: String
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```
