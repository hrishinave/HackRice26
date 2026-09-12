import type { Metadata } from "next";
import { Bot } from "lucide-react";

export const metadata: Metadata = {
  title: "Chatbot | FocusCue",
};

export default function ChatbotPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold text-primary">Focus coach</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Chatbot
        </h1>
      </div>

      <section className="mt-8 grid flex-1 place-items-center border border-primary/25 bg-background/95 p-6 text-center shadow-[4px_4px_0_0_var(--primary)]">
        <div className="max-w-md">
          <span className="mx-auto grid size-12 place-items-center bg-primary text-primary-foreground">
            <Bot aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold">Your focus coach lives here.</h2>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            Chat guidance will be connected after the core focus-session workflow.
          </p>
        </div>
      </section>
    </main>
  );
}
