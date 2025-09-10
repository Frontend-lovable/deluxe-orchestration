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
}: {
  creds: BedrockCreds;
  messages: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const client = new BedrockRuntimeClient({
    region: creds.region,
    credentials: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
    },
  });

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    messages: messages.map((m) => ({
      role: m.role,
      content: [{ type: "text", text: m.content }],
    })),
    max_tokens: 800,
    temperature: 0.2,
  };

  const command = new InvokeModelCommand({
    modelId: creds.modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const resp = await client.send(command);
  const jsonStr = typeof resp.body === "string" ? resp.body : new TextDecoder().decode(resp.body as any);
  const data = JSON.parse(jsonStr);
  const text: string = data?.content?.[0]?.text ?? "";
  return text;
}
