import { useEffect, useState } from "react";
import { http } from "../../api/http";

const tabs = [
  "articles",
  "board-members",
  "current-issues",
  "archive-volumes",
  "videos",
  "ppts",
  "testimonials",
  "indexing-logos"
];

const jsonList = (text) =>
  text
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [journals, setJournals] = useState([]);
  const [allItems, setAllItems] = useState({
    articles: [],
    "board-members": [],
    "current-issues": [],
    "archive-volumes": [],
    videos: [],
    ppts: [],
    testimonials: [],
    "indexing-logos": []
  });

  const [forms, setForms] = useState({
    article: {
      journal_id: "",
      type: "Research",
      title: "",
      authors: "",
      abstract: "",
      external_link: "",
      doi_link: "",
      file: null
    },
    boardMember: { journal_id: "", name: "", description: "", image: null },
    currentIssue: { journal_id: "", volume_title: "", article_ids: "" },
    archiveVolume: { journal_id: "", year: "", volume_title: "", article_ids: "" },
    video: { journal_id: "", title: "", youtube_url: "" },
    ppt: { journal_id: "", title: "", file: null },
    testimonial: { description: "", image: null },
    indexingLogo: { journal_id: "", name: "", image: null }
  });

  const load = async () => {
    const [j, a, b, c, ar, v, p, t, i] = await Promise.all([
      http.get("/journals"),
      http.get("/content/articles"),
      http.get("/content/board-members"),
      http.get("/content/current-issues"),
      http.get("/content/archive-volumes"),
      http.get("/content/videos"),
      http.get("/content/ppts"),
      http.get("/content/testimonials"),
      http.get("/content/indexing-logos")
    ]);

    setJournals(j.data.journals || []);
    setAllItems({
      articles: a.data.articles || [],
      "board-members": b.data.members || [],
      "current-issues": c.data.issues || [],
      "archive-volumes": ar.data.volumes || [],
      videos: v.data.videos || [],
      ppts: p.data.ppts || [],
      testimonials: t.data.testimonials || [],
      "indexing-logos": i.data.indexingLogos || []
    });
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const setForm = (key, patch) => {
    setForms((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const createArticle = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(forms.article).forEach(([k, v]) => {
      if (k === "file") return;
      data.append(k, v);
    });
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
    data.append("journal_id", forms.boardMember.journal_id);
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
      journal_id: forms.currentIssue.journal_id,
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
      journal_id: forms.archiveVolume.journal_id,
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
    await http.post("/content/videos", forms.video);
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
    data.append("journal_id", forms.ppt.journal_id);
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

  const createTestimonial = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("description", forms.testimonial.description);
    if (forms.testimonial.image) data.append("image", forms.testimonial.image);
    await http.post("/content/testimonials", data);
    await load();
  };

  const updateTestimonial = async (item) => {
    const description = window.prompt("Update description", item.description);
    if (!description) return;
    await http.put(`/content/testimonials/${item._id}`, { description });
    await load();
  };

  const createIndexingLogo = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("journal_id", forms.indexingLogo.journal_id);
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
    <main className="container">
      <section className="form-card">
        <h1>Admin Content Studio</h1>
        <p>CRUD management for articles, boards, issues, archives, media, and testimonials.</p>
        <div className="tab-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${activeTab === tab ? "active-tab" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "articles" ? (
        <section className="form-card">
          <h2>Articles</h2>
          <form className="form-grid" onSubmit={createArticle}>
            <select required value={forms.article.journal_id} onChange={(e) => setForm("article", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
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
            <div className="item-row" key={item._id}><span>{item.title}</span><div className="actions"><button type="button" onClick={() => updateArticle(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("articles", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "board-members" ? (
        <section className="form-card">
          <h2>Board Members</h2>
          <form className="form-grid" onSubmit={createBoardMember}>
            <select required value={forms.boardMember.journal_id} onChange={(e) => setForm("boardMember", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <input placeholder="Name" required value={forms.boardMember.name} onChange={(e) => setForm("boardMember", { name: e.target.value })} />
            <textarea placeholder="Description" value={forms.boardMember.description} onChange={(e) => setForm("boardMember", { description: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setForm("boardMember", { image: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create Board Member</button>
          </form>
          {allItems["board-members"].map((item) => (
            <div className="item-row" key={item._id}><span>{item.name}</span><div className="actions"><button type="button" onClick={() => updateBoardMember(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("board-members", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "current-issues" ? (
        <section className="form-card">
          <h2>Current Issues</h2>
          <form className="form-grid" onSubmit={createCurrentIssue}>
            <select required value={forms.currentIssue.journal_id} onChange={(e) => setForm("currentIssue", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <input placeholder="Volume title" required value={forms.currentIssue.volume_title} onChange={(e) => setForm("currentIssue", { volume_title: e.target.value })} />
            <input placeholder="Article IDs (comma-separated)" value={forms.currentIssue.article_ids} onChange={(e) => setForm("currentIssue", { article_ids: e.target.value })} />
            <button className="primary-btn" type="submit">Create Current Issue</button>
          </form>
          {allItems["current-issues"].map((item) => (
            <div className="item-row" key={item._id}><span>{item.volume_title}</span><div className="actions"><button type="button" onClick={() => updateCurrentIssue(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("current-issues", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "archive-volumes" ? (
        <section className="form-card">
          <h2>Archive Volumes</h2>
          <form className="form-grid" onSubmit={createArchiveVolume}>
            <select required value={forms.archiveVolume.journal_id} onChange={(e) => setForm("archiveVolume", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <input placeholder="Year" type="number" required value={forms.archiveVolume.year} onChange={(e) => setForm("archiveVolume", { year: e.target.value })} />
            <input placeholder="Volume title" required value={forms.archiveVolume.volume_title} onChange={(e) => setForm("archiveVolume", { volume_title: e.target.value })} />
            <input placeholder="Article IDs (comma-separated)" value={forms.archiveVolume.article_ids} onChange={(e) => setForm("archiveVolume", { article_ids: e.target.value })} />
            <button className="primary-btn" type="submit">Create Archive Volume</button>
          </form>
          {allItems["archive-volumes"].map((item) => (
            <div className="item-row" key={item._id}><span>{item.year} - {item.volume_title}</span><div className="actions"><button type="button" onClick={() => updateArchiveVolume(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("archive-volumes", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "videos" ? (
        <section className="form-card">
          <h2>Videos</h2>
          <form className="form-grid" onSubmit={createVideo}>
            <select required value={forms.video.journal_id} onChange={(e) => setForm("video", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <input placeholder="Title" required value={forms.video.title} onChange={(e) => setForm("video", { title: e.target.value })} />
            <input placeholder="YouTube URL" required value={forms.video.youtube_url} onChange={(e) => setForm("video", { youtube_url: e.target.value })} />
            <button className="primary-btn" type="submit">Create Video</button>
          </form>
          {allItems.videos.map((item) => (
            <div className="item-row" key={item._id}><span>{item.title}</span><div className="actions"><button type="button" onClick={() => updateVideo(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("videos", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "ppts" ? (
        <section className="form-card">
          <h2>PPT / Slide Decks</h2>
          <form className="form-grid" onSubmit={createPpt}>
            <select required value={forms.ppt.journal_id} onChange={(e) => setForm("ppt", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <input placeholder="Title" required value={forms.ppt.title} onChange={(e) => setForm("ppt", { title: e.target.value })} />
            <input type="file" onChange={(e) => setForm("ppt", { file: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create PPT</button>
          </form>
          {allItems.ppts.map((item) => (
            <div className="item-row" key={item._id}><span>{item.title}</span><div className="actions"><button type="button" onClick={() => updatePpt(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("ppts", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "testimonials" ? (
        <section className="form-card">
          <h2>Testimonials</h2>
          <form className="form-grid" onSubmit={createTestimonial}>
            <textarea placeholder="Description" required value={forms.testimonial.description} onChange={(e) => setForm("testimonial", { description: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setForm("testimonial", { image: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create Testimonial</button>
          </form>
          {allItems.testimonials.map((item) => (
            <div className="item-row" key={item._id}><span>{item.description.slice(0, 70)}</span><div className="actions"><button type="button" onClick={() => updateTestimonial(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("testimonials", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}

      {activeTab === "indexing-logos" ? (
        <section className="form-card">
          <h2>Indexing Logos</h2>
          <form className="form-grid" onSubmit={createIndexingLogo}>
            <select required value={forms.indexingLogo.journal_id} onChange={(e) => setForm("indexingLogo", { journal_id: e.target.value })}>
              <option value="">Select Journal</option>
              {journals.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
            </select>
            <input placeholder="Name" required value={forms.indexingLogo.name} onChange={(e) => setForm("indexingLogo", { name: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setForm("indexingLogo", { image: e.target.files?.[0] || null })} />
            <button className="primary-btn" type="submit">Create Indexing Logo</button>
          </form>
          {allItems["indexing-logos"].map((item) => (
            <div className="item-row" key={item._id}><span>{item.name}</span><div className="actions"><button type="button" onClick={() => updateIndexingLogo(item)}>Edit</button><button className="danger-btn" type="button" onClick={() => remove("indexing-logos", item._id)}>Delete</button></div></div>
          ))}
        </section>
      ) : null}
    </main>
  );
};
