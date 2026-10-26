import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { ArchitectureEditor } from "./architecture-editor";

export default async function AdminArchitecturePage() {
  const diagram = await prisma.architectureDiagram.findFirst({
    where: { kind: "REFERENCE" },
  });

  const parsed = diagram
    ? {
        ...diagram,
        layers: parseJson(diagram.layers, []),
      }
    : {
        id: "default-diagram",
        title: "Industrial Edge-to-Cloud Digital Twin Reference Architecture",
        description:
          "Seven-tier distributed platform pattern connecting plant automation to enterprise cloud twins.",
        layers: [],
        svgOrImageUrl: null,
      };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Platform Architecture Diagram
        </h1>
        <p className="text-sm text-muted-foreground">
          Design and refine your executive reference architecture diagram displayed on the public
          portfolio. Edit layer components or preview real-time interactive SVG renderings.
        </p>
      </div>

      <ArchitectureEditor initialDiagram={parsed} />
    </div>
  );
}
