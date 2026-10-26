"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export function MarkdownView({ content, className = "" }: MarkdownViewProps) {
  if (!content) return null;

  return (
    <div
      className={`prose dark:prose-invert max-w-none text-foreground/90 space-y-3 leading-relaxed text-sm md:text-base ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground mt-4 mb-2 border-b border-border/60 pb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground mt-3 mb-1 text-primary" {...props} />
          ),
          p: ({ node, ...props }) => <p className="text-muted-foreground leading-relaxed my-2" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside ml-5 space-y-1 my-2 text-muted-foreground" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside ml-5 space-y-1 my-2 text-muted-foreground" {...props} />
          ),
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground my-3" {...props} />
          ),
          code: ({ node, className, children, ...props }) => {
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-primary font-medium"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
