import Link from "next/link";

export default function Home() {
  return (
    <main className="app">
      <div className="container">
        <header className="topbar">
          <div>
            <h1 className="title">Dashboard</h1>
            <p className="subtitle">
              Quick access to your Ring Builder lead pipeline.
            </p>
          </div>

          <Link className="btn" href="/leads">
            View Leads →
          </Link>
        </header>

        <section className="card" style={{ padding: 18 }}>

          <h2 style={{ margin: "14px 0 6px", fontSize: 18, letterSpacing: -0.01 }}>
            Leads workspace
          </h2>
          <p className="subtitle" style={{ marginTop: 0 }}>
            Search, scan, and drill into lead details with a cleaner, modern interface.
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" href="/leads">
              Open Leads
            </Link>
            {/* <a
              className="btn"
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
            >
              Next.js Docs
            </a> */}
          </div>
        </section>
      </div>
    </main>
  );
}
