import { Interview } from "../domain/llm-components/interview";

export class InterviewSessionService {
    // Encapsulated state tracker to isolate runtime domain lifecycles from network requests
    private activeSessions: Map<string, Interview> = new Map();

    /**
     * Initializes a new Voight-Kampff test instance and extracts the initial LLM prompt.
     */
    public async initializeSession(sessionId: string): Promise<string> {
        if (this.activeSessions.has(sessionId)) {
            throw new Error(`Invariance Collision: Session allocation failed. ID '${sessionId}' is already active.`);
        }

        // Factory invocation to decouple instantiation mechanics from the transport layer
        const interview = await Interview.create();
        this.activeSessions.set(sessionId, interview);

        // Fetch the initial prompt frame from the domain
        return await interview.attainLlmQuestion();
    }

    /**
     * Ingests a raw user string, mutates the session transcript state, and computes the next question.
     */
    public async processTurn(sessionId: string, userInput: string): Promise<string> {
        const interview = this.activeSessions.get(sessionId);
        if (!interview) {
            throw new Error(`State Resolution Exception: Session context for ID '${sessionId}' was not found.`);
        }

        // State mutation boundary: domain absorbs raw input string
        interview.attainUserResponse(userInput);

        // Execution of the downstream network/LLM sequence evaluation
        return await interview.attainLlmQuestion();
    }

    /**
     * Explicit garbage collection hook for session termination.
     */
    public terminateSession(sessionId: string): boolean {
        return this.activeSessions.delete(sessionId);
    }
}