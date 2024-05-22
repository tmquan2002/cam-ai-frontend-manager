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

export type TaskError = {
    row: number,
    reasons: string
}
export type TaskResult = {
    status: TaskStatus,
    inserted: number,
    updated: number,
    failed: number,
    description: string,
    metadata: string[]
}