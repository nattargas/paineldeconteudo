"use client";

import { useEffect, useRef, useState } from "react";

const SUGESTOES = [
  "Como aplico o tape numa unha encravada leve?",
  "Quando o tape não é indicado?",
  "Quanto tempo o tape deve ficar?",
];

export default function Home() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimRef = useRef(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar(pergunta) {
    const conteudo = (pergunta ?? texto).trim();
    if (!conteudo || carregando) return;

    const historico = [...mensagens, { role: "user", content: conteudo }];
    setMensagens([...historico, { role: "assistant", content: "" }]);
    setTexto("");
    setCarregando(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historico }),
      });
      if (!resp.ok || !resp.body) throw new Error(await resp.text());

      const leitor = resp.body.getReader();
      const decoder = new TextDecoder();
      let resposta = "";
      while (true) {
        const { done, value } = await leitor.read();
        if (done) break;
        resposta += decoder.decode(value, { stream: true });
        setMensagens([...historico, { role: "assistant", content: resposta }]);
      }
    } catch (err) {
      setMensagens([
        ...historico,
        {
          role: "assistant",
          content: err?.message || "Não consegui responder agora. Tente de novo.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="app">
      <header>
        <h1>TapeTutor IA</h1>
        <p>Seu tutor da técnica de tape para unha encravada</p>
      </header>

      <section className="conversa">
        {mensagens.length === 0 && (
          <div className="sugestoes">
            {SUGESTOES.map((s) => (
              <button key={s} onClick={() => enviar(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {mensagens.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content || (carregando ? "Pensando…" : "")}
          </div>
        ))}
        <div ref={fimRef} />
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar();
            }
          }}
          placeholder="Escreva sua dúvida…"
          rows={2}
        />
        <button type="submit" disabled={carregando || !texto.trim()}>
          Enviar
        </button>
      </form>
    </main>
  );
}
