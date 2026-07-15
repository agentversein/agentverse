"use client";
import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";
import ReactMarkdown from "react-markdown";
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function ChatWindow({
  selectedAgent,
  chatList,
  setChatList,
  currentChatId,
  setCurrentChatId,
  messages,
  setMessages,
  createNewChat,
}) {
  const [message, setMessage] = useState("");
  const [imageHistory, setImageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();

  window.addEventListener("resize", checkMobile);

  return () =>
    window.removeEventListener("resize", checkMobile);
}, []);
  
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [resumeTemplate, setResumeTemplate] = useState("modern");
  const [structuredResume, setStructuredResume] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [search, setSearch] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [workbook, setWorkbook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const rowsPerPage = 10;
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      const formData = new FormData();
      formData.append("image", base64);
      if (!file.type.startsWith("image/")) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/analyze-file", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.analysis) {
         if ((data.type || "text") === "image") {
  setImageHistory((prev) => [
    data.output,
    ...prev,
  ]);
}

          setLoading(false);
          setMessage("");
          return;
        }
        setDocumentText(data.content);
        setDocumentName(file.name);
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            type: "text",
            content: `✅ ${file.name} uploaded successfully.\n\nNow you can ask anything about this document.`,
          },
        ]);
        setMessages((prev) => [
          ...prev,
          {
            sender: "user",
            type: "text",
            content: `📄 ${file.name}`,
          },
          {
            sender: "ai",
            type: "text",
            content: data.analysis,
          },
        ]);

        return;
      }

      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: "📸 Image uploaded" },
        { role: "assistant", content: data.reply },
      ]);
    };

    reader.readAsDataURL(file);
  };
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser support nahi karta 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setMessage(text); // ⚠️ yaha message use hoga
    };
  };
  // Load chats

  // Save chats

  // Sync current chat
  useEffect(() => {
    if (!currentChatId) return;
    setChatList((prev) =>
      prev.map((chat) =>
        chat._id === currentChatId
          ? {
            ...chat,
            messages,
          }
          : chat
      )
    );
  }, [messages]);
  const downloadResumePDF = () => {
    if (!structuredResume) {
      alert("Generate resume first.");
      return;
    }

    const data = structuredResume;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ===== Background =====
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, "F");

    // ===== Left Sidebar =====
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 60, 297, "F");

    // ===== Profile Image =====
    if (profileImage) {
      doc.addImage(profileImage, "JPEG", 12, 15, 36, 36);
    }

    // ===== Name =====
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(data.name || "", 8, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(data.title || "", 8, 68);

    // ===== Contact =====
    let leftY = 85;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("CONTACT", 8, leftY);

    leftY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    if (data.email) {
      const email = doc.splitTextToSize(data.email, 45);
      doc.text(email, 8, leftY);
      leftY += email.length * 5 + 4;
    }

    if (data.phone) {
      doc.text(data.phone, 8, leftY);
      leftY += 8;
    }

    if (data.location) {
      const location = doc.splitTextToSize(data.location, 45);
      doc.text(location, 8, leftY);
      leftY += location.length * 5 + 8;
    }

    // ===== Skills =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("SKILLS", 8, leftY);

    leftY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    (data.skills || []).forEach((skill) => {
      const skillText = doc.splitTextToSize("• " + skill, 45);
      doc.text(skillText, 8, leftY);
      leftY += skillText.length * 5 + 2;
    });

    // ===== Right Column =====
    let rightY = 20;

    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Professional Summary", 70, rightY);

    rightY += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const summary = doc.splitTextToSize(
      data.summary || "",
      120
    );

    doc.text(summary, 70, rightY);

    rightY += summary.length * 6 + 12;
    // ===== Experience =====

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Experience", 70, rightY);

    rightY += 10;

    (data.experience || []).forEach((exp) => {

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(exp.role || "", 70, rightY);

      rightY += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `${exp.company || ""} | ${exp.duration || ""}`,
        70,
        rightY
      );

      rightY += 6;

      const desc = doc.splitTextToSize(
        exp.description || "",
        125
      );

      doc.text(desc, 70, rightY);

      rightY += desc.length * 5 + 8;

    });

    // ===== Education =====

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    doc.text("Education", 70, rightY);

    rightY += 10;

    (data.education || []).forEach((edu) => {

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(
        edu.degree || "",
        70,
        rightY
      );

      rightY += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `${edu.college || ""} (${edu.year || ""})`,
        70,
        rightY
      );

      rightY += 10;

    });
    // ===== Projects =====

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Projects", 70, rightY);

    rightY += 10;

    (data.projects || []).forEach((project) => {

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);

      doc.text(project.name || "", 70, rightY);

      rightY += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const projectLines = doc.splitTextToSize(
        project.description || "",
        125
      );

      doc.text(projectLines, 70, rightY);

      rightY += projectLines.length * 5 + 8;

    });

    // ===== Certifications =====

    if (data.certifications?.length) {

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Certifications", 70, rightY);

      rightY += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      data.certifications.forEach((item) => {

        doc.text("• " + item, 70, rightY);

        rightY += 6;

      });

      rightY += 6;
    }

    // ===== Languages =====

    if (data.languages?.length) {

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Languages", 70, rightY);

      rightY += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        data.languages.join(" • "),
        70,
        rightY
      );

      rightY += 10;
    }

    // ===== Footer =====

    doc.setDrawColor(200);

    doc.line(10, 287, 200, 287);

    doc.setFontSize(9);

    doc.setTextColor(120);

    doc.text(
      "Generated by AgentVerse AI Resume Builder",
      10,
      293
    );

    doc.save("Professional_Resume.pdf");

    return;
  }
    const downloadAnalyticsPDF = () => {
      if (!analysis) {
        alert("Please upload a dataset first.");
        return;
      }

      const doc = new jsPDF("p", "mm", "a4");

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("AgentVerse AI Analytics Report", 14, 18);

      doc.setTextColor(0);

      autoTable(doc, {
        startY: 36,
        head: [["Dataset Summary", "Value"]],
        body: [
          ["Rows", analysis.rows],
          ["Columns", analysis.columns],
          ["Generated", new Date().toLocaleString()],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235],
        },
      });

      let y = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(15);
      doc.text("Column Names", 14, y);

      y += 8;

      const columnText = doc.splitTextToSize(
        analysis.columnNames.join(", "),
        180
      );

      doc.text(columnText, 14, y);

      y += columnText.length * 6 + 10;

      if (analysis.statistics) {
        autoTable(doc, {
          startY: y,
          head: [["Column", "Average", "Minimum", "Maximum"]],
          body: Object.entries(analysis.statistics).map(
            ([col, stat]) => [
              col,
              stat.avg,
              stat.min,
              stat.max,
            ]
          ),
          theme: "grid",
          headStyles: {
            fillColor: [16, 185, 129],
          },
        });

        y = doc.lastAutoTable.finalY + 10;
      }

      if (aiSummary) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("AI Insights", 14, y);

        y += 8;

        doc.setFont("helvetica", "normal");

        const aiLines = doc.splitTextToSize(aiSummary, 180);

        doc.text(aiLines, 14, y);
      }

      const pages = doc.getNumberOfPages();

      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);

        doc.setFontSize(10);
        doc.setTextColor(120);

        doc.text(
          `Generated by AgentVerse AI • Page ${i}/${pages}`,
          14,
          290
        );
      }

      doc.save("AgentVerse_AI_Analytics_Report.pdf");
    };
    const handleDatasetUpload = (e) => {
      const file = e.target.files[0];

      if (!file) return;

      if (file.name.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            analyzeDataset(results.data);
          },
        });
      } else {
        const reader = new FileReader();

        reader.onload = (evt) => {
          const wb = XLSX.read(evt.target.result, {
            type: "array",
          });

          setWorkbook(wb);

          const names = wb.SheetNames;

          setSheetNames(names);

          setSelectedSheet(names[0]);

          const sheet = wb.Sheets[names[0]];

          const json = XLSX.utils.sheet_to_json(sheet);

          analyzeDataset(json);
        };

        reader.readAsArrayBuffer(file);
      }
    };

    const analyzeDataset = (data) => {
      if (!data.length) return;

      setDataset(data);

      const columns = Object.keys(data[0]);
      const numericColumns = columns.filter((col) =>
        data.every((row) => !isNaN(parseFloat(row[col])))
      );

      const statistics = {};

      numericColumns.forEach((col) => {
        const values = data
          .map((row) => parseFloat(row[col]))
          .filter((v) => !isNaN(v));

        const avg =
          values.reduce((a, b) => a + b, 0) / values.length;

        statistics[col] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: avg.toFixed(2),
        };
      });
      setAnalysis({
        rows: data.length,
        columns: columns.length,
        columnNames: columns,
        statistics,
      });
      fetch("/api/run-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId: "data-agent",
          prompt:
            "Analyze this dataset and give a short business summary:\n\n" +
            JSON.stringify(data.slice(0, 20)),
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setAiSummary(result.output);
        });
    };
    const send = async () => {
      // ===== FREE LIMIT CHECK =====

const chatCount =
  Number(localStorage.getItem("chatCount") || "0");

const agentUsage = JSON.parse(
  localStorage.getItem("agentUsage") || "{}"
);

// AI Chat → 15 free
if (selectedAgent?.id === "chat-agent") {
  if (chatCount >= 15) {
    alert(
      "🎉 Your 15 free AI chats are over.\n\nPlease upgrade to Pro."
    );
    return;
  }

  localStorage.setItem(
    "chatCount",
    String(chatCount + 1)
  );
}

// Other Agents → 1 free
if (selectedAgent?.id !== "chat-agent") {
  if (agentUsage[selectedAgent.id]) {
    alert(
      `${selectedAgent.name} free trial finished.\n\nPlease upgrade to Pro.`
    );
    return;
  }

  agentUsage[selectedAgent.id] = true;

  localStorage.setItem(
    "agentUsage",
    JSON.stringify(agentUsage)
  );
}
      if (!message.trim() || !selectedAgent) return;
      if (!currentChatId) {
        createNewChat();
        return;
      }
      const userMessage = {
        sender: "user",
        type: "text",
        content: message,
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setLoading(true);
      try {
        const res = await fetch("/api/run-agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: selectedAgent.id,
            prompt: message,
            chatId: currentChatId,
            documentText,
            documentName,
            history: messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content:
                typeof m.content === "string"
                  ? m.content
                  : JSON.stringify(m.content),
            })),
          }),
        });
        const data = await res.json();

        if (
          selectedAgent?.id === "resume-agent" &&
          data.type === "text"
        ) {
          try {
            const json = JSON.parse(data.output);

            setStructuredResume(json);

            const aiMessage = {
              sender: "ai",
              type: "resume",
              content: json,
            };

            setMessages((prev) => [...prev, aiMessage]);

          } catch (e) {

            setMessages((prev) => [
              ...prev,
              {
                sender: "ai",
                type: "text",
                content: data.output,
              },
            ]);

          }

        } else {

          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              type: data.type || "text",
              content: data.output,
            },
          ]);

        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
      setMessage("");
    };
    const filteredDataset = dataset.filter((row) =>
      JSON.stringify(row)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredDataset.length / rowsPerPage);

    const paginatedData = filteredDataset.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
    return (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(180deg,#f8fbff 0%,#eef4ff 100%)",
      overflow: "hidden",
    }}
  >
       {/* Premium Header */}
<div
  style={{
    height: 72,
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,.88)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid #edf2f7",
    position: "sticky",
    top: 0,
    zIndex: 100,
  }}
>
  <div>
    <h2
      style={{
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        color: "#111827",
      }}
    >
      {selectedAgent
        ? `${selectedAgent.icon} ${selectedAgent.name}`
        : "AgentVerse AI"}
    </h2>

    <p
      style={{
        margin: "4px 0 0",
        color: "#6b7280",
        fontSize: 14,
      }}
    >
      Your intelligent AI workspace
    </p>
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "#22c55e",
      }}
    />

    <span
      style={{
        color: "#6b7280",
        fontSize: 14,
      }}
    >
      AI Ready
    </span>
  </div>

        </div>
        {/* Messages */}
        <div
          style={{
  flex: 1,
  overflowY: "auto",
  padding: isMobile ? 20 : 40,
  maxWidth: 950,
  width: "100%",
  margin: "0 auto",
  scrollBehavior: "smooth",
}}
        >
    

          {messages.length === 0 && (
  <div
    style={{
      textAlign: "center",
      marginTop: 100,
    }}
  >
    <div style={{ fontSize: 70 }}>🚀</div>

    <h1
      style={{
        fontSize: 36,
        marginTop: 20,
        color: "#111827",
      }}
    >
      Welcome to AgentVerse AI
    </h1>

    <p
      style={{
        color: "#6b7280",
        fontSize: 18,
        marginTop: 10,
      }}
    >
      Ask anything. Generate images. Write code.
      Analyze data. Build resumes.
    </p>
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 18,
    maxWidth: 900,
    margin: "50px auto",
  }}
>

<div style={{
padding:25,
background:"#fff",
borderRadius:20,
boxShadow:"0 15px 35px rgba(37,99,235,.08)",
cursor: "pointer",
transition: "all .25s ease",
}}>
<h3>💬 AI Chat</h3>
<p>Ask anything instantly.</p>
</div>

<div style={{
padding:25,
background:"#fff",
borderRadius:20,
boxShadow:"0 15px 35px rgba(37,99,235,.08)",
cursor: "pointer",
transition: "all .25s ease",
}}>
<h3>🎨 Images</h3>
<p>Create AI Images.</p>
</div>

<div style={{
padding:25,
background:"#fff",
borderRadius:20,
boxShadow:"0 15px 35px rgba(37,99,235,.08)",
cursor: "pointer",
transition: "all .25s ease",
}}>
<h3>📄 Resume</h3>
<p>Generate ATS Resume.</p>
</div>

<div style={{
padding:25,
background:"#fff",
borderRadius:20,
boxShadow:"0 15px 35px rgba(37,99,235,.08)",
cursor: "pointer",
transition: "all .25s ease",
}}>
<h3>📊 Analytics</h3>
<p>Analyze Excel & CSV.</p>
</div>

</div>
  </div>
)}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: 28,
              }}
            >
              {msg.sender !== "user" && (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "#2563eb",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      fontSize: 20,
    }}
  >
    🤖
  </div>
)}
              <div
               style={{
  width: "100%",
  maxWidth: "850px",
  margin: "0 auto",

  borderRadius:
    msg.sender === "user"
      ? "24px 24px 6px 24px"
      : "24px 24px 24px 6px",

  background:
    msg.sender === "user"
      ? "linear-gradient(135deg,#2563eb,#4f46e5)"
      : "#ffffff",

  color:
    msg.sender === "user"
      ? "#ffffff"
      : "#111827",

  border:
    msg.sender === "user"
      ? "none"
      : "1px solid #e5e7eb",

  boxShadow: "0 12px 30px rgba(0,0,0,.08)",

  overflowWrap: "break-word",
  wordBreak: "break-word",
}}
              >
               {msg.type === "image" ? (

<div
  style={{
    background:"#fff",
    borderRadius:18,
    padding:18,
    maxWidth:520,
    boxShadow:"0 10px 30px rgba(0,0,0,.08)"
  }}
>

<img
src={msg.content}
alt="Generated"
style={{
width:"100%",
maxWidth: isMobile ? "100%" : 600,
borderRadius:20,
display:"block"
}}
/><div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 15,
    flexWrap: "wrap",
  }}
>
  <button
    onClick={() => navigator.clipboard.writeText(msg.content)}
    style={{
      padding: "10px 18px",
      borderRadius: 10,
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    📋 Copy URL
  </button>

  <a
    href={msg.content}
    download
    target="_blank"
    rel="noreferrer"
    style={{
      padding: "10px 18px",
      borderRadius: 10,
      background: "#16a34a",
      color: "#fff",
      textDecoration: "none",
    }}
  >
    ⬇️ Download
  </a>
</div>

<div
style={{
display:"flex",
justifyContent:"space-between",
marginTop:15,
gap:10,
flexWrap:"wrap"
}}
>

<button
onClick={()=>{
navigator.clipboard.writeText(message)
}}
style={{
padding:"10px 18px",
border:"none",
borderRadius:10,
background:"#2563eb",
color:"#fff",
cursor:"pointer"
}}
>
📋 Copy Prompt
</button>

<button
onClick={()=>{
window.open(msg.content)
}}
style={{
padding:"10px 18px",
border:"none",
borderRadius:10,
background:"#16a34a",
color:"#fff",
cursor:"pointer"
}}
>
⬇️ Download
</button>

<button
onClick={send}
style={{
padding:"10px 18px",
border:"none",
borderRadius:10,
background:"#7c3aed",
color:"#fff",
cursor:"pointer"
}}
>
✨ Regenerate
</button>

</div>

</div>

) :
               msg.type === "resume" ? (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "900px",
                      margin: "20px auto",
                      background: "#fff",
                      padding: 30,
                      borderRadius: 16,
                      color: "#000",
                      boxShadow: "0 2px 12px rgba(0,0,0,.12)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "#2563eb",
                        color: "white",
                        padding: 25,
                        borderRadius: 12,
                        marginBottom: 20,
                      }}
                    >
                      <h1 style={{ margin: 0, fontSize: 30 }}>
                        {msg.content.name}
                      </h1>

                      <h3 style={{ marginTop: 8 }}>
                        {msg.content.title}
                      </h3>

                      <div style={{ marginTop: 15, fontSize: 14 }}>

                        {msg.content.email && (
                          <div>📧 {msg.content.email}</div>
                        )}

                        {msg.content.phone && (
                          <div>📞 {msg.content.phone}</div>
                        )}

                        {msg.content.location && (
                          <div>📍 {msg.content.location}</div>
                        )}

                        {msg.content.linkedin && (
                          <div>🔗 {msg.content.linkedin}</div>
                        )}

                        {msg.content.github && (
                          <div>💻 {msg.content.github}</div>
                        )}

                      </div>
                    </div>

                    <h3>Professional Summary</h3>
                    <p>{msg.content.summary}</p>

                    <h3 style={{ marginTop: 25 }}>Skills</h3>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        marginBottom: 20,
                      }}
                    >
                      {msg.content.skills?.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#2563eb",
                            color: "#fff",
                            padding: "6px 14px",
                            borderRadius: 20,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <h3>Experience</h3>

                    {msg.content.experience?.map((exp, i) => (
                      <div
                        key={i}
                        style={{
                          borderLeft: "4px solid #2563eb",
                          paddingLeft: 15,
                          marginBottom: 20,
                        }}
                      >
                        <h4 style={{ margin: 0 }}>{exp.role}</h4>

                        <strong>{exp.company}</strong>

                        <div style={{ color: "#666", margin: "5px 0" }}>
                          {exp.duration}
                        </div>

                        <p>{exp.description}</p>
                      </div>
                    ))}

                    <h3>Education</h3>

                    {msg.content.education?.map((edu, i) => (
                      <div key={i} style={{ marginBottom: 15 }}>
                        <strong>{edu.degree}</strong>

                        <div>{edu.college}</div>

                        <small>{edu.year}</small>
                      </div>
                    ))}
                    <h3>Projects</h3>

                    {msg.content.projects?.map((project, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#f8fafc",
                          padding: 15,
                          borderRadius: 10,
                          marginBottom: 15,
                        }}
                      >
                        <strong>{project.name}</strong>

                        <p>{project.description}</p>

                        {project.technologies?.length > 0 && (
                          <small>
                            <b>Tech:</b> {project.technologies.join(", ")}
                          </small>
                        )}
                      </div>
                    ))}
                    <h3>Certifications</h3>

                    <ul>
                      {msg.content.certifications?.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <h3>Languages</h3>

                    <ul>
                      {msg.content.languages?.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                    <h3>Achievements</h3>

                    <ul>
                      {msg.content.achievements?.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                ) : (
                  <div
                    style={{
                      background: "#ffffff",
                      padding: 20,
                      borderRadius: 12,
                      color: "#111827",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <ReactMarkdown>
                      {String(msg.content)}
                    </ReactMarkdown>
                  </div>
                )}
                {msg.sender !== "user" && (
  <button
    onClick={() => navigator.clipboard.writeText(String(msg.content))}
    style={{
      marginTop: 10,
      padding: "8px 14px",
      border: "none",
      borderRadius: 10,
      background: "#f3f4f6",
      cursor: "pointer",
    }}
  >
    📋 Copy
  </button>
)}
<button
  onClick={send}
  style={{
    marginLeft: 10,
    padding: "8px 14px",
    border: "none",
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  }}
>
  🔄 Regenerate
</button>
              </div>
              {msg.sender === "user" && (
  <div
    style={{
      width: 42,
      height: 42,
      borderRadius: "50%",
      background: "#111827",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      marginLeft: 12,
      flexShrink: 0,
    }}
  >
    👤
  </div>
)}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
          {analysis && (
            <div
              style={{
  width: "100%",
  maxWidth: "100%",
  background: "#ffffff",
  padding: 20,
  borderRadius: 12,
  color: "#111827",
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  border: "1px solid #e5e7eb",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  boxSizing: "border-box",
}}
            >
              <h3>📊 Dataset Summary</h3>

              <p><strong>Rows:</strong> {analysis.rows}</p>

              <p><strong>Columns:</strong> {analysis.columns}</p>

              <p>
                <strong>Column Names:</strong>{" "}
                {analysis.columnNames.join(", ")}
              </p>
            </div>
          )}
          <p
            style={{
              fontWeight: "bold",
              marginBottom: 20,
              color: "#555",
            }}
          >
            Showing {filteredDataset.length} of {dataset.length} records
          </p>
          {analysis && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h2>{analysis.rows}</h2>
                <p>Total Rows</p>
              </div>

              <div
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h2>{analysis.columns}</h2>
                <p>Total Columns</p>
              </div>
              <div
                style={{
                  background: "#f59e0b",
                  color: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h2>{Object.keys(analysis.numericStats || {}).length}</h2>
                <p>Numeric Columns</p>
              </div>

              <div
                style={{
                  background: "#7c3aed",
                  color: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h2>{selectedSheet || "Sheet1"}</h2>
                <p>Active Sheet</p>
              </div>
              <div
                style={{
                  background: "#ea580c",
                  color: "#fff",
                  padding: 20,
                  borderRadius: 12,
                }}
              >
                <h2>{dataset.length}</h2>
                <p>Records Loaded</p>
              </div>
            </div>
          )}
          {analysis?.statistics && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <h3>📈 Numeric Statistics</h3>

              {Object.entries(analysis.statistics).map(([column, stat]) => (
                <div
                  key={column}
                  style={{
                    marginBottom: 15,
                    paddingBottom: 10,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <strong>{column}</strong>

                  <p>Average: {stat.avg}</p>
                  <p>Minimum: {stat.min}</p>
                  <p>Maximum: {stat.max}</p>
                </div>
              ))}
            </div>
          )}
          {aiSummary && (
            <div
              style={{
                background: "#ffffff",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              }}
            >
              <h3>🤖 AI Dataset Insights</h3>

              <p style={{ whiteSpace: "pre-wrap" }}>
                {aiSummary}
              </p>
            </div>
          )}
          {dataset.length > 0 && (

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                width: "100%",
                height: "350px",

              }}
            >

              <Bar
                data={{
                  labels: analysis.columnNames,
                  datasets: [
                    {
                      label: "Columns",
                      data: analysis.columnNames.map(() => dataset.length),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}
          {dataset.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                width: "100%",
                height: "350px",

              }}
            >
              <h3>🥧 Pie Chart</h3>

              <Pie
                data={{
                  labels: analysis.columnNames,
                  datasets: [
                    {
                      data: analysis.columnNames.map(() => dataset.length),
                    },
                  ],
                }}
              />
            </div>
          )}
          {dataset.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                width: "100%",
                height: "350px",

              }}
            >
              <h3>📈 Line Chart</h3>

              <Line
                data={{
                  labels: analysis.columnNames,
                  datasets: [
                    {
                      label: "Dataset",
                      data: analysis.columnNames.map(() => dataset.length),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          )}
          {dataset.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                overflowX: "auto",

              }}
            >
              <h3>📋 Dataset Preview</h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    {analysis.columnNames.map((col) => (
                      <th
                        key={col}
                        style={{
                          border: "1px solid #ddd",
                          padding: 10,
                          background: "#2563eb",
                          color: "#fff",
                          textAlign: "left",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr key={index}>
                      {analysis.columnNames.map((col) => (
                        <td
                          key={col}
                          style={{
                            border: "1px solid #ddd",
                            padding: 8,
                          }}
                        >
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ⬅️ Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next ➡️
                </button>
              </div>
            </div>
          )}
         {loading && selectedAgent?.id === "image-agent" && (
  <div
    style={{
      background: "#fff",
      borderRadius: 18,
      padding: 25,
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      marginTop: 20,
    }}
  >
    <div style={{ fontSize: 55 }}>🎨</div>

    <h3>Generating your image...</h3>

    <p style={{ color: "#666" }}>
      AI is creating a high-quality image.
    </p>

    <div
      style={{
        width: "100%",
        height: 8,
        background: "#e5e7eb",
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 20,
      }}
    >
      <div
        style={{
          width: "70%",
          height: "100%",
          background: "#2563eb",
          animation: "pulse 1s infinite",
        }}
      />
    </div>
  </div>
)}

{loading && selectedAgent?.id !== "image-agent" && (
  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#6b7280",
    fontSize: 14,
  }}
>
  <span
    style={{
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "#2563eb",
      display: "inline-block",
    }}
  />
  <span>AgentVerse AI is thinking...</span>
</div>
)}
        </div>
        {/* Input */}
       <div
  style={{
    position: "sticky",
    bottom: 0,
    width: "100%",
    background: "transparent",
    padding: "18px 24px",
    borderTop: "1px solid #e5e7eb",
    boxShadow: "0 -10px 30px rgba(0,0,0,.08)",
    zIndex: 100,
  }}
>
  <div
style={{
  maxWidth: 900,
  margin: "0 auto 25px",
  display: "flex",
  alignItems: "center",
  gap: 15,

  background: "#ffffff",

  padding: 15,

  borderRadius: 30,

  border: "1px solid #e5e7eb",

  boxShadow: "0 20px 50px rgba(37,99,235,.15)",
}}
>

  
          <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      send();
    }
  }}
  placeholder="💬 Ask AgentVerse anything..."
  className="flex-1 h-12 w-full rounded-lg border border-gray-300 px-4 text-base"
  style={{
    flex: 1,
    height: 60,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 17,
    paddingLeft: 10,
  }}
/>

<input
  id="imageUpload"
  type="file"
  accept="image/*"
  onChange={handleImage}
  style={{ display: "none" }}
/>

{selectedAgent?.id === "data-agent" && (
  <input
  id="datasetUpload"
  type="file"
  accept=".csv,.xlsx,.xls"
  onChange={handleDatasetUpload}
  style={{ display: "none" }}
/>
)}
<button
  onClick={() => {
    if (selectedAgent?.id === "data-agent") {
      document.getElementById("datasetUpload")?.click();
    } else if (selectedAgent?.id === "resume-agent") {
      document.getElementById("resumePhoto")?.click();
    } else {
      document.getElementById("imageUpload")?.click();
    }
  }}
  style={{
    width: 52,
    height: 52,
    borderRadius: "50%",
    border: "none",
    background: "#f3f4f6",
    cursor: "pointer",
    fontSize: 22,
  }}
>
  📎
</button>
<button
  onClick={startListening}
  style={{
    width: 52,
    height: 52,
    borderRadius: "50%",
    border: "none",
    background: "#f3f4f6",
    cursor: "pointer",
    fontSize: 20,
  }}

>
  🎤
</button>

<button
  onClick={send}
  disabled={loading}
  style={{
    width: 58,
    height: 58,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    fontSize: 22,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37,99,235,.35)",
  }}
>
  {loading ? "⏳" : "🚀"}
</button>

{selectedAgent?.id === "resume-agent" && (
  <>
    <input
  id="resumePhoto"
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  }}
  style={{ display: "none" }}
/>

    <div>
      {profileImage && (
        <img
          src={profileImage}
          alt="Profile"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #2563eb",
            marginBottom: 15,
          }}
        />
      )}

      <h3 style={{ marginBottom: 12 }}>
        🤖 AI Resume Suggestions
      </h3>

      <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
        <li>✅ Add measurable achievements.</li>
        <li>✅ Include LinkedIn profile.</li>
        <li>✅ Add GitHub or Portfolio.</li>
        <li>✅ Use strong action verbs.</li>
        <li>✅ Tailor skills for the target job.</li>
        <li>✅ Keep resume to one page.</li>
      </ul>
    </div>
  </>
)}

{selectedAgent?.id === "data-agent" && (
  <button
    onClick={downloadAnalyticsPDF}
    style={{
      padding: "12px 22px",
      border: "none",
      borderRadius: 10,
      background: "#7c3aed",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    📊 Download Analytics PDF
  </button>
)}
        </div>
      </div>
      </div>
    );
  }