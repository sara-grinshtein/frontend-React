export type MessageType = {
       message_id: number;
    volunteer_id: number | null;
    helped_id: number;
    isDone: boolean;
    description: string;
    confirmArrival?: boolean;
}
