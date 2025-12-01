import { invokeLLM } from "./dist/index.js";

console.log("Testing LLM...");

try {
  const response = await invokeLLM({
    messages: [
      { role: "user", content: "Say 'test successful' in Arabic" }
    ]
  });
  
  console.log("✅ Success!");
  console.log("Response:", response.choices[0].message.content);
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
}
