import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, ArrowDownRight, ArrowRight, Check, CircleHelp, Cpu, Pause, Play, RotateCcw, StepForward, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { evaluateGate, type GateType } from "@/lib/logic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LogicVerse | Interactive Boolean Logic Lab" },
      {
        name: "description",
        content:
          "Explore Boolean logic with a live circuit simulator, truth tables, and step-by-step Python logic.",
      },
      { property: "og:title", content: "LogicVerse | Interactive Boolean Logic Lab" },
      {
        property: "og:description",
        content: "A hands-on lab for exploring Boolean logic, gates, and binary signals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const gates: GateType[] = ["AND", "OR", "NOT", "XOR"];
const gateExpressions: Record<GateType, string> = {
  AND: "A and B",
  OR: "A or B",
  NOT: "not A",
  XOR: "A != B",
};
const speedOptions = [
  { label: "Slow", interval: 1500 },
  { label: "Normal", interval: 850 },
  { label: "Fast", interval: 380 },
];
const quizOptions = [
  { label: "A = 1, B = 0", a: true, b: false },
  { label: "A = 0, B = 0", a: false, b: false },
  { label: "A = 1, B = 1", a: true, b: true },
];

function Index() {
  const [gate, setGate] = useState<GateType>("AND");
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const output = evaluateGate(gate, inputA, inputB);
  const stepCount = gate === "NOT" ? 3 : 4;
  const speed = speedOptions[speedIndex] ?? speedOptions[1];
  const codeLines =
    gate === "NOT"
      ? [`A = ${inputA ? "True" : "False"}`, `result = ${gateExpressions[gate]}`, "print(int(result))"]
      : [
          `A = ${inputA ? "True" : "False"}`,
          `B = ${inputB ? "True" : "False"}`,
          `result = ${gateExpressions[gate]}`,
          "print(int(result))",
        ];
  const truthRows =
    gate === "NOT"
      ? [
          { a: false, b: null },
          { a: true, b: null },
        ]
      : [
          { a: false, b: false },
          { a: false, b: true },
          { a: true, b: false },
          { a: true, b: true },
        ];
  const selectedQuizOption = quizAnswer === null ? undefined : quizOptions[quizAnswer];
  const quizIsCorrect = selectedQuizOption
    ? evaluateGate("XOR", selectedQuizOption.a, selectedQuizOption.b)
    : false;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % stepCount);
    }, speed?.interval ?? 850);

    return () => window.clearInterval(timer);
  }, [isPlaying, speed?.interval, stepCount]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const updateGate = (nextGate: GateType) => {
    setGate(nextGate);
    setActiveStep(0);
    setIsPlaying(false);
  };

  const updateInputA = (value: boolean) => {
    setInputA(value);
    setActiveStep(0);
    setIsPlaying(false);
  };

  const updateInputB = (value: boolean) => {
    setInputB(value);
    setActiveStep(0);
    setIsPlaying(false);
  };

  const resetSimulation = () => {
    setGate("AND");
    setInputA(false);
    setInputB(false);
    setActiveStep(0);
    setIsPlaying(false);
    setQuizAnswer(null);
  };

  const moveCursorGlow = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY}px`);
  };

  return (
    <div className="logic-site" onPointerMove={moveCursorGlow}>
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="LogicVerse home">
          <span className="brand-mark" aria-hidden="true">
            <Cpu size={17} strokeWidth={1.8} />
          </span>
          <span>Logic<span className="brand-accent">Verse</span></span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="#concept">The basics</a>
          <a href="#lab">Simulator</a>
          <a href="#truth-table">Truth table</a>
        </nav>
        <a className="session-pill" href="#lab">
          <span className="status-dot" />
          <span>LAB SESSION <b>01</b></span>
          <ArrowDownRight size={14} aria-hidden="true" />
        </a>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE INTERACTIVE BOOLEAN LAB</div>
            <h1>Make logic<br /><span>visible.</span></h1>
            <p className="hero-intro">
              Flip a bit. Trace a signal. See how a single decision becomes the language of every computer.
            </p>
            <div className="hero-actions">
              <a className="hero-cta" href="#lab">Enter the lab <ArrowRight size={16} /></a>
              <a className="hero-secondary" href="#concept">Start with the basics <ArrowDownRight size={15} /></a>
            </div>
            <div className="hero-microcopy"><Activity size={14} /> FOUR GATES. TWO INPUTS. ENDLESS POSSIBILITIES.</div>
          </div>

          <div className="hero-instrument" aria-label="Live Boolean signal preview">
            <div className="instrument-topline">
              <span><span className="instrument-live-dot" /> SIGNAL PREVIEW</span>
              <span>LV / 001</span>
            </div>
            <div className="instrument-title">A decision in <span>one bit.</span></div>
            <div className="binary-preview">
              <div className="binary-state binary-on"><span className="binary-digit">1</span><div><strong>TRUE</strong><small>signal present</small></div><span className="binary-wave" /></div>
              <div className="binary-state"><span className="binary-digit">0</span><div><strong>FALSE</strong><small>signal absent</small></div><span className="binary-flat" /></div>
            </div>
            <div className="instrument-footer"><span>BOOLEAN STATE</span><span>01 <i>/</i> 02</span></div>
          </div>
          <div className="hero-side-note" aria-hidden="true">BOOLEAN<br />SYSTEMS<br /><span>EST. 1938</span></div>
        </section>

        <section id="concept" className="concept-section" data-reveal>
          <div className="concept-heading">
            <span className="section-index">00 / THE LANGUAGE</span>
            <h2>At the heart of it,<br /><span>everything is a choice.</span></h2>
          </div>
          <div className="concept-copy">
            <p>Boolean logic is a system built on two states: true or false. Computers translate those states into the simplest possible signals.</p>
            <div className="concept-translation">
              <span className="translation-word">TRUE</span><span className="translation-arrow">→</span><span className="translation-bit">1</span>
              <span className="translation-divider" />
              <span className="translation-word">FALSE</span><span className="translation-arrow">→</span><span className="translation-bit translation-off">0</span>
            </div>
          </div>
        </section>

        <section id="lab" className="lab-section" data-reveal>
          <div className="section-heading-row">
            <div>
              <span className="section-index">01 / CIRCUIT BUILDER</span>
              <h2>Build a circuit<span className="heading-period">.</span></h2>
            </div>
            <div className="live-state"><span className="status-dot" /> LIVE SIMULATION <span className="live-state-divider">/</span> <span>{gate}</span></div>
          </div>

          <div className="gate-toolbar">
            <div className="toolbar-label"><span className="toolbar-number">A</span><span>Choose a gate</span></div>
            <div className="gate-selector" role="group" aria-label="Choose logic gate">
              {gates.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="ghost"
                  className={`gate-choice ${gate === option ? "is-selected" : ""}`}
                  aria-pressed={gate === option}
                  onClick={() => updateGate(option)}
                >
                  <span className="gate-choice-symbol" aria-hidden="true">{option === "NOT" ? "¬" : option === "XOR" ? "⊕" : option === "AND" ? "∧" : "∨"}</span>
                  {option}
                </Button>
              ))}
            </div>
            <Button type="button" variant="ghost" className="reset-button" onClick={resetSimulation} aria-label="Reset simulator">
              <RotateCcw size={15} /> <span>Reset</span>
            </Button>
          </div>

          <div className="simulator-grid">
            <section className="circuit-panel" aria-label="Live circuit diagram">
              <div className="panel-heading">
                <div><span className="panel-kicker">LIVE CIRCUIT</span><strong>{gate} GATE <span className="panel-heading-dot">/</span> OUTPUT <span className="panel-output-number">{Number(output)}</span></strong></div>
                <span className="diagram-chip"><Zap size={13} /> SIGNAL FLOW</span>
              </div>
              <CircuitDiagram gate={gate} inputA={inputA} inputB={inputB} output={output} />
              <div className="circuit-legend"><span><i className="legend-line legend-active" /> ACTIVE SIGNAL</span><span><i className="legend-line" /> IDLE</span><span className="legend-note">{gate === "NOT" ? "BYPASS · INPUT B UNUSED" : "CURRENT · A → GATE → OUTPUT"}</span></div>
            </section>

            <aside className="input-panel">
              <div className="panel-heading input-panel-heading">
                <div><span className="panel-kicker">INPUT CONTROLS</span><strong>Set your signals</strong></div>
                <span className="input-count">{gate === "NOT" ? "01" : "02"} <i>/</i> 02</span>
              </div>
              <div className="input-control">
                <div className={`input-icon ${inputA ? "input-icon-on" : ""}`}>A</div>
                <div className="input-description"><strong>Input A</strong><span>{inputA ? "HIGH · 1" : "LOW · 0"}</span></div>
                <Switch checked={inputA} onCheckedChange={updateInputA} aria-label="Toggle input A" />
              </div>
              <div className={`input-control ${gate === "NOT" ? "input-is-disabled" : ""}`}>
                <div className={`input-icon ${inputB && gate !== "NOT" ? "input-icon-on" : ""}`}>B</div>
                <div className="input-description"><strong>Input B</strong><span>{gate === "NOT" ? "NOT USED BY THIS GATE" : inputB ? "HIGH · 1" : "LOW · 0"}</span></div>
                <Switch checked={inputB} onCheckedChange={updateInputB} disabled={gate === "NOT"} aria-label="Toggle input B" />
              </div>
              <div className="input-footnote"><CircleHelp size={14} /><span>{gate === "NOT" ? "NOT flips the state of A." : "Flip either switch to change the output."}</span></div>
              <div className="output-readout">
                <div><span className="readout-label">GATE OUTPUT</span><span className="readout-word">{output ? "TRUE" : "FALSE"}</span></div>
                <span className={`output-value ${output ? "output-value-on" : ""}`}>{Number(output)}</span>
              </div>
            </aside>
          </div>
        </section>

        <section id="truth-table" className="truth-section" data-reveal>
          <div className="section-heading-row truth-heading-row">
            <div><span className="section-index">02 / EVERY POSSIBILITY</span><h2>Truth, in a table<span className="heading-period">.</span></h2></div>
            <div className="truth-caption"><span className="truth-live-mark" /> CURRENT GATE <strong>{gate}</strong></div>
          </div>
          <div className="truth-layout">
            <div className="truth-table-wrap">
              <table className="truth-table">
                <thead><tr><th scope="col">INPUT A</th><th scope="col">INPUT B</th><th scope="col" className="truth-output-heading">OUTPUT <span>{gate}</span></th></tr></thead>
                <tbody>
                  {truthRows.map((row, index) => {
                    const isCurrent = row.a === inputA && (gate === "NOT" || row.b === inputB);
                    return (
                      <tr key={`${Number(row.a)}-${row.b === null ? "x" : Number(row.b)}`} className={isCurrent ? "truth-row-current" : ""} aria-current={isCurrent ? "true" : undefined}>
                        <td><span className={`truth-bit ${row.a ? "truth-bit-on" : ""}`}>{Number(row.a)}</span></td>
                        <td><span className={`truth-bit ${row.b ? "truth-bit-on" : ""}`}>{row.b === null ? "—" : Number(row.b)}</span></td>
                        <td><span className={`truth-result ${evaluateGate(gate, row.a, row.b ?? false) ? "truth-result-on" : ""}`}>{Number(evaluateGate(gate, row.a, row.b ?? false))}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="truth-table-foot"><span><span className="truth-current-dot" /> HIGHLIGHTED ROW = YOUR CURRENT INPUTS</span><span>{truthRows.length} COMBINATIONS</span></div>
            </div>
            <aside className="truth-note">
              <span className="note-index">READ THE OUTPUT</span>
              <div className="truth-equation"><span>{gate === "NOT" ? "¬ A" : gate === "AND" ? "A ∧ B" : gate === "OR" ? "A ∨ B" : "A ⊕ B"}</span><ArrowRight size={16} /><strong>{Number(output)}</strong></div>
              <p>{gate === "AND" ? "AND needs both inputs at 1. One missing signal keeps the output at 0." : gate === "OR" ? "OR needs at least one input at 1. Only two missing signals make 0." : gate === "NOT" ? "NOT flips input A: 0 becomes 1, and 1 becomes 0." : "XOR lights up when the inputs disagree — one 1 and one 0."}</p>
              <div className="note-gate-label"><span className="status-dot" /> {gate} GATE ACTIVE</div>
            </aside>
          </div>
        </section>

        <section id="code" className="execution-section" data-reveal>
          <div className="section-heading-row">
            <div><span className="section-index">03 / STEP THROUGH THE LOGIC</span><h2>Follow every step<span className="heading-period">.</span></h2></div>
            <div className="execution-context"><span className="context-dot" /> PYTHON TRANSLATION <span className="live-state-divider">/</span> <span>{gate}</span></div>
          </div>
          <div className="execution-grid">
            <section className="code-panel" aria-label="Python code simulation">
              <div className="code-panel-top"><span><span className="terminal-mark">›_</span> boolean_logic.py</span><span className="python-tag">PYTHON 3</span></div>
              <div className="code-lines" aria-live="polite">
                {codeLines.map((line, index) => (
                  <div className={`code-line ${activeStep === index ? "code-line-active" : ""}`} key={`${gate}-${index}`} aria-current={activeStep === index ? "step" : undefined}>
                    <span className="line-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="line-caret">{activeStep === index ? "›" : " "}</span>
                    <code>{line}</code>
                  </div>
                ))}
              </div>
              <div className="code-controls">
                <Button type="button" variant="ghost" className="step-button step-button-next" onClick={() => { setIsPlaying(false); setActiveStep((current) => (current + 1) % stepCount); }}>
                  <StepForward size={15} /> Next step
                </Button>
                {isPlaying ? (
                  <Button type="button" variant="ghost" className="step-button" onClick={() => setIsPlaying(false)}><Pause size={14} /> Pause</Button>
                ) : (
                  <Button type="button" variant="ghost" className="step-button" onClick={() => setIsPlaying(true)}><Play size={14} /> Play</Button>
                )}
                <label className="speed-control"><span>SPEED</span><input type="range" min="0" max="2" step="1" value={speedIndex} aria-label="Simulation speed" onChange={(event) => setSpeedIndex(Number(event.target.value))} /><strong>{speed?.label ?? "Normal"}</strong></label>
              </div>
            </section>

            <aside className="execution-side">
              <section className={`result-panel ${output ? "result-panel-on" : ""}`} aria-live="polite">
                <div className="result-panel-header"><span className="panel-kicker">OUTPUT REGISTER</span><span className="result-lamp-label"><i className="result-lamp" /> {output ? "SIGNAL HIGH" : "SIGNAL LOW"}</span></div>
                <div className="result-display"><div className="result-bulb"><span className="bulb-core" /></div><div className="result-copy"><strong>{output ? "True" : "False"}</strong><span>Boolean result</span></div><span className="result-binary">{Number(output)}</span></div>
                <div className="result-equation">{inputA ? 1 : 0} {gate === "NOT" ? "→" : gate === "AND" ? "AND" : gate === "OR" ? "OR" : "XOR"} {gate === "NOT" ? "" : `${inputB ? 1 : 0} → `}<strong>{Number(output)}</strong></div>
              </section>

              <section className="quiz-panel">
                <div className="quiz-heading"><span className="quiz-icon"><CircleHelp size={15} /></span><div><span className="panel-kicker">QUICK CHECK</span><strong>Can you predict XOR?</strong></div><span className="quiz-score">01 <i>/</i> 01</span></div>
                <p>Which input pair makes the XOR output 1?</p>
                <div className="quiz-options">
                  {quizOptions.map((option, index) => {
                    const isChosen = quizAnswer === index;
                    const isCorrect = isChosen && evaluateGate("XOR", option.a, option.b);
                    return (
                      <Button key={option.label} type="button" variant="ghost" className={`quiz-option ${isChosen ? "quiz-option-chosen" : ""} ${isCorrect ? "quiz-option-correct" : ""}`} onClick={() => setQuizAnswer(index)} aria-pressed={isChosen}>
                        <span className="quiz-option-marker">{isCorrect ? <Check size={12} /> : String.fromCharCode(65 + index)}</span>{option.label}
                      </Button>
                    );
                  })}
                </div>
                <div className={`quiz-feedback ${quizAnswer === null ? "" : quizIsCorrect ? "quiz-feedback-correct" : "quiz-feedback-try"}`} aria-live="polite">
                  {quizAnswer === null ? "Choose an answer to check your logic." : quizIsCorrect ? "Exactly — XOR is 1 when the inputs differ." : "Not quite. XOR needs exactly one input at 1."}
                </div>
              </section>
            </aside>
          </div>
        </section>

        <section className="closing-section" data-reveal>
          <div className="closing-rule"><span /><span>LOGICVERSE / FIELD NOTES</span><span /></div>
          <div className="closing-copy"><span className="section-index">A SMALL SIGNAL. A BIG IDEA.</span><h2>Every system starts<br />with <span>one decision.</span></h2><a href="#top">Back to the beginning <ArrowRight size={15} /></a></div>
          <div className="closing-stamp" aria-hidden="true"><span>LOGIC<br />IS THE<br />LANGUAGE</span><Zap size={20} /></div>
        </section>
      </main>

      <footer className="site-footer"><a className="brand-lockup footer-brand" href="#top"><span className="brand-mark"><Cpu size={14} /></span><span>Logic<span className="brand-accent">Verse</span></span></a><span>AN INTERACTIVE BOOLEAN LOGIC LAB</span><a href="#lab">REOPEN SIMULATOR <ArrowRight size={12} /></a></footer>
    </div>
  );
}

function CircuitDiagram({ gate, inputA, inputB, output }: { gate: GateType; inputA: boolean; inputB: boolean; output: boolean }) {
  const inputPathA = gate === "NOT" ? "M 142 118 H 286 V 170 H 395" : "M 142 118 H 286 V 138 H 394";
  const inputPathB = gate === "NOT" ? "M 142 220 H 285" : "M 142 220 H 286 V 194 H 394";

  return (
    <div className={`circuit-stage ${output ? "circuit-stage-active" : ""}`}>
      <svg className="logic-circuit" viewBox="0 0 860 330" role="img" aria-label={`${gate} gate circuit. Input A is ${Number(inputA)}, input B is ${gate === "NOT" ? "unused" : Number(inputB)}, output is ${Number(output)}.`}>
        <path className="wire wire-a" d={inputPathA} />
        <path className={`wire wire-b ${gate === "NOT" ? "wire-unused" : ""}`} d={inputPathB} />
        <path className={`wire wire-output ${output ? "wire-live" : ""}`} d="M 508 170 H 750" />
        <circle className={`input-node ${inputA ? "input-node-live" : ""}`} cx="142" cy="118" r="7" />
        <circle className={`input-node ${inputB && gate !== "NOT" ? "input-node-live" : ""} ${gate === "NOT" ? "input-node-unused" : ""}`} cx="142" cy="220" r="7" />
        <text className="diagram-label" x="91" y="123">A <tspan>{Number(inputA)}</tspan></text>
        <text className={`diagram-label ${gate === "NOT" ? "diagram-label-muted" : ""}`} x="91" y="225">B <tspan>{gate === "NOT" ? "—" : Number(inputB)}</tspan></text>
        <g className={`diagram-gate ${output ? "diagram-gate-active" : ""}`}>
          {gate === "AND" && <path className="gate-shape" d="M 394 112 H 445 A 58 58 0 0 1 445 228 H 394 Z" />}
          {gate === "OR" && <path className="gate-shape" d="M 390 112 Q 428 112 476 170 Q 428 228 390 228 Q 420 170 390 112 Z" />}
          {gate === "XOR" && <><path className="gate-shape" d="M 390 112 Q 428 112 476 170 Q 428 228 390 228 Q 420 170 390 112 Z" /><path className="gate-extra" d="M 377 112 Q 407 170 377 228" /></>}
          {gate === "NOT" && <><path className="gate-shape" d="M 395 116 L 492 170 L 395 224 Z" /><circle className="gate-bubble" cx="502" cy="170" r="8" /></>}
          <text className="gate-diagram-label" x={gate === "NOT" ? "443" : "437"} y="175">{gate}</text>
        </g>
        <circle className={`output-node ${output ? "output-node-live" : ""}`} cx="750" cy="170" r="7" />
        <g className={`diagram-bulb ${output ? "diagram-bulb-on" : ""}`}>
          <circle className="bulb-halo" cx="790" cy="170" r="25" />
          <circle className="bulb-shape" cx="790" cy="170" r="16" />
          <path className="bulb-filament" d="M 784 170 L 788 174 L 792 166 L 796 170" />
        </g>
        <text className="diagram-output-label" x="770" y="220">OUTPUT <tspan>{Number(output)}</tspan></text>
      </svg>
    </div>
  );
}