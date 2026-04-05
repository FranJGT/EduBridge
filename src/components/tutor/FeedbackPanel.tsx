"use client";

import { motion } from "motion/react";
import { t } from "@/lib/i18n";
import { SpeechBubble } from "@/components/shared/SpeechBubble";

interface Feedback {
  isCorrect: boolean;
  feedback: string;
  hint?: string;
  correctAnswer?: string;
  scanBonus?: number;
  starsEarned?: number;
}

interface FeedbackPanelProps {
  feedback: Feedback;
  onNext: () => void;
  onRetry: () => void;
  onTopics: () => void;
  language: string;
}

export function FeedbackPanel({
  feedback,
  onNext,
  onRetry,
  onTopics,
  language,
}: FeedbackPanelProps) {
  return (
    <div className="space-y-6">
      {/* Result indicator */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl ${
            feedback.isCorrect
              ? "bg-success/10 text-success"
              : "bg-secondary/10 text-secondary"
          }`}
          style={
            feedback.isCorrect
              ? { boxShadow: "0 0 40px rgba(76,175,80,0.2)" }
              : {}
          }
        >
          {feedback.isCorrect ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12a9 9 0 109 9 9 9 0 00-9-9" />
              <polyline points="9 12 15 12" />
              <polyline points="12 9 12 15" />
            </svg>
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-bold ${
            feedback.isCorrect ? "text-success" : "text-secondary"
          }`}
        >
          {feedback.isCorrect
            ? t("student.correct", language)
            : t("student.almost", language)}
        </motion.h2>

        {/* Stars reward */}
        {feedback.isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="text-sm font-bold">+{feedback.starsEarned ?? 20} Stars</span>
          </motion.div>
        )}

        {/* Scan bonus */}
        {feedback.scanBonus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="text-sm font-bold">
              +{feedback.scanBonus} Stars (Scan Bonus!)
            </span>
          </motion.div>
        )}
      </div>

      {/* Nuri feedback */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SpeechBubble text={feedback.feedback} />
      </motion.div>

      {/* Hint for wrong answers */}
      {feedback.hint && !feedback.isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-secondary/10"
        >
          <svg
            className="w-5 h-5 text-secondary shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 019 14" />
          </svg>
          <p className="text-sm text-secondary">{feedback.hint}</p>
        </motion.div>
      )}

      {!feedback.isCorrect && feedback.correctAnswer && (
        <p className="text-center text-sm text-muted">
          Answer: {feedback.correctAnswer}
        </p>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        {feedback.isCorrect ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full h-14 rounded-full bg-primary text-white text-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            {t("student.nextProblem", language)}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              className="flex-1 h-14 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
            >
              {t("student.tryAgain", language)}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="flex-1 h-14 rounded-full border border-border text-foreground font-medium hover:bg-card transition-colors"
            >
              {t("student.nextProblem", language)}
            </motion.button>
          </div>
        )}
        <button
          onClick={onTopics}
          className="w-full text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; {t("feedback.backTopics", language)}
        </button>
      </motion.div>
    </div>
  );
}
