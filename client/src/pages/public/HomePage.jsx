import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { http } from "../../api/http";

export const HomePage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [journals, setJournals] = useState([]);
  const [searchParams] = useSearchParams();
  const testimonialsRef = useRef(null);

  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    http
      .get("/content/testimonials")
      .then((res) => setTestimonials(res.data.testimonials || []))
      .catch(() => setTestimonials([]));
  }, []);

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

  const previewText = (value) => {
    if (!value) return "";
    return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
  };

  const scrollTestimonials = (direction) => {
    if (!testimonialsRef.current) return;
    const card = testimonialsRef.current.querySelector(".testimonial-card");
    const offset = card ? card.offsetWidth + 24 : 320;
    testimonialsRef.current.scrollBy({ left: direction * offset, behavior: "smooth" });
  };

  return (
    <main>
      <section className="hero fade-up">
        <div className="hero-pattern">
          <svg viewBox="0 0 1200 600">
            <path d="M0 300 Q300 200 600 300 T1200 300" />
            <path d="M0 350 Q300 250 600 350 T1200 350" />
            <path d="M0 250 Q300 150 600 250 T1200 250" />
            <path d="M0 400 Q300 300 600 400 T1200 400" />
            <path d="M0 200 Q300 100 600 200 T1200 200" />
          </svg>
        </div>

        <div className="world-map" />

        <div className="container hero-grid">
          <div className="hero-text">
            <h1>
              PUBLISH YOUR BOOK <br />
              &amp; GO <span style={{ color: "var(--orange)" }}>GLOBAL</span>
            </h1>
            <p className="hero-subtitle">We make publishing easy for you</p>

            <div className="hero-buttons">
              <NavLink to="/submit" className="hero-btn-primary">
                <i className="fa-solid fa-paper-plane" />
                <span>Publish Now</span>
              </NavLink>

              <NavLink to="/journals" className="hero-btn-secondary">
                <i className="fa-solid fa-book-open" />
                <span>View Journals</span>
              </NavLink>
            </div>

            <div className="hero-book-showcase" aria-hidden="true">
              <div className="hero-book-track">
                <div className="hero-book-group">
                  <div className="hero-book">
                    <img src="/images/agriculture.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/journal2.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/medical0.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/op2.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/store.jpg" alt="" />
                  </div>
                </div>

                <div className="hero-book-group">
                  <div className="hero-book">
                    <img src="/images/agriculture.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/journal2.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/medical0.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/op2.png" alt="" />
                  </div>
                  <div className="hero-book">
                    <img src="/images/store.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="book-base">
              <img src="/images/book-base.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      <div className="home-about-wrapper fade-up">
        <div className="home-about-image fade-up">
          <img src="/images/Habout.svg" alt="About" />
        </div>

        <div className="home-about-content fade-up">
          <span className="home-about-small fade-up">About Us</span>
          <h2>Advancing Science Through Open Knowledge</h2>

          <p>
            At Open Ethic Publishers, We Believe That The Future Of Scientific Progress Lies
            Transparency, Collaboration, And Accessibility. As Independent International Publisher
            Of Peer-Reviewed Journals Across Clinical, Medical, And Scientific Disciplines
          </p>

          <div className="home-about-buttons fade-up">
            <div className="home-about-btn">
              <img src="/images/Geography.svg" alt="Globe" />
              Global Research
            </div>

            <div className="home-about-btn">
              <img src="/images/Tie.svg" alt="Peer" />
              Peer-Reviewed
            </div>

            <div className="home-about-btn">
              <img src="/images/User%20Account.svg" alt="Expert" />
              Expert Editors
            </div>
          </div>
        </div>
      </div>

      <div className="apart-section fade-up">
        <div className="apart-pattern">
          <svg viewBox="0 0 1200 600">
            <g>
              <circle cx="600" cy="300" r="90" />
              <circle cx="600" cy="300" r="180" />
              <circle cx="600" cy="300" r="260" />
              <circle cx="600" cy="300" r="350" />
            </g>
          </svg>
        </div>

        <h2>What Sets Up Apart</h2>

        <div className="apart-cards fade-up">
          <div className="card">
            <div className="icon">
              <img src="/images/Lightning%20Bolt.svg" alt="Lightning" />
            </div>
            <h3>Fast Publishing</h3>
            <p>Average Turnaround Of 4–6 Weeks From Submission To Publication.</p>
          </div>

          <div className="card">
            <div className="icon">
              <img src="/images/Eye.svg" alt="Eye" />
            </div>
            <h3>Open Access</h3>
            <p>All Articles Freely Available — No Paywalls, No Barriers To Knowledge.</p>
          </div>

          <div className="card">
            <div className="icon">
              <img src="/images/Handshake.svg" alt="Handshake" />
            </div>
            <h3>Ethical Standards</h3>
            <p>COPE-Compliant Practices With Zero Tolerance For Plagiarism.</p>
          </div>
        </div>
      </div>

      {query ? (
        <section className="home-search-results fade-up" id="home-journals">
          <div className="container">
            <div className="home-journals-header">
              <div>
                <h2>Search Results</h2>
                <p>Showing matches for "{query}"</p>
              </div>
            </div>

            <div className="search-results">
              {filteredJournals.map((journal) => (
                <article className="search-result" key={journal._id}>
                  <div className="search-result-meta">skyopenaccesspublishers.com</div>
                  <NavLink to={`/journals/${journal.slug}`} className="search-result-title">
                    {journal.title}
                  </NavLink>
                  <p className="search-result-snippet">
                    {previewText(journal.about) || "No description provided yet."}
                  </p>
                </article>
              ))}
            </div>

            {!filteredJournals.length ? (
              <p className="empty-state">No journals match your search yet.</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="book-banner fade-up">
        <div className="book-banner-overlay">
          <div className="book-banner-buttons">
            <NavLink to="/ebooks" className="banner-btn">
              <i className="fa-solid fa-tablet-screen-button" />
              <span>E-Books</span>
            </NavLink>

            <NavLink to="/reprints" className="banner-btn">
              <i className="fa-solid fa-print" />
              <span>Reprints</span>
            </NavLink>
          </div>
        </div>
      </section>

      <section className="testimonial-section fade-up">
        <div className="container">
          <div className="left-content fade-up">
            <span className="tag">Testimonials</span>
            <h2>What Our Client Says</h2>
            <p>
              Medical, Pharmaceutical, Biomedical, Life Sciences, Engineering, And Environmental
              Sciences.
            </p>
          </div>

          <div className="testimonial-shell">
            {testimonials.length > 1 ? (
              <button
                type="button"
                className="arrow left-arrow"
                onClick={() => scrollTestimonials(-1)}
                aria-label="Previous testimonial"
              >
                ←
              </button>
            ) : null}

            <div className="testimonial-track" ref={testimonialsRef}>
              {testimonials.length ? (
                testimonials.map((item) => (
                  <article className="testimonial-card fade-up" key={item._id}>
                    <div className="quote-icon">“</div>
                    <p className="testimonial-text">{item.description}</p>
                    <div className="divider" />
                    <div className="client-info">
                      <img
                        src={item.image_url || "https://randomuser.me/api/portraits/men/32.jpg"}
                        alt={item.name || "Client"}
                      />
                      <div>
                        <h4>{item.name || "Client"}</h4>
                        <span>Contributor</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <article className="testimonial-card fade-up">
                  <div className="quote-icon">“</div>
                  <p className="testimonial-text">
                    No testimonials available yet. Please check back soon.
                  </p>
                </article>
              )}
            </div>

            {testimonials.length > 1 ? (
              <button
                type="button"
                className="arrow right-arrow"
                onClick={() => scrollTestimonials(1)}
                aria-label="Next testimonial"
              >
                →
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};
