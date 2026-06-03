import {GoogleGenAI} from "@google/genai";
import * as prompts from '../prompts/prompt-manager';

type AttainResponseResult =
    | { success: true; data: string }
    | { success: false; error: string };



class InterviewChat {
    readonly aiClient: GoogleGenAI;
    transcript: string;
    questionCount: number;

    constructor(){
        this.aiClient = new GoogleGenAI({});
        this.transcript = "";
        this.questionCount = 0;
    }

    public async getQuestion(): Promise<string> {
        let interviewPrompt: string = prompts.getInterviewInstructions();
        let responseResult: AttainResponseResult = await this.LlmResponse(interviewPrompt + this.transcript);
        return responseResult.success ? responseResult.data : responseResult.error;
    }


    private async LlmResponse(message: string): Promise<AttainResponseResult> {
        try {
            const response = await this.aiClient.models.generateContent({
                model: "gemini-3.5-flash",
                contents: message,
            });
            const textResponse: string = response.text ?? "EMPTY";
            if (textResponse == "EMPTY"){
                return { success: false, error: "Received an undefined response" }
            }
            this.transcript += textResponse + '\n';
            this.questionCount++;
            return { success: true, data: textResponse };
        } catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : "Unknown Error";
            return { success: false, error: errorMessage };
        }
    }






}