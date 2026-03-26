// src/data/mockRequests.js

export const sampleRequests = [
  {
    id: "REQ-001",
    title: "Request VPN access for new project",
    type: "Access",
    priority: "High",
    status: "Pending",
    stage: "Manager Approval",
    slaHours: 42,
    createdAt: "2026-03-05T09:18:00Z",
    requester: "jane.doe@example.com",
    urgency: "HIGH",
    timeline: [
      {
        id: "t1",
        actor: "Jane Doe",
        role: "Requester",
        time: "2026-03-05T09:18:00Z",
        action: "Submitted request",
        comment: "Need VPN access for the new T2 project."
      },
      {
        id: "t2",
        actor: "Mark Taylor",
        role: "Manager",
        time: "2026-03-05T11:07:00Z",
        action: "Approved",
        comment: "Looks good to me, please ensure compliance training is complete."
      },
      {
        id: "t3",
        actor: "Alex Wu",
        role: "IT Admin",
        time: "2026-03-06T08:14:00Z",
        action: "In review",
        comment: "Checking system access requirements."
      },
    ],
  },
  {
    id: "REQ-002",
    title: "Request new MacBook Pro",
    type: "Hardware",
    priority: "Medium",
    status: "Approved",
    stage: "Procurement",
    slaHours: 120,
    createdAt: "2026-03-01T14:35:00Z",
    requester: "jason.lee@example.com",
    urgency: "MEDIUM",
    timeline: [
      {
        id: "t1",
        actor: "Jason Lee",
        role: "Requester",
        time: "2026-03-01T14:35:00Z",
        action: "Submitted request",
        comment: "Need replacement laptop for development work."
      },
      {
        id: "t2",
        actor: "Sofia Williams",
        role: "Manager",
        time: "2026-03-02T10:12:00Z",
        action: "Approved",
        comment: "Approved based on current budget allotment."
      },
      {
        id: "t3",
        actor: "Procurement",
        role: "Procurement",
        time: "2026-03-03T08:45:00Z",
        action: "Order placed",
        comment: "Order placed with vendor; ETA 7 days."
      },
    ],
  },
  {
    id: "REQ-003",
    title: "Compliance training access request",
    type: "Compliance",
    priority: "Low",
    status: "Rejected",
    stage: "Closed",
    slaHours: 0,
    createdAt: "2026-02-27T16:22:00Z",
    requester: "amelia.smith@example.com",
    urgency: "LOW",
    timeline: [
      {
        id: "t1",
        actor: "Amelia Smith",
        role: "Requester",
        time: "2026-02-27T16:22:00Z",
        action: "Submitted request",
        comment: "Need access to annual compliance training module."
      },
      {
        id: "t2",
        actor: "Compliance Team",
        role: "Compliance",
        time: "2026-02-28T10:09:00Z",
        action: "Rejected",
        comment: "Training is automatically assigned; please check your dashboard."
      },
    ],
  },
  {
    id: "REQ-004",
    title: "Request access to analytics dashboard",
    type: "Access",
    priority: "High",
    status: "Pending",
    stage: "IT Review",
    slaHours: 8,
    createdAt: "2026-03-11T12:00:00Z",
    requester: "priya.kumar@example.com",
    urgency: "HIGH",
    timeline: [
      {
        id: "t1",
        actor: "Priya Kumar",
        role: "Requester",
        time: "2026-03-11T12:00:00Z",
        action: "Submitted request",
        comment: "Need access to analytics dashboard for quarterly reporting."
      },
      {
        id: "t2",
        actor: "IT Support",
        role: "IT Admin",
        time: "2026-03-11T13:15:00Z",
        action: "Reviewing",
        comment: "Checking permissions and data access levels."
      },
    ],
  },
];
