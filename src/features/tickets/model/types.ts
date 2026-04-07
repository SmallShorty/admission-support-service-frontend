import {
  ExamScore,
  ApplicantProgram,
  ApplicantInfo,
} from "@/app/entities/applicant/model/types";
import { DeliveryStatus, MessageType } from "@/features/chat/model/types";

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

export enum EscalationCause {
  COMPLEX_ISSUE = "COMPLEX_ISSUE",
  INSUFFICIENT_RIGHTS = "INSUFFICIENT_RIGHTS",
  CUSTOMER_COMPLAINT = "CUSTOMER_COMPLAINT",
  TECHNICAL_FAILURE = "TECHNICAL_FAILURE",
  TIMEOUT = "TIMEOUT",
  OTHER = "OTHER",
}

export enum TicketStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  ESCALATED = "ESCALATED",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  AWAITING_FEEDBACK = "AWAITING_FEEDBACK",
}

export interface TicketListItem {
  id: string;
  applicant: ApplicantInfo;
  operator: {
    id: string | null;
  };
  category: AdmissionIntentCategory | null;
  status: TicketStatus;
  priorityValue: number | null;
  createdAt: string;
  lastMessageAt: string;
}

export interface TicketDetail extends TicketListItem {
  noteText: string;
  intent: AdmissionIntentCategory | null;
  assignedAt: string | null;
  firstReplyAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  updatedAt: string;
  examScores?: ExamScore[];
  applicantPrograms?: ApplicantProgram[];
}

export interface TicketCounts {
  NEW: number;
  IN_PROGRESS: number;
  ESCALATED: number;
  RESOLVED: number;
  CLOSED: number;
  AWAITING_FEEDBACK: number;
}
export interface TicketFilters {
  status?: TicketStatus;
  agentId?: string;
  limit?: number;
  offset?: number;
}
export interface AllQueueFilters {
  status?: TicketStatus[];
  agentId?: string;
}
export interface TakeTicketResponse extends TicketListItem {}
export interface EscalateTicketPayload {
  toAgentId: string;
  cause: EscalationCause;
  causeComment?: string;
}
export interface UpdateTicketStatusPayload {
  status: TicketStatus.RESOLVED | TicketStatus.CLOSED;
}
export interface TicketMessage {
  id: number;
  ticketId: string;
  authorId: string;
  authorType: MessageType;
  content: string;
  status: DeliveryStatus;
  deliveredAt?: string;
  seenAt?: string;
  createdAt: string;
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
}
