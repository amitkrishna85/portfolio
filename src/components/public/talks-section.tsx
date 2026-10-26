import * as React from "react";
import { Award, ExternalLink, Mic, FileText, BookmarkCheck } from "lucide-react";

interface TalkItem {
  id: string;
  title: string;
  kind: string;
  eventOrPub: string;
  date: string;
  url: string | null;
  description: string | null;
}

export function TalksSection({ talks }: { talks: TalkItem[] }) {
  if (talks.length === 0) return null;

  return (
    <section id="talks" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>Industry Authority & Thought Leadership</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Keynotes, Patents & Publications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {talks.map((talk) => (
          <div
            key={talk.id}
            className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-3 transition-all hover:border-primary/40 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-mono inline-block">
                {talk.kind}
              </span>

              <h3 className="font-extrabold text-base text-foreground leading-snug">
                {talk.title}
              </h3>

              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{talk.eventOrPub}</span>
                <span className="font-mono"> • {talk.date}</span>
              </div>

              {talk.description && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {talk.description}
                </p>
              )}
            </div>

            {talk.url && (
              <div className="pt-3 border-t border-border/60">
                <a
                  href={talk.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>View Documentation / Slides</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
