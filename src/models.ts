import { CliError } from "./error";
import { getOllamaModels } from "./ollama";

export type ModelInfo = { id: string; realId?: string }

export const MODEL_MAP: {
  [prefix: string]: ModelInfo[]
} = {
  gpt: [
    {
      id: "gpt-4o",
    },
    {
      id: "gpt-4o-mini",
    },
    {
      id: "gpt-4.5-preview",
    },
    {
      id: "gpt-4-turbo",
    },
    {
      id: "gpt-3.5-turbo",
    },
  ],
  openai: [
    {
      id: "openai-o1",
    },
    {
      id: "openai-o1-mini",
    },
    {
      id: "openai-o3-mini",
    },
  ],
  claude: [
    {
      id: "claude-3.7-sonnet",
      realId: "claude-3-7-sonnet-20250219",
    },
    {
      id: "claude-3.7-haiku",
      realId: "claude-3-7-haiku-20250219",
    },
    {
      id: "claude-3.5-sonnet",
      realId: "claude-3-5-sonnet-20241022",
    },
    {
      id: "claude-3.5-haiku",
      realId: "claude-3-5-haiku-20241022",
    },
    {
      id: "claude-3-opus",
      realId: "claude-3-opus-20240229",
    },
    {
      id: "claude-3-sonnet",
      realId: "claude-3-sonnet-20240229",
    },
    {
      id: "claude-3-haiku",
      realId: "claude-3-haiku-20240307",
    },
  ],
  gemini: [
    {
      id: "gemini-2.0-flash",
    },
    {
      id: "gemini-2.0-flash-lite-preview",
    },
    {
      id: "gemini-2.0-pro-exp-02-05",
    },
    {
      id: "gemini-1.5-pro",
    },
    {
      id: "gemini-1.5-flash",
    },
    {
      id: "gemini-2.0-flash-thinking-exp-1219",
    },
  ],
  groq: [
    {
      id: "groq-llama-3.3-70b",
      realId: "llama-3.3-70b-versatile",
    },
    {
      id: "groq-deepseek-r1-70b",
      realId: "deepseek-r1-distill-llama-70b",
    },
    {
      id: "groq-llama-3.1-70b",
      realId: "llama-3.1-70b-versatile",
    },
    {
      id: "groq-llama-3.1-8b",
      realId: "llama-3.1-8b-instant",
    },
    {
      id: "groq-mixtral-8x7b",
      realId: "mixtral-8x7b-32768",
    },
  ],
  copilot: [
    {
      id: "copilot-gpt-4o",
      realId: "gpt-4o",
    },
    {
      id: "copilot-o1",
      realId: "o1",
    },
    {
      id: "copilot-o1-mini",
      realId: "o1-mini",
    },
    {
      id: "copilot-o3-mini",
      realId: "o3-mini",
    },
    {
      id: "copilot-claude-3.7-sonnet",
      realId: "claude-3.7-sonnet",
    },
    {
      id: "copilot-claude-3.5-sonnet",
      realId: "claude-3.5-sonnet",
    },
  ],
}

export const MODELS = Object.values(MODEL_MAP).flat()

export const MODEL_PREFIXES = Object.keys(MODEL_MAP)

export async function getAllModels(includeOllama?: boolean | "required") {
  let models = [...MODELS]

  if (includeOllama) {
    const ollamaModels = await getOllamaModels()
    if (ollamaModels.length === 0 && includeOllama === "required") {
      throw new CliError("no Ollama models available")
    }
    models = [...models, ...ollamaModels]
  }

  return models
}

export function getCheapModelId(modelId: string) {
  if (modelId.startsWith("gpt-")) return "gpt-4o-mini"

  if (modelId.startsWith("claude-")) return "claude-3-haiku-20240307"

  if (modelId.startsWith("gemini-")) return "gemini-1.5-flash"

  if (modelId.startsWith("groq-")) return "llama-3.1-8b-instant"

  if (modelId.startsWith("copilot-")) return "copilot-gpt-4o"

  if (modelId.startsWith("openai-")) return "gpt-4o-mini"

  return modelId
}

export function toProviderModelId(modelId: string) {
  if (modelId.startsWith("groq-")) {
    return modelId.replace("groq-", "")
  }
  return modelId
}
