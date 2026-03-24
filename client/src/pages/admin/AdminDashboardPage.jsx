import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../api/http";

const initialJournal = {
  title: "",
  about: "",
  aim_scope: "",
  author_guidelines: "",
  cover: null
};

export const AdminDashboardPage = () => {
  const [journals, setJournals] = useState([]);
  const [logos, setLogos] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [journalForm, setJournalForm] = useState(initialJournal);
  const [logoFile, setLogoFile] = useState(null);

  const loadData = async () => {
    const [j, l, s] = await Promise.all([
      http.get("/journals"),
      http.get("/logos"),
      http.get("/submissions")
    ]);
    setJournals(j.data.journals || []);
    setLogos(l.data.logos || []);
    setSubmissions(s.data.submissions || []);
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  const createJournal = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", journalForm.title);
    data.append("about", journalForm.about);
    data.append("aim_scope", journalForm.aim_scope);
    data.append("author_guidelines", journalForm.author_guidelines);
    if (journalForm.cover) data.append("cover", journalForm.cover);

    await http.post("/journals", data);
    setJournalForm(initialJournal);
    await loadData();
  };

  const deleteJournal = async (id) => {
    await http.delete(`/journals/${id}`);
    await loadData();
  };

  const uploadLogo = async (e) => {
    e.preventDefault();
    if (!logoFile) return;
    const data = new FormData();
    data.append("logo", logoFile);
    await http.post("/logos", data);
    setLogoFile(null);
    await loadData();
  };

  const deleteLogo = async (id) => {
    await http.delete(`/logos/${id}`);
    await loadData();
  };

  const setSubmissionStatus = async (id, status) => {
    await http.patch(`/submissions/${id}/status`, { status });
    await loadData();
  };

  const deleteSubmission = async (id) => {
    await http.delete(`/submissions/${id}`);
    await loadData();
  };

  return (
    <main className="container admin-grid">
      <section className="form-card full-width">
        <h2>Advanced Content Management</h2>
        <p>Manage articles, board members, current issue, archives, videos, PPT, testimonials, and indexing logos.</p>
        <Link to="/admin/content" className="primary-btn" style={{ textDecoration: "none", display: "inline-block" }}>
          Open Content Studio
        </Link>
      </section>

      <section className="form-card">
        <h2>Create Journal</h2>
        <form onSubmit={createJournal} className="form-grid">
          <label>
            Title
            <input
              value={journalForm.title}
              onChange={(e) => setJournalForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </label>
          <label>
            About
            <textarea
              value={journalForm.about}
              onChange={(e) => setJournalForm((p) => ({ ...p, about: e.target.value }))}
            />
          </label>
          <label>
            Aim and Scope
            <textarea
              value={journalForm.aim_scope}
              onChange={(e) => setJournalForm((p) => ({ ...p, aim_scope: e.target.value }))}
            />
          </label>
          <label>
            Author Guidelines
            <textarea
              value={journalForm.author_guidelines}
              onChange={(e) =>
                setJournalForm((p) => ({ ...p, author_guidelines: e.target.value }))
              }
            />
          </label>
          <label>
            Cover
            <input type="file" accept="image/*" onChange={(e) => setJournalForm((p) => ({ ...p, cover: e.target.files?.[0] || null }))} />
          </label>
          <button className="primary-btn" type="submit">
            Add Journal
          </button>
        </form>
      </section>

      <section className="form-card">
        <h2>Manage Journals</h2>
        {journals.map((journal) => (
          <div key={journal._id} className="item-row">
            <span>{journal.title}</span>
            <button onClick={() => deleteJournal(journal._id)} className="danger-btn" type="button">
              Delete
            </button>
          </div>
        ))}
      </section>

      <section className="form-card">
        <h2>Marquee Logos</h2>
        <form onSubmit={uploadLogo} className="form-grid">
          <label>
            Upload Logo
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
          </label>
          <button className="primary-btn" type="submit">
            Upload
          </button>
        </form>
        {logos.map((logo) => (
          <div key={logo._id} className="item-row">
            <img src={logo.image_url} alt="logo" className="mini-logo" />
            <button onClick={() => deleteLogo(logo._id)} className="danger-btn" type="button">
              Delete
            </button>
          </div>
        ))}
      </section>

      <section className="form-card full-width">
        <h2>Submissions</h2>
        {submissions.map((sub) => (
          <article key={sub._id} className="submission-card">
            <h3>{sub.manuscript_title}</h3>
            <p>
              {sub.full_name} | {sub.email} | {sub.article_type} | {sub.country}
            </p>
            <p>{sub.abstract.slice(0, 240)}...</p>
            <a href={sub.manuscript_url} target="_blank" rel="noreferrer">
              Download Manuscript
            </a>
            <div className="actions">
              <select
                value={sub.status}
                onChange={(e) => setSubmissionStatus(sub._id, e.target.value)}
              >
                <option value="received">received</option>
                <option value="under_review">under_review</option>
                <option value="accepted">accepted</option>
                <option value="published">published</option>
                <option value="rejected">rejected</option>
              </select>
              <button onClick={() => deleteSubmission(sub._id)} className="danger-btn" type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};
