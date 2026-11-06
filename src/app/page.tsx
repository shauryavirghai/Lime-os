import { Suspense } from "react";
import HomePage from "@/components/home/HomePage";
import { CopyrightYear } from "@/components/home/CopyrightYear";

export default function Home() {
  return (
    <HomePage
      copyrightYear={
        <Suspense fallback="2026">
          <CopyrightYear />
        </Suspense>
      }
    />
  );
}
