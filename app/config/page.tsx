import React from "react";
import Header from "@/components/Header";
import ConfigEditor from "@/components/ConfigEditor";

type Config = { key: string; value: string };

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — CBT Prep Hub",
  description: "Configure exam duration, pass mark, and application settings.",
};

export default async function ConfigPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/config`);
  const configs: Config[] = await res.json();

  return (
    <>
      <main className="flex-1 bg-navy px-6 py-10 md:px-10 lg:px-16 max-w-3xl mx-auto w-full">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Settings
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-offwhite mb-2">
            App Configuration
          </h1>
          <p className="text-muted text-sm">
            Manage exam parameters and application settings below.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-navy-border mb-6" />

        <ConfigEditor initialConfig={configs} />
      </main>
    </>
  );
}
