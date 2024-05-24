import { TaskStatus } from "./CamAIEnum";

export type Progress = {
    percents: number,
    detailed: {
        currentFinishedRecord: number,
        total: number
    }
}

export type ProgressTask = {
    taskId: string | null;
    setTaskId: React.Dispatch<React.SetStateAction<string | null>>
}
export type ReasonType = { [key: string]: string };
export type TaskError = {
    row: number;
    reasons: ReasonType;
}

export type MetaData = { [key: string]: any[] | TaskError[] }
export type TaskResult = {
    status: TaskStatus,
    inserted: number,
    updated: number,
    failed: number,
    description: string,
    metadata: MetaData[]
}