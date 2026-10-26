import { prisma } from "@/lib/prisma";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Inbound Messages & Recruiter Inquiries
        </h1>
        <p className="text-sm text-muted-foreground">
          Inquiries received through the public contact form, stored securely with spam honeypot
          and rate-limiting protection.
        </p>
      </div>

      <MessagesClient initialMessages={messages} />
    </div>
  );
}
