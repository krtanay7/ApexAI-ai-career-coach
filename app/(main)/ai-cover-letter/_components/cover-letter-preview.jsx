"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, Edit2, Save, X } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { updateCoverLetter } from "@/actions/cover-letter";
import { toast } from "sonner";

let html2pdf;
if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js/dist/html2pdf.min.js");
}

const CoverLetterPreview = ({ content, coverId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  // Convert markdown text to plain text (remove markdown syntax)
  const markdownToPlainText = (markdown) => {
    return markdown
      .replace(/^# /gm, "")
      .replace(/^## /gm, "")
      .replace(/^### /gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .split("\n")
      .filter((line) => line.trim());
  };

  const handleDownloadPDF = () => {
    const displayContent = isEditing ? editContent : content;
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; color: #333;">
        ${displayContent
          .replace(/^# /gm, "<h1 style=\"font-size: 28px; font-weight: bold; margin: 20px 0;\">")
          .replace(/^## /gm, "<h2 style=\"font-size: 20px; font-weight: bold; margin: 15px 0;\">")
          .replace(/\n/g, "<br/>")}
      </div>
    `;

    const options = {
      margin: 10,
      filename: "cover-letter.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    html2pdf().set(options).from(element).save();
    setIsOpen(false);
  };

  const handleDownloadWord = async () => {
    const displayContent = isEditing ? editContent : content;
    const lines = markdownToPlainText(displayContent);

    const paragraphs = lines.map((line) => {
      const isHeading = displayContent.includes(`# ${line}`) || displayContent.includes(`## ${line}`);

      return new Paragraph({
        text: line,
        run: {
          bold: isHeading,
          size: isHeading ? 28 : 22,
        },
        spacing: {
          line: 360,
          lineRule: "auto",
        },
      });
    });

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
          margins: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "cover-letter.docx");
      setIsOpen(false);
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCoverLetter(coverId, editContent);
      toast.success("Cover letter updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save cover letter");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const displayContent = isEditing ? editContent : content;

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-between items-center gap-2">
        <div className="flex gap-2">
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2"
              variant="outline"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>

        <div className="relative">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="gap-2 flex items-center"
          >
            <Download className="h-4 w-4" />
            Download
            <ChevronDown className="h-4 w-4" />
          </Button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-white to-gray-50 border-2 border-blue-300 rounded-xl shadow-2xl z-10 overflow-hidden">
              <button
                onClick={handleDownloadPDF}
                className="w-full text-left px-4 py-3 hover:bg-blue-100 border-b-2 border-blue-200 flex items-center gap-3 transition-colors duration-200 group"
              >
                <Download className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Download as PDF</span>
                  <span className="text-xs text-gray-500">Professional format</span>
                </div>
              </button>
              <button
                onClick={handleDownloadWord}
                className="w-full text-left px-4 py-3 hover:bg-green-100 flex items-center gap-3 transition-colors duration-200 group"
              >
                <Download className="h-5 w-5 text-green-600 group-hover:text-green-700" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Download as Word</span>
                  <span className="text-xs text-gray-500">Editable format (.docx)</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isEditing ? (
        <div data-color-mode="light">
          <MDEditor
            value={editContent}
            onChange={(val) => setEditContent(val || "")}
            preview="edit"
            height={700}
            visibleDragbar={false}
          />
        </div>
      ) : (
        <div data-color-mode="light">
          <MDEditor value={displayContent} preview="preview" height={700} />
        </div>
      )}
    </div>
  );
};

export default CoverLetterPreview;
