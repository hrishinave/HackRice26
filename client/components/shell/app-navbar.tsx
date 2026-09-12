"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioWaveform, Bot, House, Settings } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: House },
  { href: "/chatbot", label: "Chatbot", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="FocusCue home"
          className="flex shrink-0 items-center gap-2.5 text-primary"
          href="/"
        >
          <span className="grid size-9 place-items-center bg-primary text-primary-foreground">
            <AudioWaveform aria-hidden="true" className="size-5" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            FocusCue
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: isActive ? "default" : "ghost",
                  }),
                  "sm:h-9 sm:w-auto sm:px-3",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" className="mr-1.5"/>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sr-only sm:hidden">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
