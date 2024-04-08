import { NotificationStatus, NotificationType } from "./CamAIEnum"

export type NotificationDetail = {
    title: string,
    content: string,
    priority: string,
    type: NotificationType,
    entityName: string,
    relatedEntityId:string
    status: NotificationStatus,
    id: string,
    createdDate: string,
}