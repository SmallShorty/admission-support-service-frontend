export enum TicketStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  ESCALATED = "ESCALATED",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  AWAITING_FEEDBACK = "AWAITING_FEEDBACK",
}

export enum EscalationCause {
  COMPLEX_ISSUE = "COMPLEX_ISSUE",
  INSUFFICIENT_RIGHTS = "INSUFFICIENT_RIGHTS",
  CUSTOMER_COMPLAINT = "CUSTOMER_COMPLAINT",
  TECHNICAL_FAILURE = "TECHNICAL_FAILURE",
  TIMEOUT = "TIMEOUT",
  OTHER = "OTHER",
}

export enum AdmissionIntentCategory {
  TECHNICAL_ISSUES = "TECHNICAL_ISSUES",
  DEADLINES_TIMELINES = "DEADLINES_TIMELINES",
  DOCUMENT_SUBMISSION = "DOCUMENT_SUBMISSION",
  STATUS_VERIFICATION = "STATUS_VERIFICATION",
  SCORES_COMPETITION = "SCORES_COMPETITION",
  PAYMENTS_CONTRACTS = "PAYMENTS_CONTRACTS",
  ENROLLMENT = "ENROLLMENT",
  DORMITORY_HOUSING = "DORMITORY_HOUSING",
  STUDIES_SCHEDULE = "STUDIES_SCHEDULE",
  EVENTS = "EVENTS",
  GENERAL_INFO = "GENERAL_INFO",
  PROGRAM_CONSULTATION = "PROGRAM_CONSULTATION",
}

// TODO дополнить
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Ticket {
  id: string;
  applicantId: string;
  agentId: string | null;
  status: TicketStatus;
  priority: number | null;
  intent: AdmissionIntentCategory | null;
  noteText: string;
  assignedAt: string | null;
  firstReplyAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  satisfactionScore: string | null;
  createdAt: string;
  updatedAt: string;
  applicant: UserInfo;
  agent: UserInfo | null;
}

export interface TicketListItem {
  id: string;
  status: TicketStatus;
  priority: number | null;
  noteText: string;
  createdAt: string;
  updatedAt: string;
  applicantId: string;
  agentId: string | null;
  applicantName: string;
  agentName?: string;
}

export interface TakeTicketResponse {
  id: string;
  status: TicketStatus;
  agentId: string;
  assignedAt: string;
  applicant: UserInfo;
}

export interface EscalateTicketPayload {
  toAgentId: string;
  cause: EscalationCause;
  causeComment?: string;
}

export interface UpdateTicketStatusPayload {
  status: TicketStatus.RESOLVED | TicketStatus.CLOSED;
}

export interface AllQueueFilters {
  status?: TicketStatus[];
  agentId?: string;
  priority?: number;
  dateFrom?: string;
  dateTo?: string;
}
