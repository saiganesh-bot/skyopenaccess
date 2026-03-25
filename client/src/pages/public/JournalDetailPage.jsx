import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { http } from "../../api/http";

const cleanText = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const getArticleHref = (article) => article.external_link || article.pdf_url || article.doi_link || "";

export const JournalDetailPage = () => {
  const { slug } = useParams();
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

  const articleCount = useMemo(() => content.articles.length, [content.articles.length]);

  if (loading) {
    return (
      <main className="container">
        <section className="form-card">
          <p>Loading journal content...</p>
        </section>
      </main>
    );
  }

  if (!journal) {
    return (
      <main className="container">
        <section className="form-card">
          <p className="error">{error || "Journal not found"}</p>
          <Link to="/" className="inline-link">Return to Home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="journal-hero">
        <div>
          <Link to="/" className="inline-link">Back to journals</Link>
          <h1>{journal.title}</h1>
          <p className="muted-line">{articleCount} published entries and media assets available.</p>
        </div>
        {journal.cover_image_url ? (
          <img src={journal.cover_image_url} alt={journal.title} className="journal-detail-cover" />
        ) : null}
      </section>

      {error ? (
        <section className="form-card">
          <p className="error">{error}</p>
        </section>
      ) : null}

      <section className="journal-text-grid">
        <article className="form-card">
          <h2>About</h2>
          <div
            className="rich-output"
            dangerouslySetInnerHTML={{ __html: journal.about || "<p>Not available yet.</p>" }}
          />
        </article>
        <article className="form-card">
          <h2>Aim and Scope</h2>
          <div
            className="rich-output"
            dangerouslySetInnerHTML={{ __html: journal.aim_scope || "<p>Not available yet.</p>" }}
          />
        </article>
        <article className="form-card">
          <h2>Author Guidelines</h2>
          <div
            className="rich-output"
            dangerouslySetInnerHTML={{ __html: journal.author_guidelines || "<p>Not available yet.</p>" }}
          />
        </article>
      </section>

      <section className="form-card">
        <h2>Articles</h2>
        {!content.articles.length ? <p className="muted-line">No articles yet.</p> : null}
        <div className="stack-list">
          {content.articles.map((article) => {
            const href = getArticleHref(article);
            return (
              <article className="content-row" key={article._id}>
                <div>
                  <h3>{article.title}</h3>
                  <p>{cleanText(article.abstract).slice(0, 220)}</p>
                </div>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="primary-btn inline-btn">
                    Open
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="journal-split-grid">
        <article className="form-card">
          <h2>Editorial Board</h2>
          {!content.members.length ? <p className="muted-line">No board members added.</p> : null}
          {content.members.map((member) => (
            <div className="content-row" key={member._id}>
              <div>
                <h3>{member.name}</h3>
                <p>{member.description || "Profile will be updated soon."}</p>
              </div>
              {member.image_url ? <img src={member.image_url} alt={member.name} className="avatar-sm" /> : null}
            </div>
          ))}
        </article>

        <article className="form-card">
          <h2>Current Issue</h2>
          {!content.issues.length ? <p className="muted-line">No current issue yet.</p> : null}
          {content.issues.map((issue) => (
            <div className="content-row" key={issue._id}>
              <div>
                <h3>{issue.volume_title}</h3>
                <p>{issue.article_items?.length || 0} linked articles</p>
              </div>
            </div>
          ))}
        </article>
      </section>

      <section className="journal-split-grid">
        <article className="form-card">
          <h2>Archive Volumes</h2>
          {!content.volumes.length ? <p className="muted-line">No archive volume yet.</p> : null}
          {content.volumes.map((volume) => (
            <div className="content-row" key={volume._id}>
              <div>
                <h3>{volume.year} - {volume.volume_title}</h3>
                <p>{volume.article_items?.length || 0} linked articles</p>
              </div>
            </div>
          ))}
        </article>

        <article className="form-card">
          <h2>Presentations and Videos</h2>
          {!content.ppts.length && !content.videos.length ? (
            <p className="muted-line">No media published yet.</p>
          ) : null}
          {content.ppts.map((ppt) => (
            <div className="content-row" key={ppt._id}>
              <div>
                <h3>{ppt.title}</h3>
                <p>Presentation file</p>
              </div>
              <a href={ppt.file_url} target="_blank" rel="noreferrer" className="inline-link">Open</a>
            </div>
          ))}
          {content.videos.map((video) => (
            <div className="content-row" key={video._id}>
              <div>
                <h3>{video.title}</h3>
                <p>{video.youtube_url}</p>
              </div>
              <a href={video.youtube_url} target="_blank" rel="noreferrer" className="inline-link">Watch</a>
            </div>
          ))}
        </article>
      </section>

      <section className="form-card">
        <h2>Indexing Logos</h2>
        <div className="logo-grid">
          {content.indexingLogos.map((logo) => (
            <article className="logo-card" key={logo._id}>
              <img src={logo.image_url} alt={logo.name} className="logo" />
              <p>{logo.name}</p>
            </article>
          ))}
          {!content.indexingLogos.length ? <p className="muted-line">No indexing logos yet.</p> : null}
        </div>
      </section>
    </main>
  );
};
