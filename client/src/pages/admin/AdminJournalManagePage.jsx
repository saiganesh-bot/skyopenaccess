import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageCropModal } from "../../components/ImageCropModal";
import { RichTextEditor } from "../../components/RichTextEditor";
import { http } from "../../api/http";

const tabs = [
  { key: "details", label: "Details" },
  { key: "info-box", label: "Info Box" },
  { key: "recent-articles", label: "Recent Articles" },
  { key: "editorial-board", label: "Editorial Board" },
  { key: "articles-in-press", label: "Articles In Press" },
  { key: "current-issue", label: "Current Issue" },
  { key: "archive", label: "Archive" },
  { key: "ppts", label: "PPTs" },
  { key: "videos", label: "Videos" },
  { key: "indexing", label: "Indexing" }
];

const jsonList = (text) =>
  text
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const AdminJournalManagePage = () => {
  const { journalId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [journal, setJournal] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [editJournalForm, setEditJournalForm] = useState({
    title: "",
    about: "",
    aim_scope: "",
    author_guidelines: "",
    cover: null
  });
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [forms, setForms] = useState({
    article: {
      type: "Research",
      title: "",
      authors: "",
      abstract: "",
      external_link: "",
      doi_link: "",
      file: null
    },
    boardMember: { name: "", description: "", image: null },
    currentIssue: { volume_title: "", article_ids: "" },
    archiveVolume: { year: "", volume_title: "", article_ids: "" },
    video: { title: "", youtube_url: "" },
    ppt: { title: "", file: null },
    indexingLogo: { name: "", image: null }
  });
  const [allItems, setAllItems] = useState({
    articles: [],
    boardMembers: [],
    currentIssues: [],
    archiveVolumes: [],
    videos: [],
    ppts: [],
    indexingLogos: []
  });

  const setForm = (key, patch) => {
    setForms((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const load = async () => {
    setError("");
    try {
      const [journalRes, articlesRes, boardRes, issuesRes, archiveRes, videosRes, pptsRes, indexingRes] =
        await Promise.all([
          http.get("/journals"),
          http.get("/content/articles", { params: { journal_id: journalId } }),
          http.get("/content/board-members", { params: { journal_id: journalId } }),
          http.get("/content/current-issues", { params: { journal_id: journalId } }),
          http.get("/content/archive-volumes", { params: { journal_id: journalId } }),
          http.get("/content/videos", { params: { journal_id: journalId } }),
          http.get("/content/ppts", { params: { journal_id: journalId } }),
          http.get("/content/indexing-logos", { params: { journal_id: journalId } })
        ]);

      const journals = journalRes.data.journals || [];
      const found = journals.find((item) => item._id === journalId) || null;
      setJournal(found);
      setEditJournalForm({
        title: found?.title || "",
        about: found?.about || "",
        aim_scope: found?.aim_scope || "",
        author_guidelines: found?.author_guidelines || "",
        cover: null
      });
      setAllItems({
        articles: articlesRes.data.articles || [],
        boardMembers: boardRes.data.members || [],
        currentIssues: issuesRes.data.issues || [],
        archiveVolumes: archiveRes.data.volumes || [],
        videos: videosRes.data.videos || [],
        ppts: pptsRes.data.ppts || [],
        indexingLogos: indexingRes.data.indexingLogos || []
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load journal data");
      if (err.response?.status === 401 || err.response?.status === 403) {
        setInfo("Admin login is required. Please login again and retry.");
      }
    }
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, [journalId]);

  useEffect(() => {
    return () => {
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    };
  }, [cropImageSrc]);

  const handleCoverPick = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    const nextSrc = URL.createObjectURL(file);
    setCropImageSrc(nextSrc);
    event.target.value = "";
  };

  const handleCropClose = () => {
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc("");
  };

  const handleCropComplete = (file) => {
    setEditJournalForm((prev) => ({ ...prev, cover: file }));
    handleCropClose();
  };

  const updateJournal = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const data = new FormData();
    data.append("title", editJournalForm.title);
    data.append("about", editJournalForm.about);
    data.append("aim_scope", editJournalForm.aim_scope);
    data.append("author_guidelines", editJournalForm.author_guidelines);
    if (editJournalForm.cover) data.append("cover", editJournalForm.cover);

    try {
      const { data: response } = await http.put(`/journals/${journalId}`, data);
      setJournal(response.journal);
      setEditJournalForm((prev) => ({ ...prev, cover: null }));
      setInfo("Journal updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update journal");
    }
  };

  const createArticle = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(forms.article).forEach(([k, v]) => {
      if (k === "file") return;
      data.append(k, v);
    });
    data.append("journal_id", journalId);
    if (forms.article.file) data.append("file", forms.article.file);
    await http.post("/content/articles", data);
    await load();
  };

  const updateArticle = async (item) => {
    const title = window.prompt("Update title", item.title);
    if (!title) return;
    await http.put(`/content/articles/${item._id}`, { title });
    await load();
  };

  const createBoardMember = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("journal_id", journalId);
    data.append("name", forms.boardMember.name);
    data.append("description", forms.boardMember.description);
    if (forms.boardMember.image) data.append("image", forms.boardMember.image);
    await http.post("/content/board-members", data);
    await load();
  };

  const updateBoardMember = async (item) => {
    const name = window.prompt("Update name", item.name);
    if (!name) return;
    await http.put(`/content/board-members/${item._id}`, { name });
    await load();
  };

  const createCurrentIssue = async (e) => {
    e.preventDefault();
    await http.post("/content/current-issues", {
      journal_id: journalId,
      volume_title: forms.currentIssue.volume_title,
      article_ids: jsonList(forms.currentIssue.article_ids)
    });
    await load();
  };

  const updateCurrentIssue = async (item) => {
    const volume_title = window.prompt("Update volume title", item.volume_title);
    if (!volume_title) return;
    await http.put(`/content/current-issues/${item._id}`, { volume_title });
    await load();
  };

  const createArchiveVolume = async (e) => {
    e.preventDefault();
    await http.post("/content/archive-volumes", {
      journal_id: journalId,
      year: Number(forms.archiveVolume.year),
      volume_title: forms.archiveVolume.volume_title,
      article_ids: jsonList(forms.archiveVolume.article_ids)
    });
    await load();
  };

  const updateArchiveVolume = async (item) => {
    const volume_title = window.prompt("Update volume title", item.volume_title);
    if (!volume_title) return;
    await http.put(`/content/archive-volumes/${item._id}`, { volume_title });
    await load();
  };

  const createVideo = async (e) => {
    e.preventDefault();
    await http.post("/content/videos", { ...forms.video, journal_id: journalId });
    await load();
  };

  const updateVideo = async (item) => {
    const title = window.prompt("Update title", item.title);
    if (!title) return;
    await http.put(`/content/videos/${item._id}`, { title });
    await load();
  };

  const createPpt = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("journal_id", journalId);
    data.append("title", forms.ppt.title);
    if (forms.ppt.file) data.append("file", forms.ppt.file);
    await http.post("/content/ppts", data);
    await load();
  };

  const updatePpt = async (item) => {
    const title = window.prompt("Update title", item.title);
    if (!title) return;
    await http.put(`/content/ppts/${item._id}`, { title });
    await load();
  };

  const createIndexingLogo = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("journal_id", journalId);
    data.append("name", forms.indexingLogo.name);
    if (forms.indexingLogo.image) data.append("image", forms.indexingLogo.image);
    await http.post("/content/indexing-logos", data);
    await load();
  };

  const updateIndexingLogo = async (item) => {
    const name = window.prompt("Update name", item.name);
    if (!name) return;
    await http.put(`/content/indexing-logos/${item._id}`, { name });
    await load();
  };

  const remove = async (path, id) => {
    await http.delete(`/content/${path}/${id}`);
    await load();
  };

  return (
    <main className="container admin-shell">
      <section className="form-card admin-page-hero">
        <h2>Manage: {journal?.title || "Journal"}</h2>
        {error ? <p className="error">{error}</p> : null}
        {info ? <p className="success">{info}</p> : null}
        <div className="tab-row admin-tabs journal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-btn ${activeTab === tab.key ? "active-tab" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "details" ? (
        <section className="form-card admin-panel">
          <h3>Journal Details</h3>
          <form onSubmit={updateJournal} className="form-grid">
            <label>
              Title
              <input
                required
                value={editJournalForm.title}
                onChange={(e) => setEditJournalForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>
            <label>
              About This Journal
              <RichTextEditor
                value={editJournalForm.about}
                onChange={(value) => setEditJournalForm((prev) => ({ ...prev, about: value }))}
                placeholder="Write journal about section..."
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
              Replace Cover (1024x1536)
              <input type="file" accept="image/*" onChange={handleCoverPick} />
              {editJournalForm.cover ? (
                <span className="muted-line">Cropped image ready to upload.</span>
              ) : null}
            </label>
            <button className="primary-btn" type="submit">
              Update Journal
            </button>
          </form>
        </section>
      ) : null}

      {activeTab === "info-box" ? (
        <section className="form-card admin-panel">
          <h3>Info Box</h3>
          <p className="muted-line">Info box management will be available here.</p>
        </section>
      ) : null}

      {activeTab === "recent-articles" ? (
        <section className="form-card admin-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Articles</h3>
              <p className="muted-line">Add and update recent articles for this journal.</p>
            </div>
          </div>
          <form className="form-grid" onSubmit={createArticle}>
            <input placeholder="Type" value={forms.article.type} onChange={(e) => setForm("article", { type: e.target.value })} />
            <input placeholder="Title" value={forms.article.title} onChange={(e) => setForm("article", { title: e.target.value })} required />
            <input placeholder="Authors" value={forms.article.authors} onChange={(e) => setForm("article", { authors: e.target.value })} required />
            <textarea placeholder="Abstract" value={forms.article.abstract} onChange={(e) => setForm("article", { abstract: e.target.value })} required />
            <input placeholder="External link" value={forms.article.external_link} onChange={(e) => setForm("article", { external_link: e.target.value })} />
            <input placeholder="DOI link" value={forms.article.doi_link} onChange={(e) => setForm("article", { doi_link: e.target.value })} />
            <input type="file" onChange={(e) => setForm("article", { file: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create Article</button>
          </form>
          {allItems.articles.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.title}</span>
              <div className="actions">
                <button type="button" onClick={() => updateArticle(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("articles", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {activeTab === "editorial-board" ? (
        <section className="form-card admin-panel">
          <h3>Editorial Board</h3>
          <form className="form-grid" onSubmit={createBoardMember}>
            <input placeholder="Name" required value={forms.boardMember.name} onChange={(e) => setForm("boardMember", { name: e.target.value })} />
            <textarea placeholder="Description" value={forms.boardMember.description} onChange={(e) => setForm("boardMember", { description: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setForm("boardMember", { image: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create Board Member</button>
          </form>
          {allItems.boardMembers.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.name}</span>
              <div className="actions">
                <button type="button" onClick={() => updateBoardMember(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("board-members", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {activeTab === "articles-in-press" ? (
        <section className="form-card admin-panel">
          <h3>Articles In Press</h3>
          <p className="muted-line">Articles in press will be available here.</p>
        </section>
      ) : null}

      {activeTab === "current-issue" ? (
        <section className="form-card admin-panel">
          <h3>Current Issue</h3>
          <form className="form-grid" onSubmit={createCurrentIssue}>
            <input placeholder="Volume title" required value={forms.currentIssue.volume_title} onChange={(e) => setForm("currentIssue", { volume_title: e.target.value })} />
            <input placeholder="Article IDs (comma-separated)" value={forms.currentIssue.article_ids} onChange={(e) => setForm("currentIssue", { article_ids: e.target.value })} />
            <button className="primary-btn" type="submit">Create Current Issue</button>
          </form>
          {allItems.currentIssues.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.volume_title}</span>
              <div className="actions">
                <button type="button" onClick={() => updateCurrentIssue(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("current-issues", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {activeTab === "archive" ? (
        <section className="form-card admin-panel">
          <h3>Archive</h3>
          <form className="form-grid" onSubmit={createArchiveVolume}>
            <input placeholder="Year" type="number" required value={forms.archiveVolume.year} onChange={(e) => setForm("archiveVolume", { year: e.target.value })} />
            <input placeholder="Volume title" required value={forms.archiveVolume.volume_title} onChange={(e) => setForm("archiveVolume", { volume_title: e.target.value })} />
            <input placeholder="Article IDs (comma-separated)" value={forms.archiveVolume.article_ids} onChange={(e) => setForm("archiveVolume", { article_ids: e.target.value })} />
            <button className="primary-btn" type="submit">Create Archive Volume</button>
          </form>
          {allItems.archiveVolumes.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.year} - {item.volume_title}</span>
              <div className="actions">
                <button type="button" onClick={() => updateArchiveVolume(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("archive-volumes", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {activeTab === "ppts" ? (
        <section className="form-card admin-panel">
          <h3>PPTs</h3>
          <form className="form-grid" onSubmit={createPpt}>
            <input placeholder="Title" required value={forms.ppt.title} onChange={(e) => setForm("ppt", { title: e.target.value })} />
            <input type="file" onChange={(e) => setForm("ppt", { file: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create PPT</button>
          </form>
          {allItems.ppts.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.title}</span>
              <div className="actions">
                <button type="button" onClick={() => updatePpt(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("ppts", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {activeTab === "videos" ? (
        <section className="form-card admin-panel">
          <h3>Videos</h3>
          <form className="form-grid" onSubmit={createVideo}>
            <input placeholder="Title" required value={forms.video.title} onChange={(e) => setForm("video", { title: e.target.value })} />
            <input placeholder="YouTube URL" required value={forms.video.youtube_url} onChange={(e) => setForm("video", { youtube_url: e.target.value })} />
            <button className="primary-btn" type="submit">Create Video</button>
          </form>
          {allItems.videos.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.title}</span>
              <div className="actions">
                <button type="button" onClick={() => updateVideo(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("videos", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {activeTab === "indexing" ? (
        <section className="form-card admin-panel">
          <h3>Indexing</h3>
          <form className="form-grid" onSubmit={createIndexingLogo}>
            <input placeholder="Name" required value={forms.indexingLogo.name} onChange={(e) => setForm("indexingLogo", { name: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setForm("indexingLogo", { image: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create Indexing Logo</button>
          </form>
          {allItems.indexingLogos.map((item) => (
            <div className="item-row" key={item._id}>
              <span>{item.name}</span>
              <div className="actions">
                <button type="button" onClick={() => updateIndexingLogo(item)}>Edit</button>
                <button className="danger-btn" type="button" onClick={() => remove("indexing-logos", item._id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {cropImageSrc ? (
        <ImageCropModal
          imageSrc={cropImageSrc}
          outputWidth={1024}
          outputHeight={1536}
          onClose={handleCropClose}
          onComplete={handleCropComplete}
        />
      ) : null}
    </main>
  );
};
