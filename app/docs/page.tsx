import type { Metadata } from "next";
import DocsClient from "./DocsClient";

export const metadata: Metadata = {
  title: "Docs — Upload Questions Guide | CBT Prep Hub",
  description:
    "Learn how to upload questions to CBT Prep Hub using JSON or CSV, download templates, and get AI prompts to convert your existing question banks automatically.",
};

export default function DocsPage() {
  return <DocsClient />;
}
