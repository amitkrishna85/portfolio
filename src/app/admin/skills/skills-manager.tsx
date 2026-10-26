"use client";

import * as React from "react";
import {
  createSkillCategoryAction,
  deleteSkillCategoryAction,
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from "@/actions/skills";
import { Plus, Trash2, Edit2, Layers, X, Save } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  level: number | null;
  order: number;
}

interface CategoryWithSkills {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
}

export function SkillsManager({ initialCategories }: { initialCategories: CategoryWithSkills[] }) {
  const [categories, setCategories] = React.useState<CategoryWithSkills[]>(initialCategories);
  const [newCatName, setNewCatName] = React.useState("");
  const [isAddingCat, setIsAddingCat] = React.useState(false);

  // Skill add state
  const [addingSkillCatId, setAddingSkillCatId] = React.useState<string | null>(null);
  const [newSkillName, setNewSkillName] = React.useState("");
  const [newSkillLevel, setNewSkillLevel] = React.useState(5);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await createSkillCategoryAction(newCatName.trim());
    if (res.item) {
      setCategories([...categories, { ...res.item, skills: [] }]);
      setNewCatName("");
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" and all its skills?`)) return;
    const res = await deleteSkillCategoryAction(id);
    if (res.success) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleAddSkill = async (categoryId: string) => {
    if (!newSkillName.trim()) return;
    const res = await createSkillAction(categoryId, newSkillName.trim(), newSkillLevel);
    if (res.item) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId ? { ...c, skills: [...c.skills, res.item!] } : c
        )
      );
      setNewSkillName("");
      setAddingSkillCatId(null);
    }
  };

  const handleDeleteSkill = async (categoryId: string, skillId: string) => {
    const res = await deleteSkillAction(skillId);
    if (res.success) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) } : c
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Organize domain taxonomy into executive categories and skill proficiencies.
        </p>
        <button
          onClick={() => setIsAddingCat(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Category</span>
        </button>
      </div>

      {isAddingCat && (
        <form onSubmit={handleAddCategory} className="p-4 rounded-xl border border-primary/40 bg-card/60 flex items-center gap-3">
          <input
            type="text"
            required
            autoFocus
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category Name (e.g. Industrial Protocol Engineering)"
            className="flex-1 p-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
          >
            Create Category
          </button>
          <button
            type="button"
            onClick={() => setIsAddingCat(false)}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">{category.name}</h3>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id, category.name)}
                className="p-1 rounded text-muted-foreground hover:text-destructive"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Skills chips */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/60 text-foreground border border-border group"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-primary font-bold">L{skill.level ?? 5}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(category.id, skill.id)}
                      className="text-muted-foreground hover:text-destructive ml-0.5"
                      title="Remove skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input within category */}
              {addingSkillCatId === category.id ? (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Skill name (e.g. OPC UA)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 p-1.5 text-xs rounded border border-border bg-background"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                    className="p-1.5 text-xs rounded border border-border bg-background"
                  >
                    <option value={5}>Level 5 (Expert)</option>
                    <option value={4}>Level 4 (Advanced)</option>
                    <option value={3}>Level 3 (Competent)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddSkill(category.id)}
                    className="px-2.5 py-1.5 rounded bg-primary text-primary-foreground text-xs font-semibold"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingSkillCatId(null)}
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddingSkillCatId(category.id);
                    setNewSkillName("");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium pt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Skill to {category.name}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
