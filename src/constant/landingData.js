// src/constants/landingData.js
import {
  AssignmentOutlined,
  VerifiedOutlined,
  AccountTreeOutlined,
  HistoryOutlined,
} from "@mui/icons-material";

export const NAV_LINKS = ["Features", "How It Works", "Tech Stack", "Demo"];

export const FEATURES = [
  {
    icon: AssignmentOutlined,
    title: "Submit & Track",
    desc: "Raise requests for access, IT support, or compliance — then watch every status update in real time.",
    accent: "#00E5FF",
  },
  {
    icon: VerifiedOutlined,
    title: "Approve or Reject",
    desc: "Managers review incoming requests with full context, add comments, and action them in a single click.",
    accent: "#7C3AED",
  },
  {
    icon: AccountTreeOutlined,
    title: "Sequential Workflow",
    desc: "Multi-stage approvals with intelligent routing — the right person sees the right request at the right time.",
    accent: "#06B6D4",
  },
  {
    icon: HistoryOutlined,
    title: "Full Audit Trail",
    desc: "Every action timestamped and logged. Compliance teams get complete visibility with zero extra effort.",
    accent: "#8B5CF6",
  },
];

export const STEPS = [
  { num: "01", title: "Submit a Request",   desc: "Users fill a structured form — type, urgency, description — and hit send." },
  { num: "02", title: "Routed to Approver", desc: "The system routes it to the right manager based on request type and org hierarchy." },
  { num: "03", title: "Reviewed & Actioned",desc: "Approver accepts, rejects, or requests more info with a timestamped comment." },
  { num: "04", title: "Closed & Logged",    desc: "The request is resolved, all parties notified, and the trail is permanently archived." },
];

export const TECH = [
  { name: "React + Vite", sub: "Frontend",   color: "#61DAFB", symbol: "⚛" },
  { name: "Spring Boot",  sub: "Backend",    color: "#6DB33F", symbol: "🍃" },
  { name: "MySQL",        sub: "Database",   color: "#00AFF0", symbol: "🐬" },
  { name: "MUI v5",       sub: "UI Library", color: "#007FFF", symbol: "▦" },
];

export const HERO_QUEUE_ITEMS = [
  { label: "Access Request",   status: "Approved",  color: "#10B981", user: "sarah@corp.com" },
  { label: "VPN Setup Ticket", status: "Pending",   color: "#F59E0B", user: "mike@corp.com"  },
  { label: "Compliance Audit", status: "In Review", color: "#00E5FF", user: "admin@corp.com" },
];