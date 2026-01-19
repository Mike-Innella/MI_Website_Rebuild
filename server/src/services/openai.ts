import OpenAI from "openai";
import { env } from "../config/env.js";

if (!env.OPENAI_API_KEY) {
  throw new Error("Missing required env var: OPENAI_API_KEY");
}

export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
