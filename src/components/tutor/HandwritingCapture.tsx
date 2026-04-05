"use client";

import { useState, useRef } from "react";
import { t } from "@/lib/i18n";

interface HandwritingCaptureProps {
  language: string;
  onAnalysis: (analysis: Record<string, unknown>) => void;
  onBack: () => void;
}

export function HandwritingCapture({
  language,
  onAnalysis,
  onBack,
}: HandwritingCaptureProps) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Extract base64 without data URI prefix
      setImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data from data URL
      const base64 = image.split(",")[1];
      if (!base64) {
        setError("Invalid image format. Please try again.");
        setAnalyzing(false);
        return;
      }

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, language }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          onAnalysis(data.analysis);
        } else {
          setError("Could not analyze the image. Try a clearer photo.");
        }
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch {
      setError("Connection error. Check your AI provider.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-6 pt-8">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">{t("camera.title", language)}</h2>
        <p className="text-sm text-muted">{t("camera.instruction", language)}</p>
      </div>

      {!image ? (
        <div className="space-y-4">
          {/* Camera capture */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-card transition-colors"
          >
            <svg
              className="w-12 h-12 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
            <span className="text-sm font-medium text-muted">
              {t("camera.capture", language)}
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="rounded-2xl overflow-hidden border border-border">
            <img
              src={image}
              alt="Captured handwriting"
              className="w-full object-contain max-h-64"
            />
          </div>

          {error && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setImage(null);
                setError(null);
              }}
              className="flex-1 h-12 rounded-xl border border-border text-foreground font-medium hover:bg-card transition-colors"
            >
              {t("camera.retake", language)}
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("camera.analyzing", language)}
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        &larr; Back to topics
      </button>
    </div>
  );
}
