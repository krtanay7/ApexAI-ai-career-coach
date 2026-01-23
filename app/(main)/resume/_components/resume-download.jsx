"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

let html2pdf;
if (typeof window !== "undefined") {
  html2pdf = require("html2pdf.js/dist/html2pdf.min.js");
}

const ResumeDownload = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; color: #333;">
        ${content
          .replace(/^# /gm, "<h1 style=\"font-size: 28px; font-weight: bold; margin: 20px 0;\">")
          .replace(/^## /gm, "<h2 style=\"font-size: 20px; font-weight: bold; margin: 15px 0;\">")
          .replace(/\n/g, "<br/>")}
      </div>
    `;

    const options = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    html2pdf().set(options).from(element).save();
    setIsOpen(false);
  };

  const handleDownloadWord = async () => {
    const lines = markdownToPlainText(content);

    const paragraphs = lines.map((line) => {
      const isHeading = content.includes(`# ${line}`) || content.includes(`## ${line}`);

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
      saveAs(blob, "resume.docx");
      setIsOpen(false);
    });
  };

  return (
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

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ResumeDownload;
