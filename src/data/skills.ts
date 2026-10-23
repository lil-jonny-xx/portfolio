// Skills are graded by evidence, not by self-rating.
//   project  — used in a project on this site (linked)
//   practice — used in coursework, exercises or practice, but no featured project
//   learning — currently learning or planned for an upcoming phase

export type Evidence = "project" | "practice" | "learning";

export interface Skill {
  name: string;
  evidence: Evidence;
  projects?: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: Skill[];
}

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  project: "Used in a project",
  practice: "Coursework / practice",
  learning: "Learning / planned",
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Programming",
    skills: [
      { name: "Python", evidence: "project", projects: ["ecodata", "darvas-research", "road-safety-ml", "cloud-optimizer-dynamic"] },
      { name: "Java", evidence: "project", projects: ["rooftop-delivery"] },
      { name: "TypeScript", evidence: "project", projects: ["ecodata"] },
      { name: "SQL", evidence: "project", projects: ["ecodata", "rooftop-delivery"] },
      { name: "Bash", evidence: "project", projects: ["permissioned-blockchain", "cloud-optimizer-dynamic"] },
      { name: "C++", evidence: "practice" },
      { name: "Verilog", evidence: "practice" },
      { name: "Go", evidence: "learning" },
      { name: "Solidity", evidence: "learning" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & infrastructure",
    skills: [
      { name: "AWS", evidence: "project", projects: ["cloud-optimizer-dynamic"] },
      { name: "Terraform", evidence: "project", projects: ["cloud-optimizer-dynamic", "cloud-optimizer-static"] },
      { name: "Docker & Compose", evidence: "project", projects: ["ecodata", "permissioned-blockchain"] },
      { name: "Linux", evidence: "project", projects: ["ecodata", "portable-nas"] },
      { name: "Networking", evidence: "project", projects: ["cloud-optimizer-dynamic", "portable-nas"] },
      { name: "GitHub Actions / CI", evidence: "project", projects: ["cloud-optimizer-dynamic"] },
      { name: "nginx / Caddy", evidence: "project", projects: ["permissioned-blockchain", "ecodata"] },
      { name: "OPA / Rego", evidence: "project", projects: ["cloud-optimizer-dynamic"] },
      { name: "Git", evidence: "project" },
      { name: "Kubernetes", evidence: "learning" },
    ],
  },
  {
    id: "backend",
    label: "Backend & distributed systems",
    skills: [
      { name: "FastAPI", evidence: "project", projects: ["ecodata", "cloud-optimizer-dynamic"] },
      { name: "PostgreSQL", evidence: "project", projects: ["ecodata", "cloud-optimizer-dynamic"] },
      { name: "Apache Kafka", evidence: "project", projects: ["ecodata"] },
      { name: "Redis", evidence: "project", projects: ["ecodata"] },
      { name: "Amazon SQS", evidence: "project", projects: ["cloud-optimizer-dynamic"] },
      { name: "Spring Boot", evidence: "project", projects: ["rooftop-delivery"] },
      { name: "Keycloak / OIDC", evidence: "project", projects: ["ecodata"] },
      { name: "Neo4j", evidence: "project", projects: ["ecodata"] },
      { name: "Data structures & algorithms", evidence: "practice" },
    ],
  },
  {
    id: "observability",
    label: "Observability",
    skills: [
      { name: "Prometheus", evidence: "project", projects: ["cloud-optimizer-dynamic", "ecodata", "permissioned-blockchain"] },
      { name: "Grafana", evidence: "project", projects: ["cloud-optimizer-dynamic", "ecodata", "permissioned-blockchain"] },
      { name: "Loki · Tempo", evidence: "project", projects: ["ecodata"] },
    ],
  },
  {
    id: "ml-quant",
    label: "Machine learning & quant",
    skills: [
      { name: "YOLOv8", evidence: "project", projects: ["road-safety-ml"] },
      { name: "OpenCV", evidence: "project", projects: ["road-safety-ml"] },
      { name: "Folium", evidence: "project", projects: ["road-safety-ml"] },
      { name: "pandas · NumPy", evidence: "project", projects: ["darvas-research"] },
      { name: "Backtesting & validation", evidence: "project", projects: ["darvas-research"] },
      { name: "PyTorch", evidence: "practice" },
    ],
  },
  {
    id: "blockchain",
    label: "Blockchain",
    skills: [
      { name: "Hyperledger Besu", evidence: "project", projects: ["permissioned-blockchain"] },
      { name: "QBFT consensus", evidence: "project", projects: ["permissioned-blockchain"] },
      { name: "EVM", evidence: "learning" },
      { name: "Cryptography fundamentals (ECDSA)", evidence: "practice" },
    ],
  },
];
