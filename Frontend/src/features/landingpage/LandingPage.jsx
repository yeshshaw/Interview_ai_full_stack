import { useState } from "react";
import "./LandingPage.scss";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";

// ── Modal Component ────────────────────────────────────────
// function Modal({ type, onClose, onSwitch }) {
//   const isLogin = type === "login";
//   const isRegister = type === "register";

//   return (
//     <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
//       <div className="modal">
//         <button className="modal__close" onClick={onClose}>✕</button>

//         <div className="modal__icon">
//           {isLogin ? "🔐" : isRegister ? "✨" : "🚀"}
//         </div>

//         {isLogin && (
//           <>
//             <h2>Welcome back</h2>
//             <p>Sign in to continue your interview prep journey.</p>
//             <div className="modal__form">
//               <div className="modal__field">
//                 <label>Email</label>
//                 <input type="email" placeholder="you@example.com" />
//               </div>
//               <div className="modal__field">
//                 <label>Password</label>
//                 <input type="password" placeholder="••••••••" />
//               </div>
//               <button className="btn btn--primary btn--lg modal__submit">Sign In →</button>
//             </div>
//             <div className="modal__footer">
//               Don't have an account?{" "}
//               <button onClick={() => onSwitch("register")}>Register free</button>
//             </div>
//           </>
//         )}

//         {isRegister && (
//           <>
//             <h2>Get started free</h2>
//             <p>Create your account and build your first interview plan today.</p>
//             <div className="modal__form">
//               <div className="modal__field">
//                 <label>Full Name</label>
//                 <input type="text" placeholder="Jane Smith" />
//               </div>
//               <div className="modal__field">
//                 <label>Email</label>
//                 <input type="email" placeholder="you@example.com" />
//               </div>
//               <div className="modal__field">
//                 <label>Password</label>
//                 <input type="password" placeholder="Create a strong password" />
//               </div>
//               <button className="btn btn--cta modal__submit">Create Account →</button>
//             </div>
//             <div className="modal__footer">
//               Already have an account?{" "}
//               <button onClick={() => onSwitch("login")}>Sign in</button>
//             </div>
//           </>
//         )}

//         {type === "try" && (
//           <>
//             <h2>Try it free</h2>
//             <p>No credit card needed. Generate a custom plan in under 60 seconds.</p>
//             <div className="modal__form">
//               <div className="modal__field">
//                 <label>Target Role</label>
//                 <input type="text" placeholder="e.g. Senior Frontend Engineer" />
//               </div>
//               <div className="modal__field">
//                 <label>Experience Level</label>
//                 <input type="text" placeholder="e.g. 3 years" />
//               </div>
//               <div className="modal__field">
//                 <label>Company (optional)</label>
//                 <input type="text" placeholder="e.g. Google, Meta…" />
//               </div>
//               <button className="btn btn--try modal__submit">Generate My Plan 🎯</button>
//             </div>
//             <div className="modal__footer">
//               Want full access?{" "}
//               <button onClick={() => onSwitch("register")}>Register free</button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// ── 3D Interview Card ──────────────────────────────────────
function InterviewCard() {
  const steps = [
    { text: "Analyze target role & JD", done: true },
    { text: "Build question bank (50+ Qs)", done: true },
    { text: "Schedule mock sessions", active: true },
    { text: "AI feedback & scoring", done: false },
  ];

  return (
    <div className="interview-card-3d">
      {/* Floating mini-cards */}
      <div className="mini-card mini-card--a">
        <span className="icon">🧠</span> AI-powered analysis
      </div>
      <div className="mini-card mini-card--b">
        <span className="icon">✅</span> Plan ready in 60s
      </div>

      <div className="card-wrapper">
        <div className="card">
          <div className="card__header">
            <span className="title">Interview Plan</span>
            <span className="badge">Active</span>
          </div>

          <div className="card__role">
            <div className="icon">👨‍💻</div>
            <div className="info">
              <div className="name">Senior Frontend Engineer</div>
              <div className="sub">Google · L5 · 4 weeks plan</div>
            </div>
          </div>

          <div className="card__steps">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`card__step${s.active ? " card__step--active" : ""}`}
              >
                <div className="num">{i + 1}</div>
                <span className="step-text">{s.text}</span>
                {s.done && <span className="check">✓</span>}
                {s.active && <span className="check" style={{ color: "#f97316" }}>◉</span>}
              </div>
            ))}
          </div>

          <div className="card__progress">
            <div className="label">
              <span>Progress</span>
              <span>67%</span>
            </div>
            <div className="bar">
              <div className="fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature Cards Data ─────────────────────────────────────
const FEATURES = [
  {
    icon: "🎯",
    iconBg: "linear-gradient(135deg,#00e5ff22,#00e5ff44)",
    iconColor: "#00e5ff",
    title: "Tailored Question Bank",
    desc: "AI curates 50+ role-specific questions from real interview experiences at top companies like FAANG, startups & more.",
  },
  {
    icon: "🗓️",
    iconBg: "linear-gradient(135deg,#7c3aed22,#7c3aed44)",
    iconColor: "#a78bfa",
    title: "Smart Schedule Builder",
    desc: "Auto-generate a daily/weekly prep calendar based on your timeline, availability and weak areas.",
  },
  {
    icon: "🤖",
    iconBg: "linear-gradient(135deg,#f9731622,#f9731644)",
    iconColor: "#f97316",
    title: "AI Mock Interviews",
    desc: "Practice with an AI interviewer that adapts difficulty in real time and gives instant, actionable feedback.",
  },
  {
    icon: "📊",
    iconBg: "linear-gradient(135deg,#10b98122,#10b98144)",
    iconColor: "#10b981",
    title: "Performance Analytics",
    desc: "Track scores, improvement trends and confidence levels across topics with a beautiful live dashboard.",
  },
  {
    icon: "🏢",
    iconBg: "linear-gradient(135deg,#ec489922,#ec489944)",
    iconColor: "#ec4899",
    title: "Company-Specific Prep",
    desc: "Deep-dive modules for Google, Meta, Amazon, Microsoft, Stripe and 100+ companies with insider tips.",
  },
  {
    icon: "🌐",
    iconBg: "linear-gradient(135deg,#06b6d422,#06b6d444)",
    iconColor: "#06b6d4",
    title: "Community & Mentors",
    desc: "Connect with 50k+ engineers, share plans, and book 1:1 sessions with ex-FAANG mentors for expert guidance.",
  },
];

// ── Main Landing Page ──────────────────────────────────────
export default function LandingPage() { 

  const {loading , handleLogout , user} = useAuth() ;
const navigate = useNavigate() ;
  async function handleClick() {
    await handleLogout() ;
  }
  if (loading) {
    return(
      <main>
        <h1>Loading......</h1>
      </main>
    )
  }

  // const [modal, setModal] = useState(null); // null | 'login' | 'register' | 'try'

  return (
    <div className="landing">
      {/* Background */}
      <div className="landing__bg">
        <div className="dots" />
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar__logo">
          <div className="logo-icon">⚡</div>
          Inter<span>Prep</span>
        </div>

        <ul className="navbar__links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#blog">Blog</a></li>
        </ul>

        <div className="navbar__actions">

  {
    user ? (
      <button
        className="btn btn--ghost"
        onClick={handleClick}
      >
        Logout
      </button>
    ) : (
      <>
        <button
          className="btn btn--ghost"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>

        <button
          className="btn btn--outline"
          onClick={() => navigate("/register")}
        >
          Register Free
        </button>
      </>
    )
  }

</div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="dot" />
              AI-Powered Interview Coaching
            </div>

            <h1 className="hero__title">
              Create Your Custom<br />
              <span className="highlight">Interview Plan</span><br />
              in 60 Seconds
            </h1>

            <p className="hero__sub">
              Stop guessing what to study. Our AI analyzes your target role,
              company, and timeline — then builds a personalized prep roadmap
              that actually gets you the offer.
            </p>

            <div className="hero__actions">
              <button className="btn btn--try btn--lg" onClick={() => navigate("/build")}>
                🚀 Try It Free
              </button>
              <button
  className="btn btn--cta btn--lg"
  onClick={() => {

    if (user) {
      navigate("/build");
    } else {
      navigate("/login", {
        state: {
          from: {
            pathname: "/build",
          },
        },
      });
    }

  }}
>
  ✨ Get Started
</button>
              <button className="btn btn--ghost btn--lg" onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <div className="num">48k+</div>
                <div className="label">Engineers placed</div>
              </div>
              <div className="hero__stat">
                <div className="num">94%</div>
                <div className="label">Offer success rate</div>
              </div>
              <div className="hero__stat">
                <div className="num">200+</div>
                <div className="label">Companies covered</div>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <InterviewCard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="features__header">
          <div className="features__eyebrow">Everything you need</div>
          <h2 className="features__title">
            The smartest way to<br />prepare for any interview
          </h2>
          <p className="features__sub">
            From question banks to AI mock interviews — every tool you need to
            land your dream role is in one place.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div
                className="feature-card__icon"
                style={{ background: f.iconBg, boxShadow: `0 4px 20px ${f.iconColor}44` }}
              >
                {f.icon}
              </div>
              <div className="feature-card__title">{f.title}</div>
              <div className="feature-card__desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-section__inner">
          <div className="cta-section__eyebrow">Limited time — free plan available</div>
          <h2 className="cta-section__title">
            Ready to ace your<br />next interview?
          </h2>
          <p className="cta-section__sub">
            Join 48,000+ engineers who used InterPrep to land offers at Google,
            Meta, Amazon and more. Start for free — no credit card required.
          </p>
          <div className="cta-section__actions">
            <button className="btn btn--try btn--lg" onClick={() => navigate("/build")}>
              🚀 Try Free Now
            </button>
            <button className="btn btn--cta btn--lg" onClick={() => navigate("/register")}>
              ✨ Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>© 2025 InterPrep. All rights reserved.</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>

      {/* Modal */}
      {/* {modal && (
        <Modal
          type={modal}
          onClose={() => setModal(null)}
          onSwitch={(t) => setModal(t)}
        />
      )} */}
    </div>
  );
}
