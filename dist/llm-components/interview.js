"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interview = void 0;
const genai_1 = require("@google/genai");
const prompts = __importStar(require("../prompts/prompt-manager"));
class Interview {
    constructor() { }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new Interview();
            yield instance.initializeInterviewClass();
            return instance;
        });
    }
    initializeInterviewClass() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            this._transcript = "";
            this._questionCount = 0;
            this._aiClient = yield this.initializeGoogleGenAIClient();
        });
    }
    get transcript() { return this._transcript; }
    get questionCount() { return this._questionCount; }
    initializeGoogleGenAIClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("CRITICAL FATAL: Local initialization failed. " +
                    "Environment variable 'GEMINI_API_KEY' is missing or empty.");
            }
            try {
                const client = new genai_1.GoogleGenAI({ apiKey });
                yield client.models.list({});
                this._aiClient = client;
                return this._aiClient;
            }
            catch (error) {
                throw new Error(`CRITICAL FATAL: Remote authentication failed with Google Gateways. ` +
                    `Reason: ${error.message || error}`);
            }
        });
    }
    attainLlmQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            const interviewPrompt = prompts.getInterviewInstructions();
            const responseResult = yield this.LlmResponse(interviewPrompt + this._transcript);
            if ("data" in responseResult) {
                this._transcript += prompts.stringifyChatMessage({ role: "assistant", content: responseResult.data });
                this._questionCount++;
                return responseResult.data;
            }
            else {
                return responseResult.error;
            }
        });
    }
    attainUserResponse(userInput) {
        let item = { role: "user", content: userInput };
        this._transcript += prompts.stringifyChatMessage(item);
    }
    LlmResponse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield this._aiClient.models.generateContent({
                    model: "gemini-3.5-flash",
                    contents: message,
                });
                const textResponse = (_a = response.text) !== null && _a !== void 0 ? _a : "EMPTY";
                if (textResponse == "EMPTY") {
                    return { success: false, error: "Received an undefined response" };
                }
                return { success: true, data: textResponse };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown Error";
                return { success: false, error: errorMessage };
            }
        });
    }
}
exports.Interview = Interview;
