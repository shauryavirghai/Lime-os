export type AppId =
  | "finder"
  | "chrome"
  | "browser"
  | "messages"
  | "mail"
  | "maps"
  | "photos"
  | "music"
  | "notes"
  | "calendar"
  | "reminders"
  | "settings"
  | "terminal"
  | "calculator"
  | "store"
  | "playstore"
  | "textedit"
  | "weather"
  | "clock"
  | "contacts"
  | "preview"
  | "launchpad"
  | "youtube"
  | "gmail";

export type AppMeta = {
  id: AppId;
  name: string;
  color: string;
  letter: string;
  dock?: boolean;
  w: number;
  h: number;
};

export const APPS: AppMeta[] = [
  { id: "finder", name: "Finder", color: "#54c8f8", letter: "F", dock: true, w: 760, h: 480 },
  { id: "chrome", name: "Chrome", color: "#4285f4", letter: "C", dock: true, w: 900, h: 560 },
  { id: "browser", name: "Glow", color: "#1c7cff", letter: "G", w: 860, h: 540 },
  { id: "messages", name: "Messages", color: "#30d158", letter: "M", dock: true, w: 720, h: 460 },
  { id: "mail", name: "Mail", color: "#0a84ff", letter: "@", dock: true, w: 780, h: 500 },
  { id: "maps", name: "Maps", color: "#30d158", letter: "⌂", w: 800, h: 520 },
  { id: "photos", name: "Photos", color: "#ff375f", letter: "P", dock: true, w: 760, h: 500 },
  { id: "music", name: "Music", color: "#ff375f", letter: "♪", dock: true, w: 700, h: 460 },
  { id: "notes", name: "Notes", color: "#ffd60a", letter: "N", dock: true, w: 680, h: 460 },
  { id: "calendar", name: "Calendar", color: "#ff453a", letter: "31", w: 720, h: 500 },
  { id: "reminders", name: "Reminders", color: "#ff9f0a", letter: "✓", w: 420, h: 520 },
  { id: "settings", name: "Settings", color: "#8e8e93", letter: "⚙", dock: true, w: 720, h: 500 },
  { id: "terminal", name: "Terminal", color: "#1c1c1e", letter: ">", w: 640, h: 400 },
  { id: "calculator", name: "Calculator", color: "#d4d4d8", letter: "=", w: 280, h: 400 },
  { id: "store", name: "App Store", color: "#0a84ff", letter: "A", dock: true, w: 820, h: 560 },
  { id: "playstore", name: "Play Store", color: "#34a853", letter: "▶", w: 780, h: 540 },
  { id: "textedit", name: "TextEdit", color: "#ffffff", letter: "T", w: 640, h: 460 },
  { id: "weather", name: "Weather", color: "#5ac8fa", letter: "☀", w: 520, h: 420 },
  { id: "clock", name: "Clock", color: "#1c1c1e", letter: "⏱", w: 480, h: 360 },
  { id: "contacts", name: "Contacts", color: "#af52de", letter: "☺", w: 640, h: 440 },
  { id: "preview", name: "Preview", color: "#5e5ce6", letter: "◉", w: 640, h: 440 },
  { id: "launchpad", name: "Launchpad", color: "#c6f355", letter: "L", w: 800, h: 500 },
  { id: "youtube", name: "YouTube", color: "#ff0000", letter: "▶", w: 900, h: 560 },
  { id: "gmail", name: "Gmail", color: "#ea4335", letter: "M", w: 860, h: 540 },
];

export const DEFAULT_DOCK: AppId[] = APPS.filter((a) => a.dock).map((a) => a.id);

export const byId = (id: string) => APPS.find((a) => a.id === id);
