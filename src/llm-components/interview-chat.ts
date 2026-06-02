import {GoogleGenAI} from "@google/genai";
import {Prompts} from '../prompts/prompt-manager';

class InterviewChat {
    readonly ai: GoogleGenAI;
    transcript: string;
    questionCount: number;
    prompt: Prompts;

    constructor(){
        this.ai = new GoogleGenAI({});
        this.transcript = "";
        this.questionCount = 0;
        this.prompt = new Prompts();
    }

    public getQuestion() {
        let interview
    }

}