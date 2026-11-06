"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const NAV = [
  { href: "#lime-os", label: "Lime OS" },
  { href: "#glow", label: "Glow Display" },
  { href: "#core", label: "Lime Core" },
  { href: "#apps", label: "Apps" },
  { href: "#studio", label: "Studio" },
  { href: "#support", label: "Support" },
];

export default function HomePage({ copyrightYear }: { copyrightYear: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-black text-white">
      <header className="nav-blur sticky top-0 z-50 h-12 text-[12px]">
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
            <LimeMark />
            <span>Limelightworld</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[#d2d2d7] md:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/os"
              className="rounded-full bg-[var(--lime)] px-3 py-1 text-[11px] font-semibold text-black"
            >
              Experience Lime OS
            </Link>
            <button
              type="button"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-white/10 bg-black px-4 py-3 md:hidden">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="block py-2 text-[#d2d2d7]">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section id="lime-os" className="hero-glow px-6 pb-8 pt-16 text-center md:pt-24">
        <p className="mb-3 text-sm tracking-wide text-[var(--lime)]">Lime OS by Limelightworld</p>
        <h1 className="text-[40px] font-semibold leading-none tracking-tight md:text-[72px]">
          Lime OS
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[21px] font-normal text-[#a1a1a6] md:text-[28px]">
          The most refined desktop ever made.
          <br className="hidden md:block" /> Quiet power. Cinematic glass. Every app, ready.
        </p>
        <div className="mt-5 flex items-center justify-center gap-8 text-[17px]">
          <a href="#glow" className="text-[#2997ff] hover:underline">
            Learn more ›
          </a>
          <Link href="/os" className="text-[#2997ff] hover:underline">
            Launch ›
          </Link>
        </div>
        <div className="mx-auto mt-14 max-w-[1100px]">
          <LaptopFrame />
        </div>
      </section>

      <section className="bg-[var(--wash)] px-6 py-24 text-center text-[var(--ink)]" id="glow">
        <p className="text-sm font-semibold tracking-wide text-[#6e6e73]">Glow Display</p>
        <h2 className="mt-2 text-[40px] font-semibold tracking-tight md:text-[56px]">
          Light, with discipline.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[21px] text-[#6e6e73]">
          A 5K Glow canvas with lime-balanced whites, true blacks, and a desktop that
          feels carved from glass — not painted on it.
        </p>
        <div className="mx-auto mt-12 h-[280px] max-w-[820px] rounded-[28px] bg-gradient-to-br from-[#eafbc0] via-[#c6f355] to-[#1c2a12] shadow-[0_40px_80px_rgba(0,0,0,0.12)]" />
      </section>

      <section className="bg-black px-6 py-24 text-center" id="core">
        <p className="text-sm font-semibold tracking-wide text-[var(--lime)]">Lime Core</p>
        <h2 className="mt-2 text-[40px] font-semibold tracking-tight md:text-[56px]">
          Silent. Instant. Endless.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[21px] text-[#a1a1a6]">
          Lime Core runs Finder, Studio, Glow Browser, and a full app library together —
          without the noise. Performance you feel, not a spec you memorize.
        </p>
        <div className="mx-auto mt-14 grid max-w-[900px] grid-cols-3 gap-6 text-left">
          {[
            ["12-wide", "unified architecture"],
            ["64 GB", "cinematic memory"],
            ["2 TB", "studio storage"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-white/5 p-6">
              <div className="text-3xl font-semibold text-[var(--lime)]">{n}</div>
              <div className="mt-1 text-sm text-[#a1a1a6]">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f5f5f7] p-3" id="apps">
        <div className="grid gap-3 md:grid-cols-2">
          <Tile
            dark
            kicker="Apps"
            title="Every tool. Already home."
            body="Finder, Mail, Messages, Calendar, Music, Maps, Notes, Terminal — a complete desktop, designed as one piece."
            href="/os"
            cta="Open the library"
          >
            <AppIconGrid />
          </Tile>
          <Tile
            kicker="Privacy"
            title="Yours. On this machine."
            body="Lime Lock keeps windows, files, and messages on-device. No account required to start. No cloud unless you ask."
            href="#support"
            cta="See how"
          >
            <div className="mx-auto mt-8 h-40 w-40 rounded-full bg-[var(--lime)]/90 p-8">
              <div className="flex h-full items-center justify-center rounded-full bg-black text-white">
                Lime Lock
              </div>
            </div>
          </Tile>
          <Tile
            kicker="Studio"
            title="Create without switching worlds."
            body="Write, compose, and preview in windows that stay out of the way. TextEdit, Preview, Photos, and Music share one elegant chrome."
            href="/os"
            cta="Try Studio"
          >
            <div className="mt-10 h-48 rounded-xl bg-gradient-to-r from-[#1d1d1f] to-[#3a4a20]" />
          </Tile>
          <Tile
            dark
            kicker="Continuity"
            title="One OS. Every screen."
            body="Launch Lime OS in the browser. Keep your dock, wallpapers, notes, and windows exactly as you left them."
            href="/os"
            cta="Resume"
          >
            <div className="mt-8 flex justify-center gap-3">
              <div className="h-36 w-56 rounded-xl bg-white/10" />
              <div className="h-28 w-20 self-end rounded-lg bg-white/10" />
            </div>
          </Tile>
        </div>
      </section>

      <section className="bg-black px-6 py-28 text-center" id="studio">
        <h2 className="text-[40px] font-semibold tracking-tight md:text-[56px]">
          Designed to be lived in.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[21px] text-[#a1a1a6]">
          A menu bar that recedes. A dock that breathes. Windows that feel heavier
          than software — and lighter than chrome.
        </p>
        <Link
          href="/os"
          className="mt-10 inline-flex rounded-full bg-[var(--lime)] px-8 py-3 text-[17px] font-semibold text-black"
        >
          Experience Lime OS
        </Link>
      </section>

      <footer id="support" className="bg-[var(--wash)] text-[12px] text-[#6e6e73]">
        <div className="mx-auto max-w-[980px] px-6 py-8">
          <p className="border-b border-[#d2d2d7] pb-4">
            Lime OS is a product of Limelightworld. Experience it at limelightworld.com.
            Features shown run in your browser as a complete desktop environment.
          </p>
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            <Foot
              title="Shop and Learn"
              links={["Lime OS", "Glow Display", "Lime Core", "Studio", "Accessories"]}
            />
            <Foot
              title="Services"
              links={["Lime Cloud", "Lime Music", "Lime Arcade", "Lime News"]}
            />
            <Foot title="Account" links={["Manage ID", "Lime Store Account", "iCloud-class sync"]} />
            <Foot
              title="Limelightworld"
              links={["About", "Newsroom", "Ethics", "Contact", "Support"]}
            />
          </div>
          <p>
            Copyright © {copyrightYear} Limelightworld Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Tile({
  dark,
  kicker,
  title,
  body,
  href,
  cta,
  children,
}: {
  dark?: boolean;
  kicker: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`min-h-[520px] overflow-hidden px-8 py-14 text-center ${
        dark ? "bg-black text-white" : "bg-white text-[var(--ink)]"
      }`}
    >
      <p className={`text-sm font-semibold ${dark ? "text-[var(--lime)]" : "text-[#6e6e73]"}`}>
        {kicker}
      </p>
      <h3 className="mt-2 text-[32px] font-semibold tracking-tight md:text-[40px]">{title}</h3>
      <p className={`mx-auto mt-3 max-w-md text-[17px] ${dark ? "text-[#a1a1a6]" : "text-[#6e6e73]"}`}>
        {body}
      </p>
      <div className="mt-4">
        <Link href={href} className="text-[17px] text-[#2997ff] hover:underline">
          {cta} ›
        </Link>
      </div>
      {children}
    </div>
  );
}

function Foot({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="mb-2 font-semibold text-[#1d1d1f]">{title}</p>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l}>
            <Link href="/os" className="hover:underline">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LimeMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--lime)" aria-hidden>
      <path d="M12 2c2 4 2 6 0 8 4-1 8 1 10 5-2 7-8 10-10 10S4 22 2 15c2-4 6-6 10-5-2-2-2-4 0-8Z" />
    </svg>
  );
}

function LaptopFrame() {
  return (
    <div className="mx-auto">
      <div className="overflow-hidden rounded-t-[18px] border border-white/15 bg-[#0c0c0c] p-2 shadow-[0_50px_120px_rgba(198,243,85,0.12)]">
        <div className="wallpaper relative h-[380px] overflow-hidden rounded-[12px] md:h-[520px]">
          <div className="os-glass absolute inset-x-0 top-0 flex h-7 items-center justify-between px-3 text-[11px] text-white/90">
            <span className="flex items-center gap-2">
              <LimeMark /> Lime OS
            </span>
            <span>Fri 9:41</span>
          </div>
          <div className="absolute left-1/2 top-16 h-48 w-[70%] -translate-x-1/2 rounded-xl window-chrome p-3 text-left text-[var(--ink)]">
            <div className="mb-2 flex gap-1.5">
              <span className="traffic bg-[#ff5f57]" />
              <span className="traffic bg-[#febc2e]" />
              <span className="traffic bg-[#28c840]" />
            </div>
            <p className="text-sm font-medium">Finder</p>
            <p className="text-xs text-[#6e6e73]">Applications · Documents · Studio</p>
          </div>
          <div className="dock-glass absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-2xl px-3 py-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 rounded-lg"
                style={{ background: `hsl(${70 + i * 18} 70% 55%)` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 max-w-[92%] rounded-b-lg bg-[#3a3a3c]" />
      <div className="mx-auto h-2 max-w-[28%] rounded-b-xl bg-[#2c2c2e]" />
    </div>
  );
}

function AppIconGrid() {
  const colors = ["#5ac8fa", "#ff375f", "#30d158", "#ffd60a", "#bf5af2", "#ff9f0a", "#64d2ff", "#ff453a"];
  return (
    <div className="mx-auto mt-10 grid max-w-xs grid-cols-4 gap-4">
      {colors.map((c) => (
        <div key={c} className="h-14 w-14 rounded-[14px]" style={{ background: c }} />
      ))}
    </div>
  );
}
