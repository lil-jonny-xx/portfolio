// Central project registry. Every case-study page, card, filter and the sitemap read from here.
// Write only what the source repository supports, and say where a claim stops being verified.

export const CATEGORIES = [
  { id: "cloud-devops", label: "Cloud & DevOps" },
  { id: "backend-distributed", label: "Backend & Distributed Systems" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "quant", label: "Quantitative Research" },
  { id: "blockchain", label: "Blockchain" },
  { id: "applications", label: "Applications & Experiments" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type ProjectStatus = "completed" | "in-progress" | "research" | "prototype";

/** How much of a diagram exists. Drawn as a label on the figure. */
export type DiagramKind = "applied" | "implemented" | "partly-built" | "proposed";

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
  /** planned = dashed outline; external = outside the system boundary. */
  tone?: "core" | "planned" | "external";
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  planned?: boolean;
}

export interface DiagramGroup {
  label: string;
  col: number;
  row: number;
  cols: number;
  rows: number;
}

export interface Diagram {
  kind: DiagramKind;
  title: string;
  caption: string;
  cols: number;
  rows: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
}

export interface Section {
  title: string;
  body: string;
}

export interface DataTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Compact name for dense lists such as skills. */
  shortTitle: string;
  /** One line used on cards. */
  summary: string;
  overview: string;
  categories: CategoryId[];
  stack: string[];
  status: ProjectStatus;
  /** Human-readable period; only dates confirmed by commits or documents. */
  period: string;
  /** Year used to order the timeline. */
  year: number;
  /** Who did what. Team context is always stated. */
  role: string;
  /** What the evidence for this page is, and where it stops. */
  verification: string;
  problem: string;
  goals: string[];
  constraints: string[];
  architecture: string;
  diagram: Diagram;
  implementation: Section[];
  decisions: Section[];
  challenges: Section[];
  tradeoffs: string[];
  outcomes: string[];
  limitations: string[];
  learned: string[];
  table?: DataTable;
  links: { github?: string; demo?: string; docs?: string };
  /** Optional real screenshot under /public/images/projects. The SVG diagram is used when absent. */
  cover?: { src: string; alt: string; width: number; height: number };
  gallery?: { src: string; alt: string; caption: string; width: number; height: number }[];
  related: string[];
  featured: boolean;
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  research: "Research",
  prototype: "Prototype",
};

export const DIAGRAM_KIND_LABEL: Record<DiagramKind, string> = {
  applied: "Implemented and applied in a development account",
  implemented: "Implemented in code",
  "partly-built": "Solid = built · dashed = planned",
  proposed: "Proposed design",
};

export const projects: Project[] = [
  {
    slug: "cloud-optimizer-dynamic",
    title: "Cloud Optimizer: Dynamic",
    shortTitle: "Cloud Optimizer",
    summary:
      "Terraform-defined AWS stack where capacity follows demand: queue-driven Spot workers, a budget guard in CI and chaos experiments.",
    overview:
      "A FinOps-focused AWS environment built for the CloudScale challenge. Web capacity scales on CPU and request count, background workers scale on queue depth with a 70/30 On-Demand/Spot mix, and an OPA policy refuses any Terraform plan that would break the monthly budget, drop a mandatory tag or use an instance type outside the whitelist.",
    categories: ["cloud-devops", "backend-distributed"],
    stack: [
      "Terraform",
      "AWS (ap-south-1)",
      "VPC / NAT",
      "ALB",
      "Auto Scaling",
      "SQS",
      "RDS PostgreSQL",
      "Lambda",
      "EventBridge",
      "AWS FIS",
      "OPA / Rego",
      "Infracost",
      "GitHub Actions (OIDC)",
      "FastAPI",
      "Prometheus",
      "Grafana",
    ],
    status: "completed",
    period: "Sep 2026",
    year: 2026,
    role:
      "Team project (BNP BLR Team 01, five contributors). By the commit history I wrote 25 of the 41 commits: the Dynamic stack's Terraform foundation and remote state, the SQS worker path, queue-depth scaling and Spot draining, the OPA budget guard, monitoring, and the static baseline. Teammates built the GitHub Actions validation and OIDC pipeline, the first VPC/ALB stage and traffic-simulator changes.",
    verification:
      "Read from the team repository: Terraform modules, Lambda sources, policy, workflows and READMEs. The development state lists about 100 managed resource addresses, so the stack was applied to an AWS account. It was a development environment, not a production service, and I make no claim that it is running today.",
    problem:
      "A fleet sized for peak sits idle most of the day and is still occasionally too small. The challenge was to replace it with capacity that follows demand, keep non-critical work on cheaper Spot capacity without losing jobs, and prove any saving against a real configuration rather than an assumed one.",
    goals: [
      "Scale the web tier on load, and the worker tier on outstanding work rather than CPU alone.",
      "Use Spot for non-critical jobs only, and drain workers cleanly when Spot capacity is reclaimed.",
      "Stop an over-budget plan before it reaches apply.",
      "Keep a like-for-like static baseline so avoided cost is measurable.",
    ],
    constraints: [
      "AWS free-plan account: RDS instance quota of two, which later blocked deploying the baseline.",
      "The budget cap may not be set inside the Terraform code; it must arrive from -var or TF_VAR_budget_cap.",
      "Region fixed to ap-south-1.",
    ],
    architecture:
      "Traffic reaches an Application Load Balancer in public subnets and is forwarded to a web Auto Scaling Group running the FastAPI service in private subnets, with egress through a NAT gateway. The API writes records to RDS PostgreSQL and publishes background jobs to separate critical and non-critical SQS queues, each with a dead-letter queue. A Lambda on a one-minute EventBridge schedule republishes queue backlog as a custom CloudWatch metric that drives step scaling of the worker group. Terraform state lives in S3 with a DynamoDB lock table, both created by a separate bootstrap stack that also manages the GitHub OIDC roles.",
    diagram: {
      kind: "applied",
      title: "Dynamic stack — request and job paths",
      caption:
        "Simplified from the Terraform modules. Security groups, IAM roles and subnets are omitted for legibility. A single NAT gateway is used, so private-subnet egress is not highly available.",
      cols: 4,
      rows: 5,
      groups: [{ label: "AWS · ap-south-1", col: 1, row: 0, cols: 3, rows: 5 }],
      nodes: [
        { id: "sim", label: "Traffic simulator", sub: "CSV profile → load", col: 0, row: 1, tone: "external" },
        { id: "nat", label: "NAT gateway", sub: "private egress", col: 3, row: 0 },
        { id: "alb", label: "ALB", sub: "web target group", col: 1, row: 1 },
        { id: "web", label: "Web ASG", sub: "FastAPI · 1–8 on-demand", col: 2, row: 1, tone: "core" },
        { id: "rds", label: "RDS PostgreSQL 16", sub: "db.t3.micro", col: 3, row: 1 },
        { id: "sqs", label: "SQS", sub: "2 queues + DLQs", col: 2, row: 2 },
        { id: "worker", label: "Worker ASG", sub: "70/30 On-Demand/Spot", col: 3, row: 2, tone: "core" },
        { id: "crit", label: "Critical workers", sub: "on-demand only", col: 3, row: 3 },
        { id: "qm", label: "queue_metric λ", sub: "EventBridge · 1 min", col: 1, row: 3 },
        { id: "cw", label: "CloudWatch", sub: "step-scaling alarms", col: 2, row: 3 },
        { id: "drain", label: "spot_drain λ", sub: "interruption warning", col: 2, row: 4 },
        { id: "mon", label: "Prometheus · Grafana", sub: "reached over SSM", col: 1, row: 2 },
        { id: "ci", label: "GitHub Actions", sub: "plan · Infracost · OPA", col: 0, row: 3, tone: "external" },
        { id: "state", label: "Remote state", sub: "S3 + DynamoDB lock", col: 0, row: 4, tone: "external" },
      ],
      edges: [
        { from: "sim", to: "alb", label: "HTTP" },
        { from: "alb", to: "web" },
        { from: "web", to: "rds" },
        { from: "web", to: "sqs", label: "POST /jobs" },
        { from: "sqs", to: "worker" },
        { from: "sqs", to: "crit" },
        { from: "qm", to: "cw", label: "queue_length" },
        { from: "cw", to: "worker", label: "scale" },
        { from: "drain", to: "worker", label: "SIGTERM" },
        { from: "mon", to: "web", label: "scrape" },
        { from: "ci", to: "state" },
      ],
    },
    implementation: [
      {
        title: "Module layout",
        body: "The root stack composes twelve modules: networking, security, alb, web-asg, worker-asg, queue, rds, storage, iam, monitoring, chaos and app-artifacts. Application code is zipped by Terraform's archive provider and shipped to instances through S3, so one apply carries both infrastructure and the version of the app it runs.",
      },
      {
        title: "Two scaling signals",
        body: "The web group uses target tracking on average CPU (50%) plus step scaling on RequestCountPerTarget. Workers scale on a custom queue_length metric. SQS publishes its own depth metric only every five minutes, which is too slow, so a Lambda reads each queue every minute and republishes visible plus in-flight messages — work a Spot worker has picked up but not finished is still outstanding.",
      },
      {
        title: "Spot without lost jobs",
        body: "Workers run a mixed-instances policy with 70% On-Demand above base and capacity-optimized Spot allocation. A drain Lambda receives both the Spot interruption warning and the ASG terminate lifecycle hook, stops the worker over SSM, and the worker handles SIGTERM by finishing its current message before exiting. Critical jobs have their own on-demand group, and the API rejects a Critical request outright if it finds itself on a Spot host.",
      },
      {
        title: "Budget guard in the pipeline",
        body: "On every pull request the workflow runs fmt, validate, plan, Infracost and then an OPA policy over the plan. The policy denies plans that exceed the cap, lose a mandatory tag or use a non-whitelisted instance type. Apply is a manual workflow that needs a typed confirmation, repeats every gate, waits for /health to return 200 and re-runs the simulator with a 300 ms p95 gate.",
      },
      {
        title: "Chaos experiments",
        body: "Two AWS FIS templates (Spot interruption and network fault) plus a deliberate misconfiguration test are documented in a runbook. Both templates stop automatically if the load balancer serves more than five 5xx responses in a minute.",
      },
    ],
    decisions: [
      {
        title: "No default for budget_cap",
        body: "Giving the variable a default would let a plan run against a number nobody chose. Without one, the value has to come from the caller or the pipeline, and the working value is recorded with its reasoning in the dataset folder.",
      },
      {
        title: "Scale workers on backlog, not CPU",
        body: "A worker waiting on I/O can be idle on CPU while the queue grows. Queue depth measures the thing users wait on.",
      },
      {
        title: "Complete the lifecycle action even when draining fails",
        body: "An unanswered hook holds the instance for the full heartbeat timeout and stalls its replacement. SQS will redeliver an interrupted message anyway, so failing open is the safer choice.",
      },
    ],
    challenges: [
      {
        title: "Bootstrapping and IAM gaps",
        body: "Early applies produced instances whose bootstrap failed and workers that could not publish to SQS. The fix commit repaired EC2 user data, added the missing SQS permissions to the instance role and corrected the plan pipeline.",
      },
      {
        title: "Reconciling state with existing resources",
        body: "Some web-tier resources already existed outside Terraform. They were brought under management with import blocks rather than recreated, and plans were checked until they showed no unintended replacement.",
      },
      {
        title: "CI secrets context",
        body: "The Infracost key was not visible where the step expected it; it is now read from the job environment. Without a key the pipeline still enforces tags, instance types and the mixed-instances rule, and annotates the run to say the cost rule was skipped.",
      },
    ],
    tradeoffs: [
      "A single NAT gateway and a single-AZ db.t3.micro keep the bill inside the cap at the cost of availability.",
      "Spot capacity is limited to non-critical work; critical jobs pay on-demand prices for predictability.",
      "Prometheus and Grafana run on one instance reached over SSM instead of a managed service, which is cheaper but is itself a single point of failure.",
    ],
    outcomes: [
      "The stack was applied in ap-south-1 during development; its state lists about 100 resource addresses across networking, compute, queues, database, IAM and monitoring.",
      "Plan-time policy enforcement exists and fails the pull-request job with the reason when a rule is broken.",
      "Tooling to compute avoided cost from two Infracost breakdowns (cost_savings.py) is in the repository. No saved report is checked in, so no savings figure is quoted here.",
    ],
    limitations: [
      "No measured cost saving or latency result is published on this page.",
      "The static baseline was priced, not deployed (see the companion project).",
      "The public repositories under my account are earlier snapshots; the full version lives in the team repository.",
    ],
    learned: [
      "Terraform state is the real source of truth during an incident; importing beats recreating.",
      "Cost controls are most effective at plan time, before money is spent.",
      "Graceful shutdown is an application concern as much as an infrastructure one.",
    ],
    links: { github: "https://github.com/lil-jonny-xx/Cloud-Optimizer-Dynamic" },
    related: ["cloud-optimizer-static", "ecodata"],
    featured: true,
  },
  {
    slug: "cloud-optimizer-static",
    title: "Cloud Optimizer: Static",
    shortTitle: "Static baseline",
    summary:
      "The control group: the same application on a fixed fleet sized for peak, used to price what dynamic scaling avoids.",
    overview:
      "A baseline environment for the Dynamic stack. It reuses every module except the fleet — eight web and eight worker instances, on-demand only, min = max = desired, no scaling policy anywhere — so the two environments differ only in how capacity is decided.",
    categories: ["cloud-devops"],
    stack: ["Terraform", "AWS", "Infracost", "Python"],
    status: "completed",
    period: "Sep 2026",
    year: 2026,
    role: "Part of the same team project. I built the static fleet module, sized it for peak and moved it onto the shared networking module.",
    verification:
      "Read from the team repository and its README. The stack was priced with Infracost from a plan; it was not deployed.",
    problem:
      "A cost saving is only meaningful against something real. Comparing the dynamic stack with a guessed number would make any saving an assertion.",
    goals: [
      "Define a naive but realistic fixed fleet in code.",
      "Share every module except capacity so the comparison isolates one decision.",
      "Price it without needing it to run.",
    ],
    constraints: [
      "The free-plan RDS quota was already used by the dynamic stack, so an apply stops at InstanceQuotaExceeded after the network and load balancer.",
      "A half-applied stack still bills for its NAT gateway and load balancer.",
    ],
    architecture:
      "Identical networking, security, load balancer, database, queue, storage and IAM modules to the Dynamic stack, with a static-fleet module in place of the two scaling groups.",
    diagram: {
      kind: "implemented",
      title: "Shared modules, one difference",
      caption: "The baseline swaps only the capacity modules. It is defined and priced from a plan, not deployed.",
      cols: 3,
      rows: 3,
      nodes: [
        { id: "shared", label: "Shared modules", sub: "network · ALB · RDS · SQS", col: 1, row: 0 },
        { id: "dyn", label: "Dynamic capacity", sub: "web 1–8 · workers 1–6", col: 0, row: 1, tone: "core" },
        { id: "static", label: "Static fleet", sub: "8 web + 8 workers, fixed", col: 2, row: 1, tone: "core" },
        { id: "ic", label: "Infracost", sub: "breakdown from plan", col: 1, row: 2 },
      ],
      edges: [
        { from: "shared", to: "dyn" },
        { from: "shared", to: "static" },
        { from: "dyn", to: "ic" },
        { from: "static", to: "ic" },
      ],
    },
    implementation: [
      {
        title: "Sizing for the worst case",
        body: "A fleet that cannot scale must be sized for peak or it fails under load. Peak here is the Dynamic stack's own ceiling: web max 8, workers max 6 plus two critical workers.",
      },
      {
        title: "Pricing from a plan",
        body: "Infracost reads the Terraform plan JSON and produces a breakdown; scripts/cost_savings.py compares the baseline and optimized breakdowns against the budget cap and writes a CSV report.",
      },
    ],
    decisions: [
      {
        title: "Price rather than deploy",
        body: "Infracost needs only the plan, so the baseline never needed to run. Deploying it would have cost money to produce a number the plan already gives.",
      },
    ],
    challenges: [
      {
        title: "Duplicated networking",
        body: "The first version copied the networking module and could drift from the Dynamic stack. It was replaced with the shared module so the comparison stays fair.",
      },
    ],
    tradeoffs: ["A priced baseline does not capture runtime behaviour such as latency under the same load."],
    outcomes: ["A deployable baseline definition and a documented procedure to price it and compare."],
    limitations: ["Not deployed on this account; no measured comparison is published here."],
    learned: ["A fair benchmark changes one variable at a time — including in infrastructure."],
    links: { github: "https://github.com/lil-jonny-xx/Cloud-Optimizer-Static" },
    related: ["cloud-optimizer-dynamic"],
    featured: false,
  },
  {
    slug: "ecodata",
    title: "EcoData Investment Research Platform",
    shortTitle: "EcoData",
    summary:
      "Self-hosted research platform for Indian, US and Japanese listed companies, built around point-in-time data and an event-driven core.",
    overview:
      "EcoData collects filings, statements, prices, ownership and classification for listed companies in three markets and presents them with a screener, saved work, a sector web and long-run macro charts. It is designed to be auditable: no look-ahead, no survivorship bias, and a missing figure is shown as a gap with its reason, never as a zero or a guess.",
    categories: ["backend-distributed", "quant", "cloud-devops"],
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL 16",
      "TimescaleDB",
      "Apache Kafka (KRaft)",
      "Neo4j",
      "Next.js 16",
      "Keycloak (OIDC)",
      "Docker Compose",
      "Caddy",
      "Cloudflare",
      "Prometheus",
      "Grafana",
      "Loki",
      "Tempo",
      "SOPS + age",
    ],
    status: "in-progress",
    period: "Sep 2026 – present",
    year: 2026,
    role: "Solo project: architecture, data ingestion, API, front end, infrastructure and operations (346 commits).",
    verification:
      "Read from the private repository, its README, ADR register and progress log. The web app answers at app.ecodatas.com. Features listed as ahead (search/RAG, quant, reports) are not built.",
    problem:
      "Research on listed companies usually means stitching together exchange filings, regulator databases and price feeds that disagree on identifiers, dates and units. Most tools also quietly fill gaps or use today's company list for historical questions, which makes any backtest or screen built on them look better than it was.",
    goals: [
      "One canonical store for companies, statements, prices and ownership across India, the US and Japan.",
      "Point-in-time correctness: every figure is tied to the date it was known.",
      "Provenance: every chart and table names its source.",
      "A foundation for later knowledge-graph, retrieval and quantitative work.",
    ],
    constraints: [
      "Single VPS (Netcup, 16 vCPU / 64 GB / 2 TB NVMe) running Docker Compose.",
      "Self-hosted AI only: no hosted proprietary LLM API in production.",
      "Licensed data must never reach the public API.",
    ],
    architecture:
      "Cloudflare caches public HTML in front of Caddy, the only container with host ports, which routes to the Next.js web app, the FastAPI service and Keycloak. PostgreSQL with TimescaleDB is the source of truth. Business events are written to an outbox table in the same transaction and relayed to Kafka by a publisher; consumers write the audit log and run account onboarding. Neo4j holds a rebuildable graph projection of the sector framework. Ingestion runs as one-shot Docker jobs per source.",
    diagram: {
      kind: "partly-built",
      title: "Platform topology",
      caption:
        "From the repository's architecture section. Solid boxes are deployed services; dashed boxes are phases not yet built. Kafka runs as a single broker — an initial deployment, not high availability.",
      cols: 5,
      rows: 5,
      nodes: [
        { id: "browser", label: "Browser", col: 0, row: 0, tone: "external" },
        { id: "cf", label: "Cloudflare", sub: "CDN · tiered cache", col: 1, row: 0, tone: "external" },
        { id: "caddy", label: "Caddy", sub: "TLS · only open ports", col: 2, row: 0 },
        { id: "kc", label: "Keycloak", sub: "OIDC", col: 3, row: 0 },
        { id: "web", label: "web", sub: "Next.js 16 · SSR", col: 2, row: 1 },
        { id: "api", label: "api", sub: "FastAPI", col: 3, row: 1, tone: "core" },
        { id: "ingest", label: "Ingestion jobs", sub: "NSE · BSE · EDGAR · JPX", col: 4, row: 1 },
        { id: "pg", label: "PostgreSQL 16", sub: "+ TimescaleDB · canonical", col: 3, row: 2, tone: "core" },
        { id: "neo", label: "Neo4j", sub: "rebuildable projection", col: 4, row: 2 },
        { id: "rag", label: "Search / RAG", sub: "phases 10–11", col: 1, row: 2, tone: "planned" },
        { id: "quant", label: "Quant engine", sub: "phase 13", col: 1, row: 3, tone: "planned" },
        { id: "pub", label: "outbox-publisher", col: 2, row: 3 },
        { id: "kafka", label: "Kafka", sub: "single KRaft broker", col: 3, row: 3 },
        { id: "audit", label: "audit-consumer", col: 3, row: 4 },
        { id: "onb", label: "onboarding worker", col: 4, row: 4 },
        { id: "obs", label: "Observability", sub: "Prometheus · Loki · Tempo", col: 0, row: 4 },
      ],
      edges: [
        { from: "browser", to: "cf" },
        { from: "cf", to: "caddy" },
        { from: "caddy", to: "kc" },
        { from: "caddy", to: "web" },
        { from: "web", to: "api", label: "server-side" },
        { from: "api", to: "pg" },
        { from: "ingest", to: "pg" },
        { from: "pg", to: "neo", label: "project" },
        { from: "pg", to: "pub", label: "outbox" },
        { from: "pub", to: "kafka" },
        { from: "kafka", to: "audit" },
        { from: "kafka", to: "onb" },
        { from: "pg", to: "rag", planned: true },
        { from: "pg", to: "quant", planned: true },
      ],
    },
    implementation: [
      {
        title: "Ingestion and provenance",
        body: "Each source is a one-shot Docker job writing into Postgres: NSE and BSE classification, prices, results, statements, shareholding, corporate actions and annual reports (back to FY2016); SEC EDGAR company facts, filings, 13F holdings and insider forms; JPX listings and J-Quants statements. Macro series come from FRED, the World Bank, IMF, BIS, OECD and the ECB, and every chart names its source.",
      },
      {
        title: "Point-in-time and honest gaps",
        body: "Figures are stored against the date they became known, so a historical screen sees only what was public then. Currency conversion uses the ECB rate on each figure's own date. A value the platform does not hold renders as a dash with a reason.",
      },
      {
        title: "Transactional outbox",
        body: "Business events are written to an outbox table in the same database transaction as the change they describe, then relayed to Kafka. A crash can delay an event but cannot lose it or publish one for a change that rolled back.",
      },
      {
        title: "Tenancy and authorisation",
        body: "Every tenant-owned table carries tenant_id with row-level security from the first row. Role-based access and plan entitlements are evaluated separately and both must pass. Keycloak handles identity; the app never stores passwords.",
      },
      {
        title: "Operations",
        body: "One Compose file per service, pinned images, five Docker networks with Kafka on an internal one, and a firewall open only on 22, 80 and 443. Deploys pull on the server and rebuild one service after tagging a rollback image. Logs, metrics and traces go to Loki, Prometheus and Tempo via Alloy.",
      },
    ],
    decisions: [
      {
        title: "PostgreSQL as the only source of truth",
        body: "Graph, search and vector stores are projections that can be rebuilt from Postgres. That keeps backups and correctness arguments to one system.",
      },
      {
        title: "Redis never holds durable events",
        body: "Redis is used for caching, locks, rate limits and sessions only. Events that matter go through the outbox and Kafka.",
      },
      {
        title: "Architecture decisions are written down",
        body: "Fourteen ADRs record choices such as the outbox, tenancy model and separation of RBAC from entitlements. Where the README and an ADR disagree, the ADR wins.",
      },
    ],
    challenges: [
      {
        title: "Sources that disagree",
        body: "Exchanges, regulators and price feeds differ on identifiers, units and corporate-action handling. Each loader normalises into the canonical schema and keeps the source attached rather than silently picking a winner.",
      },
      {
        title: "Keeping one server operable",
        body: "With around twenty services on one VPS, isolation came from network segmentation, pinned images, per-service runbooks and an explicit rollback tag on every deploy.",
      },
    ],
    tradeoffs: [
      "A single VPS keeps cost and complexity low but is a single point of failure.",
      "A single Kafka broker gives the event model now and leaves replication for later.",
      "Self-hosting AI limits model choice in exchange for data control.",
    ],
    outcomes: [
      "Build phases 0–8 are in place (infrastructure, CI, database, auth, providers, market data, company master, fundamentals, ownership), with first versions of the knowledge graph and workspace.",
      "About 330 API tests run without external services; ingestion and database packages have their own fixture-based suites.",
    ],
    limitations: [
      "Search/RAG, quantitative research tools, reports, hardening and production-readiness phases are not built.",
      "Off-server backups with a tested restore are an open item.",
      "Sign-up is not yet enabled, and legal and regulatory positioning is still open. It is a research tool, not investment advice.",
      "Six web end-to-end tests are known to fail and are tracked.",
    ],
    learned: [
      "Data correctness rules (point-in-time, no fabricated values) shape the schema more than features do.",
      "Writing ADRs early makes it possible to change direction without losing the reasoning.",
    ],
    links: { demo: "https://app.ecodatas.com" },
    related: ["darvas-research", "cloud-optimizer-dynamic"],
    featured: true,
  },
  {
    slug: "darvas-research",
    title: "Type-1 Darvas Screening & Backtesting",
    shortTitle: "Darvas research",
    summary:
      "Relative-strength and Darvas-box research on Indian equities, rebuilt around a parity-checked engine and a walk-forward validation gate.",
    overview:
      "A personal research project testing a relative-strength trend strategy on NSE equities. It began as a single Type-1 scanner with Darvas-box pyramiding and grew into a validation-first backtesting setup: a fast matrix engine that must reproduce the slow engine to the rupee, data-repair layers for splits and benchmarks, and a five-stage gate that every rule must pass out of sample.",
    categories: ["quant"],
    stack: ["Python", "pandas", "NumPy", "yfinance", "Parquet", "matplotlib"],
    status: "research",
    period: "2026",
    year: 2026,
    role: "Solo research.",
    verification:
      "Read from the local research folder: TYPE1_DARVAS_ALGO_FINAL.py, the engine sources and METHODOLOGY_V4.md. All results are historical backtests with modelled costs. Nothing has been run forward, on paper or live.",
    problem:
      "Answering ‘is this parameter good?’ with one long backtest number cannot tell a real edge from a lucky cell on a noisy surface, and a slow engine meant nobody could afford to check.",
    goals: [
      "Express the Type-1 rules exactly and without look-ahead.",
      "Make a backtest fast enough to sweep parameters.",
      "Close every known source of silent optimism in the data.",
      "Accept a rule only if it survives out-of-sample testing.",
    ],
    constraints: [
      "Free end-of-day data with unadjusted splits and gaps.",
      "No point-in-time fundamentals, so fundamental filters cannot be tested without look-ahead.",
    ],
    architecture:
      "Raw bhavcopy and end-of-day files are repaired (splits, benchmark, delistings, ETF exclusion), turned into indicator panels, and replayed by the engine day by day. Every sweep passes through the five-stage gate before a parameter is accepted.",
    diagram: {
      kind: "implemented",
      title: "Research pipeline",
      caption: "Stages correspond to scripts in the research folder.",
      cols: 4,
      rows: 3,
      nodes: [
        { id: "raw", label: "Raw EOD data", sub: "bhavcopy · EOD2 · ^NSEI", col: 0, row: 0, tone: "external" },
        { id: "repair", label: "Repair layer", sub: "splits · ETFs · benchmark", col: 1, row: 0 },
        { id: "ind", label: "Indicators", sub: "ARS 63 · SRS 126 · EMA", col: 2, row: 0 },
        { id: "sig", label: "Signals", sub: "RS cross · Darvas breakout", col: 3, row: 0 },
        { id: "slow", label: "Reference engine", sub: "pandas day loop", col: 3, row: 1 },
        { id: "fast", label: "Matrix engine", sub: "date × symbol NumPy", col: 2, row: 1, tone: "core" },
        { id: "cost", label: "Costs & tax", sub: "impact · STCG/LTCG", col: 1, row: 1 },
        { id: "gate", label: "5-stage gate", sub: "grid → walk-forward", col: 1, row: 2, tone: "core" },
        { id: "verdict", label: "PASS / FAIL", col: 2, row: 2 },
      ],
      edges: [
        { from: "raw", to: "repair" },
        { from: "repair", to: "ind" },
        { from: "ind", to: "sig" },
        { from: "sig", to: "slow" },
        { from: "slow", to: "fast", label: "parity" },
        { from: "fast", to: "cost" },
        { from: "cost", to: "gate" },
        { from: "gate", to: "verdict" },
      ],
    },
    implementation: [
      {
        title: "Type-1 rules",
        body: "ARS is a stock's 63-session return minus the NIFTY 50 (^NSEI) 63-session return; SRS uses 126 sessions. An initial 40% entry needs ARS to have recently crossed above zero with a positive 21-session slope, SRS above zero, EMA 50 above EMA 100, close above EMA 50 and no 30-week Stage-4 downtrend, plus a P/E-versus-profit-growth gate. Exits use the previous 20-session low.",
      },
      {
        title: "Sequential Darvas boxes",
        body: "Further 40% and 20% tranches are added only after a new box forms after the previous entry. A box top is confirmed when subsequent sessions fail to make a higher high, then the bottom the same way; the box is frozen, and only a close above the frozen top counts as a breakout. This avoids a rolling high/low rectangle that quietly uses future bars.",
      },
      {
        title: "A fast engine proven identical to the slow one",
        body: "The prepared cache is converted once into dense date × symbol NumPy matrices (5,608 days × 2,289 symbols) and replayed in well under a second. With every new rule switched off, it must reproduce the reference engine to the rupee and trade-for-trade; every sweep refuses to run if that parity self-test fails.",
      },
      {
        title: "Realism layers",
        body: "split_repair.py found 565 one-day falls worse than −35% and applied 200 confidence-graded split repairs. ETFs (any INF ISIN) are excluded after one was found holding a slot for fourteen years. Tax is booked by holding period and financial year, slippage uses a square-root participation model, the benchmark's unadjusted 10:1 split is repaired, and starting capital is CPI-deflated.",
      },
    ],
    decisions: [
      {
        title: "Optimise for MAR, report plateaus",
        body: "Most rules exist to cut risk, so the objective is CAGR divided by maximum drawdown. Results are smoothed and reported as a region within 5% of the peak, not as a single best cell.",
      },
      {
        title: "Out-of-sample or nothing",
        body: "A rule passes only if, in both walk-forward folds (fit 2004–14 test 2015–26, and the reverse), its chosen setting beats the rule-off baseline on test MAR while giving up no more than one CAGR point.",
      },
    ],
    challenges: [
      {
        title: "Earlier numbers were wrong",
        body: "Once ETFs were excluded and tax was booked, a headline figure from an earlier run turned out to have been inflated by a few gold-ETF trades cushioning 2008. The lesson was to distrust any improvement that arrives before the data has been cleaned.",
      },
      {
        title: "Transaction costs",
        body: "In one early cost experiment on the Type-1 scanner, modelled transaction costs exceeded the gross profit and turned the result negative. Costs are now part of every run rather than an afterthought.",
      },
    ],
    tradeoffs: [
      "A two-fold walk-forward over 22 years is coarse; the two halves of the market genuinely prefer different settings.",
      "The validation gate's own settings (split date, tolerance, smoothing window) were chosen by judgement and have not been varied.",
    ],
    outcomes: [
      "Parity self-test: the matrix engine reproduces the reference engine exactly on a 503-trade run.",
      "A sweep of 169 cells takes about 79 seconds instead of hours.",
      "Seven rule families were swept; every one failed the walk-forward gate and was rejected.",
    ],
    limitations: [
      "Backtests only. Past simulated performance does not indicate future results, and nothing here is investment advice.",
      "Even the accepted stop and position-count parameters do not pass the formal walk-forward; they were chosen on plateau stability, which is weaker evidence.",
      "No point-in-time fundamental data, so fundamental filters cannot be validated.",
      "The top ten trades account for roughly half of net P&L in the baseline, so results are path-sensitive.",
    ],
    learned: [
      "A validator is only as honest as its own untested assumptions.",
      "Data repair is most of the work in a long backtest.",
      "Rejecting a rule is a result.",
    ],
    table: {
      caption: "Walk-forward verdicts for the rule families swept in one session (from METHODOLOGY_V4.md)",
      columns: ["Rule family", "Verdict"],
      rows: [
        ["Stop percentage", "Fail (fold A)"],
        ["Maximum positions", "Fail (fold A)"],
        ["Sector cap", "Fail (both folds)"],
        ["Laggard exit — relative strength", "Fail (both folds)"],
        ["Laggard exit — return", "Fail (both folds)"],
        ["Position trim", "Fail (both folds)"],
        ["Crash brake", "Fail (fold A)"],
      ],
      note: "Historical simulation with modelled costs, impact and tax. Not a performance claim.",
    },
    links: {},
    related: ["ecodata"],
    featured: true,
  },
  {
    slug: "road-safety-ml",
    title: "Automated Road Safety Audit System",
    shortTitle: "Road safety audit",
    summary:
      "Compares an old and a new drive-through video of the same road with YOLOv8 to find new defects, then produces structured JSON, maps and a report.",
    overview:
      "Built for the CivTech road-safety hackathon. Given a base video (older condition) and a present video of the same corridor, the system aligns them, runs object detection on sampled frames, matches detections across the two runs, and reports what changed — new potholes, widened cracks, faded markings, missing furniture — with a heuristic condition score, rule-based maintenance references and an auto-generated report.",
    categories: ["machine-learning"],
    stack: ["Python", "YOLOv8 (Ultralytics)", "OpenCV", "FFmpeg", "geopy / Nominatim", "Folium", "Streamlit", "LaTeX", "FPDF"],
    status: "completed",
    period: "Nov – Dec 2025",
    year: 2025,
    role: "Two-person team. I built most of the pipeline and repository; my teammate wrote the project README and documentation.",
    verification:
      "Read from the public repository (about 3,300 lines of Python) and the final documentation. No accuracy or mAP figure is recorded in the repository, so none is quoted.",
    problem:
      "Road audits are manual and slow, and a single inspection says little about how fast a road is deteriorating. Comparing two recordings of the same stretch shows change, which is what maintenance planning needs.",
    goals: [
      "Detect road defects and furniture in ordinary dash-cam style video.",
      "Align two videos of the same corridor and report differences, not just detections.",
      "Produce machine-readable output plus a human-readable report.",
    ],
    constraints: [
      "Training and inference on a GTX 1650 laptop GPU with about 2.4 GB usable memory, with a college GPU server used for heavier work.",
      "Hackathon timeline.",
    ],
    architecture:
      "Frames are extracted with FFmpeg (OpenCV fallback) and the two videos are aligned using ORB feature matching. A fine-tuned YOLOv8 checkpoint and the pretrained YOLOv8s model run on each frame; detections are normalised into categories and matched across runs by IoU. A rule-based GIS profile, a root-cause analyser and an IRC reference generator enrich the result, which is written as JSON and rendered into a LaTeX/PDF report and a Streamlit dashboard with Folium maps.",
    diagram: {
      kind: "implemented",
      title: "Dual-video audit pipeline",
      caption: "Module boundaries follow penultimate_road_audit_system.py and its companions. The optional segmentation model was not shipped.",
      cols: 4,
      rows: 3,
      nodes: [
        { id: "vids", label: "Base + present video", col: 0, row: 0, tone: "external" },
        { id: "frames", label: "Frame extraction", sub: "FFmpeg · OpenCV fallback", col: 1, row: 0 },
        { id: "sync", label: "Visual sync", sub: "ORB feature matching", col: 2, row: 0 },
        { id: "yolo", label: "YOLOv8 detection", sub: "fine-tuned + yolov8s", col: 3, row: 0, tone: "core" },
        { id: "match", label: "Change matching", sub: "IoU across runs", col: 3, row: 1, tone: "core" },
        { id: "pci", label: "Condition score", sub: "heuristic PCI proxy", col: 2, row: 1 },
        { id: "gis", label: "GIS profile", sub: "Nominatim + rules", col: 1, row: 1 },
        { id: "irc", label: "Root cause + IRC refs", sub: "rule-based", col: 1, row: 2 },
        { id: "json", label: "Structured JSON", col: 2, row: 2 },
        { id: "out", label: "Report · dashboard", sub: "PDF · Streamlit · Folium", col: 3, row: 2 },
      ],
      edges: [
        { from: "vids", to: "frames" },
        { from: "frames", to: "sync" },
        { from: "sync", to: "yolo" },
        { from: "yolo", to: "match" },
        { from: "match", to: "pci" },
        { from: "gis", to: "pci" },
        { from: "gis", to: "irc" },
        { from: "irc", to: "json" },
        { from: "pci", to: "json" },
        { from: "json", to: "out" },
      ],
    },
    implementation: [
      {
        title: "Detection",
        body: "A YOLOv8 checkpoint fine-tuned on Indian road-scene imagery runs alongside the pretrained YOLOv8s model. Raw class names from both are normalised into internal buckets (potholes, cracks, markings, signs, guardrails) before comparison.",
      },
      {
        title: "Comparing two runs",
        body: "Detections in matched base and present frames are paired by intersection-over-union per class. Unmatched present detections become new defects; matched pairs are compared for growth, such as crack width measured in pixels and scaled using lane geometry. Repeated events are suppressed so one pothole is not reported on every frame.",
      },
      {
        title: "Context and recommendations",
        body: "The GIS engine reverse-geocodes coordinates with Nominatim to classify the road (highway, residential, intersection, urban) and attaches a rule-based environmental profile. A root-cause analyser maps defect plus context to a likely cause, and a lookup maps issue types to the relevant Indian Roads Congress guidance.",
      },
      {
        title: "Output",
        body: "Every audit is written as JSON with a contract validator, then rendered to a PDF report (LaTeX or FPDF) and explored in a Streamlit dashboard with Folium heat maps.",
      },
    ],
    decisions: [
      {
        title: "Compare, don't just detect",
        body: "A detector alone produces a list. Aligning two drives turns it into change over time, which is what decides where maintenance goes first.",
      },
      {
        title: "Plain rules for context",
        body: "The GIS profile, root-cause and IRC steps are explicit rules rather than learned models, so every recommendation can be traced to the rule that produced it.",
      },
    ],
    challenges: [
      {
        title: "Limited GPU memory",
        body: "About 2.4 GB of usable GPU memory constrained model size and batch size; heavier runs moved to the college GPU server.",
      },
      {
        title: "Large binaries in Git",
        body: "Model weights and videos were removed from history and replaced by a download script and .gitignore rules.",
      },
    ],
    tradeoffs: [
      "The condition score is a heuristic proxy computed from detection densities, not a standards-compliant Pavement Condition Index survey.",
      "Environmental context (rainfall, drainage, soil) comes from rules, not measured data.",
    ],
    outcomes: [
      "A working end-to-end pipeline from two videos to JSON, a PDF report and a dashboard, submitted as the team's final hackathon version.",
    ],
    limitations: [
      "No validated detection accuracy is recorded in the repository.",
      "The road-marking segmentation model is optional and its download location was never published.",
    ],
    learned: [
      "Most of an applied CV system is alignment, matching and reporting around the model.",
      "Being explicit about which parts are heuristics makes the output more trustworthy.",
    ],
    links: { github: "https://github.com/lil-jonny-xx/CivTech" },
    related: ["portable-nas"],
    featured: true,
  },
  {
    slug: "permissioned-blockchain",
    title: "Private Permissioned EVM Network",
    shortTitle: "Besu network",
    summary:
      "Hyperledger Besu QBFT network: a four-validator local devnet with RPC nodes and monitoring, defined in Docker Compose; the application layer is designed, not built.",
    overview:
      "A permissioned, EVM-compatible blockchain for an application where a known set of organisations must agree on shared records. The project follows a local-first plan: get a reproducible validator network working in Docker Compose, then add contracts, a backend, indexing and only later Kubernetes.",
    categories: ["blockchain", "backend-distributed", "cloud-devops"],
    stack: ["Hyperledger Besu", "QBFT", "EVM", "Docker Compose", "nginx", "Prometheus", "Grafana", "Bash", "Make"],
    status: "in-progress",
    period: "Oct 2026 – present",
    year: 2026,
    role: "Built with a collaborator. They created the repository skeleton, the network generator and the four-validator Compose file; I fixed the generator for fresh clones, set the chain ID, capped validator memory, wired static peering, added Prometheus metrics and Grafana, and added the RPC layer.",
    verification:
      "Read from the public repository (ten commits). Compose definitions, genesis configuration, Prometheus and nginx configs exist. Smart contracts, the backend API, PostgreSQL, the indexer, authentication and production key management are not in the repository yet.",
    problem:
      "Several parties need a shared, tamper-evident record without trusting one operator's database, but a public chain exposes data and adds fee and finality uncertainty they do not need.",
    goals: [
      "Byzantine-fault-tolerant consensus among a known validator set.",
      "EVM compatibility so standard Solidity tooling works.",
      "A reproducible local network before any cloud deployment.",
      "Observability from day one.",
    ],
    constraints: [
      "QBFT with n validators tolerates f faulty ones only while n ≥ 3f + 1, so four validators tolerate one.",
      "Validator keys must never be committed; the dev network generates fresh keys per clone.",
    ],
    architecture:
      "Four Besu validators run QBFT (2-second block period, chain ID 20260001, zero base fee) on an internal validator network, peering through a static nodes file. Two non-validator RPC nodes sit behind an nginx load balancer, so clients never talk to validators directly. Prometheus scrapes every node and Grafana ships a chain dashboard. Planned layers above that: Solidity contracts, an API with authentication, an event indexer into PostgreSQL, and a frontend.",
    diagram: {
      kind: "partly-built",
      title: "Validator and service topology",
      caption: "Solid = defined in the repository's Compose stack. Dashed = designed, not built.",
      cols: 4,
      rows: 4,
      groups: [{ label: "validator-net", col: 0, row: 2, cols: 4, rows: 2 }],
      nodes: [
        { id: "client", label: "Frontend / clients", col: 0, row: 0, tone: "planned" },
        { id: "api", label: "Backend API", sub: "auth · business rules", col: 1, row: 0, tone: "planned" },
        { id: "idx", label: "Indexer", sub: "events → PostgreSQL", col: 2, row: 0, tone: "planned" },
        { id: "sc", label: "Solidity contracts", col: 3, row: 0, tone: "planned" },
        { id: "lb", label: "nginx RPC LB", col: 1, row: 1 },
        { id: "rpc1", label: "rpc1", sub: "non-validator", col: 2, row: 1 },
        { id: "rpc2", label: "rpc2", sub: "non-validator", col: 3, row: 1 },
        { id: "v1", label: "validator1", sub: "QBFT", col: 0, row: 2, tone: "core" },
        { id: "v2", label: "validator2", sub: "QBFT", col: 1, row: 2, tone: "core" },
        { id: "v3", label: "validator3", sub: "QBFT", col: 2, row: 2, tone: "core" },
        { id: "v4", label: "validator4", sub: "QBFT", col: 3, row: 2, tone: "core" },
        { id: "prom", label: "Prometheus", col: 0, row: 3 },
        { id: "graf", label: "Grafana", sub: "chain dashboard", col: 1, row: 3 },
      ],
      edges: [
        { from: "client", to: "api", planned: true },
        { from: "api", to: "lb", planned: true },
        { from: "idx", to: "lb", planned: true },
        { from: "lb", to: "rpc1" },
        { from: "lb", to: "rpc2" },
        { from: "rpc1", to: "v3" },
        { from: "rpc2", to: "v4" },
        { from: "v1", to: "v2" },
        { from: "v2", to: "v3" },
        { from: "v3", to: "v4" },
        { from: "prom", to: "v1", label: "scrape" },
        { from: "prom", to: "graf" },
      ],
    },
    implementation: [
      {
        title: "Reproducible genesis",
        body: "A generator script uses Besu's operator tooling to create four validator key pairs and the QBFT genesis from qbft-config.json. It writes the keys outside version control, so every clone gets fresh keys and the network starts from `make reset`.",
      },
      {
        title: "Static peering",
        body: "Validators connect through a static nodes file rather than discovery, which keeps the topology explicit in a permissioned setting.",
      },
      {
        title: "RPC separation",
        body: "Two non-validator nodes serve JSON-RPC behind nginx. Validators stay on an internal network and only take part in consensus.",
      },
      {
        title: "Monitoring",
        body: "Metrics are enabled on every node; Prometheus scrapes them and Grafana is provisioned with a datasource and a chain dashboard.",
      },
    ],
    decisions: [
      {
        title: "QBFT over Clique or IBFT 2.0",
        body: "QBFT is Besu's recommended BFT protocol for enterprise networks and gives immediate finality, which matters when blocks represent agreements between organisations.",
      },
      {
        title: "Compose first, Kubernetes later",
        body: "Kubernetes adds operational surface before the application exists. A Compose network is enough to develop and test contracts and the indexer.",
      },
      {
        title: "Validators are not RPC endpoints",
        body: "Exposing validators to client traffic mixes consensus load with query load and widens the attack surface.",
      },
    ],
    challenges: [
      {
        title: "Generator failing on a fresh clone",
        body: "The network generator assumed directories that only existed on the original machine. It was fixed so the stack can be rebuilt from nothing.",
      },
      {
        title: "Memory on a laptop",
        body: "Six JVM-based Besu nodes exhaust a development machine quickly; validator memory is capped in the Compose file.",
      },
    ],
    tradeoffs: [
      "Four validators tolerate one fault, the minimum useful BFT set; more validators add resilience and message overhead.",
      "Zero base fee suits a permissioned network but means spam control must come from permissioning, not gas price.",
    ],
    outcomes: [
      "A four-validator QBFT devnet with two RPC nodes, an RPC load balancer and monitoring, defined in one Compose stack with Make targets.",
    ],
    limitations: [
      "No smart contracts, backend, indexer, authentication or TLS yet.",
      "Validator key management beyond development keys, backups and Kubernetes deployment are planned only.",
    ],
    learned: [
      "Consensus is the easy part to start; key management and operations are the hard part to finish.",
    ],
    links: { github: "https://github.com/AryanSasane/chain-platform" },
    related: ["ecodata", "cloud-optimizer-dynamic"],
    featured: true,
  },
  {
    slug: "rooftop-delivery",
    title: "RoofTop Delivery Allocation Service",
    shortTitle: "RoofTop",
    summary:
      "Spring Boot service that assigns delivery drivers to orders with a two-heap allocator, deterministic tie-breaking and a run-scoped data model.",
    overview:
      "A small backend that solves a driver-assignment problem: N customers order at given times, M drivers each carry one order at a time, the lowest-numbered free driver takes the next order, and an order with nobody free is refused. The allocation rules live in a pure engine; the service persists each run to MySQL and exposes it over REST.",
    categories: ["applications", "backend-distributed"],
    stack: ["Java", "Spring Boot", "Spring Data JPA", "MySQL", "JUnit", "Maven", "OpenAPI"],
    status: "completed",
    period: "Sep 2026",
    year: 2026,
    role: "Solo.",
    verification: "Read from the public repository, its README and tests.",
    problem:
      "A naive scan of every driver for every order is O(N × M), and an ambiguous rule (can a driver returning at minute 24 take an order placed at minute 24?) silently changes the answer.",
    goals: [
      "Make every rule explicit, including tie-breaking.",
      "Keep allocation independent of clocks, databases and request timing so a run is reproducible.",
    ],
    constraints: ["The required output format is fixed text, e.g. “C6 - No Food :-(”."],
    architecture:
      "REST controller → DeliveryRunService → DriverAssignmentEngine, with Spring Data JPA persisting runs, drivers and orders. The engine has no clock, database or state between calls.",
    diagram: {
      kind: "implemented",
      title: "Layers",
      caption: "From the repository README.",
      cols: 4,
      rows: 2,
      nodes: [
        { id: "c", label: "REST controller", sub: "/api/v1/delivery-runs", col: 0, row: 0 },
        { id: "s", label: "DeliveryRunService", sub: "one transaction per run", col: 1, row: 0 },
        { id: "e", label: "DriverAssignmentEngine", sub: "free + busy min-heaps", col: 2, row: 0, tone: "core" },
        { id: "db", label: "MySQL", sub: "runs · drivers · orders", col: 1, row: 1 },
      ],
      edges: [
        { from: "c", to: "s" },
        { from: "s", to: "e" },
        { from: "s", to: "db", label: "JPA" },
      ],
    },
    implementation: [
      {
        title: "Two heaps",
        body: "Free drivers sit in a min-heap on driver number and busy drivers in a min-heap on return minute. Before each order, busy drivers with availableAt ≤ orderTime move to the free heap, stopping at the first still out. Cost is O(N log N + N log M) instead of O(N × M).",
      },
      {
        title: "Run-scoped data",
        body: "A run owns its drivers and orders, so a second run never sees drivers left busy by the first. Only available_at is stored; status is computed from it, so no row can be stuck reading BUSY. A refused order has a null driver_id rather than a magic value. The schema is owned by schema.sql, not generated by Hibernate.",
      },
    ],
    decisions: [
      {
        title: "Create a run in one call",
        body: "Allocation depends on the whole set of orders, not on request arrival order, so posting the same input twice gives the same answer.",
      },
    ],
    challenges: [
      {
        title: "An off-by-one in the rules",
        body: "The sample input only produces the expected output if a driver is free when availableAt ≤ orderTime. A strict comparison gives the wrong answer for one order, and a test pins it.",
      },
    ],
    tradeoffs: ["For two drivers the heap is unnecessary; it matters once the fleet is large."],
    outcomes: ["Engine and controller tests; sample input reproduces the expected output."],
    limitations: ["A small, single-purpose service; not deployed."],
    learned: ["Separating pure rules from persistence makes the rules testable without starting the app."],
    links: { github: "https://github.com/lil-jonny-xx/rooftop-delivery" },
    related: ["cloud-optimizer-dynamic"],
    featured: false,
  },
  {
    slug: "portable-nas",
    title: "Portable Network-Attached Storage",
    shortTitle: "Portable NAS",
    summary: "A portable Linux-based NAS sharing storage to devices on the local network over Samba.",
    overview:
      "A small, portable file server built to give several devices one shared, network-accessible store. It was a hands-on exercise in Linux storage, users and permissions, local networking and Samba.",
    categories: ["applications", "cloud-devops"],
    stack: ["Linux", "Samba (SMB)", "Networking", "File permissions"],
    status: "completed",
    period: "2025",
    year: 2025,
    role: "Solo.",
    verification:
      "Described from my own notes and résumé. There is no public repository, and hardware model, operating system release, storage layout and performance measurements are not documented yet, so none are stated here.",
    problem: "Files were spread across devices with no shared, always-available location on the local network.",
    goals: [
      "One shared store reachable from every device on the network.",
      "Per-user access instead of an open share.",
      "Portable: usable wherever there is a local network.",
    ],
    constraints: ["Small hardware budget and power envelope."],
    architecture:
      "A Linux host exposes a mounted storage volume as Samba shares on the local network. Linux users and groups map to share permissions so each client sees only what it should.",
    diagram: {
      kind: "implemented",
      title: "Storage topology",
      caption: "Conceptual view of the build; specific hardware is not documented here.",
      cols: 3,
      rows: 2,
      nodes: [
        { id: "disk", label: "Storage volume", sub: "mounted on host", col: 0, row: 0 },
        { id: "host", label: "Linux host", sub: "users · permissions", col: 1, row: 0, tone: "core" },
        { id: "smb", label: "Samba", sub: "SMB shares", col: 2, row: 0 },
        { id: "lan", label: "Local network", col: 2, row: 1, tone: "external" },
        { id: "clients", label: "Laptops · phones", col: 1, row: 1, tone: "external" },
      ],
      edges: [
        { from: "disk", to: "host" },
        { from: "host", to: "smb" },
        { from: "smb", to: "lan" },
        { from: "lan", to: "clients" },
      ],
    },
    implementation: [
      {
        title: "Shares and permissions",
        body: "Samba shares are backed by Linux directories whose ownership and modes enforce access; Samba users map onto system accounts.",
      },
    ],
    decisions: [
      {
        title: "Samba",
        body: "SMB is supported natively by Windows, macOS, Linux and most mobile file managers, so no client software is needed.",
      },
    ],
    challenges: [],
    tradeoffs: ["A single disk host is simple and portable but has no redundancy."],
    outcomes: ["A working shared store on the local network."],
    limitations: ["Configuration details, hardware and measurements still need to be written up."],
    learned: ["Permissions problems are usually a mismatch between the share's view and the file system's view."],
    links: {},
    related: ["permissioned-blockchain"],
    featured: false,
  },
];
