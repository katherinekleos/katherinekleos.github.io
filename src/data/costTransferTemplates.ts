export type TransferReasonKey =
  | "new-award"
  | "salary-realignment"
  | "effort-change"
  | "default-account"
  | "timing-delay"
  | "multi-ledger"
  | "other";

export type ToneKey = "standard" | "formal" | "concise";

export interface ReasonTemplate {
  label: string;
  standard: string;
  formal: string;
  concise: string;
}

export const reasonTemplates: Record<TransferReasonKey, ReasonTemplate> = {
  "new-award": {
    label: "New award received after payroll posted",
    standard:
      "Following receipt of the new award, the PI elected to realign salary distribution to reflect current research activities and project responsibilities.",
    formal:
      "Following receipt of the new award, salary distribution was reviewed and realigned to reflect the PI's current research activities, project responsibilities, and available funding across active accounts.",
    concise:
      "After the new award was received, salary distribution was realigned to match current research activity.",
  },

  "salary-realignment": {
    label: "Salary distribution needed realignment",
    standard:
      "Salary distribution required realignment to better reflect the employee's actual effort and project responsibilities.",
    formal:
      "A review of payroll distribution determined that the original allocation did not accurately reflect the employee's actual effort and project responsibilities, and a realignment was therefore required.",
    concise:
      "Salary distribution was realigned to reflect actual effort.",
  },

  "effort-change": {
    label: "Effort or project activity changed",
    standard:
      "Project activity and effort allocation changed, requiring payroll expenses to be redistributed to the account that more accurately reflects the work performed.",
    formal:
      "Subsequent review confirmed a change in project activity and effort allocation, requiring redistribution of payroll expenses to the account that appropriately reflects the work performed.",
    concise:
      "Effort changed, so payroll was moved to the account that matches the work performed.",
  },

  "default-account": {
    label: "Payroll initially charged to a temporary or default account",
    standard:
      "Payroll expenses were initially charged to a temporary or default account pending final account setup and review.",
    formal:
      "Payroll expenses were initially charged to a temporary or departmental holding account pending account establishment, administrative review, and final payroll alignment.",
    concise:
      "Payroll first posted to a temporary account pending setup.",
  },

  "timing-delay": {
    label: "Administrative timing delay",
    standard:
      "An administrative timing delay affected the original payroll distribution, and the expense is now being transferred to the account that reflects the appropriate funding source.",
    formal:
      "Due to administrative timing constraints, payroll initially posted to an interim funding source and is now being transferred to the account that appropriately reflects the applicable funding source and actual activity.",
    concise:
      "A timing delay caused the original posting, and the payroll is now being aligned to the correct account.",
  },

  "multi-ledger": {
    label: "Redistribution across multiple active ledgers",
    standard:
      "Payroll distribution required adjustment across multiple active accounts to align charges with the employee's actual effort and the funding sources supporting that work.",
    formal:
      "Payroll distribution required adjustment across multiple active ledgers in order to align salary charges with actual effort, project responsibilities, and the funding sources supporting those activities.",
    concise:
      "Payroll was redistributed across active accounts to match actual effort.",
  },

  other: {
    label: "Other",
    standard:
      "A payroll review determined that the original distribution should be updated to better reflect the work performed and the appropriate funding source.",
    formal:
      "Review of payroll activity determined that the original distribution should be revised to align with the work performed, applicable project activity, and the appropriate funding source.",
    concise:
      "Payroll distribution was updated to better match the work performed.",
  },
};

export const toneLabels: Record<ToneKey, string> = {
  standard: "Standard",
  formal: "Formal / audit-ready",
  concise: "Concise",
};

export const defaultCustomPhrases = [
  "Following receipt of a new award, the PI elected to realign his salary distribution to reflect current research activities and project responsibilities across all active accounts.",
  "The new sponsored account reflects the PI’s current research activities and available funding. This transfer aligns payroll with the actual effort expended on the new grant.",
];