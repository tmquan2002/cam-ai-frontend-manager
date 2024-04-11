import {
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from "./CamAIEnum";

export type NotificationDetail = {
  title: string;
  content: string;
  priority: NotificationPriority;
  type: NotificationType;
  entityName: string;
  relatedEntityId: string;
  status: NotificationStatus;
  id: string;
  createdDate: string;
};
