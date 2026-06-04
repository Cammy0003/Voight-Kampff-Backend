"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyChatMessage = void 0;
exports.getInterviewInstructions = getInterviewInstructions;
var promptTexts = require("./interview-prompts");
var stringifyChatMessage = function (m) { return "".concat(m.role, ": ").concat(m.content); };
exports.stringifyChatMessage = stringifyChatMessage;
var stringifyChatMessageArray = function (m) {
    var res = "";
    for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
        var chatMsg = m_1[_i];
        res += (0, exports.stringifyChatMessage)(chatMsg) + "\n";
    }
    return res;
};
function getInterviewInstructions() {
    var instructions = promptTexts.Interview_Instructions;
    var example1 = "\nExample Conversation with likely Replicant:\n"
        + stringifyChatMessageArray(promptTexts.EXAMPLE_TRANSCRIPT_USER);
    var example2 = "\nExample Conversation with likely Human:\n"
        + stringifyChatMessageArray(promptTexts.EXAMPLE_TRANSCRIPT_NEW_TOPIC);
    var currentContextHeader = "\nCurrent Context of this conversation:\n";
    var res = instructions + example1 + example2 + currentContextHeader;
    // console.log(res);
    return res;
}
