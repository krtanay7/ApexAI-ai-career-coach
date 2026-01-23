// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const isEducation = type === "Education";

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  const getEducationPlaceholder = () => {
    if (!isEducation) return `Description of your ${type.toLowerCase()}`;
    
    const titleValue = watch("title") || "";
    
    // For 10th/12th
    if (titleValue.includes("10th") || titleValue.includes("12th")) {
      return `Example: Percentage/CGPA: 95%, Board: CBSE, Stream: Science, Honors in Mathematics, Merit Certificate, Subject: Computer Science`;
    }
    
    // For Bachelor's
    if (titleValue.includes("Bachelor") || titleValue.includes("B.Tech") || titleValue.includes("B.S") || titleValue.includes("BA") || titleValue.includes("B.Com")) {
      return `Example: GPA: 3.8/4.0, Dean's List (All semesters), Relevant Coursework: Data Structures, Web Development, Machine Learning, Database Design, Capstone: AI Resume Builder, Scholarship: Merit Scholarship`;
    }
    
    // For Master's
    if (titleValue.includes("Master") || titleValue.includes("M.Tech") || titleValue.includes("M.S") || titleValue.includes("MBA")) {
      return `Example: GPA: 4.0/4.0, Specialization: Artificial Intelligence, Relevant Coursework: Deep Learning, NLP, Computer Vision, Thesis: Efficient Neural Networks for Edge Computing, Publications: 2 peer-reviewed papers`;
    }
    
    // For Diploma
    if (titleValue.includes("Diploma")) {
      return `Example: CGPA: 8.5/10, Specialization: Full Stack Web Development, Final Project: E-Commerce Platform, Internship: 6 months at Tech Company, Skills: HTML, CSS, JavaScript, React, Node.js`;
    }
    
    // Default
    return `Example: Include GPA/Percentage, honors, relevant coursework, certifications, thesis/capstone projects, or achievements`;
  };

  const getExperiencePlaceholder = () => {
    const isExperience = type === "Experience";
    if (!isExperience) return getEducationPlaceholder();
    
    return `Example: Led development of microservices architecture serving 10M+ users. Reduced API response time by 40%. Mentored 5 junior developers. Implemented CI/CD pipeline reducing deployment time by 85%.`;
  };

  const getProjectPlaceholder = () => {
    const isProject = type === "Project";
    if (!isProject) return getEducationPlaceholder();
    
    return `Example: Built AI Career Coach platform using Next.js, React, Node.js. Features: AI-powered resume generation (80% time savings), interview prep module (5000+ users). GitHub: https://github.com/... Live: https://example.com`;
  };

  const getTitlePlaceholder = () => {
    if (isEducation) return "e.g., 10th Standard, 12th Grade, Bachelor of Technology (B.Tech), Master of Science (M.S), Diploma in Web Development";
    if (type === "Experience") return "e.g., Senior Software Engineer, Full Stack Developer, Product Manager, Data Scientist";
    if (type === "Project") return "e.g., AI Career Coach Platform, E-Commerce Mobile App, Real-time Chat Application";
    return "Title/Position";
  };

  const getOrganizationPlaceholder = () => {
    if (isEducation) return "e.g., IIT Delhi, CBSE Board, State Board";
    if (type === "Experience") return "e.g., Google, Microsoft, Startup XYZ";
    if (type === "Project") return "e.g., Personal Project, Company Initiative, Open Source";
    return "Organization/Company";
  };

  const getEducationFields = () => {
    const titleValue = watch("title");
    const isHighSchool = titleValue && (titleValue.includes("10th") || titleValue.includes("12th") || titleValue.includes("Secondary") || titleValue.includes("High School"));
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">{isEducation ? "Degree/Certificate" : type} *</label>
            <Input
              placeholder={getTitlePlaceholder()}
              {...register("title")}
              error={errors.title}
              className="border-2 border-gray-400 bg-white text-gray-900 font-medium"
            />
            {isEducation && <p className="text-xs text-gray-600 font-medium">Include degree type (B.Tech, M.Tech, 10th, 12th, etc.)</p>}
            {type === "Experience" && <p className="text-xs text-gray-600 font-medium">Your job title or position</p>}
            {type === "Project" && <p className="text-xs text-gray-600 font-medium">Name of your project or initiative</p>}
            {errors.title && (
              <p className="text-sm text-red-600 font-semibold">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">{isEducation ? "School/University/Board" : type === "Experience" ? "Company/Organization" : "Project Type"} *</label>
            <Input
              placeholder={getOrganizationPlaceholder()}
              {...register("organization")}
              error={errors.organization}
              className="border-2 border-gray-400 bg-white text-gray-900 font-medium"
            />
            {isEducation && <p className="text-xs text-gray-600 font-medium">Your educational institution or board</p>}
            {type === "Experience" && <p className="text-xs text-gray-600 font-medium">Name of your employer or company</p>}
            {type === "Project" && <p className="text-xs text-gray-600 font-medium">Personal, Company, or Open Source project</p>}
            {errors.organization && (
              <p className="text-sm text-red-600 font-semibold">
                {errors.organization.message}
              </p>
            )}
          </div>
        </div>

        {!isHighSchool && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">📅 Start Date *</label>
                <Input
                  type="month"
                  {...register("startDate")}
                  className="border-2 border-gray-500 bg-white text-gray-900 font-medium placeholder:text-gray-700 cursor-pointer"
                  error={errors.startDate}
                  style={{ colorScheme: 'light' }}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 font-semibold">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800">📅 End Date {current ? "(Optional)" : "*"}</label>
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  error={errors.endDate}
                  className="border-2 border-gray-500 bg-white text-gray-900 font-medium placeholder:text-gray-700 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={{ colorScheme: 'light' }}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 font-semibold">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border-2 border-gray-300">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
              <label htmlFor="current" className="text-sm font-bold text-gray-900 cursor-pointer">
                ✓ {isEducation ? "Currently Pursuing" : type === "Experience" ? "Currently Working Here" : "Ongoing Project"}
              </label>
            </div>
          </>
        )}

        {isHighSchool && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">📅 Year of Passing *</label>
            <Input
              type="month"
              {...register("startDate")}
              error={errors.startDate}
              className="border-2 border-gray-500 bg-white text-gray-900 font-medium placeholder:text-gray-700 cursor-pointer"
              placeholder="When did you complete?"
              style={{ colorScheme: 'light' }}
            />
            {errors.startDate && (
              <p className="text-sm text-red-600 font-semibold">
                {errors.startDate.message}
              </p>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index} className={`border-l-4 ${isEducation ? "border-l-indigo-500" : type === "Experience" ? "border-l-orange-500" : "border-l-red-500"}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold">
                  {item.title}
                </CardTitle>
                <p className={`text-xs mt-1 font-medium ${isEducation ? "text-indigo-600" : type === "Experience" ? "text-orange-600" : "text-red-600"}`}>
                  📍 {item.organization}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600 font-medium">
                📅 {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} ${item.endDate ? `- ${item.endDate}` : ""}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap text-gray-700 bg-gray-50 p-2 rounded">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className={`border-2 ${isEducation ? "border-indigo-300 bg-indigo-50" : type === "Experience" ? "border-orange-300 bg-orange-50" : "border-red-300 bg-red-50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ➕ Add {type}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getEducationFields()}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800">Description *</label>
              <Textarea
                placeholder={isEducation ? getEducationPlaceholder() : type === "Experience" ? getExperiencePlaceholder() : getProjectPlaceholder()}
                className="h-32 border-2 border-gray-400 bg-white text-gray-900 font-medium"
                {...register("description")}
                error={errors.description}
              />
              {isEducation && (
                <p className="text-xs text-gray-600 font-medium">
                  💡 <strong>For 10th/12th:</strong> Include percentage/CGPA, board, stream, honors, subjects <br />
                  <strong>For Bachelor's/Master's:</strong> Include GPA, coursework, honors, projects, scholarships <br />
                  <strong>For Diploma:</strong> Include CGPA, specialization, projects, internships
                </p>
              )}
              {type === "Experience" && (
                <p className="text-xs text-gray-600 font-medium">
                  💡 Include: Key achievements, metrics (revenue, users, performance improvements), technologies used, team size managed
                </p>
              )}
              {type === "Project" && (
                <p className="text-xs text-gray-600 font-medium">
                  💡 Include: Project description, your role, technologies used, GitHub/demo links, user count/impact, key features
                </p>
              )}
              {errors.description && (
                <p className="text-sm text-red-600 font-semibold">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !watch("description")}
                className="flex-1 text-purple-600 hover:text-purple-700"
              >
                {isImproving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add {type}
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full border-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 font-bold text-base"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          ➕ Add {type}
        </Button>
      )}
    </div>
  );
}
