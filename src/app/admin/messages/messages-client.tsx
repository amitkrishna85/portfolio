"use client";

import * as React from "react";
import { markMessageReadAction, deleteMessageAction } from "@/actions/contact";
import { Mail, Check, Trash2, Building, Calendar, Clock } from "lucide-react";

export function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = React.useState(initialMessages);

  const handleMarkRead = async (id: string) => {
    const res = await markMessageReadAction(id);
    if (res.success) {
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from ${name}?`)) return;
    const res = await deleteMessageAction(id);
    if (res.success) {
      setMessages(messages.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground bg-card/30">
          No messages received yet. Inbound recruiter inquiries will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border bg-card shadow-xs space-y-3 transition-all ${
                msg.read ? "border-border opacity-80" : "border-primary/40 bg-primary/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" title="Unread" />
                  )}
                  <h3 className="font-bold text-sm text-foreground">{msg.name}</h3>
                  <span className="text-xs text-muted-foreground">({msg.email})</span>
                  {msg.company && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building className="w-3 h-3" /> {msg.company}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1 ml-2">
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-medium text-foreground flex items-center gap-1"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="font-semibold text-xs text-foreground">{msg.subject}</div>

              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>

              <div className="pt-2 border-t border-border/50">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
