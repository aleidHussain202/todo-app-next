/**
 * Represents a single task in the to-do list.
 */
export interface Todo {
    /** Unique identifier for the task, typically a UUID */
    id: string;
    /** The main text content of the task */
    text: string;
    /** Boolean flag indicating if the task is finished */
    completed: boolean;
    /** Unix timestamp (ms) of when the task was created */
    createdAt: number;
}