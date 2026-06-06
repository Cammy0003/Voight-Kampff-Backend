import {GoogleGenAI} from "@google/genai";
import * as prompts from '../prompts/prompt-manager';

type AttainResponseResult = | { data: string } | { error: string };

export class Interview {
    private _aiClient!: GoogleGenAI;
    private _transcript!: string;
    private _questionCount!: number;

    protected constructor() {}

    public static async create(): Promise<Interview> {
        const instance = new Interview();
        await instance.initializeInterviewClass();
        return instance;
    }

    private async initializeInterviewClass(): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this._transcript = "";
        this._questionCount = 0;
        this._aiClient = await this.initializeGoogleGenAIClient();
    }

    get transcript(): string { return this._transcript; }
    get questionCount(): number { return this._questionCount; }

    private async initializeGoogleGenAIClient(): Promise<GoogleGenAI> {
        const apiKey: string | undefined = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error(
                "CRITICAL FATAL: Local initialization failed. " +
                "Environment variable 'GEMINI_API_KEY' is missing or empty."
            );
        }
        try {
            const client = new GoogleGenAI({ apiKey });
            await client.models.list({});
            this._aiClient = client;
            return this._aiClient;
        } catch (error: any) {
            throw new Error(
                `CRITICAL FATAL: Remote authentication failed with Google Gateways. ` +
                `Reason: ${error.message || error}`
            );
        }
    }

    public async attainLlmQuestion(): Promise<string> {
        const interviewPrompt: string = prompts.getInterviewInstructions();
        const responseResult: AttainResponseResult = await this.LlmResponse(interviewPrompt + this._transcript);
        if ("data" in responseResult){
            this._transcript += prompts.stringifyChatMessage({ role: "assistant", content: responseResult.data }) + '\n';
            this._questionCount++;
            return responseResult.data;
        } else {
            return responseResult.error;
        }
    }

    public attainUserResponse(userInput: string): void {
        let item: prompts.ChatMessage = { role: "user", content: userInput };
        this._transcript += prompts.stringifyChatMessage(item) + '\n';
    }

    private async LlmResponse(message: string): Promise<AttainResponseResult> {
        const maxRetries = 5;
        let attempt = 0;
        try {
            const response = await this._aiClient.models.generateContent({
                model: "gemini-3.5-flash",
                contents: message,
            });
            const textResponse: string = response.text ?? "undefined";
            if (textResponse == "undefined"){
                return { error: "Received an undefined response"};
            }
            return { data: textResponse};
        } catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : "Unknown Error";
            if (errorMessage.includes("503") || errorMessage.includes("429")
                || errorMessage.includes("UNAVAILABLE")) {
                attempt++;
                if (attempt >= maxRetries) {
                    return {error: `Failed after ${maxRetries} attempts. Last error: ${errorMessage}`};
                }
                await this.delayResponse(attempt, maxRetries);
            }
            return {error: errorMessage};
        }

    }

    private async delayResponse(attempt: number, maxRetries: number, baseDelay=2000) {
        const jitter = Math.random() * 1000;
        const delayMs = (baseDelay * Math.pow(2, attempt - 1)) + jitter;
        console.log(`\n[System] Network congestion detected. Retrying in 
        ${(delayMs / 1000).toFixed(1)}s (Attempt ${attempt}/${maxRetries})...`);
        return await new Promise(resolve => setTimeout(resolve, delayMs));
    }

}