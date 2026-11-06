import type { AppId } from "./catalog";

export function AppIcon({ id, size = 44 }: { id: AppId; size?: number }) {
  const s = { width: size, height: size };
  return (
    <div className="overflow-hidden rounded-[22%] shadow-sm" style={s}>
      {glyph(id, size)}
    </div>
  );
}

function glyph(id: AppId, size: number) {
  const s = { width: size, height: size };
  switch (id) {
    case "finder":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#3da6ea" />
          <path d="M8 40h48v16a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V40Z" fill="#e8e8ed" />
          <circle cx="24" cy="28" r="5" fill="#1c1c1e" />
          <circle cx="40" cy="28" r="5" fill="#1c1c1e" />
          <path d="M22 46c4 4 16 4 20 0" stroke="#1c1c1e" strokeWidth="3" fill="none" />
        </svg>
      );
    case "chrome":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <circle cx="32" cy="32" r="30" fill="#fff" />
          <path d="M32 8a24 24 0 0 1 20.8 12H32z" fill="#ea4335" />
          <path d="M52.8 20a24 24 0 0 1-8 30.6L32 32z" fill="#fbbc04" />
          <path d="M44.8 50.6A24 24 0 0 1 8.6 36h23.4z" fill="#34a853" />
          <path d="M8.6 36A24 24 0 0 1 32 8v24z" fill="#4285f4" />
          <circle cx="32" cy="32" r="10" fill="#4285f4" />
          <circle cx="32" cy="32" r="6" fill="#fff" />
        </svg>
      );
    case "browser":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <circle cx="32" cy="32" r="30" fill="#1c7cff" />
          <circle cx="32" cy="32" r="12" fill="#fff" />
          <path d="M32 4v56M4 32h56" stroke="#7fbaff" strokeWidth="3" />
        </svg>
      );
    case "messages":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#30d158" />
          <path d="M16 20h32a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H28l-10 8v-8h-2a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6Z" fill="#fff" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#1d9bf0" />
          <path d="M12 20h40v24H12V20Z" fill="#fff" />
          <path d="M12 20l20 14L52 20" stroke="#1d9bf0" strokeWidth="3" fill="none" />
        </svg>
      );
    case "maps":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#30d158" />
          <path d="M32 12c-8 0-14 6-14 14 0 12 14 26 14 26s14-14 14-26c0-8-6-14-14-14Z" fill="#fff" />
          <circle cx="32" cy="26" r="5" fill="#ff3b30" />
        </svg>
      );
    case "photos":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#fff" />
          <circle cx="22" cy="24" r="10" fill="#ff453a" />
          <circle cx="42" cy="24" r="10" fill="#ffd60a" />
          <circle cx="22" cy="42" r="10" fill="#30d158" />
          <circle cx="42" cy="42" r="10" fill="#5e5ce6" />
        </svg>
      );
    case "music":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#ff2d55" />
          <path d="M24 16v24a8 8 0 1 0 6 8V28l18-4v14a8 8 0 1 0 6 8V16L24 20Z" fill="#fff" />
        </svg>
      );
    case "notes":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#ffd60a" />
          <path d="M16 12h32v40H16z" fill="#fff8dc" />
          <path d="M22 24h20M22 32h20M22 40h14" stroke="#c7a000" strokeWidth="3" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#fff" />
          <rect width="64" height="18" fill="#ff3b30" />
          <text x="32" y="48" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1c1c1e">
            31
          </text>
        </svg>
      );
    case "reminders":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#5e5ce6" />
          <circle cx="32" cy="32" r="16" fill="none" stroke="#fff" strokeWidth="4" />
          <path d="M22 32l6 6 14-14" stroke="#fff" strokeWidth="4" fill="none" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#8e8e93" />
          <circle cx="32" cy="32" r="8" fill="#e5e5ea" />
          <circle cx="32" cy="32" r="18" fill="none" stroke="#e5e5ea" strokeWidth="6" strokeDasharray="6 7" />
        </svg>
      );
    case "terminal":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#1c1c1e" />
          <path d="M16 24l12 8-12 8M32 40h16" stroke="#c6f355" strokeWidth="3" fill="none" />
        </svg>
      );
    case "calculator":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#2c2c2e" />
          <rect x="12" y="12" width="40" height="12" rx="2" fill="#d4d4d8" />
          <circle cx="20" cy="36" r="4" fill="#ff9f0a" />
          <circle cx="32" cy="36" r="4" fill="#ff9f0a" />
          <circle cx="44" cy="36" r="4" fill="#ff9f0a" />
          <circle cx="20" cy="48" r="4" fill="#ff9f0a" />
        </svg>
      );
    case "store":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#0a84ff" />
          <path d="M22 20a10 10 0 0 1 20 0" stroke="#fff" strokeWidth="4" fill="none" />
          <rect x="16" y="22" width="32" height="28" rx="6" fill="#fff" />
          <path d="M28 22a4 4 0 0 0 8 0" stroke="#0a84ff" strokeWidth="3" fill="none" />
        </svg>
      );
    case "playstore":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#fff" />
          <path d="M18 12l30 20-30 20V12Z" fill="#34a853" />
          <path d="M18 12l16 16-16 4V12Z" fill="#4285f4" />
          <path d="M18 52l16-16 14 4L18 52Z" fill="#fbbc04" />
          <path d="M48 32L34 28l14-8v12Z" fill="#ea4335" />
        </svg>
      );
    case "textedit":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#f2f2f7" />
          <path d="M18 14h28v36H18z" fill="#fff" stroke="#c7c7cc" />
          <path d="M24 24h16M24 32h16M24 40h10" stroke="#1c1c1e" strokeWidth="3" />
        </svg>
      );
    case "weather":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#5ac8fa" />
          <circle cx="26" cy="26" r="10" fill="#ffd60a" />
          <path d="M24 40h22a8 8 0 0 1 0 16H24a10 10 0 0 1 0-16Z" fill="#fff" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#1c1c1e" />
          <circle cx="32" cy="32" r="18" fill="#fff" />
          <path d="M32 20v12l8 6" stroke="#ff3b30" strokeWidth="3" fill="none" />
        </svg>
      );
    case "contacts":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#af52de" />
          <circle cx="32" cy="24" r="8" fill="#fff" />
          <path d="M16 50c2-10 10-14 16-14s14 4 16 14" fill="#fff" />
        </svg>
      );
    case "preview":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#5e5ce6" />
          <rect x="14" y="16" width="36" height="32" rx="4" fill="#fff" />
          <circle cx="26" cy="30" r="4" fill="#5e5ce6" />
        </svg>
      );
    case "launchpad":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#1c1c1e" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <circle key={`${r}${c}`} cx={18 + c * 14} cy={18 + r * 14} r="4" fill="#c6f355" />
            )),
          )}
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#ff0000" />
          <path d="M26 20v24l20-12-20-12Z" fill="#fff" />
        </svg>
      );
    case "gmail":
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#fff" />
          <path d="M10 20l22 16 22-16v28H10V20Z" fill="#ea4335" />
          <path d="M10 20l22 16 22-16-8 4-14 10L18 24 10 20Z" fill="#c5221f" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" {...s}>
          <rect width="64" height="64" rx="14" fill="#c6f355" />
        </svg>
      );
  }
}
