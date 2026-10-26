"use client";

import * as React from "react";
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  duplicateExperienceAction,
  toggleExperienceStatusAction,
} from "@/actions/experience";
import { BulletEditor } from "@/components/admin/bullet-editor";
import { FileUploader } from "@/components/admin/file-uploader";
import { formatDate, calculateTenure } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Shield,
  X,
  Save,
} from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  companyUrl: string | null;
  logoUrl: string | null;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  bullets: string[];
  techStack: string[];
  industries: string[];
  anonymizeCompany: boolean;
  companyAlias: string | null;
  order: number;
  status: string;
  visible: boolean;
}

export function ExperienceManager({ initialItems }: { initialItems: ExperienceItem[] }) {
  const [items, setItems] = React.useState<ExperienceItem[]>(initialItems);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [editingItem, setEditingItem] = React.useState<ExperienceItem | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for creating/editing
  const [formCompany, setFormCompany] = React.useState("");
  const [formCompanyUrl, setFormCompanyUrl] = React.useState("");
  const [formLogoUrl, setFormLogoUrl] = React.useState("");
  const [formTitle, setFormTitle] = React.useState("");
  const [formLocation, setFormLocation] = React.useState("");
  const [formStartDate, setFormStartDate] = React.useState("");
  const [formEndDate, setFormEndDate] = React.useState("");
  const [formSummary, setFormSummary] = React.useState("");
  const [formBullets, setFormBullets] = React.useState<string[]>([]);
  const [formTechStack, setFormTechStack] = React.useState("");
  const [formIndustries, setFormIndustries] = React.useState("");
  const [formAnonymize, setFormAnonymize] = React.useState(false);
  const [formAlias, setFormAlias] = React.useState("");
  const [formStatus, setFormStatus] = React.useState("PUBLISHED");

  const openCreateModal = () => {
    setEditingItem(null);
    setFormCompany("");
    setFormCompanyUrl("");
    setFormLogoUrl("");
    setFormTitle("");
    setFormLocation("");
    setFormStartDate("");
    setFormEndDate("");
    setFormSummary("");
    setFormBullets([""]);
    setFormTechStack("");
    setFormIndustries("");
    setFormAnonymize(false);
    setFormAlias("");
    setFormStatus("PUBLISHED");
    setIsCreating(true);
  };

  const openEditModal = (item: ExperienceItem) => {
    setEditingItem(item);
    setFormCompany(item.company);
    setFormCompanyUrl(item.companyUrl || "");
    setFormLogoUrl(item.logoUrl || "");
    setFormTitle(item.title);
    setFormLocation(item.location);
    setFormStartDate(item.startDate);
    setFormEndDate(item.endDate || "");
    setFormSummary(item.summary);
    setFormBullets(item.bullets);
    setFormTechStack(item.techStack.join(", "));
    setFormIndustries(item.industries.join(", "));
    setFormAnonymize(item.anonymizeCompany);
    setFormAlias(item.companyAlias || "");
    setFormStatus(item.status);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    const payload = {
      company: formCompany,
      companyUrl: formCompanyUrl,
      logoUrl: formLogoUrl,
      title: formTitle,
      location: formLocation,
      startDate: formStartDate,
      endDate: formEndDate ? formEndDate : null,
      summary: formSummary,
      bullets: formBullets.filter((b) => b.trim().length > 0),
      techStack: formTechStack.split(",").map((s) => s.trim()).filter(Boolean),
      industries: formIndustries.split(",").map((s) => s.trim()).filter(Boolean),
      anonymizeCompany: formAnonymize,
      companyAlias: formAlias,
      status: formStatus,
    };

    try {
      if (editingItem) {
        const res = await updateExperienceAction(editingItem.id, payload);
        if (res.error) throw new Error(res.error);
        setItems(
          items.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  ...payload,
                  bullets: payload.bullets,
                  techStack: payload.techStack,
                  industries: payload.industries,
                }
              : it
          )
        );
        setNotification({ type: "success", text: "Role updated successfully!" });
      } else {
        const res = await createExperienceAction(payload);
        if (res.error) throw new Error(res.error);
        if (res.item) {
          setItems([
            ...items,
            {
              ...res.item,
              bullets: payload.bullets,
              techStack: payload.techStack,
              industries: payload.industries,
            },
          ]);
        }
        setNotification({ type: "success", text: "New role created successfully!" });
      }
      closeModal();
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Failed to save role" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await deleteExperienceAction(id);
      if (res.error) throw new Error(res.error);
      setItems(items.filter((it) => it.id !== id));
      setNotification({ type: "success", text: "Role deleted." });
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Failed to delete" });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await duplicateExperienceAction(id);
      if (res.error) throw new Error(res.error);
      if (res.item) {
        const parsed = {
          ...res.item,
          bullets: JSON.parse(res.item.bullets),
          techStack: JSON.parse(res.item.techStack),
          industries: JSON.parse(res.item.industries),
        };
        setItems([...items, parsed]);
        setNotification({ type: "success", text: "Role duplicated as Draft." });
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Failed to duplicate" });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await toggleExperienceStatusAction(id);
      if (res.error) throw new Error(res.error);
      setItems(
        items.map((it) => (it.id === id ? { ...it, status: res.status! } : it))
      );
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Failed to update status" });
    }
  };

  const filteredItems = items.filter((it) => {
    const matchesStatus = statusFilter === "ALL" || it.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      it.company.toLowerCase().includes(q) ||
      it.title.toLowerCase().includes(q) ||
      it.summary.toLowerCase().includes(q) ||
      it.techStack.some((t) => t.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center justify-between ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roles, companies, tech stack..."
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
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Role</span>
        </button>
      </div>

      {/* Experience list */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground bg-card/30">
            No roles match the selected filter. Click &quot;Add Career Role&quot; to create one.
          </div>
        ) : (
          filteredItems.map((item) => {
            const tenure = calculateTenure(item.startDate, item.endDate);

            return (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 transition-all hover:border-primary/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.anonymizeCompany && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> NDA Anonymized ({item.companyAlias})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        {item.anonymizeCompany ? item.companyAlias || "Confidential Client" : item.company}
                      </span>
                      <span>•</span>
                      <span>{item.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.startDate)} — {formatDate(item.endDate)}
                        {tenure && ` (${tenure})`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-start">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                      title={item.status === "PUBLISHED" ? "Switch to Draft" : "Publish item"}
                    >
                      {item.status === "PUBLISHED" ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-amber-500" />}
                    </button>
                    <button
                      onClick={() => handleDuplicate(item.id)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Duplicate role"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Edit role"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.summary}
                </p>

                {/* Bullets preview */}
                {item.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-xs text-muted-foreground/90 space-y-1">
                    {item.bullets.slice(0, 2).map((b, i) => (
                      <li key={i} className="line-clamp-1">
                        {b}
                      </li>
                    ))}
                    {item.bullets.length > 2 && (
                      <li className="text-[11px] text-muted-foreground italic list-none -ml-4">
                        +{item.bullets.length - 2} more achievements
                      </li>
                    )}
                  </ul>
                )}

                {/* Tech chips */}
                {item.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Slide-over / Modal for Create/Edit */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingItem ? "Edit Career Role" : "Add New Career Role"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Director of Engineering - Digital Twin Platforms"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Employer / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Industrial Software Corp"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Anonymization Toggle */}
                <div className="md:col-span-2 p-3 rounded-lg border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-xs font-semibold text-foreground block">
                          NDA Customer / Employer Anonymization
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Protect confidential employer or client names on public pages
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formAnonymize}
                        onChange={(e) => setFormAnonymize(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {formAnonymize && (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                        Public Alias (e.g. &quot;Global Tier-1 Automotive OEM&quot;) *
                      </label>
                      <input
                        type="text"
                        required={formAnonymize}
                        value={formAlias}
                        onChange={(e) => setFormAlias(e.target.value)}
                        placeholder="Global Energy Supermajor / Fortune 50 Industrial OEM"
                        className="w-full p-2 rounded-md border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Oslo, Norway / Remote"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Company Website URL
                  </label>
                  <input
                    type="url"
                    value={formCompanyUrl}
                    onChange={(e) => setFormCompanyUrl(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Start Date (YYYY-MM) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    placeholder="2021-06"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    End Date (YYYY-MM or empty for Present)
                  </label>
                  <input
                    type="text"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    placeholder="Leave empty for Present"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Publishing Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="PUBLISHED">Published (Visible Publicly)</option>
                    <option value="DRAFT">Draft (Admin Preview Only)</option>
                  </select>
                </div>

                <div>
                  <FileUploader
                    value={formLogoUrl}
                    onChange={setFormLogoUrl}
                    accept="image/*"
                    label="Company Logo (Optional)"
                    description="Square logo (PNG or SVG)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Role Summary
                  </label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Directing platform engineering and application teams..."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Bullet Editor with live hints */}
              <div className="pt-2 border-t border-border">
                <BulletEditor
                  bullets={formBullets}
                  onChange={setFormBullets}
                  label="Role Achievements & Industrial Metrics"
                  description="Start with an action verb (Architected, Scaled) and include quantifiable outcomes."
                />
              </div>

              {/* Tech stack & Industries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formTechStack}
                    onChange={(e) => setFormTechStack(e.target.value)}
                    placeholder="Kubernetes, Kafka, OPC UA, MQTT, Go, TypeScript"
                    className="w-full p-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Industries (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formIndustries}
                    onChange={(e) => setFormIndustries(e.target.value)}
                    placeholder="Manufacturing, Energy, Oil & Gas"
                    className="w-full p-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Career Role</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
