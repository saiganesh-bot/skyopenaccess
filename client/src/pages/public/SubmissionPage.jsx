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
      .catch(console.error);
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
      setStatus({ type: "error", message: "Please upload manuscript file." });
      return;
    }

    const data = new FormData();
    data.append("full_name", form.full_name);
    data.append("email", form.email);
    data.append("article_type", form.article_type);
    data.append("manuscript_title", form.manuscript_title);
    data.append("country", form.country);
    data.append("abstract", form.abstract);
    data.append("journal_ids", JSON.stringify(form.journal_ids));
    data.append("manuscript", form.manuscript);

    try {
      const res = await http.post("/submissions", data);
      setStatus({ type: "success", message: res.data.message || "Submission successful." });
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
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Submission failed"
      });
    }
  };

  return (
    <main className="container">
      <section className="form-card">
        <h1>Online Manuscript Submission</h1>
        <p>Submit your article with all required information and attach .doc/.docx/.pdf file.</p>

        <form onSubmit={submit} className="form-grid">
          <label>
            Full Name
            <input name="full_name" value={form.full_name} onChange={update} required />
          </label>

          <label>
            Enter Mail
            <input name="email" type="email" value={form.email} onChange={update} required />
          </label>

          <label>
            Article Type
            <select name="article_type" value={form.article_type} onChange={update} required>
              {articleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Manuscript Title
            <input
              name="manuscript_title"
              value={form.manuscript_title}
              onChange={update}
              required
            />
          </label>

          <label>
            Journal(s)
            <select multiple value={form.journal_ids} onChange={onJournalSelect} required>
              {journals.map((journal) => (
                <option key={journal._id} value={journal._id}>
                  {journal.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Country
            <select name="country" value={form.country} onChange={update} required>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <label className="full-width">
            Abstract
            <textarea
              name="abstract"
              rows={8}
              value={form.abstract}
              onChange={update}
              placeholder="Write 150-300 words covering aim, methods, results and conclusions"
              required
            />
            <small>{abstractWords} words</small>
          </label>

          <label className="full-width">
            Main File (.doc/.docx/.pdf)
            <input
              type="file"
              accept=".doc,.docx,.pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onFileChange}
              required
            />
          </label>

          <button type="submit" className="primary-btn full-width">
            Submit
          </button>
        </form>

        {status.message ? <p className={status.type}>{status.message}</p> : null}
      </section>
    </main>
  );
};
