"use client";

import * as React from "react";
import {
  createCaseStudyAction,
  updateCaseStudyAction,
  deleteCaseStudyAction,
  toggleCaseStudyStatusAction,
} from "@/actions/case-studies";
import { MetricBuilder, CaseMetric } from "@/components/admin/metric-builder";
import { FileUploader } from "@/components/admin/file-uploader";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Star,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  industry: string;
  customerName: string;
  anonymizeCustomer: boolean;
  customerAlias: string | null;
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics: CaseMetric[];
  techStack: string[];
  coverImageUrl: string | null;
  architectureImageUrl: string | null;
  links: { label: string; url: string }[];
  featured: boolean;
  order: number;
  status: string;
  visible: boolean;
}

export function CaseStudiesManager({ initialItems }: { initialItems: CaseStudyItem[] }) {
  const [items, setItems] = React.useState<CaseStudyItem[]>(initialItems);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [editingItem, setEditingItem] = React.useState<CaseStudyItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [anonymizeCustomer, setAnonymizeCustomer] = React.useState(true);
  const [customerAlias, setCustomerAlias] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [situation, setSituation] = React.useState("");
  const [task, setTask] = React.useState("");
  const [action, setAction] = React.useState("");
  const [result, setResult] = React.useState("");
  const [metrics, setMetrics] = React.useState<CaseMetric[]>([]);
  const [techStack, setTechStack] = React.useState("");
  const [coverImageUrl, setCoverImageUrl] = React.useState("");
  const [architectureImageUrl, setArchitectureImageUrl] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [status, setStatus] = React.useState("PUBLISHED");

  const openCreate = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setIndustry("Industrial Manufacturing & Energy");
    setCustomerName("");
    setAnonymizeCustomer(true);
    setCustomerAlias("Tier-1 Global Industrial OEM");
    setSummary("");
    setSituation("");
    setTask("");
    setAction("");
    setResult("");
    setMetrics([]);
    setTechStack("");
    setCoverImageUrl("");
    setArchitectureImageUrl("");
    setFeatured(true);
    setStatus("PUBLISHED");
    setIsModalOpen(true);
  };

  const openEdit = (item: CaseStudyItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setIndustry(item.industry);
    setCustomerName(item.customerName);
    setAnonymizeCustomer(item.anonymizeCustomer);
    setCustomerAlias(item.customerAlias || "");
    setSummary(item.summary);
    setSituation(item.situation);
    setTask(item.task);
    setAction(item.action);
    setResult(item.result);
    setMetrics(item.metrics);
    setTechStack(item.techStack.join(", "));
    setCoverImageUrl(item.coverImageUrl || "");
    setArchitectureImageUrl(item.architectureImageUrl || "");
    setFeatured(item.featured);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      slug,
      title,
      summary,
      industry,
      customerName,
      anonymizeCustomer,
      customerAlias: customerAlias || null,
      situation,
      task,
      action,
      result,
      metrics,
      techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
      coverImageUrl: coverImageUrl || null,
      architectureImageUrl: architectureImageUrl || null,
      featured,
      status,
    };

    try {
      if (editingItem) {
        const res = await updateCaseStudyAction(editingItem.id, payload);
        if (res.error) throw new Error(res.error);
        setItems(
          items.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  ...payload,
                  metrics: payload.metrics,
                  techStack: payload.techStack,
                  links: it.links,
                }
              : it
          )
        );
      } else {
        const res = await createCaseStudyAction(payload);
        if (res.error) throw new Error(res.error);
        if (res.item) {
          setItems([
            ...items,
            {
              ...res.item,
              metrics: payload.metrics,
              techStack: payload.techStack,
              links: [],
            },
          ]);
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save case study");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Delete case study "${itemTitle}"?`)) return;
    const res = await deleteCaseStudyAction(id);
    if (res.success) {
      setItems(items.filter((it) => it.id !== id));
    }
  };

  const handleToggleStatus = async (id: string) => {
    const res = await toggleCaseStudyStatusAction(id);
    if (res.success) {
      setItems(items.map((it) => (it.id === id ? { ...it, status: res.status! } : it)));
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesStatus = statusFilter === "ALL" || it.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      it.title.toLowerCase().includes(q) ||
      it.industry.toLowerCase().includes(q) ||
      it.customerName.toLowerCase().includes(q) ||
      (it.customerAlias && it.customerAlias.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search case studies, industries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New STAR Case Study</span>
        </button>
      </div>

      {/* Grid of Case Studies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((study) => (
          <div
            key={study.id}
            className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 flex flex-col justify-between transition-all hover:border-primary/40"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                  {study.industry}
                </span>

                <div className="flex items-center gap-1">
                  {study.featured && (
                    <span className="p-1 text-amber-500" title="Featured on homepage">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleStatus(study.id)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title={study.status === "PUBLISHED" ? "Switch to Draft" : "Publish item"}
                  >
                    {study.status === "PUBLISHED" ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-amber-500" />}
                  </button>
                  <button
                    onClick={() => openEdit(study)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Edit case study"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(study.id, study.title)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-foreground line-clamp-2">
                {study.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>
                  Client:{" "}
                  {study.anonymizeCustomer
                    ? `${study.customerAlias || "Confidential"} (NDA Protected)`
                    : study.customerName}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {study.summary}
              </p>

              {/* KPI Badges */}
              {study.metrics.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {study.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 rounded bg-muted/50 border border-border text-[11px] font-mono text-foreground"
                    >
                      <span className="font-bold text-primary">{m.value}{m.unit}</span>{" "}
                      <span className="text-muted-foreground">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-muted-foreground">/work/{study.slug}</span>
              <Link
                href={`/work/${study.slug}`}
                target="_blank"
                className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Full Modal for STAR Case Study Builder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingItem ? "Edit STAR Case Study" : "Create Industrial STAR Case Study"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Case Study Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Scalable Hybrid-Edge Digital Twin for Asset Performance Management"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. scalable-hybrid-edge-digital-twin"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm font-mono text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Industry Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Energy & Process Operations / Manufacturing"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Anonymization Section */}
                <div className="md:col-span-2 p-3.5 rounded-lg border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-xs font-semibold text-foreground block">
                          Customer NDA Anonymization Guard
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          When checked, the public site only displays the customer alias
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anonymizeCustomer}
                        onChange={(e) => setAnonymizeCustomer(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                        Private Real Customer Name (Stored only in DB) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Real enterprise name"
                        className="w-full p-2 text-xs rounded border border-border bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                        Public Customer Alias (e.g. &quot;Global Energy Supermajor&quot;) *
                      </label>
                      <input
                        type="text"
                        required={anonymizeCustomer}
                        value={customerAlias}
                        onChange={(e) => setCustomerAlias(e.target.value)}
                        placeholder="Global Tier-1 OEM / Supermajor"
                        className="w-full p-2 text-xs rounded border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Executive Summary *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief 2-line summary for cards and search snippets..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* STAR Layout Form */}
              <div className="p-4 rounded-xl border border-primary/30 bg-card/60 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>STAR Methodology Breakdown</span>
                </h3>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                    S - Situation (Industrial Context & Operational Baseline) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Describe legacy equipment, downtime frequency, and cost per hour of stoppage..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                    T - Task (Charter & Platform Objectives) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="What specific throughput, SLA, or twin replication capability was required..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                    A - Action (Engineering Strategy, Architecture & Execution) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="How teams were organized, edge protocols standardized, streaming pipelines deployed..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                    R - Result (Measurable Business ROI & Operational Impact) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="Downtime reduction, equipment failures caught before trip, annual cost savings..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Metric Builder */}
              <div className="pt-2 border-t border-border">
                <MetricBuilder metrics={metrics} onChange={setMetrics} />
              </div>

              {/* Tech Stack & Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="Kubernetes, Kafka, OPC UA, TimescaleDB, Three.js, GraphQL"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <FileUploader
                    value={coverImageUrl}
                    onChange={setCoverImageUrl}
                    accept="image/*"
                    label="Cover Image (Optional)"
                    description="Hero banner for the case study"
                  />
                </div>

                <div>
                  <FileUploader
                    value={architectureImageUrl}
                    onChange={setArchitectureImageUrl}
                    accept="image/*"
                    label="Custom Architecture Diagram (Optional)"
                    description="Plant-to-cloud twin diagram or screenshot"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Feature on homepage</span>
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-1.5 rounded-md border border-border bg-background text-xs font-medium text-foreground"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Case Study</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
