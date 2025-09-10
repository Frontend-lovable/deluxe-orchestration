import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export interface BedrockCreds {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  region: string;
  modelId: string;
}

export async function invokeClaude({
  creds,
  messages,
  maxTokens,
  temperature,
}: {
  creds: BedrockCreds;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const client = new BedrockRuntimeClient({
    region: creds.region,
    credentials: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
    },
  });

  // If using Claude v2/v2:1 on Bedrock, use the legacy prompt format
  const isClaude2 = /^anthropic\.claude-v2(?::1)?$/.test(creds.modelId);

  const command = new InvokeModelCommand({
    modelId: creds.modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(
      isClaude2
        ? {
            prompt: buildPromptFromMessages(messages),
            max_tokens_to_sample: maxTokens ?? 500,
            temperature: temperature ?? 0.7,
          }
        : {
            anthropic_version: "bedrock-2023-05-31",
            messages: messages.map((m) => ({
              role: m.role,
              content: [{ type: "text", text: m.content }],
            })),
            max_tokens: maxTokens ?? 800,
            temperature: temperature ?? 0.2,
          }
    ),
  });

  const resp = await client.send(command);
  const jsonStr = typeof resp.body === "string" ? resp.body : new TextDecoder().decode(resp.body as any);
  const data = JSON.parse(jsonStr);

  if (isClaude2) {
    // Legacy Anthropic response shape
    return data?.completion ?? "";
  }
  // Messages API shape
  return data?.content?.[0]?.text ?? "";
}

function buildPromptFromMessages(ms: { role: "user" | "assistant"; content: string }[]): string {
  const lines: string[] = [];
  for (const m of ms) {
    if (m.role === "user") lines.push(`\n\nHuman: ${m.content}`);
    else lines.push(`\n\nAssistant: ${m.content}`);
  }
  lines.push("\n\nAssistant:");
  return lines.join("");
}
