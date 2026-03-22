"use client";

import { useState, useEffect } from "react";

type EventColor = "blue" | "teal" | "green" | "orange" | "purple" | "red" | "pink";

type Recurrence =
  | { type: "none"; date: string }
  | { type: "weekly"; days: number[] };

interface ScheduleEvent {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  color: EventColor;
  isTemplate: boolean;
  recurrence: Recurrence;
  deletedOn?: string[];
}

const COLOR_BG: Record<EventColor, string> = {
  blue:   "bg-blue-500/15 border-blue-500/30",
  teal:   "bg-teal-500/15 border-teal-500/30",
  green:  "bg-green-500/15 border-green-500/30",
  orange: "bg-orange-500/15 border-orange-500/30",
  purple: "bg-purple-500/15 border-purple-500/30",
  red:    "bg-red-500/15 border-red-500/30",
  pink:   "bg-pink-500/15 border-pink-500/30",
};
const COLOR_BAR: Record<EventColor, string> = {
  blue:   "bg-blue-500",
  teal:   "bg-teal-400",
  green:  "bg-green-500",
  orange: "bg-orange-400",
  purple: "bg-purple-500",
  red:    "bg-red-500",
  pink:   "bg-pink-400",
};
const COLOR_DOT: Record<EventColor, string> = {
  blue:   "bg-blue-500",
  teal:   "bg-teal-400",
  green:  "bg-green-500",
  orange: "bg-orange-400",
  purple: "bg-purple-500",
  red:    "bg-red-500",
  pink:   "bg-pink-400",
};
const COLOR_TEXT: Record<EventColor, string> = {
  blue:   "text-blue-400",
  teal:   "text-teal-400",
  green:  "text-green-400",
  orange: "text-orange-400",
  purple: "text-purple-400",
  red:    "text-red-400",
  pink:   "text-pink-400",
};

const COLOR_OPTIONS: { value: EventColor; label: string }[] = [
  { value: "blue",   label: "Niebieski" },
  { value: "teal",   label: "Morski"    },
  { value: "green",  label: "Zielony"   },
  { value: "orange", label: "Pomarańcz" },
  { value: "purple", label: "Fioletowy" },
  { value: "red",    label: "Czerwony"  },
  { value: "pink",   label: "Różowy"    },
];

function tmpl(id: string, date: string, title: string, location: string, start: string, end: string, color: EventColor): ScheduleEvent {
  return { id, title, location, startTime: start, endTime: end, color, isTemplate: true, recurrence: { type: "none", date } };
}

const TEMPLATE: ScheduleEvent[] = [
  tmpl("t-0321-1", "2026-03-21", "Logika",               "KW1", "09:50", "11:30", "blue"),
  tmpl("t-0321-2", "2026-03-21", "Emocje i motywacja",   "C11", "15:35", "19:05", "orange"),
  tmpl("t-0322-1", "2026-03-22", "Neuropsychologia",     "W1",  "09:50", "11:30", "teal"),
  tmpl("t-0322-2", "2026-03-22", "Emocje i motywacja",   "C11", "15:35", "19:05", "orange"),
  tmpl("t-0328-1", "2026-03-28", "Neuropsychologia",     "W1",  "08:00", "10:35", "teal"),
  tmpl("t-0328-2", "2026-03-28", "Emocje i motywacja",   "",    "10:40", "13:15", "orange"),
  tmpl("t-0328-3", "2026-03-28", "Historia myśli psych.","W1",  "13:35", "16:10", "green"),
  tmpl("t-0328-4", "2026-03-28", "Psych. różnic indyw.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0329-1", "2026-03-29", "Neuropsychologia",     "W1",  "08:00", "10:35", "teal"),
  tmpl("t-0329-2", "2026-03-29", "Emocje i motywacja",   "",    "10:40", "13:15", "orange"),
  tmpl("t-0329-3", "2026-03-29", "Historia myśli psych.","W1",  "13:35", "16:10", "green"),
  tmpl("t-0329-4", "2026-03-29", "Psych. różnic indyw.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0418-1", "2026-04-18", "Metodologia badań",    "W1",  "08:00", "09:40", "green"),
  tmpl("t-0418-2", "2026-04-18", "Metodologia badań",    "W1",  "09:45", "12:20", "green"),
  tmpl("t-0418-3", "2026-04-18", "Logika",               "KW1", "13:35", "15:15", "blue"),
  tmpl("t-0418-4", "2026-04-18", "Psych. eduk.-wychow.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0419-1", "2026-04-19", "Metodologia badań",    "W1",  "08:00", "09:40", "green"),
  tmpl("t-0419-2", "2026-04-19", "Metodologia badań",    "W1",  "09:45", "12:20", "green"),
  tmpl("t-0419-3", "2026-04-19", "Logika",               "KW1", "13:35", "15:15", "blue"),
  tmpl("t-0419-4", "2026-04-19", "Psych. eduk.-wychow.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0425-1", "2026-04-25", "Emocje i motywacja",   "C11", "15:35", "19:05", "orange"),
  tmpl("t-0509-1", "2026-05-09", "Neuropsychologia",     "W1",  "08:00", "10:35", "teal"),
  tmpl("t-0509-2", "2026-05-09", "Emocje i motywacja",   "",    "10:40", "13:15", "orange"),
  tmpl("t-0509-3", "2026-05-09", "Historia myśli psych.","W1",  "13:35", "16:10", "green"),
  tmpl("t-0509-4", "2026-05-09", "Psych. różnic indyw.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0510-1", "2026-05-10", "Neuropsychologia",     "W1",  "08:00", "10:35", "teal"),
  tmpl("t-0510-2", "2026-05-10", "Emocje i motywacja",   "",    "10:40", "13:15", "orange"),
  tmpl("t-0510-3", "2026-05-10", "Historia myśli psych.","W1",  "13:35", "16:10", "green"),
  tmpl("t-0510-4", "2026-05-10", "Psych. różnic indyw.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0516-1", "2026-05-16", "Metodologia badań",    "W1",  "08:00", "09:40", "green"),
  tmpl("t-0516-2", "2026-05-16", "Metodologia badań",    "W1",  "09:45", "12:20", "green"),
  tmpl("t-0516-3", "2026-05-16", "Logika",               "KW1", "13:35", "15:15", "blue"),
  tmpl("t-0516-4", "2026-05-16", "Emocje i motywacja",   "C11", "14:30", "16:10", "orange"),
  tmpl("t-0516-5", "2026-05-16", "Psych. eduk.-wychow.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0517-1", "2026-05-17", "Metodologia badań",    "W1",  "08:00", "09:40", "green"),
  tmpl("t-0517-2", "2026-05-17", "Metodologia badań",    "W1",  "09:45", "12:20", "green"),
  tmpl("t-0517-3", "2026-05-17", "Logika",               "KW1", "13:35", "15:15", "blue"),
  tmpl("t-0517-4", "2026-05-17", "Emocje i motywacja",   "C11", "14:30", "16:10", "orange"),
  tmpl("t-0517-5", "2026-05-17", "Psych. eduk.-wychow.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0530-1", "2026-05-30", "Logika",               "KW1", "09:50", "11:30", "blue"),
  tmpl("t-0531-1", "2026-05-31", "Logika",               "KW1", "09:50", "11:30", "blue"),
  tmpl("t-0613-1", "2026-06-13", "Metodologia badań",    "W1",  "08:00", "09:40", "green"),
  tmpl("t-0613-2", "2026-06-13", "Metodologia badań",    "W1",  "10:40", "13:15", "green"),
  tmpl("t-0613-3", "2026-06-13", "Logika",               "KW1", "13:35", "15:15", "blue"),
  tmpl("t-0613-4", "2026-06-13", "Emocje i motywacja",   "C11", "14:30", "16:10", "orange"),
  tmpl("t-0613-5", "2026-06-13", "Psych. eduk.-wychow.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0614-1", "2026-06-14", "Metodologia badań",    "W1",  "08:00", "09:40", "green"),
  tmpl("t-0614-2", "2026-06-14", "Metodologia badań",    "W1",  "10:40", "13:15", "green"),
  tmpl("t-0614-3", "2026-06-14", "Logika",               "KW1", "13:35", "15:15", "blue"),
  tmpl("t-0614-4", "2026-06-14", "Emocje i motywacja",   "C11", "14:30", "16:10", "orange"),
  tmpl("t-0614-5", "2026-06-14", "Psych. eduk.-wychow.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0620-1", "2026-06-20", "Neuropsychologia",     "W1",  "08:00", "10:35", "teal"),
  tmpl("t-0620-2", "2026-06-20", "Emocje i motywacja",   "",    "10:40", "13:15", "orange"),
  tmpl("t-0620-3", "2026-06-20", "Historia myśli psych.","W1",  "13:35", "16:10", "green"),
  tmpl("t-0620-4", "2026-06-20", "Psych. różnic indyw.", "W1",  "18:45", "21:20", "purple"),
  tmpl("t-0621-1", "2026-06-21", "Neuropsychologia",     "W1",  "08:00", "10:35", "teal"),
  tmpl("t-0621-2", "2026-06-21", "Emocje i motywacja",   "",    "10:40", "13:15", "orange"),
  tmpl("t-0621-3", "2026-06-21", "Historia myśli psych.","W1",  "13:35", "16:10", "green"),
  tmpl("t-0621-4", "2026-06-21", "Psych. różnic indyw.", "W1",  "18:45", "21:20", "purple"),
];

const CUSTOM_KEY  = "plan_studia_custom_v1";
const DELETED_KEY = "plan_studia_deleted_tpl_v1";

function loadCustom(): ScheduleEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]"); } catch { return []; }
}
function saveCustom(ev: ScheduleEvent[]) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(ev)); }
function loadDeleted(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(DELETED_KEY) ?? "[]"); } catch { return []; }
}
function saveDeleted(ids: string[]) { localStorage.setItem(DELETED_KEY, JSON.stringify(ids)); }

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function pad(n: number) { return String(n).padStart(2, "0"); }
function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function dow(iso: string) { return new Date(iso + "T00:00:00").getDay(); }

const PL_MONTHS = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];
const PL_DAYS_L = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];
const PL_DAYS_S = ["Nd","Pn","Wt","Śr","Cz","Pt","Sb"];

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${PL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function buildDayMap(custom: ScheduleEvent[], deletedTpl: string[], from: string, to: string): Map<string, ScheduleEvent[]> {
  const map = new Map<string, ScheduleEvent[]>();
  function push(date: string, ev: ScheduleEvent) {
    if (date < from || date > to) return;
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(ev);
  }
  for (const ev of TEMPLATE) {
    if (deletedTpl.includes(ev.id)) continue;
    if (ev.recurrence.type === "none") push(ev.recurrence.date, ev);
  }
  for (const ev of custom) {
    if (ev.recurrence.type === "none") {
      const d = ev.recurrence.date;
      if (!(ev.deletedOn ?? []).includes(d)) push(d, ev);
    } else {
      let cur = from;
      while (cur <= to) {
        if (ev.recurrence.days.includes(dow(cur)) && !(ev.deletedOn ?? []).includes(cur)) push(cur, ev);
        cur = addDays(cur, 1);
      }
    }
  }
  for (const [, evs] of map) evs.sort((a, b) => a.startTime.localeCompare(b.startTime));
  return map;
}

interface FormState {
  title: string; location: string; startTime: string; endTime: string;
  color: EventColor; recurrenceType: "none" | "weekly"; date: string; days: number[];
}
function blankForm(date?: string): FormState {
  return { title: "", location: "", startTime: "08:00", endTime: "10:00",
           color: "blue", recurrenceType: "none", date: date ?? todayISO(), days: [] };
}

export default function PlanStudia() {
  const [custom,     setCustom]     = useState<ScheduleEvent[]>([]);
  const [deletedTpl, setDeletedTpl] = useState<string[]>([]);
  const [editMode,   setEditMode]   = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState<ScheduleEvent | null>(null);
  const [form,       setForm]       = useState<FormState>(blankForm());
  const [showAll,    setShowAll]    = useState(false);

  useEffect(() => { setCustom(loadCustom()); setDeletedTpl(loadDeleted()); }, []);

  const today  = todayISO();
  const to     = addDays(today, 300);
  const dayMap = buildDayMap(custom, deletedTpl, today, to);
  const allDates = Array.from(dayMap.keys()).sort();

  interface Session { label: string; dates: string[] }
  const sessions: Session[] = [];
  const seen = new Set<string>();
  for (const date of allDates) {
    if (seen.has(date)) continue;
    const grp: string[] = [date];
    seen.add(date);
    if (dow(date) === 6) {
      const next = addDays(date, 1);
      if (dayMap.has(next) && !seen.has(next)) { grp.push(next); seen.add(next); }
    }
    const first = grp[0], last = grp[grp.length - 1];
    const label = first === last
      ? `${PL_DAYS_L[dow(first)]}, ${fmtDate(first)}`
      : `${fmtDate(first).replace(/ \d{4}$/, "")} – ${fmtDate(last)}`;
    sessions.push({ label, dates: grp });
  }

  const visibleSessions = showAll ? sessions : sessions.slice(0, 4);

  function openAdd(date?: string) { setEditTarget(null); setForm(blankForm(date)); setShowModal(true); }
  function openEdit(ev: ScheduleEvent) {
    setEditTarget(ev);
    setForm({ title: ev.title, location: ev.location, startTime: ev.startTime, endTime: ev.endTime,
              color: ev.color, recurrenceType: ev.recurrence.type,
              date: ev.recurrence.type === "none" ? ev.recurrence.date : today,
              days: ev.recurrence.type === "weekly" ? ev.recurrence.days : [] });
    setShowModal(true);
  }

  function saveForm() {
    if (!form.title.trim()) return;
    const recurrence: Recurrence = form.recurrenceType === "weekly"
      ? { type: "weekly", days: form.days }
      : { type: "none", date: form.date };
    if (editTarget && !editTarget.isTemplate) {
      const updated = custom.map((e) => e.id === editTarget.id
        ? { ...e, title: form.title, location: form.location, startTime: form.startTime, endTime: form.endTime, color: form.color, recurrence }
        : e);
      setCustom(updated); saveCustom(updated);
    } else {
      const ev: ScheduleEvent = { id: `u-${Date.now()}`, title: form.title.trim(), location: form.location.trim(),
        startTime: form.startTime, endTime: form.endTime, color: form.color, isTemplate: false, recurrence };
      const updated = [...custom, ev];
      setCustom(updated); saveCustom(updated);
    }
    setShowModal(false); setEditTarget(null);
  }

  function deleteEvent(ev: ScheduleEvent) {
    if (ev.isTemplate) { const u = [...deletedTpl, ev.id]; setDeletedTpl(u); saveDeleted(u); }
    else { const u = custom.filter((e) => e.id !== ev.id); setCustom(u); saveCustom(u); }
  }

  function restoreAll() { setDeletedTpl([]); saveDeleted([]); }

  return (
    <div className="flex flex-col min-h-dvh bg-zinc-950 pb-10">
      <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white leading-tight">Plan studiów</h1>
          <p className="text-[11px] text-zinc-500">Psychologia kliniczna · sem. IV · 2026 L</p>
        </div>
        <div className="flex gap-2 items-center">
          {deletedTpl.length > 0 && (
            <button onClick={restoreAll} className="text-xs text-yellow-400 border border-yellow-400/30 rounded-xl px-3 py-1.5">
              Przywróć ({deletedTpl.length})
            </button>
          )}
          <button onClick={() => setEditMode((v) => !v)}
            className={`text-xs font-medium rounded-xl px-3 py-1.5 border transition-colors ${editMode ? "bg-yellow-400 text-zinc-900 border-yellow-400" : "border-zinc-700 text-zinc-400"}`}>
            {editMode ? "Gotowe" : "Edytuj"}
          </button>
          <button onClick={() => openAdd()} className="w-8 h-8 rounded-xl bg-yellow-400 text-zinc-900 text-lg font-bold flex items-center justify-center">+</button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        {sessions.length === 0 && (
          <div className="flex flex-col items-center gap-3 mt-20 text-center">
            <span className="text-5xl">📅</span>
            <p className="text-white font-semibold">Brak nadchodzących zajęć</p>
            <p className="text-zinc-500 text-sm">Naciśnij + aby dodać własne zadanie</p>
          </div>
        )}
        {visibleSessions.map((session, si) => (
          <SessionBlock key={si} session={session} dayMap={dayMap} today={today}
            editMode={editMode} onAddDay={openAdd} onEdit={openEdit} onDelete={deleteEvent} />
        ))}
        {sessions.length > 4 && (
          <button onClick={() => setShowAll((v) => !v)} className="text-sm text-yellow-400 font-medium text-center py-2">
            {showAll ? "Pokaż mniej ▲" : `Pokaż wszystkie (${sessions.length}) ▼`}
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={() => setShowModal(false)}>
          <div className="w-full bg-zinc-900 border border-zinc-800 rounded-t-3xl px-5 pt-4 pb-10 flex flex-col gap-4 max-h-[90dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-1" />
            <h2 className="text-white font-bold text-lg">{editTarget ? "Edytuj" : "Nowe zajęcia / zadanie"}</h2>
            <Field label="Tytuł *">
              <input className={INPUT} placeholder="np. Praca, Egzamin…" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Miejsce / sala">
              <input className={INPUT} placeholder="opcjonalnie" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <div className="flex gap-3">
              <Field label="Od" className="flex-1">
                <input type="time" className={INPUT} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </Field>
              <Field label="Do" className="flex-1">
                <input type="time" className={INPUT} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </Field>
            </div>
            <Field label="Kolor">
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c.value} onClick={() => setForm({ ...form, color: c.value })}
                    className={`w-8 h-8 rounded-full ${COLOR_DOT[c.value]} transition-transform ${form.color === c.value ? "scale-125 ring-2 ring-white/40" : "opacity-60"}`} />
                ))}
              </div>
            </Field>
            <Field label="Powtarzanie">
              <div className="flex gap-2">
                {(["none", "weekly"] as const).map((t) => (
                  <button key={t} onClick={() => setForm({ ...form, recurrenceType: t })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.recurrenceType === t ? "bg-yellow-400 text-zinc-900 border-yellow-400" : "border-zinc-700 text-zinc-400"}`}>
                    {t === "none" ? "Jednorazowo" : "Co tydzień"}
                  </button>
                ))}
              </div>
            </Field>
            {form.recurrenceType === "none" && (
              <Field label="Data">
                <input type="date" className={INPUT} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Field>
            )}
            {form.recurrenceType === "weekly" && (
              <Field label="Dni tygodnia">
                <div className="flex gap-1.5">
                  {PL_DAYS_S.map((d, i) => (
                    <button key={i} onClick={() => setForm({ ...form, days: form.days.includes(i) ? form.days.filter((x) => x !== i) : [...form.days, i] })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${form.days.includes(i) ? "bg-yellow-400 text-zinc-900 border-yellow-400" : "border-zinc-700 text-zinc-400"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </Field>
            )}
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-2xl border border-zinc-700 text-zinc-400 text-sm font-medium">Anuluj</button>
              <button onClick={saveForm} disabled={!form.title.trim() || (form.recurrenceType === "weekly" && form.days.length === 0)}
                className="flex-1 py-3 rounded-2xl bg-yellow-400 text-zinc-900 font-bold text-sm disabled:opacity-40">Zapisz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full mt-1 bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="text-xs text-zinc-500 font-medium">{label}</label>
      {children}
    </div>
  );
}

interface SessionBlockProps {
  session: { label: string; dates: string[] };
  dayMap: Map<string, ScheduleEvent[]>;
  today: string; editMode: boolean;
  onAddDay: (date: string) => void;
  onEdit: (ev: ScheduleEvent) => void;
  onDelete: (ev: ScheduleEvent) => void;
}

function SessionBlock({ session, dayMap, today, editMode, onAddDay, onEdit, onDelete }: SessionBlockProps) {
  const isPast = session.dates[session.dates.length - 1] < today;
  return (
    <div className={`rounded-2xl border overflow-hidden border-zinc-800 ${isPast ? "opacity-50" : ""}`}>
      <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-400">{session.label}{isPast ? " · zakończone" : ""}</p>
        {!isPast && !editMode && (
          <button onClick={() => onAddDay(session.dates[0])} className="text-yellow-400 text-xs font-medium">+ Dodaj</button>
        )}
      </div>
      {session.dates.map((date) => {
        const events = dayMap.get(date) ?? [];
        const isToday = date === today;
        return (
          <div key={date} className="bg-zinc-950">
            <div className={`flex items-center gap-2 px-4 pt-3 pb-1 ${isToday ? "border-l-2 border-yellow-400" : ""}`}>
              <span className={`text-xs font-bold ${isToday ? "text-yellow-400" : "text-zinc-400"}`}>{PL_DAYS_L[dow(date)]}</span>
              <span className="text-xs text-zinc-600">{fmtDate(date)}</span>
              {isToday && <span className="text-[10px] bg-yellow-400 text-zinc-900 font-bold px-2 py-0.5 rounded-full">dziś</span>}
            </div>
            <div className="flex flex-col gap-2 px-4 pb-3 pt-1">
              {events.length === 0
                ? <p className="text-xs text-zinc-700 py-1">Brak zajęć</p>
                : events.map((ev) => (
                    <EventCard key={ev.id + date} ev={ev} editMode={editMode} onEdit={() => onEdit(ev)} onDelete={() => onDelete(ev)} />
                  ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventCard({ ev, editMode, onEdit, onDelete }: { ev: ScheduleEvent; editMode: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className={`flex items-stretch gap-3 rounded-xl border px-3 py-2.5 ${COLOR_BG[ev.color]}`}>
      <div className={`w-1 rounded-full shrink-0 ${COLOR_BAR[ev.color]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight truncate">{ev.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`text-xs font-medium ${COLOR_TEXT[ev.color]}`}>{ev.startTime} – {ev.endTime}</span>
          {ev.location && <span className="text-xs text-zinc-500">· {ev.location}</span>}
        </div>
        {ev.recurrence.type === "weekly" && <span className="text-[10px] text-zinc-600 mt-0.5 block">↻ Co tydzień</span>}
      </div>
      {editMode && (
        <div className="flex flex-col gap-1 justify-center shrink-0">
          {!ev.isTemplate && (
            <button onClick={onEdit} className="text-[10px] text-yellow-400 bg-yellow-400/10 rounded-lg px-2 py-1 font-medium">Edytuj</button>
          )}
          <button onClick={onDelete} className="text-[10px] text-red-400 bg-red-400/10 rounded-lg px-2 py-1 font-medium">Usuń</button>
        </div>
      )}
    </div>
  );
}
