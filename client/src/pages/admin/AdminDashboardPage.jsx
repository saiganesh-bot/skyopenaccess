import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RichTextEditor } from "../../components/RichTextEditor";
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
  const [editingId, setEditingId] = useState("");
  const [editJournalForm, setEditJournalForm] = useState(initialJournal);
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

  useEffect(() => {
    if (!journals.length) return;
    if (editingId) return;
    const first = journals[0];
    setEditingId(first._id);
    setEditJournalForm({
      title: first.title || "",
      about: first.about || "",
      aim_scope: first.aim_scope || "",
      author_guidelines: first.author_guidelines || "",
      cover: null
    });
  }, [journals, editingId]);

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
    if (editingId === id) {
      setEditingId("");
      setEditJournalForm(initialJournal);
    }
    await loadData();
  };

  const setActiveJournalForEdit = (journal) => {
    setEditingId(journal._id);
    setEditJournalForm({
      title: journal.title || "",
      about: journal.about || "",
      aim_scope: journal.aim_scope || "",
      author_guidelines: journal.author_guidelines || "",
      cover: null
    });
  };

  const updateJournal = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const data = new FormData();
    data.append("title", editJournalForm.title);
    data.append("about", editJournalForm.about);
    data.append("aim_scope", editJournalForm.aim_scope);
    data.append("author_guidelines", editJournalForm.author_guidelines);
    if (editJournalForm.cover) data.append("cover", editJournalForm.cover);

    await http.put(`/journals/${editingId}`, data);
    setEditJournalForm((prev) => ({ ...prev, cover: null }));
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
            <div className="actions">
              <button onClick={() => setActiveJournalForEdit(journal)} type="button">Edit</button>
              <button onClick={() => deleteJournal(journal._id)} className="danger-btn" type="button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="form-card full-width">
        <h2>Update Journal Content</h2>
        <p>Use rich editor controls on the left and write content on the right panel.</p>
        <form onSubmit={updateJournal} className="form-grid">
          <label>
            Select Journal
            <select
              required
              value={editingId}
              onChange={(e) => {
                const selected = journals.find((journal) => journal._id === e.target.value);
                if (selected) setActiveJournalForEdit(selected);
              }}
            >
              <option value="">Select Journal</option>
              {journals.map((journal) => (
                <option key={journal._id} value={journal._id}>{journal.title}</option>
              ))}
            </select>
          </label>

          <label>
            Title
            <input
              required
              value={editJournalForm.title}
              onChange={(e) => setEditJournalForm((prev) => ({ ...prev, title: e.target.value }))}
            />
          </label>

          <label>
            About Section
            <RichTextEditor
              value={editJournalForm.about}
              onChange={(value) => setEditJournalForm((prev) => ({ ...prev, about: value }))}
              placeholder="Write journal about section with bold and highlights..."
            />
          </label>

          <label>
            Aim and Scope
            <RichTextEditor
              value={editJournalForm.aim_scope}
              onChange={(value) => setEditJournalForm((prev) => ({ ...prev, aim_scope: value }))}
              placeholder="Write aim and scope..."
            />
          </label>

          <label>
            Author Guidelines
            <RichTextEditor
              value={editJournalForm.author_guidelines}
              onChange={(value) =>
                setEditJournalForm((prev) => ({ ...prev, author_guidelines: value }))
              }
              placeholder="Write author guidelines..."
            />
          </label>

          <label>
            Replace Cover
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditJournalForm((prev) => ({ ...prev, cover: e.target.files?.[0] || null }))
              }
            />
          </label>

          <button className="primary-btn" type="submit" disabled={!editingId}>
            Update Journal
          </button>
        </form>
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
