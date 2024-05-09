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
  totalInteraction: number;
  data: HumanCountDataDetail[];
};

export type HumanCountDataDetail = {
  time: string;
  humanCount: {
    low: number;
    high: number;
    open: number;
    close: number;
    median: number;
  };
  interaction: {
    count: number;
    averageDuration: number;
  };
};
