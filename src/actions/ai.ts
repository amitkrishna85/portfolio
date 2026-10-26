"use server";

import { requireAdminSession } from "@/lib/auth-guard";

interface ImproveBulletResult {
  improved: string;
  feedback: string[];
  suggestedAdditions: string[];
}

interface StarStudyResult {
  situation: string;
  task: string;
  action: string;
  result: string;
  missingDataQuestions: string[];
}

const ACTION_VERBS = [
  "Architected",
  "Spearheaded",
  "Engineered",
  "Directed",
  "Orchestrated",
  "Deployed",
  "Optimized",
  "Modernized",
  "Scaled",
  "Standardized",
  "Pioneered",
];

const INDUSTRIAL_TERMS = [
  "OPC UA",
  "MQTT Sparkplug B",
  "AVEVA PI",
  "SCADA",
  "ISA-95",
  "IEC 62443",
  "digital twin",
  "telemetry pipeline",
  "predictive maintenance",
  "OEE",
  "MTTR",
  "unplanned downtime",
  "edge runtime",
];

/**
 * Deterministic rule-based assistant when no LLM API key is configured.
 */
function ruleBasedImproveBullet(rawBullet: string): ImproveBulletResult {
  const trimmed = rawBullet.trim();
  const words = trimmed.split(/\s+/);
  const firstWord = words[0]?.replace(/[^a-zA-Z]/g, "") || "";
  const feedback: string[] = [];
  const suggestedAdditions: string[] = [];

  const startsWithStrongVerb = ACTION_VERBS.some(
    (v) => v.toLowerCase() === firstWord.toLowerCase()
  );

  let newBullet = trimmed;

  if (!startsWithStrongVerb) {
    const recommendedVerb =
      ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    feedback.push(
      `Consider opening with a decisive industrial leadership verb like "${recommendedVerb}" instead of "${firstWord}".`
    );
    newBullet = `${recommendedVerb} ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`;
  } else {
    feedback.push(`Strong opening verb: "${firstWord}".`);
  }

  // Check for quantifiable metric
  const hasMetric = /\d+%|\$\d+|\b\d+\s*(ms|sec|min|hours|x|facilities|plants|assets|tags)\b/i.test(
    trimmed
  );
  if (!hasMetric) {
    feedback.push("Missing a quantified scale or outcome metric.");
    suggestedAdditions.push(
      "[ADD: Quantified outcome, e.g., resulting in a 24% reduction in MTTR across 14 manufacturing facilities]"
    );
    newBullet += ` [ADD: What was the % reduction or scale metric achieved?]`;
  }

  // Check for OT/IT industrial context
  const hasIndustrialTerm = INDUSTRIAL_TERMS.some((term) =>
    trimmed.toLowerCase().includes(term.toLowerCase())
  );
  if (!hasIndustrialTerm) {
    feedback.push("Anchor the bullet to specific plant floor OT/IT protocols or architectures.");
    suggestedAdditions.push("Mention OPC UA, MQTT Sparkplug B, ISA-95, or SCADA integration.");
  }

  return {
    improved: newBullet,
    feedback,
    suggestedAdditions,
  };
}

/**
 * Server action to improve an executive experience bullet.
 */
export async function improveBulletAction(bullet: string): Promise<{
  success: boolean;
  data?: ImproveBulletResult;
  error?: string;
}> {
  await requireAdminSession();

  if (!bullet || bullet.trim().length === 0) {
    return { success: false, error: "Bullet text cannot be empty." };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to deterministic industrial rules
    const result = ruleBasedImproveBullet(bullet);
    return { success: true, data: result };
  }

  try {
    // If Anthropic API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 600,
          system: `You are an executive resume advisor specializing in Director of Engineering profiles for Industrial Software & Digital Twins.
CRITICAL CONSTRAINT: You must NEVER invent or hallucinate metrics, companies, dates, or false achievements.
If the candidate's input lacks a metric or specific outcome, insert an explicit bracketed placeholder like "[ADD: What was the % reduction in MTTR or downtime?]" rather than making one up.
Format your response as a valid JSON object with keys:
- "improved": string (the polished bullet with strong action verb, precise OT/IT terminology, and placeholder questions if needed)
- "feedback": string[] (1-3 points explaining improvements)
- "suggestedAdditions": string[] (specific clarification questions for missing data)`,
          messages: [
            {
              role: "user",
              content: `Improve this resume bullet point: "${bullet}"`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const json = await response.json();
      const contentText = json.content?.[0]?.text;
      const parsed = JSON.parse(contentText);
      return { success: true, data: parsed };
    }

    // Default fallback
    return { success: true, data: ruleBasedImproveBullet(bullet) };
  } catch (err: any) {
    console.error("AI bullet improvement error:", err);
    // Fall back to rule-based on network or API failure
    return { success: true, data: ruleBasedImproveBullet(bullet) };
  }
}

/**
 * Server action to structure raw engineering notes into a STAR case study.
 */
export async function notesToStarAction(rawNotes: string): Promise<{
  success: boolean;
  data?: StarStudyResult;
  error?: string;
}> {
  await requireAdminSession();

  if (!rawNotes || rawNotes.trim().length === 0) {
    return { success: false, error: "Notes cannot be empty." };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Deterministic parsing
    const lines = rawNotes.split("\n").filter((l) => l.trim().length > 0);
    return {
      success: true,
      data: {
        situation: lines[0] || "Industrial manufacturing environment requiring digital twin asset visibility.",
        task: lines[1] || "Lead end-to-end architecture and cross-functional engineering team to unify plant floor telemetry.",
        action: lines.slice(2, 4).join(" ") || "Architected unified namespace over MQTT Sparkplug B and OPC UA connecting 150k+ I/O tags.",
        result: lines.slice(4).join(" ") || "Reduced unplanned downtime by [ADD: % reduction] and decreased alert fatigue by [ADD: %].",
        missingDataQuestions: [
          "[ADD: What was the baseline downtime or OEE prior to deployment?]",
          "[ADD: What was the verified MTTR reduction after full rollout?]",
          "[ADD: What scale of tags/devices were synchronized in real time?]",
        ],
      },
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1200,
        system: `You are an expert executive industrial software portfolio editor.
Organize unstructured notes into a structured STAR (Situation, Task, Action, Result) case study.
CRITICAL CONSTRAINT: Do NOT hallucinate or fabricate facts, metrics, or vendor systems. Where numbers or specific details are absent, formulate precise questions enclosed in brackets like "[ADD: What was the exact latency target in ms?]".
Format your response as a valid JSON object with keys:
- "situation": string (1-2 paragraphs detailing the operational plant context, industrial bottlenecks, and stakes)
- "task": string (The candidate's leadership mandate and charter as Director of Engineering)
- "action": string (Technical architecture, team orchestration, OT/IT protocols, and execution milestones)
- "result": string (Business and operational ROI, OEE/MTTR improvements, with [ADD: ...] placeholders for missing figures)
- "missingDataQuestions": string[] (List of 3-5 specific questions for the candidate to fill in)`,
        messages: [
          {
            role: "user",
            content: `Convert these notes into an industrial STAR case study:\n\n${rawNotes}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const json = await response.json();
    const contentText = json.content?.[0]?.text;
    const parsed = JSON.parse(contentText);
    return { success: true, data: parsed };
  } catch (err: any) {
    console.error("AI STAR generation error:", err);
    return {
      success: true,
      data: {
        situation: rawNotes.slice(0, 200),
        task: "Orchestrate digital twin engineering team to solve asset connectivity and predictive analytics bottlenecks.",
        action: "Designed high-throughput telemetry pipeline adhering to IEC 62443 cyber-physical security.",
        result: "Delivered unified asset monitoring with zero production interruptions. [ADD: Metric]",
        missingDataQuestions: [
          "[ADD: What were the quantified production results?]",
          "[ADD: How many plants/facilities adopted the solution?]",
        ],
      },
    };
  }
}
