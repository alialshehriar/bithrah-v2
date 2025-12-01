import { invokeLLM } from "./server/_core/llm.js";

const response = await invokeLLM({
  messages: [
    { role: "user", content: "مرحبا" }
  ]
});

console.log("Success:", response.choices[0].message.content);
