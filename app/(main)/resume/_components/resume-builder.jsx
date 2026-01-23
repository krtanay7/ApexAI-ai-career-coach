"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import ResumeDownload from "./resume-download";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

let html2pdf;
if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js/dist/html2pdf.min.js");
}

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold gradient-title text-5xl md:text-6xl">
            Resume Builder
          </h1>
          <p className="text-gray-600">Create a professional resume that stands out to recruiters</p>
        </div>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-blue-900">📧 Contact Information</h3>
                <p className="text-sm text-blue-800 mt-1 font-medium">Your professional contact details that employers will use to reach you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-2 border-gray-300 rounded-lg bg-white shadow-sm">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800">Email Address *</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="john.doe@example.com"
                    error={errors.contactInfo?.email}
                    className="border-2 border-gray-400 bg-white text-gray-900 font-medium"
                  />
                  <p className="text-xs text-gray-600 font-medium">Use a professional email format</p>
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-600 font-semibold">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800">Phone Number *</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="border-2 border-gray-400 bg-white text-gray-900 font-medium"
                  />
                  <p className="text-xs text-gray-600 font-medium">Include country code for international use</p>
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-600 font-semibold">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800">LinkedIn Profile</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/john-doe"
                    className="border-2 border-gray-400 bg-white text-gray-900 font-medium"
                  />
                  <p className="text-xs text-gray-600 font-medium">Link to your complete LinkedIn profile</p>
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-600 font-semibold">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800">Portfolio / Website</label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://johndoe-portfolio.com"
                  />
                  <p className="text-xs text-gray-500">Your personal website or portfolio link</p>
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-green-900">💼 Professional Summary</h3>
                <p className="text-sm text-green-800 mt-1 font-medium">A brief overview of your career goals and key strengths (2-3 sentences)</p>
              </div>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32 border-2 border-gray-400 bg-white text-gray-900 font-medium"
                    placeholder="Dedicated software engineer with 5+ years of experience building scalable web applications. Proven expertise in React, Node.js, and cloud technologies. Passionate about mentoring junior developers and delivering high-impact solutions."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-600 font-semibold">{errors.summary.message}</p>
              )}
              <p className="text-xs text-gray-600 font-medium">💡 Tip: Keep it concise and highlight your most relevant achievements</p>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="bg-purple-100 border-2 border-purple-400 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-purple-900">🎯 Skills</h3>
                <p className="text-sm text-purple-800 mt-1 font-medium">List your technical and soft skills, separated by commas or new lines</p>
              </div>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32 border-2 border-gray-400 bg-white text-gray-900 font-medium"
                    placeholder="JavaScript, React, Node.js, TypeScript, MongoDB, PostgreSQL, AWS, Docker, Git, REST APIs, Agile, Team Leadership, Problem Solving, Communication"
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-600 font-semibold">{errors.skills.message}</p>
              )}
              <p className="text-xs text-gray-600 font-medium">💡 Tip: Include both technical and soft skills. List the most relevant skills first</p>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-orange-900">💼 Work Experience</h3>
                <p className="text-sm text-orange-800 mt-1 font-medium">List your professional roles, starting with the most recent position</p>
              </div>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-600 font-semibold">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="bg-indigo-100 border-2 border-indigo-400 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-indigo-900">🎓 Education</h3>
                <p className="text-sm text-indigo-800 mt-1 font-medium">Your degrees and certifications, starting with the most recent. Include 10th/12th, Diploma, Bachelor's, Master's, or any other degrees.</p>
              </div>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-600 font-semibold">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-red-900">🚀 Projects</h3>
                <p className="text-sm text-red-800 mt-1 font-medium">Showcase your best projects with descriptions of your contributions and impact</p>
              </div>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-600 font-semibold">
                  {errors.projects.message}
                </p>
              )}
              <p className="text-xs text-gray-600 font-medium">💡 Tip: Include links to your GitHub, live demo, or portfolio for each project</p>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <div className="flex justify-between items-center mb-2">
              <Button
                variant="link"
                type="button"
                className="mb-2"
                onClick={() =>
                  setResumeMode(resumeMode === "preview" ? "edit" : "preview")
                }
              >
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Resume
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4" />
                    Show Preview
                  </>
                )}
              </Button>
              <ResumeDownload content={previewContent} />
            </div>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
