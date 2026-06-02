import * as prompts from "./interview-prompts";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class Prompts {
    context: string;

    constructor() {
        this.context = "";
    }

    public updateContext(context: string): void {
        this.context = context;
    }

    public getInterviewInstructions(): string {
        let instructions: string = prompts.Interview_Instructions;
        let example1: string = "\nExample Conversation with Replicant:\n" + prompts.EXAMPLE_TRANSCRIPT_USER;
        let example2: string = "\nExample Conversation with Human:\n" + prompts.EXAMPLE_TRANSCRIPT_NEW_TOPIC;
        let currentContext: string = "\nCurrent Context of this conversation:\n" + this.context;
        return instructions + example1 + example2 + currentContext;
    }

}