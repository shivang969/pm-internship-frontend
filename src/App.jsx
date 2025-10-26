import { useState, useEffect } from "react";
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  Brain,
  Target,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
  PieChart,
  Network,
  MessageSquare,
  Info,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const SKILLS_OPTIONS = [
  "React",
  "Node.js",
  "Python",
  "Data Analysis",
  "UI/UX Design",
  "Project Management",
  "SEO",
  "Content Writing",
  "Financial Modeling",
  "Excel",
  "Machine Learning",
  "SQL",
  "Django",
  "Digital Marketing",
  "Social Media",
  "Analytics",
  "Financial Analysis",
  "Power BI",
  "Risk Management",
  "Investment",
  "Figma",
  "Adobe Creative Suite",
  "Prototyping",
  "User Research",
];

const LOCATION_OPTIONS = [
  "Bangalore",
  "Pune",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Remote",
  "Gujarat",
  "Bihar",
  "Kolkata",
  "Ahmedabad",
  "Patna",
];

const QUALIFICATION_OPTIONS = [
  "B.Tech",
  "M.Tech",
  "MBA",
  "BBA",
  "BCA",
  "MCA",
  "B.Com",
  "CFA Level 1",
  "B.Des",
  "Mass Communication",
  "Diploma in Design",
];

const SECTOR_OPTIONS = [
  "IT",
  "Finance",
  "Marketing",
  "Healthcare",
  "E-commerce",
  "Education",
  "Technology",
  "Data Science",
  "Banking",
  "Design",
];

const LANGUAGE_OPTIONS = ["English", "Hindi", "Gujarati", "Telugu"];

// --- Helper Components ---
const MultiSelect = ({ options, selected, onChange, label }) => {
  const handleSelect = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 text-sm cursor-pointer text-gray-300 hover:text-gray-100"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleSelect(option)}
              className="h-4 w-4 text-indigo-500 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-300 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-300 mb-2"
    >
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default function PMInternshipPlatform() {
  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [matches, setMatches] = useState([]);
  const [mlInfo, setMlInfo] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [candidateForm, setCandidateForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    qualifications: [],
    location_preference: [],
    current_location: "",
    category: "General",
    district_type: "Urban",
    past_participation: false,
    experience_months: 0,
    preferred_sectors: [],
    languages: ["English"],
  });

  const [industryForm, setIndustryForm] = useState({
    company_name: "",
    contact_email: "",
    contact_phone: "",
    internship_title: "",
    internship_description: "",
    required_skills: [],
    preferred_qualifications: [],
    location: "",
    sector: "",
    internship_capacity: 1,
    duration_months: 3,
    stipend_range: "",
    remote_allowed: false,
    preferred_candidate_profile: "",
  });

  const [matchForm, setMatchForm] = useState({
    candidate_id: "",
    industry_id: "",
    top_n: 10,
    min_score_threshold: 0.3,
    use_ml_prediction: true,
  });

  const [feedbackForm, setFeedbackForm] = useState({
    candidate_id: "",
    industry_id: "",
    placement_successful: true,
    rating: 5,
    feedback_text: "",
  });

  useEffect(() => {
    fetchStats();
    fetchMLInfo();
    fetchFeedback();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${API_BASE}/candidates`);
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    }
  };

  const fetchIndustries = async () => {
    try {
      const res = await fetch(`${API_BASE}/industries`);
      const data = await res.json();
      setIndustries(data.industries || []);
    } catch (err) {
      console.error("Failed to fetch industries:", err);
    }
  };

  const fetchMLInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/ml_info`);
      const data = await res.json();
      setMlInfo(data);
    } catch (err) {
      console.error("Failed to fetch ML info:", err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${API_BASE}/feedback`);
      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    }
  };

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/cluster_candidates`);
      const data = await res.json();
      setClusters(data.clustering_result);
      showNotification("Clustering complete!");
    } catch (err) {
      showNotification("Failed to cluster candidates", "error");
    }
    setLoading(false);
  };

  const registerCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateForm),
      });
      await res.json();
      showNotification("Candidate registered successfully!");
      fetchStats();
      setCandidateForm({
        name: "",
        email: "",
        phone: "",
        skills: [],
        qualifications: [],
        location_preference: [],
        current_location: "",
        category: "General",
        district_type: "Urban",
        past_participation: false,
        experience_months: 0,
        preferred_sectors: [],
        languages: ["English"],
      });
    } catch (err) {
      showNotification("Failed to register candidate", "error");
    }
    setLoading(false);
  };

  const registerIndustry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/industries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(industryForm),
      });
      await res.json();
      showNotification("Industry registered successfully!");
      fetchStats();
      setIndustryForm({
        company_name: "",
        contact_email: "",
        contact_phone: "",
        internship_title: "",
        internship_description: "",
        required_skills: [],
        preferred_qualifications: [],
        location: "",
        sector: "",
        internship_capacity: 1,
        duration_months: 3,
        stipend_range: "",
        remote_allowed: false,
        preferred_candidate_profile: "",
      });
    } catch (err) {
      showNotification("Failed to register industry", "error");
    }
    setLoading(false);
  };

  const findMatches = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...matchForm,
        candidate_id: matchForm.candidate_id || null,
        industry_id: matchForm.industry_id || null,
      };
      const res = await fetch(`${API_BASE}/match_internships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMatches(data.matches || []);
      showNotification(`Found ${data.total_matches} matches!`);
    } catch (err) {
      showNotification("Failed to find matches", "error");
    }
    setLoading(false);
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });
      showNotification("Feedback submitted successfully!");
      fetchFeedback();
      fetchStats();
      setFeedbackForm({
        candidate_id: "",
        industry_id: "",
        placement_successful: true,
        rating: 5,
        feedback_text: "",
      });
    } catch (err) {
      showNotification("Failed to submit feedback", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white animate-in slide-in-from-top-5`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <Zap className="w-10 h-10" />
                  PM Internship Scheme
                </h1>
                <p className="text-white/80 text-lg">
                  AI-Powered Matching with Machine Learning
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                  <div className="text-2xl font-bold">
                    {stats?.candidates?.total || 0}
                  </div>
                  <div className="text-xs text-white/70">Candidates</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                  <div className="text-2xl font-bold">
                    {stats?.industries?.total || 0}
                  </div>
                  <div className="text-xs text-white/70">Industries</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="mb-8">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-2 flex flex-wrap gap-2 border border-gray-700">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "candidate", label: "Register Candidate", icon: Users },
              { id: "industry", label: "Register Industry", icon: Briefcase },
              { id: "matching", label: "Find Matches", icon: Target },
              { id: "clustering", label: "Clustering", icon: Network },
              { id: "feedback", label: "Feedback", icon: MessageSquare },
              { id: "ml-info", label: "ML Info", icon: Info },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveView(id);
                  if (id === "matching") {
                    fetchCandidates();
                    fetchIndustries();
                  }
                  if (id === "feedback") {
                    fetchCandidates();
                    fetchIndustries();
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeView === id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main>
          {activeView === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                  <Users className="w-8 h-8 mb-4" />
                  <div className="text-4xl font-bold mb-2">
                    {stats?.candidates?.total || 0}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    Total Candidates
                  </div>
                  <div className="text-sm opacity-90">Registered users</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                  <Briefcase className="w-8 h-8 mb-4" />
                  <div className="text-4xl font-bold mb-2">
                    {stats?.industries?.total || 0}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    Active Industries
                  </div>
                  <div className="text-sm opacity-90">Partner companies</div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                  <Brain className="w-8 h-8 mb-4" />
                  <div className="text-4xl font-bold mb-2">
                    {stats?.ml_models_active || 3}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    ML Models Active
                  </div>
                  <div className="text-sm opacity-90">AI algorithms</div>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                  <MessageSquare className="w-8 h-8 mb-4" />
                  <div className="text-4xl font-bold mb-2">
                    {stats?.feedback?.total_received || 0}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    Feedback Received
                  </div>
                  <div className="text-sm opacity-90">User responses</div>
                </div>
              </div>

              {stats?.candidates?.by_category && (
                <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <PieChart className="w-6 h-6 text-indigo-400" />
                    Candidate Distribution by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.candidates.by_category).map(
                      ([cat, count]) => (
                        <div
                          key={cat}
                          className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-indigo-500 transition-all"
                        >
                          <div className="text-3xl font-bold text-white">
                            {count}
                          </div>
                          <div className="text-sm font-medium text-gray-300 mt-1">
                            {cat}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {mlInfo && (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Brain className="w-7 h-7" />
                    Machine Learning Models
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(mlInfo.ml_models).map(([key, model]) => (
                      <div
                        key={key}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                      >
                        <h4 className="text-lg font-bold mb-2 capitalize">
                          {key.replace("_", " ")}
                        </h4>
                        <p className="text-sm text-white/80 mb-2">
                          {model.purpose}
                        </p>
                        <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {model.status || model.trained
                            ? "Active"
                            : "Inactive"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "candidate" && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-400" />
                Register New Candidate
              </h2>
              <form onSubmit={registerCandidate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={candidateForm.name}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        name: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={candidateForm.email}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        email: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Phone Number"
                    name="phone"
                    value={candidateForm.phone}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        phone: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Current Location"
                    name="current_location"
                    value={candidateForm.current_location}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        current_location: e.target.value,
                      })
                    }
                  />
                </div>

                <MultiSelect
                  label="Skills"
                  options={SKILLS_OPTIONS}
                  selected={candidateForm.skills}
                  onChange={(v) =>
                    setCandidateForm({ ...candidateForm, skills: v })
                  }
                />
                <MultiSelect
                  label="Qualifications"
                  options={QUALIFICATION_OPTIONS}
                  selected={candidateForm.qualifications}
                  onChange={(v) =>
                    setCandidateForm({ ...candidateForm, qualifications: v })
                  }
                />
                <MultiSelect
                  label="Location Preferences"
                  options={LOCATION_OPTIONS}
                  selected={candidateForm.location_preference}
                  onChange={(v) =>
                    setCandidateForm({
                      ...candidateForm,
                      location_preference: v,
                    })
                  }
                />
                <MultiSelect
                  label="Preferred Sectors"
                  options={SECTOR_OPTIONS}
                  selected={candidateForm.preferred_sectors}
                  onChange={(v) =>
                    setCandidateForm({ ...candidateForm, preferred_sectors: v })
                  }
                />
                <MultiSelect
                  label="Languages"
                  options={LANGUAGE_OPTIONS}
                  selected={candidateForm.languages}
                  onChange={(v) =>
                    setCandidateForm({ ...candidateForm, languages: v })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectField
                    label="Social Category"
                    name="category"
                    value={candidateForm.category}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        category: e.target.value,
                      })
                    }
                    options={["General", "OBC", "SC", "ST"]}
                  />
                  <SelectField
                    label="District Type"
                    name="district_type"
                    value={candidateForm.district_type}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        district_type: e.target.value,
                      })
                    }
                    options={["Urban", "Rural", "Aspirational"]}
                  />
                  <InputField
                    label="Experience (Months)"
                    name="experience_months"
                    type="number"
                    value={candidateForm.experience_months}
                    onChange={(e) =>
                      setCandidateForm({
                        ...candidateForm,
                        experience_months: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Participated in past schemes?
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="past_participation"
                        checked={candidateForm.past_participation === true}
                        onChange={() =>
                          setCandidateForm({
                            ...candidateForm,
                            past_participation: true,
                          })
                        }
                        className="h-4 w-4 text-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-300">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="past_participation"
                        checked={candidateForm.past_participation === false}
                        onChange={() =>
                          setCandidateForm({
                            ...candidateForm,
                            past_participation: false,
                          })
                        }
                        className="h-4 w-4 text-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-300">No</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {loading ? "Registering..." : "Register Candidate"}
                </button>
              </form>
            </div>
          )}

          {activeView === "industry" && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-purple-400" />
                Register New Industry Partner
              </h2>
              <form onSubmit={registerIndustry} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Company Name"
                    name="company_name"
                    value={industryForm.company_name}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        company_name: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Internship Title"
                    name="internship_title"
                    value={industryForm.internship_title}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        internship_title: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Contact Email"
                    name="contact_email"
                    type="email"
                    value={industryForm.contact_email}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        contact_email: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="Contact Phone"
                    name="contact_phone"
                    value={industryForm.contact_phone}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        contact_phone: e.target.value,
                      })
                    }
                  />
                  <SelectField
                    label="Location"
                    name="location"
                    value={industryForm.location}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        location: e.target.value,
                      })
                    }
                    options={LOCATION_OPTIONS}
                  />
                  <SelectField
                    label="Sector"
                    name="sector"
                    value={industryForm.sector}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        sector: e.target.value,
                      })
                    }
                    options={SECTOR_OPTIONS}
                  />
                  <InputField
                    label="Internship Capacity"
                    name="internship_capacity"
                    type="number"
                    value={industryForm.internship_capacity}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        internship_capacity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <InputField
                    label="Duration (Months)"
                    name="duration_months"
                    type="number"
                    value={industryForm.duration_months}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        duration_months: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                </div>

                <InputField
                  label="Stipend Range (e.g., ₹15k - ₹25k)"
                  name="stipend_range"
                  value={industryForm.stipend_range}
                  onChange={(e) =>
                    setIndustryForm({
                      ...industryForm,
                      stipend_range: e.target.value,
                    })
                  }
                />

                <MultiSelect
                  label="Required Skills"
                  options={SKILLS_OPTIONS}
                  selected={industryForm.required_skills}
                  onChange={(v) =>
                    setIndustryForm({ ...industryForm, required_skills: v })
                  }
                />
                <MultiSelect
                  label="Preferred Qualifications"
                  options={QUALIFICATION_OPTIONS}
                  selected={industryForm.preferred_qualifications}
                  onChange={(v) =>
                    setIndustryForm({
                      ...industryForm,
                      preferred_qualifications: v,
                    })
                  }
                />

                <div>
                  <label
                    htmlFor="internship_description"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Internship Description
                  </label>
                  <textarea
                    name="internship_description"
                    id="internship_description"
                    rows={4}
                    value={industryForm.internship_description}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        internship_description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferred_candidate_profile"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Preferred Candidate Profile
                  </label>
                  <textarea
                    name="preferred_candidate_profile"
                    id="preferred_candidate_profile"
                    rows={3}
                    value={industryForm.preferred_candidate_profile}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        preferred_candidate_profile: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="remote_allowed"
                    name="remote_allowed"
                    type="checkbox"
                    checked={industryForm.remote_allowed}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        remote_allowed: e.target.checked,
                      })
                    }
                    className="h-5 w-5 text-indigo-500 rounded"
                  />
                  <label
                    htmlFor="remote_allowed"
                    className="text-sm font-medium text-gray-300"
                  >
                    Remote work allowed
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {loading ? "Registering..." : "Register Industry"}
                </button>
              </form>
            </div>
          )}

          {activeView === "matching" && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-green-400" />
                Find Internship Matches
              </h2>
              <form onSubmit={findMatches} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Candidate (optional)
                    </label>
                    <select
                      value={matchForm.candidate_id}
                      onChange={(e) =>
                        setMatchForm({
                          ...matchForm,
                          candidate_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    >
                      <option value="">All Candidates</option>
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Industry (optional)
                    </label>
                    <select
                      value={matchForm.industry_id}
                      onChange={(e) =>
                        setMatchForm({
                          ...matchForm,
                          industry_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    >
                      <option value="">All Industries</option>
                      {industries.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.company_name} - {i.internship_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Top N Matches
                    </label>
                    <input
                      type="number"
                      value={matchForm.top_n}
                      onChange={(e) =>
                        setMatchForm({
                          ...matchForm,
                          top_n: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Min Score Threshold
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={matchForm.min_score_threshold}
                      onChange={(e) =>
                        setMatchForm({
                          ...matchForm,
                          min_score_threshold: parseFloat(e.target.value),
                        })
                      }
                      min="0"
                      max="1"
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="use_ml_prediction"
                    checked={matchForm.use_ml_prediction}
                    onChange={(e) =>
                      setMatchForm({
                        ...matchForm,
                        use_ml_prediction: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-green-500 rounded"
                  />
                  <label
                    htmlFor="use_ml_prediction"
                    className="text-gray-300 font-medium"
                  >
                    Use ML Prediction
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {loading ? "Finding Matches..." : "Find Matches"}
                </button>
              </form>

              {matches.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    Match Results ({matches.length})
                  </h3>
                  <div className="grid gap-4">
                    {matches.map((match, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-green-500 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-white">
                              {match.candidate_name}
                            </h4>
                            <p className="text-gray-300">
                              {match.company_name} - {match.internship_title}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-400">
                              {(match.match_score.overall_score * 100).toFixed(
                                1
                              )}
                              %
                            </div>
                            <div className="text-sm text-gray-400">
                              Match Score
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">Skills</div>
                            <div className="text-lg font-bold text-blue-400">
                              {(match.match_score.skills_score * 100).toFixed(
                                0
                              )}
                              %
                            </div>
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">
                              Location
                            </div>
                            <div className="text-lg font-bold text-purple-400">
                              {(match.match_score.location_score * 100).toFixed(
                                0
                              )}
                              %
                            </div>
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">
                              Qualification
                            </div>
                            <div className="text-lg font-bold text-green-400">
                              {(
                                match.match_score.qualification_score * 100
                              ).toFixed(0)}
                              %
                            </div>
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">Sector</div>
                            <div className="text-lg font-bold text-orange-400">
                              {(match.match_score.sector_score * 100).toFixed(
                                0
                              )}
                              %
                            </div>
                          </div>
                        </div>
                        {match.match_score.ml_linear_prediction && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <div className="text-sm font-medium text-gray-300 mb-2">
                              ML Predictions:
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="text-blue-400">
                                Linear:{" "}
                                {(
                                  match.match_score.ml_linear_prediction * 100
                                ).toFixed(1)}
                                %
                              </span>
                              <span className="text-purple-400">
                                Logistic:{" "}
                                {(
                                  match.match_score.ml_logistic_probability *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                              <span
                                className={`font-semibold ${
                                  match.match_score.ml_logistic_class ===
                                  "Good Match"
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {match.match_score.ml_logistic_class ===
                                "Good Match"
                                  ? "✓ Good Match"
                                  : "✗ Poor Match"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "clustering" && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Network className="w-8 h-8 text-indigo-400" />
                Candidate Clustering Analysis
              </h2>
              <p className="text-gray-300 mb-6">
                Use K-Means clustering to group candidates based on their
                skills, qualifications, and preferences.
              </p>
              <button
                onClick={fetchClusters}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mb-8"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Network className="w-5 h-5" />
                )}
                {loading ? "Analyzing..." : "Run Clustering Analysis"}
              </button>

              {clusters && (
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Clustering Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-3xl font-bold text-indigo-400">
                          {clusters.n_clusters}
                        </div>
                        <div className="text-sm text-gray-400">
                          Clusters Found
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-indigo-400">
                          {clusters.total_candidates}
                        </div>
                        <div className="text-sm text-gray-400">
                          Total Candidates
                        </div>
                      </div>
                    </div>
                  </div>

                  {clusters.clusters && (
                    <div className="grid gap-4">
                      {Object.entries(clusters.clusters).map(
                        ([clusterId, clusterData]) => (
                          <div
                            key={clusterId}
                            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-indigo-500 transition-all"
                          >
                            <h4 className="text-xl font-bold text-white mb-4">
                              {clusterId}
                            </h4>
                            <div className="space-y-2">
                              {clusterData.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="text-gray-300 text-sm"
                                >
                                  • {item.name} (ID:{" "}
                                  {item.candidate_id.substring(0, 8)}...)
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeView === "feedback" && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-orange-400" />
                Submit Feedback
              </h2>
              <form onSubmit={submitFeedback} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Candidate *
                    </label>
                    <select
                      required
                      value={feedbackForm.candidate_id}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          candidate_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    >
                      <option value="">Select Candidate</option>
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Industry *
                    </label>
                    <select
                      required
                      value={feedbackForm.industry_id}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          industry_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    >
                      <option value="">Select Industry</option>
                      {industries.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.company_name} - {i.internship_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Placement Status *
                    </label>
                    <select
                      value={feedbackForm.placement_successful}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          placement_successful: e.target.value === "true",
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    >
                      <option value="true">✅ Successful</option>
                      <option value="false">❌ Unsuccessful</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={feedbackForm.rating}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          rating: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Feedback Text
                  </label>
                  <textarea
                    value={feedbackForm.feedback_text}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        feedback_text: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    rows="4"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>

              {feedback.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    Recent Feedback ({feedback.length})
                  </h3>
                  <div className="grid gap-4">
                    {feedback.slice(0, 5).map((fb, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-700 rounded-xl p-4 border border-gray-600"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-300">
                              {fb.placement_successful
                                ? "✅ Successful"
                                : "❌ Unsuccessful"}
                            </p>
                            {fb.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-400">
                                  {"⭐".repeat(Math.floor(fb.rating))}
                                </span>
                                <span className="ml-2 text-sm text-gray-400">
                                  {fb.rating}/5
                                </span>
                              </div>
                            )}
                            {fb.feedback_text && (
                              <p className="text-sm text-gray-300 mt-2">
                                {fb.feedback_text}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(fb.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "ml-info" && mlInfo && (
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Info className="w-8 h-8 text-blue-400" />
                Machine Learning Models
              </h2>
              <div className="space-y-6">
                {Object.entries(mlInfo.ml_models).map(([key, model]) => (
                  <div key={key} className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="text-lg font-bold text-white mb-2 capitalize">
                      {key.replace(/_/g, " ")}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      {model.purpose}
                    </p>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      {model.features && (
                        <>
                          <p className="text-xs text-gray-400 font-semibold mb-1">
                            Features Used:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {model.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                      {model.algorithm && (
                        <p className="text-xs text-gray-400 mt-2">
                          Algorithm: {model.algorithm}
                        </p>
                      )}
                      {model.n_clusters && (
                        <p className="text-xs text-gray-400 mt-2">
                          Clusters: {model.n_clusters}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {model.status || model.trained
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
