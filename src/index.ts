import * as p from './prompts/prompt-manager';
import * as inter from './llm-components/interview';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main(): Promise<void> {
    let interview: inter.Interview = new inter.Interview();

    let convoCount: number = 5;

    for (let _: number = 0; _ < convoCount; _++) {
        let resp: Promise<string> = interview.attainLlmQuestion();
        resp.then((str) => {
            console.log(str);
        })
        const rl: readline.Interface = readline.createInterface( { input, output });
        try {
            const answer: string = await rl.question("User Response: ");
            console.log(p.stringifyChatMessage({role: "user", content: answer}));
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