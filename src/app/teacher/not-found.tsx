import React from "react";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="text-[120px] font-bold leading-none text-primary/20 sm:text-[180px]">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-muted-foreground sm:h-24 sm:w-24" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mb-8 text-base text-muted-foreground sm:text-lg">
          {`Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or the URL might be incorrect.`}
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-8 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Contact Support
          </Link>
        </div>

        {/* Optional: Help Links */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-4 text-sm font-medium text-foreground">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Documentation
            </Link>
            <Link
              href="/help"
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
