// src/constants/landingData.js
import {
  AssignmentOutlined,
  VerifiedOutlined,
  AccountTreeOutlined,
  AutoAwesomeOutlined,
  BarChartOutlined,
  NotificationsActiveOutlined,
  ShieldOutlined,
  FolderOpenOutlined,
  QueryStatsOutlined,
} from "@mui/icons-material";


export const NAV_LINKS = ["Features", "How It Works", "Tech Stack", "Demo"];


export const FEATURES = [
  {
    icon: AssignmentOutlined,
    title: "Raise Requests In Minutes",
    desc:
      "Create access, IT, admin, or compliance requests from one guided form. Teams add the right details up front, so work starts without back-and-forth.",
    accent: "#00E5FF",
    eyebrow: "What the system does",
    imageKey: "img1",
    points: [
      "Smart forms for every request type",
      "Urgency and ownership captured instantly",
      "Clear summary before submit",
    ],
  },
  {
    icon: VerifiedOutlined,
    title: "Keep Approvals Clear And Fast",
    desc:
      "Managers and approvers see the full request context, risk level, and comments in one view. They can approve, reject, or ask for more information without leaving the workflow.",
    accent: "#F5B942",
    eyebrow: "How it works",
    imageKey: "img2",
    points: [
      "Context-rich approval screens",
      "Comments and decision history in one place",
      "Designed for quick action with less confusion",
    ],
  },
  {
    icon: AccountTreeOutlined,
    title: "Move Through Every Stage Smoothly",
    desc:
      "ReqZen routes each request through the right approval chain, from manager review to IT or final admin sign-off. Everyone sees exactly what is pending and what happens next.",
    accent: "#3BA4FF",
    eyebrow: "Requests to approvals",
    imageKey: "img3",
    points: [
      "Multi-step routing based on request type",
      "Live stage indicators for every approver",
      "Built to prevent bottlenecks",
    ],
  },
];


export const STEPS = [
  { num: "01", title: "Submit a Request", desc: "Users fill a structured form - type, urgency, description - and hit send." },
  { num: "02", title: "Routed to Approver", desc: "The system routes it to the right manager based on request type and org hierarchy." },
  { num: "03", title: "Reviewed & Actioned", desc: "Approver accepts, rejects, or requests more info with a timestamped comment." },
  { num: "04", title: "Closed & Logged", desc: "The request is resolved, all parties notified, and the trail is permanently archived." },
];


export const PLATFORM_CAPABILITIES = [
  {
    icon: AutoAwesomeOutlined,
    title: "Instant Submission",
    desc: "Submit requests in seconds with smart forms, auto-fill, and category detection.",
  },
  {
    icon: BarChartOutlined,
    title: "Live Dashboard",
    desc: "Real-time metrics, status updates and priority queues - all in one glance.",
  },
  {
    icon: NotificationsActiveOutlined,
    title: "Smart Notifications",
    desc: "Email, SMS, and in-app alerts keep everyone informed at every milestone.",
  },
  {
    icon: ShieldOutlined,
    title: "Role-Based Access",
    desc: "Admins, agents, and requesters - each sees only what they need to.",
  },
  {
    icon: FolderOpenOutlined,
    title: "File Attachments",
    desc: "Attach documents, images, and files directly to any request.",
  },
  {
    icon: QueryStatsOutlined,
    title: "Analytics & Reports",
    desc: "Track trends, SLA compliance, and team performance over time.",
  },
];


export const TECH = [
  { name: "React + Vite", sub: "Frontend", color: "#61DAFB", symbol: "R" },
  { name: "Spring Boot", sub: "Backend", color: "#6DB33F", symbol: "SB" },
  { name: "MySQL", sub: "Database", color: "#00AFF0", symbol: "DB" },
  { name: "MUI v5", sub: "UI Library", color: "#007FFF", symbol: "UI" },
];


export const HERO_QUEUE_ITEMS = [
  { label: "Access Request", status: "Approved", color: "#10B981", user: "sarah@corp.com" },
  { label: "VPN Setup Ticket", status: "Pending", color: "#F59E0B", user: "mike@corp.com" },
  { label: "Compliance Audit", status: "In Review", color: "#00E5FF", user: "admin@corp.com" },
];
