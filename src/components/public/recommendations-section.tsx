"use client";

import * as React from "react";
import { MessageSquareQuote, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface RecommendationItem {
  id: string;
  authorName: string;
  authorTitle: string;
  authorOrg: string;
  authorAvatar: string | null;
  relationship: string | null;
  quote: string;
  linkedinUrl: string | null;
}

export function RecommendationsSection({
  recommendations,
}: {
  recommendations: RecommendationItem[];
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (recommendations.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? recommendations.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1));
  };

  const current = recommendations[currentIndex];

  return (
    <section id="recommendations" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Executive Endorsements</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            What Leaders Say
          </h2>
        </div>

        {/* Carousel controls */}
        {recommendations.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous recommendation"
              className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground">
              {currentIndex + 1} / {recommendations.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next recommendation"
              className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-8 sm:p-10 rounded-2xl border border-border bg-card/80 shadow-sm space-y-6 relative overflow-hidden backdrop-blur-xs">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <MessageSquareQuote className="w-6 h-6" />
        </div>

        <blockquote className="text-base sm:text-lg md:text-xl font-medium text-foreground leading-relaxed italic">
          &quot;{current.quote}&quot;
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-border/60">
          <div>
            <div className="font-extrabold text-base text-foreground">{current.authorName}</div>
            <div className="text-xs text-muted-foreground">
              {current.authorTitle} • {current.authorOrg}
            </div>
            {current.relationship && (
              <div className="text-[11px] text-primary mt-0.5">{current.relationship}</div>
            )}
          </div>

          {current.linkedinUrl && (
            <a
              href={current.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
