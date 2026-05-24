import { useEffect, useState } from "react";
import { http } from "../../api/http";
import { toDriveViewerUrl } from "../../utils/driveViewer";

export const PptsPage = () => {
  const [ppts, setPpts] = useState([]);

  useEffect(() => {
    http
      .get("/content/ppts")
      .then((res) => setPpts(res.data.ppts || []))
      .catch(() => setPpts([]));
  }, []);

  return (
    <main className="container">
      <section className="card-section">
        <h2>PPTs</h2>
        <div className="grid">
          {ppts.map((ppt) => (
            <article className="card" key={ppt._id}>
              <h3>{ppt.title}</h3>
              <a
                href={toDriveViewerUrl(ppt.file_url)}
                target="_blank"
                rel="noreferrer"
                className="inline-link"
              >
                Open
              </a>
            </article>
          ))}
          {!ppts.length ? <p>No PPTs available yet.</p> : null}
        </div>
      </section>
    </main>
  );
};
