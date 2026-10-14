export type AcademicLevel = "100" | "200" | "300" | "400";
export type Platform = "WhatsApp" | "Facebook" | "Instagram" | "X" | "TikTok" | "Other";
export type UsagePurpose = "Academic" | "Entertainment" | "Socializing" | "Mixed";

export interface CadetRecord {
  id: string;
  name: string;
  level: AcademicLevel;
  platform: Platform;
  hours: number;
  cgpa: number;
  purpose: UsagePurpose;
  notes?: string;
  createdAt: string;
}

export type PageKey = "dashboard" | "cadets" | "entry" | "analytics" | "reports";