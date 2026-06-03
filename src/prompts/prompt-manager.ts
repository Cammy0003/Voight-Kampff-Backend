import * as prompts from "./interview-prompts";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const stringifyChatMessage = (m: ChatMessage): string => `${m.role}: ${m.content}`;

const stringifyChatMessageArray = (m: ChatMessage[]): string => {
    let res: string = "";
    for (const chatMsg of m){
        res += stringifyChatMessage(chatMsg) + "\n";
    }
    return res;
}

export function getInterviewInstructions(): string {
    let instructions: string = prompts.Interview_Instructions;
    let example1: string = "\nExample Conversation with likely Replicant:\n"
        + stringifyChatMessageArray(prompts.EXAMPLE_TRANSCRIPT_USER);
    let example2: string = "\nExample Conversation with likely Human:\n"
        + stringifyChatMessageArray(prompts.EXAMPLE_TRANSCRIPT_NEW_TOPIC);
    let currentContextHeader: string = "\nCurrent Context of this conversation:\n";
    let res: string = instructions + example1 + example2 + currentContextHeader;
    // console.log(res);
    return res;
}




