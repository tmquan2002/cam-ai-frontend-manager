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
    metadata: [
        { shopInserted: string[] },
        { accountInserted: string[] },
        { shopUpdated: string[] },
        { accountUpdated: string[] },
        { errors: TaskError[] }
        // {
        //     errors: [
        //         {
        //             "row": 6,
        //             "reasons": {
        //                 "ShopManagerEmail": "azsefzdvfzfxv is wrong format"
        //             }
        //         },
        //         {
        //             "row": 8,
        //             "reasons": {
        //                 "ShopManagerEmail": "sadfasefxzcvzsdv is wrong format"
        //             }
        //         },
        //         {
        //             "row": 17,
        //             "reasons": {
        //                 "ShopManagerEmail": "szxvlkharlegskhvkjhn is wrong format"
        //             }
        //         }
        //     ]
        // }
    ]
}