import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hook/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { generateInterviewReport } from '../services/interview.api.js'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg width="16" height="16" />) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg width="16" height="16" />) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg width="16" height="16" />) },
]

// ── Question Card ──
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(!open)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
            </div>

            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Roadmap ──
const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>

        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </div>
)

// ── MAIN COMPONENT ──
const Interview = () => {

    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading , getAllReport , getResumePdf} = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
      else { getAllReport() }

    }, [interviewId])

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    // ── SAFE VALUES ──
    const rawScore = report?.matchScore || 0

    const displayScore =
        rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore)

    const scoreColor =
        displayScore >= 80 ? 'score--high' :
            displayScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── LEFT NAV ── */}
                <nav className='interview-nav'>
                    <div>
                        <p className='interview-nav__label'>Sections</p>

                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={()=>{getResumePdf(interviewId)}} className='button primary-button'>
                        <svg height={"1.2rem"} style={{marginRight :"0.6rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.7134 7.12811L4.46682 7.69379C4.28637 8.10792 3.71357 8.10792 3.53312 7.69379L3.28656 7.12811C2.84706 6.11947 2.05545 5.31641 1.06767 4.87708L0.308047 4.53922C-0.102682 4.35653 -0.102682 3.75881 0.308047 3.57612L1.0252 3.25714C2.03838 2.80651 2.84417 1.97373 3.27612 0.930828L3.52932 0.319534C3.70578 -0.106511 4.29417 -0.106511 4.47063 0.319534L4.72382 0.930828C5.15577 1.97373 5.96158 2.80651 6.9748 3.25714L7.69188 3.57612C8.10271 3.75881 8.10271 4.35653 7.69188 4.53922L6.93228 4.87708C5.94451 5.31641 5.15288 6.11947 4.7134 7.12811ZM3.06361 21.6132C4.08854 15.422 6.31105 1.99658 21 1.99658C19.5042 4.99658 18.5 6.49658 17.5 7.49658L16.5 8.49658L18 9.49658C17 12.4966 14 15.9966 10 16.4966C7.33146 16.8301 5.66421 18.6635 4.99824 21.9966H3C3.02074 21.8722 3.0419 21.7443 3.06361 21.6132Z"></path></svg>
                        Download resume </button>
                </nav>

                <div className='interview-divider' />

                {/* ── CENTER ── */}
                <main className='interview-content'>

                    {activeNav === 'technical' && (
                        <section>
                            <h2>Technical Questions</h2>
                            <div className='q-list'>
                                {report?.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <h2>Behavioral Questions</h2>
                            <div className='q-list'>
                                {report?.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <h2>Roadmap</h2>
                            <div className='roadmap-list'>
                                {report?.preparationPlan?.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                </main>

                <div className='interview-divider' />

                {/* ── RIGHT SIDEBAR (FIXED) ── */}
                <aside className='interview-sidebar'>

                    {/* MATCH SCORE */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>

                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>
                                {displayScore}
                            </span>
                            <span className='match-score__pct'>%</span>
                        </div>

                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* SKILL GAPS (SAFE) */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>

                        <div className='skill-gaps__list'>
                            {report?.skillGaps?.length > 0 ? (
                                report.skillGaps.map((gap, i) => (
                                    <span
                                        key={i}
                                        className={`skill-tag skill-tag--${gap.severity || 'low'}`}
                                    >
                                        {gap.skill}
                                    </span>
                                ))
                            ) : (
                                <p style={{ fontSize: "0.8rem", color: "#7d8590" }}>
                                    No skill gaps detected
                                </p>
                            )}
                        </div>
                    </div>

                </aside>

            </div>
        </div>
    )
}

export default Interview