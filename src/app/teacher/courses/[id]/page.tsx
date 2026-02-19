import UnitDetailClient from "./UnitDetailClient";

export function generateStaticParams() {
  return [
    { id: "cell-division" },
    { id: "dna-replication" },
    { id: "protein-synthesis" },
    { id: "genetics" },
    { id: "cell-division-2" },
    { id: "dna-replication-2" },
    { id: "ecology" },
    { id: "evolution" },
  ];
}

export default function UnitDetailPage() {
  return <UnitDetailClient />;
}
