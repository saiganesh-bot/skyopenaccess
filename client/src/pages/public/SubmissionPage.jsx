import { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http";

const articleTypes = [
  "Research",
  "Review",
  "Case Study",
  "Short Communication",
  "Editorial",
  "Other"
];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];

export const SubmissionPage = () => {
  const [journals, setJournals] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    article_type: "Research",
    manuscript_title: "",
    journal_ids: [],
    country: "",
    abstract: "",
    manuscript: null
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    http
      .get("/journals")
      .then((res) => setJournals(res.data.journals || []))
      .catch(() => setJournals([]));
  }, []);

  const abstractWords = useMemo(() => {
    return form.abstract.trim() ? form.abstract.trim().split(/\s+/).length : 0;
  }, [form.abstract]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onJournalSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm((prev) => ({ ...prev, journal_ids: selected }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, manuscript: file }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (abstractWords < 150) {
      setStatus({ type: "error", message: "Abstract should be at least 150 words." });
      return;
    }

    if (!form.manuscript) {
      setStatus({ type: "error", message: "Please upload your manuscript file." });
      return;
    }

    try {
      const data = new FormData();
      data.append("full_name", form.full_name);
      data.append("email", form.email);
      data.append("article_type", form.article_type);
      data.append("manuscript_title", form.manuscript_title);
      data.append("country", form.country);
      data.append("abstract", form.abstract);
      data.append("journal_ids", JSON.stringify(form.journal_ids));
      data.append("file", form.manuscript);

      const res = await http.post("/submissions", data);
      setStatus({ type: "success", message: res.data?.message || "Submission received." });
      setForm({
        full_name: "",
        email: "",
        article_type: "Research",
        manuscript_title: "",
        journal_ids: [],
        country: "",
        abstract: "",
        manuscript: null
      });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Submission failed." });
    }
  };

  return (
    <main>
      <section className="submission-section fade-up">
        <img src="/images/store.jpg" className="submission-bg" alt="library" />
        <div className="submission-overlay" />

        <div className="submission-left">
          <h1>
            Submit your
            <br />
            Manuscript
          </h1>
        </div>

        <form className="submission-form" onSubmit={submit}>
          <h2>Online Submission</h2>

          <div className="submission-grid">
            <input
              name="full_name"
              value={form.full_name}
              onChange={update}
              placeholder="Enter Your Name...."
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="Enter Your Email...."
              required
            />
            <select name="article_type" value={form.article_type} onChange={update}>
              {articleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              name="manuscript_title"
              value={form.manuscript_title}
              onChange={update}
              placeholder="Manuscript Title...."
              required
            />
            <select multiple value={form.journal_ids} onChange={onJournalSelect}>
              {journals.map((journal) => (
                <option key={journal._id} value={journal._id}>
                  {journal.title}
                </option>
              ))}
            </select>
            <select name="country" value={form.country} onChange={update} required>
              <option value="">Select Your Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="abstract"
            value={form.abstract}
            onChange={update}
            placeholder="Abstract...."
            required
          />

          <div className="submission-upload">
            <label className="submission-upload-btn" htmlFor="manuscript">
              Upload PDF
            </label>
            <input id="manuscript" type="file" onChange={onFileChange} hidden />
            <span>(Please Upload Only .Doc / .Pdf Files Only)</span>
          </div>

          <button type="submit" className="submission-submit-btn">
            Submit
          </button>

          {status.message ? (
            <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>
          ) : null}
        </form>
      </section>
    </main>
  );
};
