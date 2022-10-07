import { inspect } from "util";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function deep_log(obj: any) {
  console.log(inspect(obj, { showHidden: false, depth: null, colors: true }));
}


export const prompt = (prompt: string) => {
  return new Promise<string>((resolve,_reject) => {
    rl.question(prompt, (value) => {
      resolve(value)
    })
  })

}