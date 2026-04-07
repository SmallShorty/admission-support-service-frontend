export enum ExamType {
  EGE = "EGE",
  INTERNAL = "INTERNAL",
}

export enum StudyForm {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  EVENING = "EVENING",
}

export enum AdmissionType {
  BUDGET_COMPETITIVE = "BUDGET_COMPETITIVE",
  BUDGET_BVI = "BUDGET_BVI",
  BUDGET_SPECIAL_QUOTA = "BUDGET_SPECIAL_QUOTA",
  BUDGET_SEPARATE_QUOTA = "BUDGET_SEPARATE_QUOTA",
  TARGET = "TARGET",
  PAID = "PAID",
}

export interface ApplicantProfile {
  id: string; // FK к Account.id
  snils: string | null;
  hasBvi: boolean;
  hasSpecialQuota: boolean;
  hasSeparateQuota: boolean;
  hasTargetQuota: boolean;
  hasPriorityRight: boolean;
  originalDocumentReceived: boolean;
  originalDocumentReceivedAt: string | null;

  examScores?: ExamScore[];
  applicantPrograms?: ApplicantProgram[];
}

export interface ExamScore {
  subjectName: string;
  score: number;
  type: ExamType | null;
}

export interface ApplicantProgram {
  programId: number;
  programCode: string;
  studyForm: StudyForm;
  admissionType: AdmissionType;
  priority: number;
}

export interface ApplicantInfo {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}
