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