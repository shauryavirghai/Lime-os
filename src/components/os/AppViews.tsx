"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { APPS, type AppId } from "./catalog";
import { useOs } from "./OsContext";
import { AppIcon } from "./AppIcon";

export function AppView({ id }: { id: AppId }) {
  switch (id) {
    case "finder":
      return <Finder />;
    case "chrome":
      return <Chrome />;
    case "browser":
      return <Browser />;
    case "messages":
      return <Messages />;
    case "mail":
      return <Mail />;
    case "maps":
      return <Maps />;
    case "photos":
      return <Photos />;
    case "music":
      return <Music />;
    case "notes":
      return <Notes />;
    case "calendar":
      return <Calendar />;
    case "reminders":
      return <Reminders />;
    case "settings":
      return <Settings />;
    case "terminal":
      return <Terminal />;
    case "calculator":
      return <Calculator />;
    case "store":
      return <Store brand="app" />;
    case "playstore":
      return <Store brand="play" />;
    case "youtube":
      return <WebFrame title="YouTube" start="https://www.youtube.com" />;
    case "gmail":
      return <WebFrame title="Gmail" start="https://mail.google.com" />;
    case "textedit":
      return <TextEdit />;
    case "weather":
      return <Weather />;
    case "clock":
      return <ClockApp />;
    case "contacts":
      return <Contacts />;
    case "preview":
      return <Preview />;
    case "launchpad":
      return <LaunchpadInner />;
    default:
      return <div className="p-6">Unknown app</div>;
  }
}

function Pane({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`h-full overflow-auto ${className}`}>{children}</div>;
}

function Finder() {
  const { openApp } = useOs();
  const [path, setPath] = useState("Lime HD / Users / lime");
  const folders = [
    { name: "Desktop", app: "finder" as AppId },
    { name: "Documents", app: "textedit" as AppId },
    { name: "Downloads", app: "preview" as AppId },
    { name: "Applications", app: "launchpad" as AppId },
    { name: "Pictures", app: "photos" as AppId },
    { name: "Music", app: "music" as AppId },
    { name: "Notes", app: "notes" as AppId },
  ];
  return (
    <Pane className="flex text-[13px]">
      <aside className="w-44 shrink-0 border-r border-black/10 bg-black/5 p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide opacity-50">Favorites</p>
        {["AirDrop", "Recents", "Applications", "Desktop", "Documents", "Downloads"].map((i) => (
          <button
            type="button"
            key={i}
            className="block w-full rounded-md px-2 py-1 text-left hover:bg-black/10"
            onClick={() => setPath(`Lime HD / Users / lime / ${i}`)}
          >
            {i}
          </button>
        ))}
      </aside>
      <div className="flex-1 p-4">
        <p className="mb-4 opacity-50">{path}</p>
        <div className="grid grid-cols-4 gap-4">
          {folders.map((f) => (
            <button
              type="button"
              key={f.name}
              onDoubleClick={() => openApp(f.app)}
              className="rounded-xl p-3 hover:bg-black/10"
            >
              <div className="mx-auto mb-2 h-12 w-14 rounded-md bg-gradient-to-b from-[#7ec8ff] to-[#2f7de1]" />
              <div>{f.name}</div>
            </button>
          ))}
        </div>
        <p className="mt-6 opacity-40">Double-click a folder to open its app.</p>
      </div>
    </Pane>
  );
}

function goUrl(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

function WebFrame({ title, start }: { title: string; start: string }) {
  const [url, setUrl] = useState(start);
  const [src, setSrc] = useState(start);
  return (
    <Pane className="flex flex-col">
      <form
        className="flex gap-2 border-b border-black/10 p-2"
        onSubmit={(e) => {
          e.preventDefault();
          const next = goUrl(url);
          setUrl(next);
          setSrc(next);
        }}
      >
        <input
          className="flex-1 rounded-full bg-black/5 px-3 py-1 text-[13px] outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="rounded-full px-3 text-[13px] text-[#0066cc]" type="submit">
          Go
        </button>
      </form>
      <iframe title={title} src={src} className="min-h-0 flex-1 bg-white" />
    </Pane>
  );
}

function Browser() {
  return <WebFrame title="Glow" start="https://en.wikipedia.org/wiki/Operating_system" />;
}

function Chrome() {
  const [url, setUrl] = useState("https://www.google.com/webhp?igu=1");
  const [src, setSrc] = useState(url);
  const [tabs, setTabs] = useState(["New Tab"]);
  const [tab, setTab] = useState(0);
  const urlRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onShortcut = (e: Event) => {
      const name = (e as CustomEvent<string>).detail;
      if (name === "new-tab") {
        setTabs((t) => [...t, "New Tab"]);
        setTab((n) => n + 1);
      }
      if (name === "focus-url") urlRef.current?.focus();
      if (name === "reload") setSrc((s) => s);
    };
    window.addEventListener("lime-os-shortcut", onShortcut);
    return () => window.removeEventListener("lime-os-shortcut", onShortcut);
  }, []);
  return (
    <Pane className="flex flex-col bg-[#dee1e6]">
      <div className="flex items-end gap-1 bg-[#dee1e6] px-2 pt-1">
        {tabs.map((t, i) => (
          <button
            type="button"
            key={`${t}-${i}`}
            onClick={() => setTab(i)}
            className={`rounded-t-lg px-4 py-1.5 text-[12px] ${tab === i ? "bg-white" : "bg-[#c7c7c7]"}`}
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          className="px-2 pb-1 text-[16px] leading-none"
          onClick={() => setTabs((t) => [...t, "New Tab"])}
        >
          +
        </button>
      </div>
      <form
        className="flex items-center gap-2 bg-white px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          const q = url.trim();
          const next = q.includes(".") || q.startsWith("http") ? goUrl(q) : `https://www.google.com/search?q=${encodeURIComponent(q)}&igu=1`;
          setUrl(next);
          setSrc(next);
          setTabs((t) => t.map((name, i) => (i === tab ? "Chrome" : name)));
        }}
      >
        <span className="text-[12px] opacity-50">← → ↻</span>
        <input
          ref={urlRef}
          className="flex-1 rounded-full bg-[#f1f3f4] px-4 py-1.5 text-[13px] outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Search Google or type a URL"
        />
      </form>
      <iframe title="Chrome" src={src} className="min-h-0 flex-1 bg-white" />
    </Pane>
  );
}

function Messages() {
  const threads = ["Studio Team", "Limelightworld", "Design"];
  const [active, setActive] = useState(threads[0]);
  const [logs, setLogs] = useState<Record<string, string[]>>({
    "Studio Team": ["The Glow panel is locked.", "Ship Lime OS tonight?"],
    Limelightworld: ["Welcome to Lime OS."],
    Design: ["Try the dawn wallpaper."],
  });
  const [draft, setDraft] = useState("");
  return (
    <Pane className="flex">
      <aside className="w-44 border-r border-black/10">
        {threads.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setActive(t)}
            className={`block w-full px-3 py-3 text-left text-[13px] ${active === t ? "bg-[#c6f355]/40" : ""}`}
          >
            {t}
          </button>
        ))}
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-2 p-4 text-[13px]">
          {(logs[active] ?? []).map((m, i) => (
            <div key={i} className="max-w-[80%] rounded-2xl bg-[#30d158] px-3 py-2 text-white">
              {m}
            </div>
          ))}
        </div>
        <form
          className="p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setLogs((l) => ({ ...l, [active]: [...(l[active] ?? []), draft] }));
            setDraft("");
          }}
        >
          <input
            className="w-full rounded-full bg-black/5 px-4 py-2 text-[13px] outline-none"
            placeholder="iMessage"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </form>
      </div>
    </Pane>
  );
}

function Mail() {
  const mail = [
    { from: "Limelightworld", sub: "Your Lime ID is ready", body: "Welcome to Lime OS. The desktop is yours." },
    { from: "Glow Studio", sub: "Weekly light report", body: "Display calibration complete. Peak 1600 nits." },
    { from: "App Store", sub: "Updates available", body: "Music, Maps, and Notes have refinements waiting." },
  ];
  const [sel, setSel] = useState(0);
  return (
    <Pane className="flex text-[13px]">
      <aside className="w-56 border-r border-black/10">
        {mail.map((m, i) => (
          <button
            type="button"
            key={m.sub}
            onClick={() => setSel(i)}
            className={`block w-full px-3 py-3 text-left ${sel === i ? "bg-black/10" : ""}`}
          >
            <div className="font-medium">{m.from}</div>
            <div className="opacity-70">{m.sub}</div>
          </button>
        ))}
      </aside>
      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold">{mail[sel].sub}</h3>
        <p className="mt-1 opacity-50">{mail[sel].from}</p>
        <p className="mt-6 leading-relaxed">{mail[sel].body}</p>
      </div>
    </Pane>
  );
}

function Maps() {
  return (
    <Pane>
      <iframe
        title="Maps"
        className="h-full w-full"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-0.15,51.48,-0.08,51.52&layer=mapnik"
      />
    </Pane>
  );
}

function Photos() {
  const shots = [
    "from-[#c6f355] to-[#1b3a12]",
    "from-[#f3d2b5] to-[#6b4a2a]",
    "from-[#9bd4ff] to-[#12345a]",
    "from-[#ff9f0a] to-[#4a1a10]",
    "from-[#bf5af2] to-[#1a1030]",
    "from-[#30d158] to-[#08220c]",
  ];
  return (
    <Pane className="grid grid-cols-3 gap-2 p-3">
      {shots.map((g) => (
        <div key={g} className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${g}`} />
      ))}
    </Pane>
  );
}

function Music() {
  const tracks = ["Lime Grove", "Night Glass", "Core Idle", "Dawn Panel"];
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => setT((x) => (x + 1) % 180), 1000);
    return () => window.clearInterval(id);
  }, [on]);
  return (
    <Pane className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-[#ff375f] to-[#1c1c1e]" />
      <div className="text-lg font-semibold">{tracks[i]}</div>
      <div className="h-1 w-64 rounded bg-black/10">
        <div className="h-1 rounded bg-[#ff375f]" style={{ width: `${(t / 180) * 100}%` }} />
      </div>
      <div className="flex gap-4 text-xl">
        <button type="button" onClick={() => setI((n) => (n + tracks.length - 1) % tracks.length)}>
          ⏮
        </button>
        <button type="button" onClick={() => setOn((v) => !v)}>
          {on ? "⏸" : "▶"}
        </button>
        <button type="button" onClick={() => setI((n) => (n + 1) % tracks.length)}>
          ⏭
        </button>
      </div>
    </Pane>
  );
}

type NoteItem = { title: string; body: string };

function Notes() {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const fallback: NoteItem[] = [{ title: "Lime OS", body: "A quieter desktop." }];
    if (typeof window === "undefined") return fallback;
    try {
      const parsed = JSON.parse(localStorage.getItem("lime-notes") ?? "null") as NoteItem[] | null;
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  });
  const [sel, setSel] = useState(0);
  useEffect(() => {
    localStorage.setItem("lime-notes", JSON.stringify(notes));
  }, [notes]);
  return (
    <Pane className="flex">
      <aside className="w-48 border-r border-black/10">
        <button
          type="button"
          className="m-2 rounded-md bg-[var(--lime)] px-2 py-1 text-[12px] text-black"
          onClick={() => setNotes((n: NoteItem[]) => [{ title: "New note", body: "" }, ...n])}
        >
          New
        </button>
        {notes.map((n, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setSel(i)}
            className={`block w-full truncate px-3 py-2 text-left text-[13px] ${sel === i ? "bg-[#ffd60a]/40" : ""}`}
          >
            {n.title || "Untitled"}
          </button>
        ))}
      </aside>
      <textarea
        className="flex-1 resize-none bg-transparent p-4 outline-none"
        value={notes[sel]?.body ?? ""}
        onChange={(e) => {
          const body = e.target.value;
          setNotes((n) =>
            n.map((item, i) =>
              i === sel ? { title: body.split("\n")[0] || "Untitled", body } : item,
            ),
          );
        }}
      />
    </Pane>
  );
}

function Calendar() {
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <Pane className="p-6">
      <h3 className="mb-4 text-xl font-semibold">
        {now.toLocaleString("en-US", { month: "long", year: "numeric" })}
      </h3>
      <div className="grid grid-cols-7 gap-2 text-center text-[13px]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="opacity-40">
            {d}
          </div>
        ))}
        {days.map((d) => (
          <div
            key={d}
            className={`rounded-full py-2 ${d === now.getDate() ? "bg-[var(--lime)] text-black" : ""}`}
          >
            {d}
          </div>
        ))}
      </div>
    </Pane>
  );
}

function Reminders() {
  const [items, setItems] = useState([
    { t: "Calibrate Glow Display", on: false },
    { t: "Ship Lime OS", on: true },
    { t: "Write launch copy", on: false },
  ]);
  const [draft, setDraft] = useState("");
  return (
    <Pane className="p-5">
      {items.map((it, i) => (
        <label key={i} className="flex items-center gap-3 border-b border-black/10 py-2 text-[14px]">
          <input
            type="checkbox"
            checked={it.on}
            onChange={() =>
              setItems((arr) => arr.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))
            }
          />
          <span className={it.on ? "opacity-40 line-through" : ""}>{it.t}</span>
        </label>
      ))}
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          setItems((a) => [...a, { t: draft, on: false }]);
          setDraft("");
        }}
      >
        <input
          className="w-full rounded-lg bg-black/5 px-3 py-2 text-[13px] outline-none"
          placeholder="New reminder"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </form>
    </Pane>
  );
}

function Settings() {
  const { settings, setSettings, keysMode } = useOs();
  return (
    <Pane className="p-6 text-[14px]">
      <h3 className="mb-4 text-lg font-semibold">System Settings</h3>
      <Row label="Appearance">
        {(["light", "dark"] as const).map((t) => (
          <button
            type="button"
            key={t}
            className={`mr-2 rounded-full px-3 py-1 ${settings.theme === t ? "bg-[var(--lime)] text-black" : "bg-black/10"}`}
            onClick={() => setSettings({ ...settings, theme: t })}
          >
            {t}
          </button>
        ))}
      </Row>
      <Row label="Wallpaper">
        {(["grove", "dawn", "noir"] as const).map((w) => (
          <button
            type="button"
            key={w}
            className={`mr-2 rounded-full px-3 py-1 ${settings.wallpaper === w ? "bg-[var(--lime)] text-black" : "bg-black/10"}`}
            onClick={() => setSettings({ ...settings, wallpaper: w })}
          >
            {w}
          </button>
        ))}
      </Row>
      <Row label="Reduce motion">
        <input
          type="checkbox"
          checked={settings.reduceMotion}
          onChange={(e) => setSettings({ ...settings, reduceMotion: e.target.checked })}
        />
      </Row>
      <Row label="Keyboard">
        <span className="text-[13px] opacity-70">
          {keysMode === "lime" ? "Lime keys" : "Mac keys"} · press ⌘-- to switch
        </span>
      </Row>
      <p className="mt-8 opacity-50">Lime OS 1.0 · Limelightworld</p>
    </Pane>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 py-3">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Terminal() {
  const { openApp } = useOs();
  const [lines, setLines] = useState<string[]>(["Lime OS Terminal · type help"]);
  const [cmd, setCmd] = useState("");
  const run = (raw: string) => {
    const c = raw.trim();
    const out = [...lines, `lime@light ~ % ${c}`];
    if (c === "help") out.push("help, ls, date, whoami, neofetch, open <app>, clear");
    else if (c === "ls") out.push("Applications  Desktop  Documents  Music  Pictures");
    else if (c === "date") out.push(new Date().toString());
    else if (c === "whoami") out.push("lime");
    else if (c === "neofetch")
      out.push("lime@limelightworld", "OS: Lime OS 1.0", "Host: Glow Display", "CPU: Lime Core");
    else if (c.startsWith("open ")) {
      const id = c.slice(5).trim() as AppId;
      openApp(id);
      out.push(`opening ${id}`);
    } else if (c === "clear") {
      setLines([]);
      setCmd("");
      return;
    } else if (c) out.push(`command not found: ${c}`);
    setLines(out);
    setCmd("");
  };
  return (
    <Pane className="bg-[#0b0b0c] p-3 font-mono text-[12px] text-[#c6f355]">
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(cmd);
        }}
      >
        <span>lime@light ~ % </span>
        <input
          className="w-2/3 bg-transparent outline-none"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          autoFocus
        />
      </form>
    </Pane>
  );
}

function Calculator() {
  const [d, setD] = useState("0");
  const keys = ["C", "÷", "×", "⌫", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", ".", "%", "±"];
  const press = (k: string) => {
    if (k === "C") setD("0");
    else if (k === "⌫") setD((x) => x.slice(0, -1) || "0");
    else if (k === "=") {
      try {
        const expr = d.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "*0.01");
        if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
          setD("Error");
          return;
        }
        setD(String(Function(`"use strict"; return (${expr})`)()));
      } catch {
        setD("Error");
      }
    } else if (k === "±") setD((x) => String(-Number(x) || 0));
    else setD((x) => (x === "0" || x === "Error" ? k : x + k));
  };
  return (
    <Pane className="grid grid-cols-4 gap-1 bg-[#1c1c1e] p-2 text-white">
      <div className="col-span-4 px-3 py-6 text-right text-3xl">{d}</div>
      {keys.map((k) => (
        <button type="button" key={k} onClick={() => press(k)} className="rounded-lg bg-white/10 py-3">
          {k}
        </button>
      ))}
    </Pane>
  );
}

function Store({ brand }: { brand: "app" | "play" }) {
  const { openApp } = useOs();
  const list = APPS.filter((a) => a.id !== "store" && a.id !== "playstore" && a.id !== "launchpad");
  return (
    <Pane>
      <div className="border-b border-black/10 px-6 py-4">
        <h3 className="text-xl font-semibold">{brand === "play" ? "Google Play" : "App Store"}</h3>
        <p className="text-[12px] opacity-50">Apps for Lime OS</p>
      </div>
      <div className="divide-y divide-black/10">
        {list.map((a) => (
          <div key={a.id} className="flex items-center gap-4 px-6 py-3">
            <AppIcon id={a.id} size={58} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-medium">{a.name}</div>
              <div className="text-[12px] opacity-50">Limelightworld</div>
            </div>
            <button
              type="button"
              className="rounded-full bg-[#0a84ff] px-4 py-1 text-[13px] font-medium text-white"
              onClick={() => openApp(a.id)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </Pane>
  );
}

function TextEdit() {
  const [t, setT] = useState("Lime OS by Limelightworld\n\nWrite anything. It stays on this machine.");
  return (
    <Pane>
      <textarea className="h-full w-full resize-none p-4 outline-none" value={t} onChange={(e) => setT(e.target.value)} />
    </Pane>
  );
}

function Weather() {
  return (
    <Pane className="flex flex-col items-center justify-center bg-gradient-to-b from-[#5ac8fa] to-[#0077b6] text-white">
      <div className="text-lg">Limelight City</div>
      <div className="text-7xl font-light">72°</div>
      <div>Glow · Mostly clear</div>
    </Pane>
  );
}

function ClockApp() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Pane className="flex items-center justify-center text-5xl font-light">
      {now.toLocaleTimeString()}
    </Pane>
  );
}

function Contacts() {
  const people = [
    ["Ava Lime", "design@limelightworld.com"],
    ["Noah Core", "core@limelightworld.com"],
    ["Mia Glow", "display@limelightworld.com"],
  ];
  return (
    <Pane className="p-4">
      {people.map(([n, e]) => (
        <div key={n} className="border-b border-black/10 py-3">
          <div className="font-medium">{n}</div>
          <div className="text-[13px] opacity-50">{e}</div>
        </div>
      ))}
    </Pane>
  );
}

function Preview() {
  return (
    <Pane className="flex items-center justify-center bg-[#111]">
      <div className="h-64 w-80 rounded-xl bg-gradient-to-br from-[#c6f355] to-[#1a2a10]" />
    </Pane>
  );
}

function LaunchpadInner() {
  const { openApp } = useOs();
  const apps = useMemo(() => APPS.filter((a) => a.id !== "launchpad"), []);
  return (
    <Pane className="grid grid-cols-5 gap-6 p-8">
      {apps.map((a) => (
        <button type="button" key={a.id} onClick={() => openApp(a.id)} className="text-center">
          <div className="mx-auto mb-2">
            <AppIcon id={a.id} size={56} />
          </div>
          <div className="text-[11px]">{a.name}</div>
        </button>
      ))}
    </Pane>
  );
}
