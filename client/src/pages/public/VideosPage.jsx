import { useEffect, useState } from "react";
import { http } from "../../api/http";

export const VideosPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    http
      .get("/content/videos")
      .then((res) => setVideos(res.data.videos || []))
      .catch(() => setVideos([]));
  }, []);

  return (
    <main className="container">
      <section className="card-section">
        <h2>Videos</h2>
        <div className="grid">
          {videos.map((video) => (
            <article className="card" key={video._id}>
              <h3>{video.title}</h3>
              <a href={video.youtube_url} target="_blank" rel="noreferrer" className="inline-link">
                Watch
              </a>
            </article>
          ))}
          {!videos.length ? <p>No videos available yet.</p> : null}
        </div>
      </section>
    </main>
  );
};
