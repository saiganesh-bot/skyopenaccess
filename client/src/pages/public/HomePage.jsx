import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../api/http";

const cleanText = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const HomePage = () => {
  const [journals, setJournals] = useState([]);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [journalsRes, logosRes] = await Promise.all([
        http.get("/journals"),
        http.get("/logos")
      ]);
      setJournals(journalsRes.data.journals || []);
      setLogos(logosRes.data.logos || []);
    };

    load().catch(console.error);
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Journal Management System</h1>
        <p>
          Submit research manuscripts online and manage peer-review pipeline with role-based
          administration.
        </p>
      </section>

      <section className="card-section">
        <h2>Available Journals</h2>
        <div className="grid">
          {journals.map((journal) => (
            <Link className="card journal-link-card" key={journal._id} to={`/journals/${journal.slug}`}>
              {journal.cover_image_url ? (
                <img src={journal.cover_image_url} alt={journal.title} className="journal-cover" />
              ) : null}
              <h3>{journal.title}</h3>
              <p>{cleanText(journal.about).slice(0, 150) || "No description yet."}</p>
              <span className="inline-link">View journal content</span>
            </Link>
          ))}
          {!journals.length ? <p>No journals available yet.</p> : null}
        </div>
      </section>

      <section className="card-section">
        <h2>Indexing / Partner Logos</h2>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...logos, ...logos].map((logo, idx) => (
              <img key={`${logo._id}-${idx}`} src={logo.image_url} alt="Indexing logo" className="logo" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
