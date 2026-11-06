"use client";

import { createContext, useContext } from "react";
import type { AppId } from "./catalog";

export type Theme = "light" | "dark";
export type Wallpaper = "grove" | "dawn" | "noir";

export type OsSettings = {
  theme: Theme;
  wallpaper: Wallpaper;
  reduceMotion: boolean;
};

export type KeysMode = "lime" | "mac";

export type OsApi = {
  openApp: (id: AppId, payload?: string) => void;
  closeApp: (id: AppId) => void;
  hideApp: (id: AppId) => void;
  settings: OsSettings;
  setSettings: (s: OsSettings) => void;
  notify: (title: string, body: string) => void;
  dockIds: AppId[];
  installApp: (id: AppId) => void;
  isOnDock: (id: AppId) => boolean;
  keysMode: KeysMode;
};

export const OsContext = createContext<OsApi | null>(null);

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs outside LimeOS");
  return ctx;
}
