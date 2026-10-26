"use client";

import * as React from "react";
import {
  createCapabilityAction,
  deleteCapabilityAction,
  createIndustryAction,
  deleteIndustryAction,
  createIntegrationAction,
  deleteIntegrationAction,
} from "@/actions/solutions";
import { Cpu, Factory, Link2, Plus, Trash2, X } from "lucide-react";

export function SolutionsManager({
  capabilities,
  industries,
  integrations,
}: {
  capabilities: any[];
  industries: any[];
  integrations: any[];
}) {
  const [caps, setCaps] = React.useState(capabilities);
  const [indus, setIndus] = React.useState(industries);
  const [integs, setIntegs] = React.useState(integrations);

  // Modal states
  const [capModal, setCapModal] = React.useState(false);
  const [indModal, setIndModal] = React.useState(false);
  const [intModal, setIntModal] = React.useState(false);

  // Form states
  const [capTitle, setCapTitle] = React.useState("");
  const [capDesc, setCapDesc] = React.useState("");
  const [capCat, setCapCat] = React.useState("Digital Twin Core");

  const [indName, setIndName] = React.useState("");
  const [indDesc, setIndDesc] = React.useState("");

  const [intName, setIntName] = React.useState("");
  const [intCat, setIntCat] = React.useState("PROTOCOL");

  const handleAddCap = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createCapabilityAction({
      title: capTitle,
      description: capDesc,
      category: capCat,
    });
    if (res.item) {
      setCaps([...caps, res.item]);
      setCapModal(false);
      setCapTitle("");
      setCapDesc("");
    }
  };

  const handleAddInd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createIndustryAction({
      name: indName,
      description: indDesc,
    });
    if (res.item) {
      setIndus([...indus, res.item]);
      setIndModal(false);
      setIndName("");
      setIndDesc("");
    }
  };

  const handleAddInt = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createIntegrationAction({
      name: intName,
      category: intCat,
    });
    if (res.item) {
      setIntegs([...integs, res.item]);
      setIntModal(false);
      setIntName("");
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Solution Capabilities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Solution Capabilities & Pillars</h2>
          </div>
          <button
            onClick={() => setCapModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Capability</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caps.map((cap) => (
            <div key={cap.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative group">
              <button
                onClick={async () => {
                  if (confirm(`Delete "${cap.title}"?`)) {
                    await deleteCapabilityAction(cap.id);
                    setCaps(caps.filter((c) => c.id !== cap.id));
                  }
                }}
                className="absolute top-3 right-3 p-1 rounded text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block">
                {cap.category}
              </span>
              <h3 className="font-bold text-sm text-foreground pr-6">{cap.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Industry Verticals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Target Industrial Verticals</h2>
          </div>
          <button
            onClick={() => setIndModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vertical</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {indus.map((ind) => (
            <div key={ind.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative group">
              <button
                onClick={async () => {
                  if (confirm(`Delete "${ind.name}"?`)) {
                    await deleteIndustryAction(ind.id);
                    setIndus(indus.filter((i) => i.id !== ind.id));
                  }
                }}
                className="absolute top-3 right-3 p-1 rounded text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <h3 className="font-bold text-sm text-foreground pr-6">{ind.name}</h3>
              <p className="text-xs text-muted-foreground">{ind.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Integration Ecosystem (Protocols, Systems, Standards, Cloud) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Integration Chips (Protocols, Systems, Standards & Cloud)
            </h2>
          </div>
          <button
            onClick={() => setIntModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Integration Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {["PROTOCOL", "SYSTEM", "STANDARD", "CLOUD"].map((cat) => {
            const group = integs.filter((i) => i.category === cat);
            const labelMap: Record<string, string> = {
              PROTOCOL: "Protocols & Connectivity",
              SYSTEM: "Plant Floor Systems (PLC/DCS/SCADA/MES/Historians)",
              STANDARD: "Industrial Standards & Cybersecurity",
              CLOUD: "Cloud & Digital Twin Ecosystems",
            };

            return (
              <div key={cat} className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {labelMap[cat] || cat} ({group.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-muted text-foreground border border-border"
                    >
                      <span>{item.name}</span>
                      <button
                        onClick={async () => {
                          await deleteIntegrationAction(item.id);
                          setIntegs(integs.filter((i) => i.id !== item.id));
                        }}
                        className="text-muted-foreground hover:text-destructive ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cap Modal */}
      {capModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Solution Capability</h3>
              <button onClick={() => setCapModal(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleAddCap} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Capability Title *</label>
                <input required type="text" value={capTitle} onChange={(e) => setCapTitle(e.target.value)} placeholder="e.g. Real-Time Asset Twin & State Sync" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <input type="text" value={capCat} onChange={(e) => setCapCat(e.target.value)} placeholder="e.g. Digital Twin Core / Industrial Analytics" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description *</label>
                <textarea rows={3} required value={capDesc} onChange={(e) => setCapDesc(e.target.value)} placeholder="Sub-second state synchronization between physical plant telemetry..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCapModal(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Capability</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ind Modal */}
      {indModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Industrial Vertical</h3>
              <button onClick={() => setIndModal(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleAddInd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Vertical Name *</label>
                <input required type="text" value={indName} onChange={(e) => setIndName(e.target.value)} placeholder="e.g. Discrete & Heavy Manufacturing" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
                <textarea rows={2} value={indDesc} onChange={(e) => setIndDesc(e.target.value)} placeholder="Assembly lines, robotics, CNC stamping..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIndModal(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Vertical</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Int Modal */}
      {intModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Integration Item</h3>
              <button onClick={() => setIntModal(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleAddInt} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Integration Name *</label>
                <input required type="text" value={intName} onChange={(e) => setIntName(e.target.value)} placeholder="e.g. OPC UA / AVEVA PI / IEC 62443" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <select value={intCat} onChange={(e) => setIntCat(e.target.value)} className="w-full p-2 text-sm rounded border border-border bg-background">
                  <option value="PROTOCOL">PROTOCOL (OPC UA, MQTT, Kafka, Modbus)</option>
                  <option value="SYSTEM">SYSTEM (SCADA, DCS, MES, Historian, ERP)</option>
                  <option value="STANDARD">STANDARD (ISA-95, IEC 62443, DTDL)</option>
                  <option value="CLOUD">CLOUD (Azure IoT, AWS TwinMaker, Omniverse)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIntModal(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
