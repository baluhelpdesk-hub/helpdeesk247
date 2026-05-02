import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
}

class OllamaClient {
  constructor(private readonly baseUrl: string, private readonly model: string) {}

  async generate(
    prompt: string,
    options: { temperature?: number; num_predict?: number } = {}
  ): Promise<string> {
    const body: OllamaGenerateRequest = {
      model: this.model,
      prompt,
      stream: false,
      options: { temperature: options.temperature ?? 0.7, num_predict: options.num_predict ?? 300 },
    };

    const response = await axios.post<OllamaGenerateResponse>(
      `${this.baseUrl}/api/generate`,
      body,
      { timeout: 120_000 }
    );

    return response.data.response;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5_000 });
      const models = response.data?.models ?? [];
      return models.some((m: { name: string }) => m.name.startsWith(this.model));
    } catch {
      return false;
    }
  }
}

export const ollamaClient = new OllamaClient(env.OLLAMA_BASE_URL, env.OLLAMA_MODEL);

export async function checkOllamaHealth() {
  const ready = await ollamaClient.healthCheck();
  if (!ready) {
    logger.warn(
      `Ollama model "${env.OLLAMA_MODEL}" not found at ${env.OLLAMA_BASE_URL}. ` +
      `LLM features will fail. Run: docker exec <ollama-container> ollama pull ${env.OLLAMA_MODEL}`
    );
  } else {
    logger.info(`Ollama ready: model "${env.OLLAMA_MODEL}"`);
  }
}
