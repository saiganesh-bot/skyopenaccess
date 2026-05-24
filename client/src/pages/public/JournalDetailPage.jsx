import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { http } from "../../api/http";
import { toDriveViewerUrl } from "../../utils/driveViewer";

const cleanText = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const tabs = [
  { id: "about", label: "About" },
  { id: "aim", label: "Aim & Scope" },
  { id: "guidelines", label: "Author Guidelines" },
  { id: "editorial", label: "Editorial Board" },
  { id: "press", label: "Article In Press" },
  { id: "current", label: "Current Issue" },
  { id: "archive", label: "Archive" },
  { id: "ppts", label: "Ppts" },
  { id: "videos", label: "Videos" },
  { id: "indexing", label: "Indexing" }
];

export const JournalDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [journal, setJournal] = useState(null);
  const [content, setContent] = useState({
    articles: [],
    members: [],
    issues: [],
    volumes: [],
    videos: [],
    ppts: [],
    indexingLogos: []
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const { data: journalData } = await http.get(`/journals/${slug}`);
        const selectedJournal = journalData.journal;
        const query = { params: { journal_id: selectedJournal._id } };

        const [articlesRes, membersRes, issuesRes, volumesRes, videosRes, pptsRes, logosRes] =
          await Promise.all([
            http.get("/content/articles", query),
            http.get("/content/board-members", query),
            http.get("/content/current-issues", query),
            http.get("/content/archive-volumes", query),
            http.get("/content/videos", query),
            http.get("/content/ppts", query),
            http.get("/content/indexing-logos", query)
          ]);

        setJournal(selectedJournal);
        setContent({
          articles: articlesRes.data.articles || [],
          members: membersRes.data.members || [],
          issues: issuesRes.data.issues || [],
          volumes: volumesRes.data.volumes || [],
          videos: videosRes.data.videos || [],
          ppts: pptsRes.data.ppts || [],
          indexingLogos: logosRes.data.indexingLogos || []
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load journal content");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && tabs.some((tab) => tab.id === hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const articleCount = useMemo(() => content.articles.length, [content.articles.length]);

  if (loading) {
    return (
      <main className="container">
        <p>Loading journal content...</p>
      </main>
    );
  }

  if (!journal) {
    return (
      <main className="container">
        <p>{error || "Journal not found"}</p>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <aside className="sidebar">
          <ul>
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={tab.id === activeTab ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          <div className={`tab-content ${activeTab === "about" ? "active" : ""}`} id="about">
            <div className="about-header">
              <h1>{journal.title}</h1>
              <p>{articleCount} published entries and media assets available.</p>
            </div>
            <div className="about-body">
              <div
                dangerouslySetInnerHTML={{
                  __html: journal.about || "<p>Not available yet.</p>"
                }}
              />
            </div>
          </div>

          <div className={`tab-content ${activeTab === "aim" ? "active" : ""}`} id="aim">
            <div className="section-header">
              <h1>Aim &amp; Scope</h1>
            </div>
            <div className="about-body">
              <div
                dangerouslySetInnerHTML={{
                  __html: journal.aim_scope || "<p>Not available yet.</p>"
                }}
              />
            </div>
          </div>

          <div
            className={`tab-content ${activeTab === "guidelines" ? "active" : ""}`}
            id="guidelines"
          >
            <h1>Author Guidelines</h1>
            <div
              className="about-body"
              dangerouslySetInnerHTML={{
                __html: journal.author_guidelines || "<p>Not available yet.</p>"
              }}
            />
          </div>

          <div
            className={`tab-content ${activeTab === "editorial" ? "active" : ""}`}
            id="editorial"
          >
            <h1>Editorial Board</h1>
            {content.members.length ? (
              <ul className="styled-list">
                {content.members.map((member) => (
                  <li key={member._id}>
                    <strong>{member.name}</strong> — {member.description || "Profile coming soon."}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No editorial board members yet.</p>
            )}
          </div>

          <div className={`tab-content ${activeTab === "press" ? "active" : ""}`} id="press">
            <h1>Article In Press</h1>
            {content.articles.length ? (
              <ul className="styled-list">
                {content.articles.map((article) => (
                  <li key={article._id}>
                    <strong>{article.title}</strong>
                    <span> — {cleanText(article.abstract).slice(0, 140)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No articles in press yet.</p>
            )}
          </div>

          <div className={`tab-content ${activeTab === "current" ? "active" : ""}`} id="current">
            <h1>Current Issue</h1>
            {content.issues.length ? (
              <ul className="styled-list">
                {content.issues.map((issue) => (
                  <li key={issue._id}>
                    <strong>{issue.volume_title}</strong> — {issue.article_items?.length || 0} linked
                    articles
                  </li>
                ))}
              </ul>
            ) : (
              <p>No current issues published yet.</p>
            )}
          </div>

          <div className={`tab-content ${activeTab === "archive" ? "active" : ""}`} id="archive">
            <h1>Archive</h1>
            {content.volumes.length ? (
              <ul className="styled-list">
                {content.volumes.map((volume) => (
                  <li key={volume._id}>
                    <strong>
                      {volume.year} — {volume.volume_title}
                    </strong>
                    <span> — {volume.article_items?.length || 0} linked articles</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No archive volume yet.</p>
            )}
          </div>

          <div className={`tab-content ${activeTab === "ppts" ? "active" : ""}`} id="ppts">
            <h1>Ppts</h1>
            {content.ppts.length ? (
              <ul className="styled-list">
                {content.ppts.map((ppt) => (
                  <li key={ppt._id}>
                    <a href={toDriveViewerUrl(ppt.file_url)} target="_blank" rel="noreferrer">
                      {ppt.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No PPTs available yet.</p>
            )}
          </div>

          <div className={`tab-content ${activeTab === "videos" ? "active" : ""}`} id="videos">
            <h1>Videos</h1>
            {content.videos.length ? (
              <ul className="styled-list">
                {content.videos.map((video) => (
                  <li key={video._id}>
                    <a href={video.youtube_url} target="_blank" rel="noreferrer">
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No videos available yet.</p>
            )}
          </div>

          <div
            className={`tab-content ${activeTab === "indexing" ? "active" : ""}`}
            id="indexing"
          >
            <h1>Indexing</h1>
            {content.indexingLogos.length ? (
              <ul className="styled-list">
                {content.indexingLogos.map((logo) => (
                  <li key={logo._id}>
                    <img src={logo.image_url} alt={logo.name} width="48" /> {logo.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No indexing logos yet.</p>
            )}
          </div>
        </main>
      </div>
    </main>
  );
};
