import * as p from './domain/prompts/prompt-manager';
import * as inter from './domain/llm-components/interview';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main(): Promise<void> {
    let interview = await inter.Interview.create();

    let convoCount: number = 3;

    for (let _: number = 0; _ < convoCount; _++) {
        const resp = await interview.attainLlmQuestion();
        const aiQuestion: string = p.stringifyChatMessage({role: 'assistant', content: resp});
        console.log(aiQuestion);
        const rl: readline.Interface = readline.createInterface( { input, output });
        try {
            const answer: string = await rl.question("User Response: ");
            const userResponse: string = p.stringifyChatMessage({role: "user", content: answer});
            // console.log(userResponse);
            interview.attainUserResponse(userResponse);
        } catch (err) {
            console.log('error occurred: ', err);
        } finally {
            rl.close();
        }
    }

    console.log("\n ---- INTERVIEW COMPLETE ----");
    console.log(interview.transcript);
}

main();