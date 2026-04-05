"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 text-danger text-3xl">
          !
        </div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-muted text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2 rounded-full border border-border text-foreground font-medium hover:bg-card transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
