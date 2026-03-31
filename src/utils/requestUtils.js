// src/utils/requestUtils.js
export const STATUS_LABELS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ESCALATED: "Escalated",
};

export const URGENCY_LABELS = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const normalizeStatus = (status, escalated) => {
  if (escalated) return STATUS_LABELS.ESCALATED;
  const raw = (status || "PENDING").toString().toUpperCase();
  if (raw.includes("APPROV")) return STATUS_LABELS.APPROVED;
  if (raw.includes("REJECT")) return STATUS_LABELS.REJECTED;
  if (raw.includes("ESCALAT")) return STATUS_LABELS.ESCALATED;
  return STATUS_LABELS.PENDING;
};

export const normalizeUrgency = (urgency) => {
  const raw = (urgency || "MEDIUM").toString().toUpperCase();
  if (raw.includes("HIGH")) return "HIGH";
  if (raw.includes("LOW")) return "LOW";
  return "MEDIUM";
};

export const getUrgencyLabel = (urgency) => URGENCY_LABELS[normalizeUrgency(urgency)];

export const estimateSlaHours = (requestType, urgency) => {
  const type = (requestType || "").toString().toUpperCase();
  const urg = normalizeUrgency(urgency);
  const isHigh = urg === "HIGH";

  if (type === "HARDWARE") return isHigh ? 24 : 48;
  if (type === "SOFTWARE") return isHigh ? 12 : 24;
  return 72;
};

export const inferCreatedAt = (slaDeadline, requestType, urgency) => {
  if (!slaDeadline) return null;
  const totalHours = estimateSlaHours(requestType, urgency);
  const due = new Date(slaDeadline);
  if (Number.isNaN(due.getTime())) return null;
  return new Date(due.getTime() - totalHours * 3600 * 1000).toISOString();
};

export const computeSlaRemainingHours = (slaDeadline) => {
  if (!slaDeadline) return null;
  const due = new Date(slaDeadline);
  if (Number.isNaN(due.getTime())) return null;
  return Math.max(0, (due.getTime() - Date.now()) / 36e5);
};

export const mapRequestDto = (dto) => {
  const requestTypeObject = dto.requestType;
  const type =
    dto.requestTypeCode ||
    (requestTypeObject && (requestTypeObject.code || requestTypeObject.name)) ||
    dto.type ||
    dto.category ||
    "General";
  const urgency = normalizeUrgency(dto.urgency || dto.priority);
  const createdAt =
    dto.createdAt ||
    dto.created_date ||
    dto.createdOn ||
    dto.submittedAt ||
    inferCreatedAt(dto.slaDeadline, type, urgency) ||
    new Date().toISOString();

  return {
    id: dto.id,
    title: dto.title || dto.requestTitle || dto.summary || "Untitled request",
    description: dto.description || "",
    type,
    urgency,
    priority: getUrgencyLabel(urgency),
    status: normalizeStatus(dto.status || dto.state, dto.escalated),
    rawStatus: dto.status || dto.state,
    requester: dto.createdBy || dto.requester || "",
    stageNumber: dto.stageNumber || dto.currentStage || dto.workflowStage || 1,
    stageLabel: dto.stage || dto.currentStage || dto.workflowStage || "In Review",
    approvalComment: dto.approvalComment || "",
    assignedTo: dto.assignedTo || "",
    priorityScore: dto.priorityScore,
    slaDeadline: dto.slaDeadline,
    createdAt,
    slaHours: Number(dto.slaHours || dto.sla || estimateSlaHours(type, urgency)),
  };
};
