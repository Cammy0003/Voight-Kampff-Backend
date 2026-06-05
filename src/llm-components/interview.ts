import {GoogleGenAI} from "@google/genai";
import * as prompts from '../prompts/prompt-manager';

type AttainResponseResult =
    | { success: true; data: string }
    | { success: false; error: string };

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
            this._transcript += prompts.stringifyChatMessage({ role: "assistant", content: responseResult.data });
            this._questionCount++;
            return responseResult.data;
        } else {
            return responseResult.error;
        }
    }

    public attainUserResponse(userInput: string): void {
        let item: prompts.ChatMessage = { role: "user", content: userInput };
        this._transcript += prompts.stringifyChatMessage(item);
    }

    private async LlmResponse(message: string): Promise<AttainResponseResult> {
        try {
            const response = await this._aiClient.models.generateContent({
                model: "gemini-3.5-flash",
                contents: message,
            });
            const textResponse: string = response.text ?? "EMPTY";
            if (textResponse == "EMPTY"){
                return { success: false, error: "Received an undefined response" }
            }
            return { success: true, data: textResponse };
        } catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : "Unknown Error";
            return { success: false, error: errorMessage };
        }
    }

}