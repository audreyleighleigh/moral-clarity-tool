import { useState } from "react";

const QUALITY_CHECK_FIELDS = ["structural_twin", "who_profits", "leverage", "agency"];
const VAGUE_TERMS = ["corporations", "the government", "government", "everyone", "vote", "society", "big tech", "the media", "companies", "people", "them", "politicians", "tech companies", "the system", "capitalism", "media", "they", "others"];

const STEPS = [
  {
    id: "concern", num: "01", chapter: "Scope",
    title: "What are you critiquing?",
    subtitle: "Be specific. A technology, a company, an industry, a practice. Vague concern is hard to act on.",
    type: "text", placeholder: "e.g. AI data centers' energy consumption"
  },
  {
    id: "structural_twin", num: "02", chapter: "Scope",
    title: "Name something structurally identical that gets less attention.",
    subtitle: "Same harm category, different visibility. If you can't name one, that's data. If you can but feel differently, that's worth sitting with.",
    type: "text", placeholder: "e.g. cobalt mining for EV batteries and laptops"
  },
  {
    id: "feeling_diff", num: "03", chapter: "Scope",
    title: "Do you feel the same way about both?",
    subtitle: "No judgment. Noticing the gap is the whole point.",
    type: "choice",
    options: [
      { value: "same", label: "Yes, my concern is consistent" },
      { value: "different", label: "No, I feel more strongly about the first" },
      { value: "unsure", label: "Honestly not sure" }
    ]
  },
  {
    id: "bias_flags", num: "04", chapter: "Bias Check",
    title: "Which of these might be shaping your concern?",
    subtitle: "Check everything that could apply. These are universal cognitive patterns, not accusations.",
    type: "multiselect",
    options: [
      {
        value: "identifiable_victim", label: "Identifiable victim effect",
        desc: "The harm feels more real because it has a face or story. We respond more to one named person than to 10,000 statistics.",
        extended: "The identifiable victim effect is one of the most robust findings in behavioral economics. Paul Slovic documented it as the collapse of compassion: we give more to save one named child than to save eight. The same pattern runs through moral outrage. A company harming someone with a name and face gets more attention than equivalent harm distributed across thousands of faceless workers. This isn't a failure of empathy. It's how empathy works.",
        example: "Sweatshop conditions for a specific brand go viral after one worker's story surfaces. Structurally identical conditions at competing brands, without the human face, go unexamined."
      },
      {
        value: "moral_licensing", label: "Moral licensing",
        desc: "Caring about this gives psychological permission to ignore something else. One acknowledged concern excuses inaction elsewhere.",
        extended: "Moral licensing shows up as a compensation effect: people who perform a virtuous act feel licensed to be less virtuous afterward. In the outrage context, posting about a cause can produce a feeling of having done something, even when the needle hasn't moved. The social signal replaces material action. It can also license ignoring structurally identical problems that haven't received the same cultural spotlight.",
        example: "Shared a thread about supply chain labor conditions. Felt good about it. Went back to purchasing from the same supply chain without further examination."
      },
      {
        value: "outrage_economy", label: "Outrage economy",
        desc: "Someone profits when you're activated: algorithmically, politically, financially. Your attention is their product.",
        extended: "The outrage economy operates at multiple levels simultaneously. Media outlets monetize engagement. Algorithms amplify high-engagement content. Political actors fundraise on enemy narratives. Advocacy organizations grow membership through fear. None of these actors necessarily want your problem solved. A solved problem ends the revenue stream. Understanding who benefits from your continued activation is basic media literacy.",
        example: "A publication running outrage content about Tech Company A has major advertisers in that company's competitor space. The editorial and financial incentives align."
      },
      {
        value: "purity_trap", label: "Purity trap",
        desc: "Holding out for a clean option that doesn't exist leads to inaction. Perfect becomes the enemy of better.",
        extended: "The purity trap is an unconscious optimization for personal innocence rather than actual impact. If no available option is clean enough to endorse, you can avoid all complicity but also all influence. Real change usually requires working within flawed systems. The people who moved the needle on labor standards, civil rights, and environmental regulation were often operating inside deeply compromised institutions. Clean hands and actual leverage rarely coexist.",
        example: "Refused to vote for either candidate because both were flawed. The candidate considered more harmful won by less than 1% while the abstainer remained uncomplicit."
      },
      {
        value: "proportionality", label: "Proportionality mismatch",
        desc: "Reaction intensity may map to visibility rather than actual scale of harm. These often diverge.",
        extended: "Proportionality mismatch is structural, not personal. The information environment systematically amplifies recent, dramatic, and legible harms over slow, distributed, and invisible ones. This calibration error happens to everyone who consumes media. The correction isn't to feel less. It's to deliberately compare: how does this harm rank against structurally similar harms that don't trend? If you can't name comparable harms that receive less attention, your moral map may be closer to a media map than a harm map.",
        example: "Significant outrage about a data breach affecting 500,000 people. Low awareness of water contamination affecting 2 million people in a less-covered region."
      },
      {
        value: "halflife", label: "Half-life doubt",
        desc: "Not sure you'll still care in a year. This might be a social moment more than a sustained moral position.",
        extended: "Short-term moral concern isn't automatically invalid. Some social moments generate concern that leads to real change. The useful diagnostic: in a year, will you still be organized around this issue, or will the cycle have moved on? The distinction between a sustained position and a social moment is worth naming honestly. Taking action now, while concern is high, makes sense either way. But the type of action that makes sense depends on which this is.",
        example: "Intense concern about a company's practices during a news cycle. Six months later: the company hasn't changed, the coverage has moved on, and so has the concern."
      },
    ]
  },
  {
    id: "counterfactual", num: "05", chapter: "Analysis",
    title: "If this didn't exist, what would?",
    subtitle: "Most critiques assume the alternative is clean. Rarely true. What actually fills the gap?",
    type: "text", placeholder: "e.g. more fossil fuel infrastructure, worse labor conditions elsewhere..."
  },
  {
    id: "who_profits", num: "06", chapter: "Analysis",
    title: "Who benefits from your outrage?",
    primer: "Every platform, publication, and political faction has a financial incentive to keep you activated. Anger drives engagement. Engagement drives revenue. This isn't conspiracy. It's the business model. Your outrage is a product being sold.",
    subtitle: "Name the specific players: platforms, industries, politicians, media outlets.",
    type: "text", placeholder: "e.g. the competing platform, the politician who needs an enemy, the outlet that monetizes anger..."
  },
  {
    id: "action", num: "07", chapter: "Action",
    title: "What are you actually doing about this?",
    subtitle: "Not judging the answer. Just mapping the gap between concern and action.",
    type: "choice",
    options: [
      { value: "voicing", label: "Posting, talking, sharing outrage online" },
      { value: "consuming", label: "Changing my own purchasing or usage" },
      { value: "organizing", label: "Involved in policy, organizing, or building alternatives" },
      { value: "nothing", label: "Honestly, nothing yet" }
    ]
  },
  {
    id: "leverage", num: "08", chapter: "Action",
    title: "What would actually move the needle?",
    subtitle: "Not what feels good. What has a realistic causal path to the change you want?",
    type: "text", placeholder: "e.g. specific legislation, shifting procurement, funding alternatives..."
  },
  {
    id: "agency", num: "09", chapter: "Action",
    title: "What's within your actual power?",
    subtitle: "Outrage often targets things with zero personal leverage. What can you actually change from where you stand?",
    type: "text", placeholder: "e.g. my purchasing, my professional choices, my local policy environment..."
  },
];

const biasOptionMap = Object.fromEntries(
  STEPS.find(s => s.id === "bias_flags").options.map(o => [o.value, o])
);

const CONSISTENCY = {
  same: { label: "Consistent Scope", color: "#4a7c59", bg: "rgba(74,124,89,0.08)", text: "You're applying concern consistently across structurally similar cases. That's less common than it sounds, and it makes your critique harder to dismiss. The question now is whether your actions match your stated values." },
  different: { label: "Selective Attention", color: "#b07d2e", bg: "rgba(176,125,46,0.08)", text: "You feel more strongly about one case than a structurally similar one. This might reflect genuine differences in scale or urgency, or it might be visibility bias. The twin you named is worth sitting with." },
  unsure: { label: "Open Question", color: "#3a6ea8", bg: "rgba(58,110,168,0.08)", text: "Honest uncertainty is a useful starting point. The structurally identical case might be meaningfully different in ways you haven't articulated yet. Or the discomfort of not knowing might be pointing at something real." },
};

const ACTION_MAP = {
  voicing: { label: "Low-to-medium leverage", color: "#b07d2e", text: "Raising awareness creates real effects, but only if it moves someone toward action. Does this post change behavior, or does it signal values? Both happen. Being honest about which is doing more work matters." },
  consuming: { label: "Medium leverage", color: "#3a6ea8", text: "Individual consumption choices send real market signals, especially at scale. Limited alone, but not nothing. Most effective when combined with collective action." },
  organizing: { label: "High leverage", color: "#4a7c59", text: "Structural change happens here. Policy, organizing, and building alternatives are the mechanisms that actually shift systems. You're in the highest-impact tier." },
  nothing: { label: "Honest starting point", color: "#888", text: "Most people are here. The gap between concern and action isn't usually laziness. The action path just isn't visible yet. That's fixable." },
};

const BIAS_NOTES = {
  identifiable_victim: "Your concern may be calibrated to visibility rather than scale. The harm that has a face feels more urgent than equivalent harm that doesn't. That's human, and worth accounting for.",
  moral_licensing: "Watch for the pattern where caring about this becomes a reason not to examine adjacent areas. One acknowledged concern doesn't clear the ledger.",
  outrage_economy: "Someone is profiting from your activation. That doesn't make your concern wrong, but knowing who benefits is relevant information about the environment you're operating in.",
  purity_trap: "If no available option is clean enough to support, you may be optimizing for personal innocence rather than actual impact. Complicity in a flawed system while working to change it is often the only path.",
  proportionality: "Check whether your reaction intensity maps to actual harm scale or to how legible and visible the harm is. These often diverge, especially for harms that are new or heavily covered.",
  halflife: "Short-term concern isn't always invalid. But if this is more social moment than sustained position, naming that honestly is useful.",
};

const PRIMER_CARDS = [
  {
    title: "Visibility isn't the same as severity",
    body: "The harms we hear about most are not necessarily the worst harms. They're the ones that are new, legible, and attached to recognizable faces or brands. Supply chains have been brutal for decades. They just don't trend."
  },
  {
    title: "The attention economy runs on outrage",
    body: "Every platform, publication, and political faction has a financial incentive to keep you activated. Anger drives engagement. Engagement drives revenue. This isn't conspiracy. It's the business model. Your outrage is a product being sold.",
    deepDive: [
      { num: "01", title: "Your attention is the product", body: "Platforms don't sell you things. They sell you to advertisers: your attention, your time, your behavior. The more time you spend on platform, the more ad inventory they have to sell. You are not the customer. You are the commodity." },
      { num: "02", title: "Engagement is the proxy metric", body: "Platforms can't directly sell 'attention' so they optimize for what they can measure: clicks, shares, comments, time on page. Whatever drives engagement gets amplified. Whatever doesn't gets buried. The metric is not 'what matters.' It's 'what sticks.'" },
      { num: "03", title: "Outrage is the highest-engagement emotion", body: "Not happiness. Not inspiration. Outrage. Research on social media sharing consistently shows that moral-emotional language (anger, disgust, indignation) spreads faster and further than neutral content. The algorithm didn't plan this. It just learned it." },
      { num: "04", title: "The algorithm has no ideology", body: "This is the part people miss. The algorithm isn't left or right, pro or anti anything. It optimizes for engagement. If outrage about Topic A gets more engagement than outrage about Topic B, Topic A gets amplified, regardless of which harm is actually worse or more important." },
      { num: "05", title: "Political actors figured this out", body: "Fundraising emails, political ads, and media coverage all follow the same logic. An enemy that activates your base raises more money than a complicated policy argument. Outrage is a fundraising mechanism. The enemy is often chosen for emotional resonance, not actual importance." },
      { num: "06", title: "The feedback loop tightens over time", body: "You see outrage content, you engage, the algorithm shows you more, your sense of what matters gets calibrated to what's most charged, you generate more outrage content, repeat. After months or years in this loop, your moral map of the world reflects engagement patterns, not reality." },
      { num: "07", title: "Slow harms become invisible", body: "Structural, undramatic, slow-moving harms get algorithmically starved. Not suppressed, just given no oxygen. Cobalt mining doesn't trend. A supply chain audit doesn't go viral. The absence of visibility gets misread as the absence of harm." },
    ]
  },
  {
    title: "Feeling strongly is not the same as acting effectively",
    body: "Moral concern and moral leverage are different things. Posting, sharing, and feeling activated can substitute for action, giving a sense of having done something when the needle hasn't moved. The question worth asking is always: what's the causal path to actual change?"
  },
];

function isVagueAnswer(text) {
  const words = text.trim().split(/\s+/);
  if (words.length < 6) return true;
  const lower = text.toLowerCase();
  return VAGUE_TERMS.some(t => lower.includes(t));
}

function isLowEngagement(answers) {
  const textFields = ["structural_twin", "who_profits", "leverage", "agency", "counterfactual"];
  const shortCount = textFields.filter(f => {
    const val = answers[f];
    return val && val.trim().split(/\s+/).length < 8;
  }).length;
  const noFlags = !answers.bias_flags || answers.bias_flags.length === 0;
  const voicing = answers.action === "voicing";
  return shortCount >= 3 && noFlags && voicing;
}

function hasLeverageGap(answers) {
  if (!answers.leverage || !answers.agency) return false;
  const systemicTerms = ["policy", "regulation", "legislation", "law", "system", "structural", "corporate", "industry", "government", "incentive", "mandate", "enforcement", "reform", "collective", "organizing", "lobbying"];
  const personalTerms = ["my purchasing", "my choices", "my own", "my professional", "my local", "i can", "my buying", "my vote", "my consumption", "my spending"];
  const lev = answers.leverage.toLowerCase();
  const ag = answers.agency.toLowerCase();
  const levSystemic = systemicTerms.some(t => lev.includes(t));
  const agPersonal = personalTerms.some(t => ag.includes(t));
  const agSystemic = systemicTerms.some(t => ag.includes(t));
  return levSystemic && agPersonal && !agSystemic;
}

function buildPositionStatement(answers) {
  const { concern, structural_twin, feeling_diff, counterfactual, leverage, agency, bias_flags } = answers;
  const flags = bias_flags || [];
  const topic = concern || "this issue";
  let para = "";
  if (feeling_diff === "same") {
    para = `I am concerned about ${topic}, and I hold that concern consistently across structurally similar cases.`;
    if (structural_twin) para += ` I acknowledge that ${structural_twin} represents comparable harm deserving equal attention.`;
    if (flags.length > 0) para += ` I have identified ${flags.length === 1 ? "a pattern" : "patterns"} (${flags.map(f => f.replace(/_/g, " ")).join(", ")}) that may be shaping how I hold this concern, and I'm accounting for them.`;
    if (counterfactual) para += ` The realistic alternative, ${counterfactual}, is not a clean baseline.`;
    if (agency) para += ` Within my own sphere, I can act on: ${agency}.`;
    if (leverage) para += ` What would actually move the needle: ${leverage}.`;
  } else if (feeling_diff === "different") {
    para = `I am concerned about ${topic}, though I recognize I apply this concern unevenly.`;
    if (structural_twin) para += ` I feel more strongly about this than ${structural_twin}, even though they share the same structural harm category. That asymmetry is worth examining.`;
    if (flags.length > 0) para += ` I've flagged ${flags.length === 1 ? "a pattern" : "patterns"} (${flags.map(f => f.replace(/_/g, " ")).join(", ")}) that may account for part of that gap.`;
    if (counterfactual) para += ` The realistic alternative, ${counterfactual}, is not clean.`;
    if (agency) para += ` What I can actually do: ${agency}.`;
    if (leverage) para += ` What would actually move the needle: ${leverage}.`;
  } else {
    para = `I am concerned about ${topic}, and I'm still working out how consistently I hold that concern.`;
    if (structural_twin) para += ` The structural parallel to ${structural_twin} raises questions I haven't fully resolved.`;
    if (flags.length > 0) para += ` I've noticed ${flags.length === 1 ? "a pattern" : "patterns"} (${flags.map(f => f.replace(/_/g, " ")).join(", ")}) that may be shaping my perspective.`;
    if (counterfactual) para += ` The realistic alternative is ${counterfactual}.`;
    if (agency) para += ` What I can actually do: ${agency}.`;
    if (leverage) para += ` What would create real change: ${leverage}.`;
  }
  return para;
}

function buildShortStatement(answers) {
  const { concern, feeling_diff, leverage } = answers;
  const topic = concern || "this issue";
  if (feeling_diff === "same") {
    const leveragePart = leverage ? ` What would actually move the needle: ${leverage}.` : "";
    return `I'm concerned about ${topic}, and I try to apply that concern consistently across similar cases.${leveragePart}`;
  } else if (feeling_diff === "different") {
    return `I'm concerned about ${topic}, though I notice I apply that concern more intensely here than in structurally similar cases. That's something I'm sitting with.`;
  } else {
    return `I'm concerned about ${topic}. I'm still working out whether my concern is consistent and where I have actual leverage.`;
  }
}

function buildChallengeText(answers) {
  const short = buildShortStatement(answers);
  const url = typeof window !== "undefined" ? (window.location.origin + window.location.pathname) : "";
  return `I just ran my position on ${answers.concern || "an issue"} through a moral clarity audit.\n\n"${short}"\n\nWant to test your own? 9 questions, no AI, about 5 minutes.\n${url}`;
}

function buildPlainText(answers) {
  const a = answers;
  const lines = [
    "MORAL CLARITY AUDIT",
    "─".repeat(38),
    "",
    "YOUR CONCERN",
    a.concern || "—",
    "",
    "STRUCTURAL TWIN",
    a.structural_twin || "—",
    "",
    "CONSISTENCY CHECK",
    a.feeling_diff === "same" ? "Consistent scope" : a.feeling_diff === "different" ? "Selective attention" : "Uncertain",
    "",
    "BIAS FLAGS IDENTIFIED",
    (a.bias_flags || []).length === 0 ? "None selected" : (a.bias_flags || []).map(f => "· " + f.replace(/_/g, " ")).join("\n"),
    "",
    "COUNTERFACTUAL",
    a.counterfactual || "—",
    "",
    "WHO PROFITS FROM YOUR OUTRAGE",
    a.who_profits || "—",
    "",
    "REAL LEVERAGE",
    a.leverage || "—",
    "",
    "YOUR SPHERE",
    a.agency || "—",
    "",
    "─".repeat(38),
    "YOUR POSITION, STATED CLEARLY",
    "",
    '"' + buildPositionStatement(a) + '"',
    "",
    "─".repeat(38),
    "Generated with Moral Clarity Tool · no AI",
  ];
  return lines.join("\n");
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [expandedCard, setExpandedCard] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentText, setCurrentText] = useState("");
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [copied, setCopied] = useState(null);
  const [showQualityWarning, setShowQualityWarning] = useState(false);
  const [expandedFlag, setExpandedFlag] = useState(null);

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const chapters = [...new Set(STEPS.map(s => s.chapter))];

  const startSteps = () => {
    setPhase("steps"); setStep(0); setCurrentText(""); setSelectedMulti([]); setShowQualityWarning(false);
  };

  const advance = (val, bypassQuality = false) => {
    const value = val !== undefined ? val : currentText;
    if (current.type === "text" && QUALITY_CHECK_FIELDS.includes(current.id) && !bypassQuality) {
      if (isVagueAnswer(value)) {
        setShowQualityWarning(true);
        return;
      }
    }
    setShowQualityWarning(false);
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      const next = STEPS[step + 1];
      setStep(step + 1);
      setCurrentText(newAnswers[next?.id] || "");
      setSelectedMulti(newAnswers[next?.id] || []);
    } else {
      if (isLowEngagement(newAnswers)) {
        setPhase("check");
      } else {
        setPhase("done");
      }
    }
  };

  const goBack = () => {
    setShowQualityWarning(false);
    if (step === 0) { setPhase("intro"); return; }
    const prev = STEPS[step - 1];
    setStep(step - 1);
    setCurrentText(answers[prev.id] || "");
    setSelectedMulti(answers[prev.id] || []);
  };

  const reset = () => {
    setPhase("intro"); setStep(0); setAnswers({});
    setCurrentText(""); setSelectedMulti([]); setCopied(null);
    setExpandedCard(null); setShowQualityWarning(false); setExpandedFlag(null);
  };

  const toggleMulti = (val) => setSelectedMulti(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const copyText = (type) => {
    const url = window.location.origin + window.location.pathname;
    let text;
    if (type === "position") text = buildShortStatement(answers) + "\n\n" + url;
    else if (type === "challenge") text = buildChallengeText(answers);
    else text = buildPlainText(answers);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type); setTimeout(() => setCopied(null), 2500);
    });
  };

  const cr = CONSISTENCY[answers.feeling_diff] || CONSISTENCY.unsure;
  const ar = ACTION_MAP[answers.action] || ACTION_MAP.nothing;
  const flaggedBiases = answers.bias_flags || [];
  const leverageGap = hasLeverageGap(answers);

  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const bg = "#f4f0e8", ink = "#1c1b18", mid = "#666", faint = "#aaa", accent = "#b5813a", white = "#fff", ruleC = "#d8d3c8";
  const rule = <div style={{ height: 1, background: ruleC, margin: "1.75rem 0" }} />;
  const lbl = (txt, extra) => <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: faint, display: "block", ...extra }}>{txt}</span>;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: ink, fontFamily: sans }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .au{animation:fadeUp 0.4s ease forwards}
        .bp{background:#1c1b18;color:#f4f0e8;border:none;padding:.8rem 1.8rem;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:600;font-size:.77rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:background .2s}
        .bp:hover{background:#333}.bp:disabled{opacity:.25;cursor:default}
        .bg{background:transparent;color:#777;border:1px solid #c8c4bc;padding:.75rem 1.4rem;font-family:'Helvetica Neue',Arial,sans-serif;font-size:.77rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s}
        .bg:hover{border-color:#888;color:#333}
        .bt{background:transparent;border:none;color:#aaa;font-family:'Helvetica Neue',Arial,sans-serif;font-size:.77rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:color .2s;padding:0}
        .bt:hover{color:#1c1b18}
        .ch{background:transparent;border:1px solid #ccc9c0;color:#1c1b18;padding:1rem 1.2rem;font-family:'Helvetica Neue',Arial,sans-serif;font-size:.91rem;text-align:left;cursor:pointer;transition:all .2s;width:100%;line-height:1.4}
        .ch:hover{border-color:#1c1b18;background:rgba(28,27,24,.03)}
        .mo{border:1px solid #ccc9c0;padding:1rem 1.2rem;cursor:pointer;transition:all .2s;display:flex;gap:.8rem;align-items:flex-start}
        .mo:hover{border-color:#999}.mo.sel{border-color:#1c1b18;background:rgba(28,27,24,.04)}
        .cb{width:16px;height:16px;border:1.5px solid #bbb;flex-shrink:0;margin-top:3px;display:flex;align-items:center;justify-content:center;transition:all .15s}
        .cb.on{background:#1c1b18;border-color:#1c1b18}
        textarea{width:100%;background:#fff;border:1px solid #ccc9c0;color:#1c1b18;padding:1rem;font-family:Georgia,serif;font-size:.94rem;resize:vertical;min-height:105px;line-height:1.75;transition:border-color .2s}
        textarea:focus{outline:none;border-color:#1c1b18}
        textarea::placeholder{color:#ccc;font-style:italic}
        .pc{background:#fff;border:1px solid #e0dbd0;padding:1.4rem;cursor:pointer;transition:border-color .2s;margin-bottom:.6rem}
        .pc:hover{border-color:#bbb}
        @media print{.np{display:none!important}}
      `}</style>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* Masthead */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".65rem" }}>
            <div style={{ flex: 1, height: 1, background: ink }} />
            <span style={{ fontSize: ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: faint, whiteSpace: "nowrap" }}>Moral Clarity Tool</span>
            <div style={{ flex: 1, height: 1, background: ink }} />
          </div>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(1.9rem,5vw,2.65rem)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-.01em" }}>
            Before you voice<br /><em>the critique</em>
          </h1>
        </div>

        {/* INTRO */}
        {phase === "intro" && (
          <div className="au">
            <p style={{ fontFamily: serif, fontSize: "1.05rem", lineHeight: 1.85, color: "#444", marginBottom: "1.25rem", fontStyle: "italic" }}>Outrage is easy. Consistent, actionable concern is harder.</p>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, color: mid, marginBottom: ".75rem" }}>This tool helps you examine the scope and leverage of a moral critique: not to dismiss it, but to sharpen it. Nine questions covering consistency, cognitive bias, counterfactuals, and real leverage.</p>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, color: mid, marginBottom: "2rem" }}>At the end you'll get a clear statement of your actual position, built from your own answers, no AI involved. Plus tools to share or print it.</p>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {chapters.map(ch => <span key={ch} style={{ fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase", border: "1px solid #ccc9c0", padding: ".28rem .65rem", color: "#999" }}>{ch}</span>)}
            </div>
            {rule}
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
              <button className="bg np" onClick={() => setPhase("primer")}>Read the primer first</button>
              <button className="bp" onClick={startSteps}>Begin Audit →</button>
            </div>
            <p style={{ fontSize: ".73rem", color: faint }}>9 questions · ~5 min · no AI · nothing is saved or transmitted</p>
          </div>
        )}

        {/* PRIMER */}
        {phase === "primer" && (
          <div className="au">
            {lbl("Three things worth knowing first", { marginBottom: "1.25rem", color: accent })}
            {PRIMER_CARDS.map((card, i) => (
              <div key={i} style={{ marginBottom: ".6rem" }}>
                <div className="pc" onClick={() => setExpandedCard(expandedCard === i ? null : i)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div>
                      {lbl(`0${i + 1}`, { marginBottom: ".3rem" })}
                      <p style={{ fontFamily: serif, fontSize: "1rem", fontWeight: 400, lineHeight: 1.35 }}>{card.title}</p>
                    </div>
                    <span style={{ color: faint, fontSize: "1.2rem", flexShrink: 0 }}>{expandedCard === i ? "−" : "+"}</span>
                  </div>
                  {expandedCard === i && (
                    <p style={{ fontSize: ".86rem", lineHeight: 1.75, color: mid, marginTop: ".8rem", borderTop: "1px solid #e8e4dc", paddingTop: ".8rem" }}>{card.body}</p>
                  )}
                </div>

                {expandedCard === i && card.deepDive && (
                  <div style={{ background: "#1c1b18", padding: "1.5rem", marginTop: ".15rem" }}>
                    <p style={{ fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#b5813a", marginBottom: "1.25rem" }}>How the outrage machine actually works</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                      {card.deepDive.map((dc, j) => (
                        <div key={j} style={{ borderLeft: "2px solid #333", paddingLeft: "1rem" }}>
                          <div style={{ display: "flex", gap: ".75rem", alignItems: "baseline", marginBottom: ".3rem" }}>
                            <span style={{ fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#666", flexShrink: 0 }}>{dc.num}</span>
                            <p style={{ fontSize: ".82rem", fontWeight: 700, color: "#e8e4dc", lineHeight: 1.3 }}>{dc.title}</p>
                          </div>
                          <p style={{ fontSize: ".8rem", lineHeight: 1.7, color: "#999", paddingLeft: "1.35rem" }}>{dc.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {rule}
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
              <button className="bp" onClick={startSteps}>Begin Audit →</button>
              <button className="bt" onClick={() => setPhase("intro")}>← Back</button>
            </div>
          </div>
        )}

        {/* STEPS */}
        {phase === "steps" && current && (
          <>
            <div style={{ marginBottom: "2.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".45rem" }}>
                <span style={{ fontSize: ".6rem", letterSpacing: ".18em", textTransform: "uppercase", color: accent }}>{current.chapter}</span>
                <span style={{ fontSize: ".72rem", color: faint }}>{step + 1} / {STEPS.length}</span>
              </div>
              <div style={{ height: 2, background: "#e0dbd0", borderRadius: 1 }}>
                <div style={{ height: "100%", background: ink, borderRadius: 1, width: `${progress}%`, transition: "width .4s ease" }} />
              </div>
            </div>

            <div className="au" key={step}>
              {lbl(`Question ${current.num}`, { marginBottom: ".55rem" })}
              <h2 style={{ fontFamily: serif, fontSize: "clamp(1.35rem,3.5vw,1.75rem)", fontWeight: 400, lineHeight: 1.3, marginBottom: ".6rem" }}>{current.title}</h2>
              {current.primer && (
                <div style={{ background: white, border: "1px solid #e0dbd0", borderLeft: `3px solid ${accent}`, padding: "1rem 1.15rem", marginBottom: "1.1rem" }}>
                  <p style={{ fontSize: ".83rem", lineHeight: 1.75, color: "#555" }}>{current.primer}</p>
                </div>
              )}
              <p style={{ fontSize: ".86rem", color: mid, lineHeight: 1.75, marginBottom: "1.5rem" }}>{current.subtitle}</p>

              {current.type === "text" && (
                <>
                  <textarea
                    value={currentText}
                    onChange={e => { setCurrentText(e.target.value); setShowQualityWarning(false); }}
                    placeholder={current.placeholder}
                    onKeyDown={e => { if (e.key === "Enter" && e.metaKey && currentText.trim()) advance(); }}
                  />
                  {showQualityWarning && (
                    <div style={{ background: "rgba(176,125,46,0.08)", border: "1px solid rgba(176,125,46,0.3)", padding: ".85rem 1rem", marginTop: ".5rem" }}>
                      <p style={{ fontSize: ".8rem", color: "#b07d2e", lineHeight: 1.6, marginBottom: ".6rem" }}>This answer might be too brief or general to be useful. More specific answers produce clearer results.</p>
                      <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                        <button className="bt" style={{ color: "#b07d2e" }} onClick={() => setShowQualityWarning(false)}>Add more detail</button>
                        <span style={{ color: faint, fontSize: ".73rem" }}>or</span>
                        <button className="bt" onClick={() => advance(undefined, true)}>That's my answer, continue</button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {current.type === "choice" && (
                <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
                  {current.options.map(opt => (
                    <button key={opt.value} className="ch" onClick={() => advance(opt.value)}>{opt.label}</button>
                  ))}
                </div>
              )}
              {current.type === "multiselect" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", marginBottom: "1.1rem" }}>
                    {current.options.map(opt => (
                      <div key={opt.value} className={`mo ${selectedMulti.includes(opt.value) ? "sel" : ""}`}
                        onClick={() => toggleMulti(opt.value)}>
                        <div className={`cb ${selectedMulti.includes(opt.value) ? "on" : ""}`}>
                          {selectedMulti.includes(opt.value) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="#f4f0e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: ".2rem" }}>{opt.label}</div>
                          <div style={{ fontSize: ".77rem", color: "#888", lineHeight: 1.55 }}>{opt.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: ".73rem", color: faint, marginBottom: "1rem" }}>Select none, some, or all. Whatever's honest.</p>
                </>
              )}

              {rule}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button className="bt" onClick={goBack}>← Back</button>
                <div style={{ display: "flex", gap: ".6rem" }}>
                  {current.type === "text" && (
                    <button className="bp" onClick={() => advance()} disabled={!currentText.trim()}>
                      {step === STEPS.length - 1 ? "See Results" : "Continue →"}
                    </button>
                  )}
                  {current.type === "multiselect" && (
                    <button className="bp" onClick={() => advance(selectedMulti)}>
                      {selectedMulti.length === 0 ? "None apply, continue" : "Continue →"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* CHECK (pushback interstitial) */}
        {phase === "check" && (
          <div className="au">
            {lbl("Before your results", { color: accent, marginBottom: ".5rem" })}
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.35rem,3.5vw,1.75rem)", fontWeight: 400, lineHeight: 1.3, marginBottom: "1.25rem" }}>One more check</h2>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, color: mid, marginBottom: ".9rem" }}>Several of your answers were brief. This audit produces more useful results when the specifics are uncomfortable to name.</p>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, color: mid, marginBottom: ".9rem" }}>The questions worth revisiting are usually: who specifically benefits from your outrage, what would actually move the needle (with a real causal path), and what's within your actual power (concretely, not generally).</p>
            <p style={{ fontSize: ".9rem", lineHeight: 1.8, color: mid, marginBottom: "2rem" }}>You're also posting about this issue without having flagged any cognitive biases. That pattern is worth at least a second look.</p>
            {rule}
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
              <button className="bg" onClick={() => { setPhase("steps"); setStep(0); setShowQualityWarning(false); }}>Take another pass</button>
              <button className="bp" onClick={() => setPhase("done")}>Continue to results →</button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {phase === "done" && (
          <div className="au">
            {lbl("Audit complete", { color: accent, marginBottom: ".5rem" })}
            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 400, lineHeight: 1.3, marginBottom: "2rem" }}>Your moral clarity audit</h2>

            {/* Consistency */}
            <div style={{ padding: "1.25rem", background: cr.bg, border: `1px solid ${cr.color}33`, marginBottom: "1.1rem" }}>
              {lbl("Consistency", { marginBottom: ".4rem" })}
              <div style={{ fontWeight: 700, color: cr.color, fontSize: ".85rem", marginBottom: ".5rem" }}>{cr.label}</div>
              <p style={{ fontSize: ".86rem", lineHeight: 1.75, color: mid }}>{cr.text}</p>
            </div>

            {/* Action */}
            <div style={{ padding: "1.25rem", background: "rgba(0,0,0,.02)", border: "1px solid #e0dbd0", marginBottom: "1.1rem" }}>
              {lbl("Leverage", { marginBottom: ".4rem" })}
              <div style={{ fontWeight: 700, color: ar.color, fontSize: ".85rem", marginBottom: ".5rem" }}>{ar.label}</div>
              <p style={{ fontSize: ".86rem", lineHeight: 1.75, color: mid }}>{ar.text}</p>
            </div>

            {/* Leverage gap */}
            {leverageGap && (
              <div style={{ padding: "1.25rem", background: "rgba(58,110,168,0.06)", border: "1px solid rgba(58,110,168,0.25)", marginBottom: "1.1rem" }}>
                {lbl("Leverage gap", { marginBottom: ".4rem", color: "#3a6ea8" })}
                <div style={{ fontWeight: 700, color: "#3a6ea8", fontSize: ".85rem", marginBottom: ".5rem" }}>Systemic lever, personal action</div>
                <p style={{ fontSize: ".86rem", lineHeight: 1.75, color: mid }}>Your leverage answer points at systemic change. Your agency answer points at personal action. Those operate at different scales. What would it look like to connect your personal capacity to the systemic lever you named?</p>
              </div>
            )}

            {/* Bias flags */}
            {flaggedBiases.length > 0 && (
              <div style={{ marginBottom: "1.1rem" }}>
                {lbl("Patterns you flagged", { marginBottom: ".75rem" })}
                <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                  {flaggedBiases.map(f => {
                    const option = biasOptionMap[f];
                    const isExpanded = expandedFlag === f;
                    return (
                      <div key={f} style={{ padding: "1rem", background: white, border: "1px solid #e0dbd0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".75rem" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: ".8rem", fontWeight: 700, marginBottom: ".3rem", textTransform: "capitalize" }}>{f.replace(/_/g, " ")}</div>
                            <p style={{ fontSize: ".8rem", color: mid, lineHeight: 1.65 }}>{BIAS_NOTES[f]}</p>
                          </div>
                          <button
                            className="bt"
                            style={{ flexShrink: 0, fontSize: "1.1rem", lineHeight: 1, paddingTop: ".1rem" }}
                            onClick={() => setExpandedFlag(isExpanded ? null : f)}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? "−" : "+"}
                          </button>
                        </div>
                        {isExpanded && option && (
                          <div style={{ borderTop: "1px solid #e8e4dc", paddingTop: ".75rem", marginTop: ".75rem" }}>
                            <p style={{ fontSize: ".8rem", lineHeight: 1.75, color: mid, marginBottom: ".75rem" }}>{option.extended}</p>
                            <div style={{ background: bg, border: "1px solid #e0dbd0", padding: ".75rem" }}>
                              {lbl("Example", { marginBottom: ".3rem" })}
                              <p style={{ fontSize: ".78rem", lineHeight: 1.65, color: "#666", fontStyle: "italic" }}>{option.example}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {rule}

            {/* Position statement */}
            <div style={{ marginBottom: "1.75rem" }}>
              {lbl("Your position, stated clearly", { color: accent, marginBottom: ".75rem" })}
              <blockquote style={{ fontFamily: serif, fontSize: "1rem", lineHeight: 1.85, color: ink, borderLeft: `3px solid ${accent}`, paddingLeft: "1.25rem", fontStyle: "italic", margin: 0, marginBottom: "1.1rem" }}>
                "{buildPositionStatement(answers)}"
              </blockquote>
              {lbl("Short version", { marginBottom: ".35rem" })}
              <p style={{ fontSize: ".83rem", lineHeight: 1.7, color: mid, fontStyle: "italic" }}>
                {buildShortStatement(answers)}
              </p>
              <p style={{ fontSize: ".72rem", color: faint, marginTop: ".6rem" }}>Built from your answers. No AI involved.</p>
            </div>

            {rule}

            {/* Share actions */}
            <div className="np" style={{ marginBottom: "1.25rem" }}>
              {lbl("Share", { marginBottom: ".75rem" })}
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".85rem 1rem", background: white, border: "1px solid #e0dbd0" }}>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, marginBottom: ".15rem" }}>Share your position</div>
                    <div style={{ fontSize: ".73rem", color: mid }}>Your short statement, ready to paste</div>
                  </div>
                  <button className="bp" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => copyText("position")}>
                    {copied === "position" ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".85rem 1rem", background: white, border: "1px solid #e0dbd0" }}>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, marginBottom: ".15rem" }}>Challenge a friend</div>
                    <div style={{ fontSize: ".73rem", color: mid }}>Your position plus a link to the tool</div>
                  </div>
                  <button className="bp" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => copyText("challenge")}>
                    {copied === "challenge" ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".85rem 1rem", background: white, border: "1px solid #e0dbd0" }}>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 600, marginBottom: ".15rem" }}>Save for later</div>
                    <div style={{ fontSize: ".73rem", color: mid }}>Full audit, plain text, ready to paste anywhere</div>
                  </div>
                  <button className="bp" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => copyText("full")}>
                    {copied === "full" ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                <button className="bg" onClick={() => window.print()}>Print / Save PDF</button>
                <button className="bt" onClick={reset}>Start Over</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
