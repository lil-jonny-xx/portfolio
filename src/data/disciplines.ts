export interface Discipline {
  id: string;
  code: string;
  title: string;
  body: string;
  tools: string[];
  projects: string[];
}

export const disciplines: Discipline[] = [
  {
    id: "cloud",
    code: "CLD",
    title: "Cloud infrastructure",
    body: "Networks, load balancing, scaling groups, IAM boundaries and remote state, all defined in Terraform. I care about what a plan will cost and what happens when an instance disappears.",
    tools: ["AWS", "Terraform", "VPC / NAT", "ALB", "Auto Scaling", "IAM", "S3 + DynamoDB state"],
    projects: ["cloud-optimizer-dynamic", "cloud-optimizer-static"],
  },
  {
    id: "devops",
    code: "OPS",
    title: "DevOps & observability",
    body: "Pipelines that gate on policy, Compose stacks with pinned images and segmented networks, and metrics, logs and traces wired in before they are needed.",
    tools: ["Docker Compose", "GitHub Actions", "OPA", "Prometheus", "Grafana", "Loki", "Linux"],
    projects: ["ecodata", "cloud-optimizer-dynamic", "permissioned-blockchain"],
  },
  {
    id: "backend",
    code: "API",
    title: "Backend & data platforms",
    body: "APIs over a canonical relational store, with provenance and point-in-time correctness treated as schema concerns rather than afterthoughts.",
    tools: ["Python", "FastAPI", "PostgreSQL", "TimescaleDB", "Redis", "Spring Boot"],
    projects: ["ecodata", "rooftop-delivery"],
  },
  {
    id: "distributed",
    code: "DST",
    title: "Distributed systems",
    body: "Transactional outboxes, queue-driven workers that drain cleanly, and Byzantine-fault-tolerant consensus among a fixed validator set.",
    tools: ["Kafka", "SQS", "Outbox pattern", "QBFT", "Besu"],
    projects: ["ecodata", "cloud-optimizer-dynamic", "permissioned-blockchain"],
  },
  {
    id: "ml",
    code: "ML",
    title: "Machine learning",
    body: "Applied computer vision where most of the work is around the model: alignment, matching, heuristics stated as heuristics, and structured output.",
    tools: ["YOLOv8", "OpenCV", "Folium", "Streamlit"],
    projects: ["road-safety-ml"],
  },
  {
    id: "quant",
    code: "QNT",
    title: "Quantitative research",
    body: "Screening and backtesting built to distrust their own results: parity-checked engines, repaired data, modelled costs and walk-forward gates.",
    tools: ["Python", "pandas", "NumPy", "Walk-forward validation"],
    projects: ["darvas-research", "ecodata"],
  },
];
