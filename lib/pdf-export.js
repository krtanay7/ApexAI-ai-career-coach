import html2pdf from "html2pdf.js";

export async function generateQuestionBankPDF(questions, company) {
  // Create HTML content for PDF
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #1e40af;
            font-size: 28px;
          }
          .header p {
            margin: 10px 0 0 0;
            color: #666;
            font-size: 14px;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 8px;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .question-block {
            margin: 25px 0;
            padding: 15px;
            border-left: 4px solid #2563eb;
            background-color: #f9fafb;
            page-break-inside: avoid;
          }
          .question-number {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          .question-text {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #111;
          }
          .question-meta {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            flex-wrap: wrap;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
          }
          .badge-easy {
            background-color: #dcfce7;
            color: #166534;
          }
          .badge-medium {
            background-color: #fef3c7;
            color: #92400e;
          }
          .badge-hard {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .badge-category {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .answer-label {
            font-weight: 600;
            color: #059669;
            margin-top: 8px;
            margin-bottom: 4px;
          }
          .answer-text {
            font-size: 13px;
            color: #374151;
            margin-left: 10px;
          }
          .explanation-label {
            font-weight: 600;
            color: #7c3aed;
            margin-top: 8px;
            margin-bottom: 4px;
          }
          .explanation-text {
            font-size: 13px;
            color: #374151;
            margin-left: 10px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 11px;
            color: #999;
          }
          .page-break {
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Interview Question Bank</h1>
          <p>${company} - Most Asked Interview Questions</p>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">${questions.length}</div>
            <div class="stat-label">Total Questions</div>
          </div>
          <div class="stat">
            <div class="stat-value">${questions.filter(q => q.difficulty === "Easy").length}</div>
            <div class="stat-label">Easy Questions</div>
          </div>
          <div class="stat">
            <div class="stat-value">${questions.filter(q => q.difficulty === "Medium").length}</div>
            <div class="stat-label">Medium Questions</div>
          </div>
          <div class="stat">
            <div class="stat-value">${questions.filter(q => q.difficulty === "Hard").length}</div>
            <div class="stat-label">Hard Questions</div>
          </div>
        </div>

        ${questions
          .map(
            (q, idx) => `
          <div class="question-block">
            <div class="question-number">Q${idx + 1}</div>
            <div class="question-text">${q.question}</div>
            <div class="question-meta">
              <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
              <span class="badge badge-category">${q.category}</span>
              ${q.frequency ? `<span class="badge badge-category">${q.frequency}x asked</span>` : ""}
            </div>
            <div class="answer-label">✓ Answer:</div>
            <div class="answer-text">${q.answer}</div>
            ${
              q.explanation
                ? `
              <div class="explanation-label">💡 Explanation:</div>
              <div class="explanation-text">${q.explanation}</div>
            `
                : ""
            }
          </div>
        `
          )
          .join("")}

        <div class="page-break"></div>
        <div class="footer">
          <p>This is a confidential interview preparation document.</p>
          <p>Use this for personal study and interview preparation only.</p>
          <p>© AI Career Coach - Interview Preparation</p>
        </div>
      </body>
    </html>
  `;

  // PDF options
  const options = {
    margin: [10, 10, 10, 10],
    filename: `${company}-Interview-Questions.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  };

  // Generate PDF
  html2pdf().set(options).from(htmlContent).save();
}

export async function generateQuestionBankWord(questions, company) {
  // Create Word document content
  let docContent = `
    <html xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:o="urn:schemas-microsoft-com:office:office"
     xmlns:w="urn:schemas-microsoft-com:office:word"
     xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
     xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${company} Interview Questions</title>
      <style>
        body {
          font-family: 'Calibri', sans-serif;
          line-height: 1.5;
          color: #333;
        }
        h1 { color: #1e40af; font-size: 28pt; text-align: center; }
        h2 { color: #1e40af; font-size: 14pt; margin-top: 20pt; }
        .question { margin: 15pt 0; padding: 10pt 15pt; border-left: 4pt solid #2563eb; background-color: #f9fafb; }
        .question-text { font-weight: bold; margin-bottom: 10pt; }
        .meta { font-size: 10pt; color: #666; margin-bottom: 10pt; }
        .answer { margin-top: 10pt; }
        .answer-label { font-weight: bold; color: #059669; }
        .answer-text { margin-left: 20pt; }
      </style>
    </head>
    <body>
      <h1>${company} Interview Question Bank</h1>
      <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
      <hr>
  `;

  // Group by category
  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([category, categoryQuestions]) => {
    docContent += `<h2>${category}</h2>`;
    categoryQuestions.forEach((q, idx) => {
      docContent += `
        <div class="question">
          <div class="question-text">Q. ${q.question}</div>
          <div class="meta">Difficulty: ${q.difficulty} | Frequency: ${q.frequency}x asked</div>
          <div class="answer">
            <span class="answer-label">Answer:</span>
            <div class="answer-text">${q.answer}</div>
          </div>
          ${q.explanation ? `<div class="answer"><span class="answer-label">Explanation:</span><div class="answer-text">${q.explanation}</div></div>` : ""}
        </div>
      `;
    });
  });

  docContent += `
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([docContent], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${company}-Interview-Questions.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
