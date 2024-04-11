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
};
