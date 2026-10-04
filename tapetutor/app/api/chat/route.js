import Anthropic from "@anthropic-ai/sdk";
import { INSTRUCOES } from "../../../lib/instrucoes";

// Lê a chave de ANTHROPIC_API_KEY (cadastrada na Vercel).
const client = new Anthropic();

export const maxDuration = 60;

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "Falta a chave ANTHROPIC_API_KEY. Cadastre em Vercel → Settings → Environment Variables e faça um novo deploy.",
      { status: 500 },
    );
  }

  const { messages } = await req.json().catch(() => ({}));

  // Aceita só o formato esperado: [{ role: "user" | "assistant", content: "texto" }]
  const historico = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .slice(-30);

  if (!historico.length || historico[historico.length - 1].role !== "user") {
    return new Response("Mensagem inválida.", { status: 400 });
  }

  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "medium" },
    // Se o modelo recusar um pedido, a própria API tenta de novo com o modelo reserva recomendado.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [
      { type: "text", text: INSTRUCOES, cache_control: { type: "ephemeral" } },
    ],
    messages: historico,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nNão consigo ajudar com esse pedido. Tente reformular a pergunta.",
            ),
          );
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("\n\n(Resposta cortada por tamanho.)"));
        }
      } catch (err) {
        console.error(err);
        const msg =
          err instanceof Anthropic.AuthenticationError
            ? "Chave da API inválida ou ausente. Confira ANTHROPIC_API_KEY na Vercel."
            : err instanceof Anthropic.RateLimitError
              ? "Muitas perguntas ao mesmo tempo. Espere alguns segundos e tente de novo."
              : "Ocorreu um erro ao responder. Tente de novo.";
        controller.enqueue(encoder.encode(`\n\n${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
