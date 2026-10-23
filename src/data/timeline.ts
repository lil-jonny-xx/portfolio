// Milestones are projects and study only — no employment is implied.
// `project` links a milestone to its case study; dates match the project registry.

export interface Milestone {
  date: string;
  title: string;
  body: string;
  project?: string;
}

export const timeline: Milestone[] = [
  {
    date: "2025",
    title: "Portable NAS",
    body: "First hands-on systems build: Linux storage, permissions and Samba on a local network.",
    project: "portable-nas",
  },
  {
    date: "Nov – Dec 2025",
    title: "Road safety audit system",
    body: "Two-person hackathon build comparing road videos over time with YOLOv8 and OpenCV.",
    project: "road-safety-ml",
  },
  {
    date: "2026",
    title: "Darvas screening & backtesting",
    body: "Relative-strength research that turned into a lesson in validation, data repair and costs.",
    project: "darvas-research",
  },
  {
    date: "Sep 2026",
    title: "EcoData begins",
    body: "Started a self-hosted research platform: Postgres, Kafka outbox, Keycloak, one VPS.",
    project: "ecodata",
  },
  {
    date: "Sep 2026",
    title: "Cloud Optimizer",
    body: "Team build of a Terraform-defined AWS stack with queue-driven Spot workers and a budget guard.",
    project: "cloud-optimizer-dynamic",
  },
  {
    date: "Oct 2026",
    title: "Permissioned EVM network",
    body: "Four-validator Besu QBFT devnet with RPC nodes and monitoring; application layer next.",
    project: "permissioned-blockchain",
  },
  {
    date: "Now",
    title: "Final year, B.Tech CSE",
    body: "National Institute of Technology Goa.",
  },
];
