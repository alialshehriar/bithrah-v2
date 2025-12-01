import { describe, it, expect } from "vitest";
import { invokeLLM } from "./_core/llm";

describe("OpenAI API Integration", () => {
  it("should successfully call OpenAI API with valid key", async () => {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'Hello' in one word." },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0].message).toBeDefined();
    expect(response.choices[0].message.content).toBeDefined();
    expect(typeof response.choices[0].message.content).toBe("string");
  }, 30000); // 30 second timeout for API call

  it("should return structured JSON response", async () => {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a helpful assistant designed to output JSON." },
        { role: "user", content: 'Return JSON with a single field "test" set to "success"' },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "test_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              test: { type: "string" },
            },
            required: ["test"],
            additionalProperties: false,
          },
        },
      },
    });

    expect(response).toBeDefined();
    expect(response.choices[0].message.content).toBeDefined();
    
    const content = typeof response.choices[0].message.content === "string" 
      ? response.choices[0].message.content 
      : JSON.stringify(response.choices[0].message.content);
    
    const parsed = JSON.parse(content);
    expect(parsed.test).toBe("success");
  }, 30000);
});
