"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { APPS, DEFAULT_DOCK, byId, type AppId } from "./catalog";
import { AppView } from "./AppViews";
import { AppIcon } from "./AppIcon";
import { OsContext, type KeysMode, type OsSettings, type Wallpaper } from "./OsContext";

type Win = {
  id: string;
  app: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
};

export default function LimeOS() {
  const [booting, setBooting] = useState(true);
  const [logged, setLogged] = useState(false);
  const [windows, setWindows] = useState<Win[]>([]);
  const [z, setZ] = useState(10);
  const [active, setActive] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const [spotQ, setSpotQ] = useState("");
  const [control, setControl] = useState(false);
  const [notesCenter, setNotesCenter] = useState(false);
  const [launchpad, setLaunchpad] = useState(false);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [clock, setClock] = useState("");
  const [toasts, setToasts] = useState<{ title: string; body: string }[]>([]);
  const [settings, setSettings] = useState<OsSettings>({
    theme: "light",
    wallpaper: "grove",
    reduceMotion: false,
  });
  const [dockIds, setDockIds] = useState<AppId[]>(DEFAULT_DOCK);
  const [winMenu, setWinMenu] = useState(false);
  const [dockMenu, setDockMenu] = useState<{ id: AppId; x: number; y: number } | null>(null);
  const [keysMode, setKeysMode] = useState<KeysMode>("lime");
  const [switcher, setSwitcher] = useState<{ apps: AppId[]; i: number } | null>(null);
  const [helpKeys, setHelpKeys] = useState(false);
  const activeRef = useRef(active);
  const windowsRef = useRef(windows);
  activeRef.current = active;
  windowsRef.current = windows;
  const drag = useRef<
    | { kind: "move"; id: string; ox: number; oy: number }
    | {
        kind: "resize";
        id: string;
        dir: string;
        sx: number;
        sy: number;
        sl: number;
        st: number;
        sw: number;
        sh: number;
      }
    | null
  >(null);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 1600);
    try {
      const saved = localStorage.getItem("lime-dock");
      if (saved) {
        const ids = (JSON.parse(saved) as AppId[]).filter((id) => id !== "playstore");
        if (ids.length) setDockIds(ids);
      }
      const keys = localStorage.getItem("lime-keys");
      if (keys === "mac" || keys === "lime") setKeysMode(keys);
    } catch {
      /* keep defaults */
    }
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("lime-dock", JSON.stringify(dockIds));
  }, [dockIds]);

  useEffect(() => {
    localStorage.setItem("lime-keys", keysMode);
  }, [keysMode]);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const notify = useCallback((title: string, body: string) => {
    setToasts((t) => [{ title, body }, ...t].slice(0, 6));
  }, []);

  const openApp = useCallback(
    (app: AppId) => {
      setLaunchpad(false);
      setSpotlight(false);
      const meta = byId(app);
      if (!meta) return;
      setWindows((ws) => {
        const existing = ws.find((w) => w.app === app && !w.min);
        if (existing) {
          setActive(existing.id);
          return ws.map((w) => (w.id === existing.id ? { ...w, z: z + 1, min: false } : w));
        }
        const id = `${app}-${Date.now()}`;
        setActive(id);
        setZ((n) => n + 1);
        return [
          ...ws.map((w) => (w.app === app && w.min ? { ...w, min: false, z: z + 1 } : w)),
          ...(ws.some((w) => w.app === app)
            ? []
            : [
                {
                  id,
                  app,
                  x: 80 + (ws.length % 5) * 28,
                  y: 48 + (ws.length % 4) * 24,
                  w: meta.w,
                  h: meta.h,
                  z: z + 1,
                  min: false,
                  max: false,
                },
              ]),
        ];
      });
    },
    [z],
  );

  const closeWin = (id: string) => {
    setWindows((w) => w.filter((x) => x.id !== id));
    if (active === id) setActive(null);
  };

  const closeApp = (app: AppId) => {
    setWindows((w) => w.filter((x) => x.app !== app));
    setActive(null);
  };

  const hideWin = (id: string) => {
    setWindows((ws) => ws.map((x) => (x.id === id ? { ...x, min: true, max: false } : x)));
  };

  const hideApp = (app: AppId) => {
    setWindows((ws) => ws.map((x) => (x.app === app ? { ...x, min: true, max: false } : x)));
  };

  const toggleFull = (id: string) => {
    setWindows((ws) => ws.map((x) => (x.id === id ? { ...x, max: !x.max, min: false } : x)));
  };

  const installApp = (id: AppId) => {
    setDockIds((d) => (d.includes(id) ? d : [...d, id]));
  };

  const focus = (id: string) => {
    setZ((n) => n + 1);
    setActive(id);
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: z + 1, min: false } : w)));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = drag.current;
      if (!d) return;
      if (d.kind === "move") {
        setWindows((ws) =>
          ws.map((w) => (w.id === d.id ? { ...w, x: e.clientX - d.ox, y: Math.max(28, e.clientY - d.oy) } : w)),
        );
        return;
      }
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      setWindows((ws) =>
        ws.map((w) => {
          if (w.id !== d.id || w.max) return w;
          let x = d.sl;
          let y = d.st;
          let width = d.sw;
          let height = d.sh;
          if (d.dir.includes("e")) width = Math.max(280, d.sw + dx);
          if (d.dir.includes("s")) height = Math.max(180, d.sh + dy);
          if (d.dir.includes("w")) {
            width = Math.max(280, d.sw - dx);
            x = d.sl + d.sw - width;
          }
          if (d.dir.includes("n")) {
            height = Math.max(180, d.sh - dy);
            y = Math.max(28, d.st + d.sh - height);
          }
          return { ...w, x, y, w: width, h: height };
        }),
      );
    };
    const onUp = () => {
      drag.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const toggleKeysMode = useCallback(() => {
    setKeysMode((mode) => {
      const next = mode === "lime" ? "mac" : "lime";
      setToasts((t) =>
        [
          {
            title: next === "lime" ? "Lime keys" : "Mac keys",
            body:
              next === "lime"
                ? "Command shortcuts now control Lime OS. Press ⌘-- to give them back to your Mac."
                : "Command shortcuts now go to your Mac. Press ⌘-- to use them in Lime OS.",
          },
          ...t,
        ].slice(0, 6),
      );
      return next;
    });
  }, []);

  useEffect(() => {
    const cmd = (e: KeyboardEvent) => e.metaKey || e.ctrlKey;
    const minus = (e: KeyboardEvent) => e.key === "-" || e.code === "Minus";

    const onKey = (e: KeyboardEvent) => {
      if (cmd(e) && minus(e) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        toggleKeysMode();
        return;
      }

      if (keysMode !== "lime") {
        if (e.key === "Escape") {
          setSwitcher(null);
          setHelpKeys(false);
        }
        return;
      }

      if (e.key === "Tab" && cmd(e)) {
        e.preventDefault();
        const open = Array.from(new Set(windowsRef.current.map((w) => w.app)));
        const list = open.length ? open : dockIds;
        if (!list.length) return;
        setSwitcher((cur) => {
          if (!cur) return { apps: list, i: list.length > 1 ? 1 : 0 };
          return { apps: list, i: (cur.i + (e.shiftKey ? list.length - 1 : 1)) % list.length };
        });
        return;
      }

      if (e.key === "Escape") {
        setSpotlight(false);
        setLaunchpad(false);
        setControl(false);
        setCtx(null);
        setWinMenu(false);
        setDockMenu(null);
        setSwitcher(null);
        setHelpKeys(false);
        const id = activeRef.current;
        if (id) {
          const cur = windowsRef.current.find((w) => w.id === id);
          if (cur?.max) toggleFull(id);
        }
        return;
      }

      if (!cmd(e)) {
        if (e.key === "F4" || e.key === "LaunchApplication") {
          e.preventDefault();
          setLaunchpad((v) => !v);
        }
        return;
      }

      const key = e.key.toLowerCase();
      const id = activeRef.current;
      const focused = windowsRef.current.find((w) => w.id === id);

      if (key === " " && !e.shiftKey) {
        e.preventDefault();
        setSpotlight((v) => !v);
        setSpotQ("");
        return;
      }
      if (key === "q" && focused) {
        e.preventDefault();
        closeApp(focused.app);
        return;
      }
      if (key === "w" && id) {
        e.preventDefault();
        closeWin(id);
        return;
      }
      if (key === "h" && focused) {
        e.preventDefault();
        hideApp(focused.app);
        return;
      }
      if (key === "m" && id) {
        e.preventDefault();
        hideWin(id);
        return;
      }
      if (key === "," ) {
        e.preventDefault();
        openApp("settings");
        return;
      }
      if (key === "n") {
        e.preventDefault();
        openApp(focused?.app ?? "finder");
        return;
      }
      if (key === "`" && focused) {
        e.preventDefault();
        const same = windowsRef.current.filter((w) => w.app === focused.app);
        const idx = same.findIndex((w) => w.id === focused.id);
        const next = same[(idx + 1) % same.length];
        if (next) focus(next.id);
        return;
      }
      if (key === "f" && e.ctrlKey) {
        e.preventDefault();
        if (id) toggleFull(id);
        return;
      }
      if (key === "l" && focused?.app === "chrome") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("lime-os-shortcut", { detail: "focus-url" }));
        return;
      }
      if (key === "t" && focused?.app === "chrome") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("lime-os-shortcut", { detail: "new-tab" }));
        return;
      }
      if (key === "r" && focused?.app === "chrome") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("lime-os-shortcut", { detail: "reload" }));
        return;
      }
      if (key === "/" && e.shiftKey) {
        e.preventDefault();
        setHelpKeys((v) => !v);
      }
    };

    const onUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        setSwitcher((cur) => {
          if (cur) openApp(cur.apps[cur.i]);
          return null;
        });
      }
    };

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("keyup", onUp, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keyup", onUp, true);
    };
  }, [keysMode, dockIds, openApp, toggleKeysMode]);

  const api = useMemo(
    () => ({
      openApp,
      closeApp,
      hideApp,
      settings,
      setSettings,
      notify,
      dockIds,
      installApp,
      isOnDock: (id: AppId) => dockIds.includes(id),
      keysMode,
    }),
    [openApp, settings, notify, dockIds, keysMode],
  );

  const focusedApp = windows.find((w) => w.id === active);
  const focusedMeta = focusedApp ? byId(focusedApp.app) : null;
  const wall: Wallpaper = settings.wallpaper;
  const wallClass = wall === "dawn" ? "dawn" : wall === "noir" ? "noir" : "";

  const spotHits = APPS.filter((a) => a.name.toLowerCase().includes(spotQ.toLowerCase()));

  if (booting) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-[var(--lime)]">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-[var(--lime)]" />
          <p className="text-sm tracking-[0.3em]">LIME OS</p>
        </div>
      </div>
    );
  }

  if (!logged) {
    return (
      <div className={`wallpaper ${wallClass} flex h-screen flex-col items-center justify-center text-white`}>
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--lime)] text-3xl text-black">
          L
        </div>
        <p className="text-xl">lime</p>
        <button
          type="button"
          className="mt-6 rounded-full bg-white/20 px-6 py-2 backdrop-blur"
          onClick={() => setLogged(true)}
        >
          Enter Lime OS
        </button>
        <Link href="/" className="mt-8 text-sm text-white/60">
          ← limelightworld.com
        </Link>
      </div>
    );
  }

  return (
    <OsContext.Provider value={api}>
      <div
        className={`wallpaper ${wallClass} relative h-screen overflow-hidden`}
        onMouseDown={() => {
          setCtx(null);
          setDockMenu(null);
          setWinMenu(false);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setCtx({ x: e.clientX, y: e.clientY });
        }}
      >
        <header className="os-glass absolute inset-x-0 top-0 z-[200] flex h-7 items-center justify-between px-3 text-[12px] text-white">
          <div className="flex items-center gap-3">
            <button type="button" className="font-semibold text-[var(--lime)]" onClick={() => setLaunchpad(true)}>
              ● Lime
            </button>
            <span className="font-semibold">{focusedMeta?.name ?? "Finder"}</span>
            <span className="hidden opacity-80 md:inline">File</span>
            <span className="hidden opacity-80 md:inline">Edit</span>
            <span className="hidden opacity-80 md:inline">View</span>
            <div className="relative hidden md:block">
              <button type="button" className="opacity-80" onClick={() => setWinMenu((v) => !v)}>
                Window
              </button>
              {winMenu && focusedApp && (
                <div className="absolute left-0 top-6 z-[240] w-48 rounded-lg bg-white py-1 text-black shadow-xl">
                  <button type="button" className="flex w-full justify-between px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white" onClick={() => { hideWin(focusedApp.id); setWinMenu(false); }}>
                    <span>Hide</span><span className="opacity-50">⌘H</span>
                  </button>
                  <button type="button" className="flex w-full justify-between px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white" onClick={() => { toggleFull(focusedApp.id); setWinMenu(false); }}>
                    <span>{focusedApp.max ? "Exit Full Screen" : "Enter Full Screen"}</span><span className="opacity-50">⌃⌘F</span>
                  </button>
                  <button type="button" className="flex w-full justify-between px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white" onClick={() => { closeWin(focusedApp.id); setWinMenu(false); }}>
                    <span>Close</span><span className="opacity-50">⌘W</span>
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="hidden opacity-80 md:inline" onClick={() => setHelpKeys((v) => !v)}>
              Help
            </button>
          </div>
          <div className="flex items-center gap-3 opacity-90">
            <button
              type="button"
              title="Press ⌘-- to switch"
              className={`rounded px-1.5 ${keysMode === "lime" ? "text-[var(--lime)]" : "opacity-70"}`}
              onClick={toggleKeysMode}
            >
              {keysMode === "lime" ? "Lime keys" : "Mac keys"}
            </button>
            <button type="button" onClick={() => setControl((v) => !v)}>
              ⌃
            </button>
            <button type="button" onClick={() => setNotesCenter((v) => !v)}>
              ◫
            </button>
            <span>{clock}</span>
          </div>
        </header>

        {windows
          .filter((w) => !w.min)
          .map((w) => (
            <article
              key={w.id}
              className={`window-chrome absolute overflow-hidden rounded-xl ${settings.theme === "dark" ? "dark" : ""}`}
              style={{
                left: w.max ? 0 : w.x,
                top: w.max ? 28 : w.y,
                width: w.max ? "100%" : w.w,
                height: w.max ? "calc(100% - 128px)" : w.h,
                zIndex: w.z,
              }}
              onMouseDown={() => focus(w.id)}
            >
              <div
                className="flex h-9 cursor-grab items-center gap-2 border-b border-black/10 px-3"
                onMouseDown={(e) => {
                  if (w.max) return;
                  drag.current = { kind: "move", id: w.id, ox: e.clientX - w.x, oy: e.clientY - w.y };
                }}
              >
                <button
                  type="button"
                  title="Close"
                  aria-label="Close"
                  className="traffic bg-[#ff5f57]"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => closeWin(w.id)}
                />
                <button
                  type="button"
                  title="Hide"
                  aria-label="Hide"
                  className="traffic bg-[#febc2e]"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => hideWin(w.id)}
                />
                <button
                  type="button"
                  title={w.max ? "Exit Full Screen" : "Full Screen"}
                  aria-label={w.max ? "Exit Full Screen" : "Full Screen"}
                  className="traffic bg-[#28c840]"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => toggleFull(w.id)}
                />
                <span className="ml-2 text-[12px] opacity-70">{byId(w.app)?.name}</span>
                <div className="ml-auto flex items-center gap-1 text-[11px]" onMouseDown={(e) => e.stopPropagation()}>
                  <button type="button" className="rounded px-2 py-0.5 hover:bg-black/10" onClick={() => hideWin(w.id)}>
                    Hide
                  </button>
                  <button type="button" className="rounded px-2 py-0.5 hover:bg-black/10" onClick={() => toggleFull(w.id)}>
                    {w.max ? "Exit Full Screen" : "Full Screen"}
                  </button>
                  <button type="button" className="rounded px-2 py-0.5 hover:bg-black/10" onClick={() => closeWin(w.id)}>
                    Close
                  </button>
                </div>
              </div>
              <div className="h-[calc(100%-36px)]">
                <AppView id={w.app} />
              </div>
              {!w.max &&
                ["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((dir) => (
                  <div
                    key={dir}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      focus(w.id);
                      drag.current = {
                        kind: "resize",
                        id: w.id,
                        dir,
                        sx: e.clientX,
                        sy: e.clientY,
                        sl: w.x,
                        st: w.y,
                        sw: w.w,
                        sh: w.h,
                      };
                    }}
                    className="absolute"
                    style={resizeStyle(dir)}
                  />
                ))}
            </article>
          ))}

        <nav className="dock-glass absolute bottom-10 left-1/2 z-[180] flex -translate-x-1/2 items-end gap-2 rounded-3xl px-3 py-2">
          {dockIds.map((id) => {
            const a = byId(id);
            if (!a) return null;
            const open = windows.some((w) => w.app === a.id);
            const hidden = windows.some((w) => w.app === a.id && w.min);
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => openApp(a.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDockMenu({ id: a.id, x: e.clientX, y: e.clientY });
                }}
                className="group relative origin-bottom pb-1 transition-transform hover:scale-125"
              >
                <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-0.5 text-[11px] text-white group-hover:block">
                  {a.name}
                  {hidden ? " (hidden)" : ""}
                </span>
                <AppIcon id={a.id} size={52} />
                {open && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                )}
              </button>
            );
          })}
          <div className="mx-1 h-12 w-px bg-white/30" />
          <button type="button" className="group relative origin-bottom pb-1 hover:scale-125">
            <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-0.5 text-[11px] text-white group-hover:block">
              Trash
            </span>
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-white/45 text-lg">
              ⌫
            </div>
          </button>
        </nav>

        {launchpad && (
          <div className="absolute inset-0 z-[190] bg-black/45 backdrop-blur-2xl" onClick={() => setLaunchpad(false)}>
            <div className="mx-auto mt-24 grid max-w-4xl grid-cols-6 gap-8 p-8" onClick={(e) => e.stopPropagation()}>
              {APPS.map((a) => (
                <button type="button" key={a.id} className="text-center text-white" onClick={() => openApp(a.id)}>
                  <div className="mx-auto mb-2">
                    <AppIcon id={a.id} size={64} />
                  </div>
                  <div className="text-[11px]">{a.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {switcher && (
          <div className="pointer-events-none absolute inset-0 z-[240] flex items-center justify-center">
            <div className="flex gap-4 rounded-3xl bg-black/55 px-6 py-5 backdrop-blur-xl">
              {switcher.apps.map((id, i) => (
                <div
                  key={id}
                  className={`rounded-2xl p-2 ${i === switcher.i ? "bg-white/25" : ""}`}
                >
                  <AppIcon id={id} size={56} />
                </div>
              ))}
            </div>
          </div>
        )}

        {helpKeys && (
          <div className="absolute inset-0 z-[230] flex items-center justify-center bg-black/40" onClick={() => setHelpKeys(false)}>
            <div
              className="max-h-[70vh] w-[min(420px,92vw)] overflow-auto rounded-2xl bg-white p-5 text-[13px] text-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-base font-semibold">Lime OS keys</h3>
              <p className="mb-3 text-[12px] text-black/50">
                Press ⌘-- to switch between Lime keys and Mac keys.
              </p>
              {[
                ["Cmd--", "Lime keys / Mac keys"],
                ["Cmd Space", "Spotlight"],
                ["Cmd Tab", "Switch apps"],
                ["Cmd Q", "Quit app"],
                ["Cmd W", "Close window"],
                ["Cmd H", "Hide app"],
                ["Cmd M", "Minimize"],
                ["Ctrl Cmd F", "Full Screen"],
                ["Cmd ,", "Settings"],
                ["Cmd N", "New window"],
                ["Cmd T", "New Chrome tab"],
                ["Cmd L", "Chrome address bar"],
                ["Cmd ?", "This list"],
              ].map(([k, label]) => (
                <div key={k} className="flex justify-between border-b border-black/5 py-1.5">
                  <span>{label}</span>
                  <kbd className="rounded bg-black/5 px-1.5">{k}</kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {spotlight && (
          <div className="absolute inset-0 z-[220] flex items-start justify-center pt-32" onClick={() => setSpotlight(false)}>
            <div
              className="w-[min(560px,92vw)] overflow-hidden rounded-2xl bg-white/90 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                autoFocus
                className="w-full bg-transparent px-5 py-4 text-lg outline-none"
                placeholder="Spotlight Search"
                value={spotQ}
                onChange={(e) => setSpotQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && spotHits[0]) openApp(spotHits[0].id);
                }}
              />
              <div className="max-h-72 overflow-auto">
                {spotHits.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    className="flex w-full items-center gap-3 px-5 py-2 text-left hover:bg-black/5"
                    onClick={() => openApp(a.id)}
                  >
                    <AppIcon id={a.id} size={28} />
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {control && (
          <div className="os-glass absolute right-3 top-9 z-[210] w-72 rounded-2xl p-3 text-white">
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {["Wi-Fi", "Bluetooth", "AirDrop", "Focus"].map((x) => (
                <div key={x} className="rounded-xl bg-white/10 p-3">
                  {x}
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-xl bg-white/10 p-3 text-[12px]">Display · Lime Glow</div>
            <div className="mt-2 rounded-xl bg-white/10 p-3 text-[12px]">Sound · Studio</div>
          </div>
        )}

        {notesCenter && (
          <div className="os-glass absolute right-3 top-9 z-[210] h-[70vh] w-80 overflow-auto rounded-2xl p-4 text-white">
            <p className="mb-3 text-sm font-semibold">Notification Center</p>
            {toasts.length === 0 && <p className="text-sm opacity-60">No notifications</p>}
            {toasts.map((t, i) => (
              <div key={i} className="mb-2 rounded-xl bg-white/10 p-3 text-sm">
                <div className="font-medium">{t.title}</div>
                <div className="opacity-70">{t.body}</div>
              </div>
            ))}
          </div>
        )}

        {dockMenu && (
          <div
            className="absolute z-[230] w-48 rounded-lg bg-white/95 py-1 text-[12px] text-black shadow-xl"
            style={{ left: dockMenu.x, top: dockMenu.y - 90 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white" onClick={() => { openApp(dockMenu.id); setDockMenu(null); }}>
              Open
            </button>
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white" onClick={() => { hideApp(dockMenu.id); setDockMenu(null); }}>
              Hide
            </button>
            <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white" onClick={() => { closeApp(dockMenu.id); setDockMenu(null); }}>
              Close
            </button>
          </div>
        )}

        {ctx && (
          <div
            className="absolute z-[230] w-48 rounded-lg bg-white/95 py-1 text-[12px] text-black shadow-xl"
            style={{ left: ctx.x, top: ctx.y }}
          >
            {[
              ["New Folder", () => notify("Finder", "Folder created on Desktop")],
              ["Get Info", () => openApp("preview")],
              ["Change Wallpaper…", () => openApp("settings")],
              ["Open Launchpad", () => setLaunchpad(true)],
            ].map(([label, fn]) => (
              <button
                type="button"
                key={String(label)}
                className="block w-full px-3 py-1.5 text-left hover:bg-[#0a84ff] hover:text-white"
                onClick={() => {
                  (fn as () => void)();
                  setCtx(null);
                }}
              >
                {label as string}
              </button>
            ))}
          </div>
        )}

        <Link href="/" className="absolute bottom-4 left-4 z-[170] text-[11px] text-white/50 hover:text-white">
          limelightworld.com
        </Link>
      </div>
    </OsContext.Provider>
  );
}

function resizeStyle(dir: string): CSSProperties {
  const edge = 8;
  const corner = 12;
  const base: CSSProperties = { position: "absolute", zIndex: 20 };
  if (dir === "n") return { ...base, top: 0, left: corner, right: corner, height: edge, cursor: "ns-resize" };
  if (dir === "s") return { ...base, bottom: 0, left: corner, right: corner, height: edge, cursor: "ns-resize" };
  if (dir === "e") return { ...base, top: corner, bottom: corner, right: 0, width: edge, cursor: "ew-resize" };
  if (dir === "w") return { ...base, top: corner, bottom: corner, left: 0, width: edge, cursor: "ew-resize" };
  if (dir === "ne") return { ...base, top: 0, right: 0, width: corner, height: corner, cursor: "nesw-resize" };
  if (dir === "nw") return { ...base, top: 0, left: 0, width: corner, height: corner, cursor: "nwse-resize" };
  if (dir === "se") return { ...base, bottom: 0, right: 0, width: corner, height: corner, cursor: "nwse-resize" };
  return { ...base, bottom: 0, left: 0, width: corner, height: corner, cursor: "nesw-resize" };
}
