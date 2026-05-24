import { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { http } from "../../api/http";

const cleanText = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    http
      .get("/journals")
      .then((res) => setJournals(res.data.journals || []))
      .catch(() => setJournals([]));
  }, []);

  const filteredJournals = useMemo(() => {
    if (!query) return journals;
    return journals.filter((journal) => {
      const title = journal.title || "";
      const about = journal.about || "";
      return `${title} ${about}`.toLowerCase().includes(query);
    });
  }, [journals, query]);

  return (
    <main>
      <section className="journals fade-up">
        <div className="container">
          <h2 className="section-title">Journals</h2>
          {query ? <p className="search-meta">Results for "{query}"</p> : null}

          {filteredJournals.map((journal) => (
            <div className="journal-item" key={journal._id}>
              <div className="journal-image">
                {journal.cover_image_url ? (
                  <img src={journal.cover_image_url} alt={journal.title} />
                ) : (
                  <img src="/images/journal1.svg" alt={journal.title} />
                )}
              </div>

              <div className="journal-content">
                <h3>{journal.title}</h3>
                <p>{cleanText(journal.about) || "No description provided yet."}</p>

                <div className="journal-buttons">
                  <NavLink to={`/journals/${journal.slug}`} className="btn">
                    View Journal
                  </NavLink>
                  <NavLink to={`/journals/${journal.slug}#current`} className="btn">
                    Current Issue
                  </NavLink>
                </div>
              </div>
            </div>
          ))}

          {!filteredJournals.length ? <p>No journals available yet.</p> : null}
        </div>
      </section>
    </main>
  );
};
