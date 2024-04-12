import { ReportInterval } from "./CamAIEnum";
import { IncidentDetail } from "./Incident";

export type ChartReportData = {
  Time: string;
  Total: number;
  ShopId: string;
};

export type InteractionReportDetail = {
  totalTime: number;
  totalInteraction: number;
  averageInteractionTime: number;
  interactionList: IncidentDetail[];
  time: string;
};

export type IncidentReportByTimeDetail = {
  shopId: string;
  total: number;
  startDate: string;
  endDate: string;
  interval: ReportInterval;
  data: IncidentReportByTimeDataDetail[];
};

export type IncidentReportByTimeDataDetail = {
  time: string;
  count: number;
  averageDuration: number | null;
};

export type HumanCountDetail = {
  shopId: string;
  startDate: string;
  endDate: string;
  interval: ReportInterval;
  data: HumanCountDataDetail[];
};

export type HumanCountDataDetail = {
  Time: string;
  Low: number;
  High: number;
  Open: number;
  Close: number;
  Median: number;
};
