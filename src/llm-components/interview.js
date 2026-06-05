"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interview = void 0;
var genai_1 = require("@google/genai");
var prompts = require("../prompts/prompt-manager");
var Interview = /** @class */ (function () {
    function Interview() {
    }
    Interview.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new Interview();
                        return [4 /*yield*/, instance.initializeInterviewClass()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    Interview.prototype.initializeInterviewClass = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        _b.sent();
                        this._transcript = "";
                        this._questionCount = 0;
                        _a = this;
                        return [4 /*yield*/, this.initializeGoogleGenAIClient()];
                    case 2:
                        _a._aiClient = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Interview.prototype, "transcript", {
        get: function () { return this._transcript; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Interview.prototype, "questionCount", {
        get: function () { return this._questionCount; },
        enumerable: false,
        configurable: true
    });
    Interview.prototype.initializeGoogleGenAIClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey, client, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiKey = process.env.GEMINI_API_KEY;
                        if (!apiKey) {
                            throw new Error("CRITICAL FATAL: Local initialization failed. " +
                                "Environment variable 'GEMINI_API_KEY' is missing or empty.");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        client = new genai_1.GoogleGenAI({ apiKey: apiKey });
                        return [4 /*yield*/, client.models.list({})];
                    case 2:
                        _a.sent();
                        this._aiClient = client;
                        return [2 /*return*/, this._aiClient];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("CRITICAL FATAL: Remote authentication failed with Google Gateways. " +
                            "Reason: ".concat(error_1.message || error_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Interview.prototype.attainLlmQuestion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var interviewPrompt, responseResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        interviewPrompt = prompts.getInterviewInstructions();
                        return [4 /*yield*/, this.LlmResponse(interviewPrompt + this._transcript)];
                    case 1:
                        responseResult = _a.sent();
                        if ("data" in responseResult) {
                            this._transcript += prompts.stringifyChatMessage({ role: "assistant", content: responseResult.data });
                            this._questionCount++;
                            return [2 /*return*/, responseResult.data];
                        }
                        else {
                            return [2 /*return*/, responseResult.error];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Interview.prototype.attainUserResponse = function (userInput) {
        var item = { role: "user", content: userInput };
        this._transcript += prompts.stringifyChatMessage(item);
    };
    Interview.prototype.LlmResponse = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var response, textResponse, error_2, errorMessage;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._aiClient.models.generateContent({
                                model: "gemini-3.5-flash",
                                contents: message,
                            })];
                    case 1:
                        response = _b.sent();
                        textResponse = (_a = response.text) !== null && _a !== void 0 ? _a : "EMPTY";
                        if (textResponse == "EMPTY") {
                            return [2 /*return*/, { success: false, error: "Received an undefined response" }];
                        }
                        return [2 /*return*/, { success: true, data: textResponse }];
                    case 2:
                        error_2 = _b.sent();
                        errorMessage = error_2 instanceof Error ? error_2.message : "Unknown Error";
                        return [2 /*return*/, { success: false, error: errorMessage }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Interview;
}());
exports.Interview = Interview;
