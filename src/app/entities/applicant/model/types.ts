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

  // В будущем сюда импортируешь типы из этого же каталога
  // examScores?: ExamScore[];
  // applicantPrograms?: ApplicantProgram[];
}
