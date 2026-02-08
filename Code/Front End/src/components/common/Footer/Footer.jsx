export default function Footer() {
  return (
    <footer
      style={{
        background: "#232946",
        color: "#fff",
        textAlign: "center",
        padding: "22px 0 10px 0",
        boxShadow: "0 -2px 16px rgba(35,41,70,0.07)",
        fontSize: 12,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 10px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        <div
          style={{
            background: "#232946",
            borderRadius: 12,
            boxShadow: "0 2px 8px #23294622",
            padding: 16,
            marginBottom: 10,
            border: "1px solid #393e6c",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 6,
              fontSize: 13,
            }}
          >
            كtabook Graduation Project
          </div>
          <div style={{ color: "#eebbc3", marginBottom: 6 }}>
            كtabook is a modern platform for book lovers to exchange, discuss,
            and read books in a vibrant online community.
          </div>
        </div>
        <div
          style={{
            background: "#232946",
            borderRadius: 12,
            boxShadow: "0 2px 8px #23294622",
            padding: 16,
            marginBottom: 10,
            border: "1px solid #393e6c",
          }}
        >
          <div style={{ color: "#b8c1ec", marginBottom: 6 }}>
            <strong>Features:</strong> Book exchange, wishlists, chat, forums,
            activity tracking, admin tools, and an integrated book reader.
          </div>
        </div>
        <div
          style={{
            background: "#232946",
            borderRadius: 12,
            boxShadow: "0 2px 8px #23294622",
            padding: 16,
            marginBottom: 10,
            border: "1px solid #393e6c",
          }}
        >
          <div style={{ color: "#b8c1ec", marginBottom: 6 }}>
            Built by students to connect readers everywhere.
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid #393e6c",
          margin: "16px 0 0 0",
          paddingTop: 6,
          color: "#a1a1aa",
          fontSize: 11,
        }}
      >
        &copy; {new Date().getFullYear()} كtabook Graduation Project. All rights
        reserved.
      </div>
    </footer>
  );
}
