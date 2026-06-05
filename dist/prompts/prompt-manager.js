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
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyChatMessage = void 0;
exports.getInterviewInstructions = getInterviewInstructions;
const promptTexts = __importStar(require("./interview-prompts"));
const stringifyChatMessage = (m) => `${m.role}: ${m.content}`;
exports.stringifyChatMessage = stringifyChatMessage;
const stringifyChatMessageArray = (m) => {
    let res = "";
    for (const chatMsg of m) {
        res += (0, exports.stringifyChatMessage)(chatMsg) + "\n";
    }
    return res;
};
function getInterviewInstructions() {
    let instructions = promptTexts.Interview_Instructions;
    let example1 = "\nExample Conversation with likely Replicant:\n"
        + stringifyChatMessageArray(promptTexts.EXAMPLE_TRANSCRIPT_USER);
    let example2 = "\nExample Conversation with likely Human:\n"
        + stringifyChatMessageArray(promptTexts.EXAMPLE_TRANSCRIPT_NEW_TOPIC);
    let currentContextHeader = "\nCurrent Context of this conversation:\n";
    let res = instructions + example1 + example2 + currentContextHeader;
    // console.log(res);
    return res;
}
