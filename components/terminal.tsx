"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { Experience, PortfolioContext, Project } from "@/lib/types";

const commands = ["help", "about", "experience", "projects", "skills", "education", "contact", "resume", "clear"];
type Entry = { input: string; output?: React.ReactNode };

const Prompt = () => <span className="prompt">prince@portfolio <span>~</span> %</span>;
const Label = ({ children }: { children: React.ReactNode }) => <div className="label">{children}</div>;
const Tags = ({ items }: { items: string[] }) => <div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div>;
const date = (value: string) => value === "Present" ? value.toUpperCase() : value.replace("-", ".");

function ExperienceItem({ entry, index }: { entry: Experience; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="record">
    <button className="record-top" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
      <span className="record-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="record-title"><strong>{entry.role}</strong><span>{entry.organization} <i>·</i> {entry.location}</span></span>
      <span className="record-date">{date(entry.startDate)} — {date(entry.endDate)}</span><span className="chevron">{expanded ? "−" : "+"}</span>
    </button>
    {expanded && <div className="record-detail"><p>{entry.description}</p><Tags items={entry.technologies} /><ul>{entry.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>}
  </article>;
}

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="record project-record">
    <button className="record-top" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
      <span className="record-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="record-title"><strong>{project.name}</strong><span>{project.description}</span></span><span className="chevron">{expanded ? "−" : "+"}</span>
    </button>
    {expanded && <div className="project-detail">
      <Label>DESCRIPTION</Label><p>{project.longDescription}</p><Label>TECHNOLOGIES</Label><Tags items={project.technologies} />
      {(project.links.github || project.links.demo) && <div className="project-links">{project.links.github && <a href={project.links.github} target="_blank">GitHub ↗</a>}{project.links.demo && <a href={project.links.demo} target="_blank">Demo ↗</a>}</div>}
    </div>}
  </article>;
}

export function Terminal({ context }: { context: PortfolioContext }) {
  const [booting, setBooting] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const timer = window.setTimeout(() => setBooting(false), 1450); return () => clearTimeout(timer); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [entries, booting]);
  useEffect(() => { if (!booting) inputRef.current?.focus(); }, [booting]);

  const outputFor = (raw: string): React.ReactNode => {
    const command = raw.toLowerCase().trim();
    if (command === "help") return <section><Label>AVAILABLE COMMANDS</Label><div className="command-grid">{[["about", "About Prince"], ["experience", "Professional experience"], ["projects", "Things he has built"], ["skills", "Technical toolkit"], ["education", "Education"], ["contact", "Contact information"], ["resume", "Open resume"], ["clear", "Clear terminal"]].map(([name, description]) => <div key={name}><b>{name}</b><span>{description}</span></div>)}</div></section>;
    if (command === "about") return <section className="about"><Label>PROFILE // {context.profile.name.toUpperCase()}</Label><h2>{context.profile.title}</h2><div className="headline">{context.profile.headline}</div><p>{context.profile.summary}</p><p className="muted">{context.profile.availability}</p></section>;
    if (command === "experience") return <section><Label>EXPERIENCE <small>SELECT AN ENTRY FOR DETAILS</small></Label>{context.experience.map((item, index) => <ExperienceItem key={`${item.organization}-${item.role}`} entry={item} index={index} />)}</section>;
    if (command === "projects") return <section><Label>PROJECTS <small>SELECT A PROJECT FOR TECHNICAL NOTES</small></Label>{context.projects.map((project, index) => <ProjectItem key={project.slug} project={project} index={index} />)}</section>;
    if (command === "skills") return <section><Label>TECHNICAL SKILLS</Label><div className="skill-grid">{context.skills.map((group) => <div className="skill-group" key={group.category}><h3>{group.category}</h3><Tags items={group.items} /></div>)}</div></section>;
    if (command === "education") return <section><Label>EDUCATION</Label>{context.education.map((item) => <div className="education" key={item.institution}><h3>{item.degree}</h3><p>{item.institution} <i>·</i> {item.location}</p><p>{item.duration}</p></div>)}</section>;
    if (command === "contact") return <section><Label>CONTACT</Label><div className="contact"><a href={`mailto:${context.contact.email}`}>{context.contact.email}</a><a href={context.contact.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={context.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></section>;
    if (command === "resume") return <section><Label>RESUME</Label><p>Open Prince&apos;s current resume in a new tab.</p><a className="resume-button" href={context.profile.resumeUrl} target="_blank" rel="noreferrer">OPEN RESUME ↗</a></section>;
    return <section className="error"><p>command not found: <b>{raw}</b></p><p>Try: <button onClick={() => execute("help")}>help</button></p></section>;
  };

  const execute = async (raw?: string) => {
    const input = (raw ?? value).trim();
    if (!input) return;
    setValue(""); setHistoryIndex(-1);
    if (input.toLowerCase() === "clear") { setEntries([]); setHistory((old) => [...old, input]); return; }
    setHistory((old) => [...old, input]);
    setEntries((old) => [...old, { input, output: outputFor(input) }]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") { event.preventDefault(); const next = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex; setHistoryIndex(next); if (next >= 0) setValue(history[history.length - 1 - next]); }
    if (event.key === "ArrowDown") { event.preventDefault(); const next = historyIndex - 1; setHistoryIndex(next); setValue(next >= 0 ? history[history.length - 1 - next] : ""); }
    if (event.key === "Tab") { event.preventDefault(); const match = commands.find((command) => command.startsWith(value.toLowerCase())); if (match) setValue(match); }
  };

  return <main className="shell" onClick={() => inputRef.current?.focus()}>
    <div className="terminal-frame">
      <header><a className="wordmark" href="/">PRINCE<span>.OS</span></a><div className="status"><i /> ONLINE</div></header>
      <nav aria-label="Portfolio navigation">{["about", "experience", "projects", "skills", "resume"].map((command) => <button key={command} onClick={() => execute(command)}>{command}</button>)}</nav>
      <div className="terminal-scroll" ref={scrollRef}>
        {booting ? <div className="boot" onClick={() => setBooting(false)}><strong>PRINCE.OS <span>v1.0</span></strong><p>Initializing system...</p><p>Loading profile<span>........ OK</span></p><p>Loading experience<span>.... OK</span></p><p>Loading projects<span>...... OK</span></p><p>Loading skills<span>........ OK</span></p><p className="ready">System ready.</p><small>click to skip</small></div> : <>
          <div className="intro">
            <p className="system">SYSTEM ONLINE</p>
            <pre className="ascii-banner" aria-label="Prince OS">{`██████╗ ██████╗ ██╗███╗   ██╗ ██████╗███████╗     ██████╗ ███████╗
██╔══██╗██╔══██╗██║████╗  ██║██╔════╝██╔════╝    ██╔═══██╗██╔════╝
██████╔╝██████╔╝██║██╔██╗ ██║██║     █████╗      ██║   ██║███████╗
██╔═══╝ ██╔══██╗██║██║╚██╗██║██║     ██╔══╝      ██║   ██║╚════██║
██║     ██║  ██║██║██║ ╚████║╚██████╗███████╗ ██ ╚██████╔╝███████║
╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝     ╚═════╝ ╚══════╝`}</pre>
            <p className="identity-name">PRINCE AMPOFO</p>
            <div className="identity-meta"><p>{context.profile.title}</p><p className="headline">{context.profile.headline}</p></div>
          </div>
          {entries.map((entry, index) => <div className="terminal-entry" key={`${entry.input}-${index}`}><div className="input-line"><Prompt /> <span>{entry.input}</span></div><div className="output">{entry.output}</div></div>)}
          <form className="input-line active" onSubmit={(event: FormEvent) => { event.preventDefault(); execute(); }}><Prompt /><input ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={handleKeyDown} aria-label="Terminal command or portfolio question" autoComplete="off" spellCheck="false" /></form>
          {entries.length === 0 && <p className="start-hint">Type <button onClick={() => execute("help")}>help</button> to explore <span>·</span> ↑↓ history <span>·</span> Tab autocomplete</p>}
        </>}
      </div>
    </div>
  </main>;
}
