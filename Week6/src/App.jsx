import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* =========================
   Storage
========================= */
const STORAGE_KEY = "week6_todos_v4";
const THEME_KEY = "week6_theme_v1";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const PRIORITY = [
  { key: "low", label: "Low", pill: "bg-emerald-400/15 text-emerald-200 border-emerald-400/20" },
  { key: "med", label: "Med", pill: "bg-amber-400/15 text-amber-200 border-amber-400/20" },
  { key: "high", label: "High", pill: "bg-rose-400/15 text-rose-200 border-rose-400/20" },
];

const FEATURE_TAGS = [
  "Add",
  "Complete",
  "Edit",
  "Delete",
  "Delete all",
  "Filter",
  "Search",
  "Sort",
  "Priority",
  "Due date/time",
  "Reorder",
  "Persist",
  "Import/Export",
  "Shortcuts",
  "Progress",
  "Theme",
];
/* =========================
   Helpers
========================= */
function formatNow(d) {
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDateTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

function fmtTime(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function isOverdue(dueDate, dueTime, completed) {
  if (!dueDate || completed) return false;

  const [y, mo, da] = dueDate.split("-").map(Number);
  const d = new Date(y, mo - 1, da);

  if (dueTime) {
    const [h, m] = dueTime.split(":").map(Number);
    d.setHours(h, m, 0, 0);
  } else {
    d.setHours(23, 59, 59, 999);
  }

  return d.getTime() < Date.now();
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-100">{value}</p>
    </div>
  );
}

function ProgressRing({ value = 0, isLight = false }) {
  const size = 46;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="block">
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke={isLight ? "rgba(15,23,42,.14)" : "rgba(255,255,255,.12)"}
          strokeWidth={stroke}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="rgba(34,211,238,.9)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="leading-tight">
        <div className={`${isLight ? "text-slate-500" : "text-slate-400"} text-xs`}>
          Progress
        </div>
        <div className={`${isLight ? "text-slate-900" : "text-slate-100"} text-sm font-semibold`}>
          {pct}%
        </div>
      </div>
    </div>
  );
}

function DragHandle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80">
      <path
        d="M9 7h.01M9 12h.01M9 17h.01M15 7h.01M15 12h.01M15 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SortableTodoItem({
  todo,
  onToggle,
  onDelete,
  onRename,
  onSetPriority,
  onSetDueDate,
  onSetDueTime,
  allowDrag,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const editRef = useRef(null);

  useEffect(() => setDraft(todo.text), [todo.text]);
  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    disabled: !allowDrag,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const pri = PRIORITY.find((p) => p.key === todo.priority) ?? PRIORITY[0];
  const overdue = isOverdue(todo.dueDate, todo.dueTime, todo.completed);

  const save = () => {
    const v = draft.trim();
    if (!v) return;
    onRename(todo.id, v);
    setEditing(false);
    toast.success("Task updated");
  };

  const cancel = () => {
    setDraft(todo.text);
    setEditing(false);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      ref={setNodeRef}
      style={style}
      className={[
        "group flex items-start justify-between gap-3 rounded-2xl border bg-slate-900/35 px-4 py-3 transition",
        "border-white/10 hover:bg-slate-900/55",
        isDragging ? "ring-2 ring-cyan-400/30 bg-slate-900/70" : "",
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Drag handle */}
        <button
          type="button"
          className={[
            "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10",
            !allowDrag ? "opacity-40 cursor-not-allowed" : "",
          ].join(" ")}
          title={allowDrag ? "Drag to reorder" : "Reorder is disabled while sorting/filtering/searching"}
          {...attributes}
          {...listeners}
          disabled={!allowDrag}
        >
          <DragHandle />
        </button>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${todo.completed
            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
            : "border-white/10 bg-white/5 hover:bg-white/10 text-slate-200"
            }`}
          title={todo.completed ? "Mark active" : "Mark complete"}
        >
          {todo.completed ? "✓" : ""}
        </button>

        <div className="min-w-0 flex-1">
          {!editing ? (
            <button
              type="button"
              onDoubleClick={() => setEditing(true)}
              className="w-full text-left"
              title="Double-click to edit"
            >
              <p className={`truncate text-sm ${todo.completed ? "text-slate-400 line-through" : "text-slate-100"}`}>
                {todo.text}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${pri.pill}`}>
                  Priority: {pri.label}
                </span>

                {todo.dueDate ? (
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
                      overdue
                        ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
                        : "border-white/10 bg-white/5 text-slate-200",
                    ].join(" ")}
                  >
                    Due: {fmtDate(todo.dueDate)}
                    {todo.dueTime ? ` • ${fmtTime(todo.dueTime)}` : ""}
                    {overdue ? " • Overdue" : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                    No due date
                  </span>
                )}

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                  Created: {formatDateTime(todo.createdAt)}
                </span>
              </div>
            </button>
          ) : (
            <div className="w-full">
              <input
                ref={editRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") cancel();
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-400/30"
              />

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={save}
                  className="rounded-xl bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/15"
                >
                  Save (Enter)
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  Cancel (Esc)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex gap-2">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10 sm:opacity-0 sm:group-hover:opacity-100"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onDelete(todo.id);
              toast.success("Task deleted");
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10 hover:text-rose-200"
          >
            Delete
          </button>
        </div>

        <div className="flex w-full max-w-[260px] flex-col gap-2">
          <select
            value={todo.priority}
            onChange={(e) => {
              onSetPriority(todo.id, e.target.value);
              toast.success("Priority updated");
            }}
            className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/20"
          >
            {PRIORITY.map((p) => (
              <option key={p.key} value={p.key}>
                Priority: {p.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={todo.dueDate || ""}
              onChange={(e) => {
                onSetDueDate(todo.id, e.target.value || null);
                toast.success("Due date updated");
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/20"
              title="Due date"
            />

            <input
              type="time"
              value={todo.dueTime || ""}
              onChange={(e) => {
                onSetDueTime(todo.id, e.target.value || null);
                toast.success("Due time updated");
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/20"
              title="Due time"
            />
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");


  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  // TEMP SORT (view-only)
  const [sortBy, setSortBy] = useState("manual"); // manual | due | priority | created
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  const [newPriority, setNewPriority] = useState("med");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDueTime, setNewDueTime] = useState("");

  const [now, setNow] = useState(() => new Date());

  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const importRef = useRef(null);

  // live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // persist todos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // persist theme
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;

      // Ctrl+K focus search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // "/" focus add task (like Notion), only if not typing
      if (!typing && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // Esc clears search
      if (e.key === "Escape") {
        if (document.activeElement === searchRef.current) {
          setQuery("");
          searchRef.current?.blur();
          return;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return { total, completed, active: total - completed };
  }, [todos]);

  const progressPct = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  const baseList = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list =
      filter === "active"
        ? todos.filter((t) => !t.completed)
        : filter === "completed"
          ? todos.filter((t) => t.completed)
          : todos;

    if (q) list = list.filter((t) => t.text.toLowerCase().includes(q));
    return list;
  }, [todos, filter, query]);

  // TEMP sorting (view-only)
  const visible = useMemo(() => {
    const list = [...baseList];

    const dir = sortDir === "asc" ? 1 : -1;

    const prioRank = (p) => (p === "high" ? 3 : p === "med" ? 2 : 1);
    const dueStamp = (t) => {
      if (!t.dueDate) return Number.POSITIVE_INFINITY;
      const [y, mo, da] = t.dueDate.split("-").map(Number);
      const d = new Date(y, mo - 1, da);
      if (t.dueTime) {
        const [h, m] = t.dueTime.split(":").map(Number);
        d.setHours(h, m, 0, 0);
      } else {
        d.setHours(23, 59, 59, 999);
      }
      return d.getTime();
    };

    if (sortBy === "due") {
      list.sort((a, b) => (dueStamp(a) - dueStamp(b)) * dir);
    } else if (sortBy === "priority") {
      list.sort((a, b) => (prioRank(a.priority) - prioRank(b.priority)) * dir);
    } else if (sortBy === "created") {
      list.sort((a, b) => ((a.createdAt || 0) - (b.createdAt || 0)) * dir);
    }

    return list;
  }, [baseList, sortBy, sortDir]);

  // Reorder only allowed when manual sorting AND no search/filter messing with view
  const allowDrag = useMemo(() => {
    const cleanView = filter === "all" && query.trim() === "" && sortBy === "manual";
    return cleanView;
  }, [filter, query, sortBy]);

  /* =========================
     CRUD
  ========================= */
  const addTodo = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;

    const item = {
      id: uid(),
      text: v,
      completed: false,
      priority: newPriority,
      dueDate: newDueDate || null,
      dueTime: newDueTime || null,
      createdAt: Date.now(),
    };

    setTodos((prev) => [item, ...prev]);
    setText("");
    toast.success("Task added");
    inputRef.current?.focus();
  };

  const toggle = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    toast.success("Task updated");
  };

  const rename = (id, nextText) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: nextText } : t)));

  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const setPriority = (id, p) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, priority: p } : t)));

  const setDueDate = (id, due) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, dueDate: due } : t)));

  const setDueTime = (id, tm) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, dueTime: tm } : t)));

  const clearCompleted = () => {
    const before = todos.length;
    setTodos((prev) => prev.filter((t) => !t.completed));
    if (before !== todos.length) toast.success("Completed tasks cleared");
  };

  const deleteAll = () => {
    if (todos.length === 0) return;
    const ok = confirm("Delete ALL tasks? This cannot be undone.");
    if (ok) {
      setTodos([]);
      toast.success("All tasks deleted");
    }
  };

  /* =========================
     DnD reorder (manual mode only)
  ========================= */
  const onDragEnd = (event) => {
    if (!allowDrag) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTodos((prev) => {
      const ids = visible.map((t) => t.id);
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const movedIds = arrayMove(ids, oldIndex, newIndex);

      const map = new Map(prev.map((t) => [t.id, t]));
      const moved = movedIds.map((id) => map.get(id)).filter(Boolean);

      const movedSet = new Set(movedIds);
      const rest = prev.filter((t) => !movedSet.has(t.id));

      toast.success("Reordered");
      return [...moved, ...rest];
    });
  };

  /* =========================
     Import / Export
  ========================= */
  const exportJSON = () => {
    const payload = {
      version: 1,
      exportedAt: Date.now(),
      todos,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `week6-todos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
    toast.success("Exported JSON");
  };

  const onImportFile = async (file) => {
    try {
      const txt = await file.text();
      const parsed = JSON.parse(txt);

      const incoming = Array.isArray(parsed) ? parsed : parsed?.todos;
      if (!Array.isArray(incoming)) throw new Error("Invalid file format");

      const sanitized = incoming
        .filter((t) => t && typeof t.text === "string")
        .map((t) => ({
          id: t.id || uid(),
          text: String(t.text).slice(0, 200),
          completed: Boolean(t.completed),
          priority: ["low", "med", "high"].includes(t.priority) ? t.priority : "med",
          dueDate: t.dueDate || null,
          dueTime: t.dueTime || null,
          createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
        }));

      setTodos(sanitized);
      toast.success(`Imported ${sanitized.length} tasks`);
    } catch (err) {
      toast.error("Import failed (bad JSON)");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };

  /* =========================
     Theme toggle
  ========================= */
  const isLight = theme === "light";

  return (
    <div className={isLight ? "min-h-screen bg-slate-50 text-slate-900" : "min-h-screen bg-slate-950 text-slate-100"}>
      <Toaster position="top-right" toastOptions={{ duration: 1800 }} />

      {/* Local keyframes for ticker */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -top-44 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl ${isLight ? "bg-fuchsia-500/15" : "bg-fuchsia-500/20"}`} />
        <div className={`absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full blur-3xl ${isLight ? "bg-cyan-400/10" : "bg-cyan-400/10"}`} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-7 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">To-Do App</h1>
              <p className={isLight ? "mt-1 text-sm text-slate-600" : "mt-1 text-sm text-slate-400"}>
                A clean todo app with real UX.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ProgressRing value={progressPct} />

              <button
                type="button"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur-xl transition ${isLight
                  ? "border-slate-200 bg-white/70 hover:bg-white"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                title="Toggle theme"
              >
                {isLight ? "☀ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>

          {/* Date/time ticker (animated slider) */}
          <div
            className={`overflow-hidden rounded-2xl border backdrop-blur-xl ${isLight ? "border-slate-200 bg-white/70" : "border-white/10 bg-white/5"
              }`}
          >
            <div className="relative">
              <div
                className="flex w-[200%] items-center gap-6 whitespace-nowrap py-2.5"
                style={{ animation: "marquee 18s linear infinite" }}
              >
                {/* duplicate content twice for seamless loop */}
                {[0, 1].map((k) => (
                  <div key={k} className="flex items-center gap-6 px-4">
                    <span className={isLight ? "text-sm text-slate-600" : "text-sm text-slate-300"}>
                      🕒 {formatNow(now)}
                    </span>
                    <span className={isLight ? "text-sm text-slate-600" : "text-sm text-slate-300"}>
                      ⌨ Ctrl+K = Search • / = Add • Esc = Clear Search
                    </span>
                    <span className={isLight ? "text-sm text-slate-600" : "text-sm text-slate-300"}>
                      💾 Persisted to LocalStorage • 📦 Import/Export JSON
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features section (chips) */}
          <div
            className={`rounded-2xl border p-4 backdrop-blur-xl ${isLight ? "border-slate-200 bg-white/70" : "border-white/10 bg-white/5"
              }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className={isLight ? "text-sm font-semibold text-slate-900" : "text-sm font-semibold text-slate-100"}>
                  Features
                </div>
                <div className={isLight ? "text-xs text-slate-600" : "text-xs text-slate-400"}>
                  Everything your To-Do needs (and more).
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {FEATURE_TAGS.map((t) => (
                  <span
                    key={t}
                    className={`rounded-full border px-2.5 py-1 text-xs ${isLight ? "border-slate-200 bg-slate-100 text-slate-700" : "border-white/10 bg-white/5 text-slate-200"
                      }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Total" value={stats.total} />
          <Stat label="Active" value={stats.active} />
          <Stat label="Completed" value={stats.completed} />
        </div>

        {/* Main card */}
        <main
          className={`rounded-3xl border p-6 backdrop-blur-xl shadow-2xl ${isLight ? "border-slate-200 bg-white/70" : "border-white/10 bg-white/5"
            }`}
        >
          {/* Add */}
          <form onSubmit={addTodo} className="flex flex-col gap-3 lg:flex-row">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new task… (Enter)"
              className={`flex-1 rounded-2xl border px-4 py-3 text-sm outline-none placeholder:opacity-70 focus:ring-2 ${isLight
                ? "border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:ring-fuchsia-400/20"
                : "border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus:ring-fuchsia-400/30"
                }`}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className={`rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 ${isLight
                  ? "border-slate-200 bg-white text-slate-900 focus:ring-cyan-400/20"
                  : "border-white/10 bg-slate-900/60 text-slate-100 focus:ring-cyan-400/20"
                  }`}
                title="Default priority"
              >
                {PRIORITY.map((p) => (
                  <option key={p.key} value={p.key}>
                    Priority: {p.label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className={`rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 ${isLight
                  ? "border-slate-200 bg-white text-slate-900 focus:ring-cyan-400/20"
                  : "border-white/10 bg-slate-900/60 text-slate-100 focus:ring-cyan-400/20"
                  }`}
                title="Default due date"
              />

              <input
                type="time"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                className={`rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 ${isLight
                  ? "border-slate-200 bg-white text-slate-900 focus:ring-cyan-400/20"
                  : "border-white/10 bg-slate-900/60 text-slate-100 focus:ring-cyan-400/20"
                  }`}
                title="Default due time"
              />

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:brightness-110 active:scale-95"
              >
                + Add
              </button>
            </div>
          </form>

          {/* Controls */}
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {["all", "active", "completed"].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-xl px-4 py-2 text-sm transition ${filter === key
                    ? isLight
                      ? "bg-slate-900 text-white"
                      : "bg-white/10 text-white"
                    : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {key[0].toUpperCase() + key.slice(1)}
                </button>
              ))}

              {/* Sorting (temporary) */}
              <div className="ml-0 flex flex-wrap items-center gap-2 sm:ml-3">
                <span className={isLight ? "text-xs text-slate-600" : "text-xs text-slate-400"}>Sort:</span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-sm outline-none ${isLight ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900/60 text-slate-100"
                    }`}
                  title="Temporary sorting (view-only)"
                >
                  <option value="manual">Manual (reorder)</option>
                  <option value="due">Due date/time</option>
                  <option value="priority">Priority</option>
                  <option value="created">Created time</option>
                </select>

                <select
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value)}
                  className={`rounded-xl border px-3 py-2 text-sm outline-none ${isLight ? "border-slate-200 bg-white" : "border-white/10 bg-slate-900/60 text-slate-100"
                    }`}
                  title="Sort direction"
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>

                {!allowDrag && sortBy !== "manual" && (
                  <span className="text-xs text-slate-400">
                    (Reorder disabled while sorting)
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks… (Ctrl+K)"
                className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none placeholder:opacity-70 focus:ring-2 sm:w-64 ${isLight
                  ? "border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:ring-cyan-400/20"
                  : "border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-400/20"
                  }`}
              />

              <button
                onClick={clearCompleted}
                disabled={stats.completed === 0}
                className="text-sm text-slate-400 transition hover:text-white disabled:opacity-40"
              >
                Clear completed
              </button>

              <button
                onClick={deleteAll}
                disabled={todos.length === 0}
                className={`rounded-xl border px-3 py-2 text-sm transition disabled:opacity-40 ${isLight
                  ? "border-slate-200 bg-white hover:bg-slate-50 hover:text-rose-600"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:text-rose-200"
                  }`}
              >
                Delete all
              </button>

              {/* Export / Import */}
              <button
                onClick={exportJSON}
                className={`rounded-xl border px-3 py-2 text-sm transition ${isLight ? "border-slate-200 bg-white hover:bg-slate-50" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                title="Export JSON"
              >
                Export
              </button>

              <button
                onClick={() => importRef.current?.click()}
                className={`rounded-xl border px-3 py-2 text-sm transition ${isLight ? "border-slate-200 bg-white hover:bg-slate-50" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                title="Import JSON"
              >
                Import
              </button>

              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImportFile(file);
                }}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Completion</span>
              <span>{progressPct}%</span>
            </div>
            <div className={`h-2 w-full overflow-hidden rounded-full ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* List */}
          <div className="mt-6">
            {visible.length === 0 ? (
              <div className={`rounded-2xl border border-dashed py-12 text-center ${isLight ? "border-slate-200 bg-white" : "border-white/15 bg-white/5"
                }`}>
                <div className={isLight ? "text-slate-600" : "text-slate-500"}>No tasks yet ✨</div>
                <div className={`mt-2 text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Tip: Double-click text to edit • Ctrl+K search • / add • Sort is view-only
                </div>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={visible.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <motion.ul layout className="space-y-3">
                    <AnimatePresence initial={false}>
                      {visible.map((todo) => (
                        <SortableTodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggle}
                          onDelete={remove}
                          onRename={rename}
                          onSetPriority={setPriority}
                          onSetDueDate={setDueDate}
                          onSetDueTime={setDueTime}
                          allowDrag={allowDrag}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        <footer className={isLight ? "mt-6 text-center text-xs text-slate-500" : "mt-6 text-center text-xs text-slate-500"}>
          Double-click to edit • Enter save • Esc cancel • Ctrl+K search • / add
        </footer>
      </div>
    </div>
  );
}