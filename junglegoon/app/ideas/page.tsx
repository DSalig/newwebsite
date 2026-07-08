"use client";

import { useState } from "react";
import Link from "next/link";
import { Idea, IdeaStatus, useIdeas } from "@/lib/store";
import { nicheById } from "@/lib/niches";

const COLUMNS: { status: IdeaStatus; label: string; hint: string }[] = [
  { status: "spark", label: "Sparks", hint: "raw signals worth a look" },
  { status: "researching", label: "Researching", hint: "numbers being run" },
  { status: "validated", label: "Validated", hint: "worth sourcing samples" },
  { status: "shelved", label: "Shelved", hint: "not now, maybe later" },
];

function IdeaCard({ idea }: { idea: Idea }) {
  const { updateIdea, removeIdea } = useIdeas();
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(idea.notes);
  const niche = idea.nicheId ? nicheById(idea.nicheId) : undefined;

  return (
    <div className="panel" style={{ padding: "12px 14px" }}>
      <div style={{ fontWeight: 700 }}>{idea.title}</div>
      <div className="sub-cell" style={{ margin: "2px 0 8px" }}>
        {idea.source} · {new Date(idea.createdAt).toLocaleDateString()}
      </div>

      {editing ? (
        <textarea
          className="input"
          style={{ width: "100%", minHeight: 70, resize: "vertical" }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      ) : (
        idea.notes && <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{idea.notes}</div>
      )}

      {niche && (
        <div style={{ marginTop: 8 }}>
          <Link className="pill info" href={`/keywords?niche=${niche.id}`}>
            {niche.name} · opp {niche.scores.opportunity}/10
          </Link>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        <select
          className="select"
          style={{ padding: "3px 6px", fontSize: 12 }}
          value={idea.status}
          onChange={(e) => updateIdea(idea.id, { status: e.target.value as IdeaStatus })}
        >
          {COLUMNS.map((c) => (
            <option key={c.status} value={c.status}>
              {c.label}
            </option>
          ))}
        </select>
        {editing ? (
          <button
            className="btn small"
            onClick={() => {
              updateIdea(idea.id, { notes });
              setEditing(false);
            }}
          >
            Save
          </button>
        ) : (
          <button className="btn small ghost" onClick={() => setEditing(true)}>
            Edit notes
          </button>
        )}
        <button className="btn small ghost" onClick={() => removeIdea(idea.id)} title="Delete idea">
          ✕
        </button>
      </div>
    </div>
  );
}

export default function IdeaVault() {
  const { ideas, addIdea } = useIdeas();
  const [title, setTitle] = useState("");

  return (
    <>
      <div className="page-head">
        <h1>Idea Vault</h1>
        <p>
          Brand and product ideas, wherever they came from — a Trend Radar spike, a niche score, or a
          shower thought. Ideas live in your browser&apos;s local storage; nothing leaves your machine.
        </p>
      </div>

      <div className="controls">
        <input
          className="input"
          style={{ width: 320 }}
          placeholder="Add an idea by hand…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) {
              addIdea({ title: title.trim(), source: "manual", notes: "" });
              setTitle("");
            }
          }}
        />
        <button
          className="btn primary"
          disabled={!title.trim()}
          onClick={() => {
            addIdea({ title: title.trim(), source: "manual", notes: "" });
            setTitle("");
          }}
        >
          Add idea
        </button>
      </div>

      {ideas.length === 0 ? (
        <div className="empty">
          Nothing in the vault yet. Save trends from <Link href="/trends">Trend Radar</Link> or
          niches from the <Link href="/niches">Niche Finder</Link>.
        </div>
      ) : (
        <div className="grid-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {COLUMNS.map((col) => {
            const items = ideas.filter((i) => i.status === col.status);
            return (
              <section key={col.status}>
                <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-2)" }}>
                  {col.label} <span className="muted">({items.length})</span>
                </h2>
                <p className="muted" style={{ marginTop: -6, fontSize: 12 }}>
                  {col.hint}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map((i) => (
                    <IdeaCard key={i.id} idea={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
