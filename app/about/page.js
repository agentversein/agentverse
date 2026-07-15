export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "50px auto",
        padding: 30,
        background: "#fff",
        borderRadius: 15,
        boxShadow: "0 10px 30px rgba(0,0,0,.1)",
      }}
    >
      <h1>🚀 About AgentVerse</h1>

      <p>
        AgentVerse is an AI platform that helps users with Chat,
        Image Generation, Resume Building, Coding, SEO,
        Research, Email Writing and Data Analysis.
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h2>👨 Founder</h2>

      <p>
        <strong>Name:</strong> Ashish Kumar Pal
      </p>

      <p>
        <strong>Email:</strong> apal7528035919@gmail.com
      </p>

      <p>
        <strong>Website:</strong> https://agentverse-gold.vercel.app
      </p>

      <p>
        <strong>Version:</strong> 1.0.0
      </p>

      <hr style={{ margin: "20px 0" }} />

      <p style={{ color: "#666" }}>
        © 2026 AgentVerse. All Rights Reserved.
      </p>
    </div>
  );
}