import OpenAI from "openai";
import {config} from 'dotenv'
import { HfInference } from "@huggingface/inference";

const HF_ACCESS_TOKEN = "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"

const inference = new HfInference(HF_ACCESS_TOKEN);

config()

const openai = new OpenAI({
  apiKey: "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",
});

const content = (animal) =>  `answer the following question with yes or no: "is  ${animal} a real animal ?"`

// TODO:incorprate highest number
// const content = (animal) =>  ` reply the following question with the highest number only, "which number is higher  ${animal}", i.e if the numbers are 70 and 80 say  " 80" `


export async function talk(animal) {

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: content(animal) }],
        model: "gpt-3.5-turbo",
      }); 

      return chatCompletion
}

export async function GenerateImage(prompt) {

  // const response = await openai.images.generate({
  //   prompt: "stock image of a vampire squid",
  //   n: 1,
  //   size: "1024x1024",
  // });

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1",
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body:{"inputs": "Can you please let us know more details about your "} ,
      }
    )
    .catch(res => console.log(res))
    const result = await response.json();
    return result;
  }
  
 const response = await  query({"inputs": "Can you please let us know more details about your "}).then((response) => {
    console.log(JSON.stringify(response));
  });

//  const response = await inference.questionAnswering({
//   inputs: {
//     context: 'What is the capital of USA?',
//     question: 'Paris is the capital of france'
//   }
// })


  return response;
}

