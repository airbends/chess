"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateTrick = action({
  args: {},
  handler: async (ctx, args) => {
    const prompt = `Generate a creative chess trick for students. Respond in JSON with keys: title, description, moves. Example:
{
  "title": "The Knight Fork",
  "description": "A classic tactic where a knight attacks two or more pieces at once.",
  "moves": "e4, Nf3, Nc3, Nd5"
}
Only output valid JSON.`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.8,
    });

    const content = resp.choices[0].message.content;
    try {
      const json = JSON.parse(content!);
      if (
        typeof json.title === "string" &&
        typeof json.description === "string" &&
        typeof json.moves === "string"
      ) {
        return json;
      }
      throw new Error("Invalid AI response");
    } catch (e) {
      throw new Error("Failed to parse AI response: " + content);
    }
  },
});
