# TapeTutor IA

Chat com IA que tira dúvidas sobre a técnica de tape para unha encravada (método ONICOTAPE). Feito em Next.js, roda na Vercel e usa o Claude como "cérebro".

## Arquivos
- `lib/instrucoes.js`: a personalidade e a base de conhecimento do agente. **É aqui que você edita o que ele sabe.**
- `app/page.js`: a tela do chat.
- `app/api/chat/route.js`: a parte que conversa com a IA (fica no servidor, a chave não aparece para o usuário).

## Publicar na Vercel
1. Crie a chave da IA em https://console.anthropic.com → **API Keys** → **Create Key**. Copie e guarde (começa com `sk-ant-`). Adicione créditos em **Billing**.
2. Entre em https://vercel.com com a conta do GitHub.
3. **Add New… → Project** e importe o repositório `paineldeconteudo`.
4. Em **Root Directory**, clique em **Edit** e escolha a pasta `tapetutor`. O Framework deve aparecer como **Next.js**.
5. Em **Environment Variables**, adicione `ANTHROPIC_API_KEY` com a chave do passo 1.
6. Clique em **Deploy**. Em cerca de 1 minuto sai o link `https://….vercel.app`.

Para atualizar: edite os arquivos no GitHub e faça commit na branch publicada. A Vercel publica de novo sozinha.

## Rodar no computador (opcional)
```bash
cd tapetutor
cp .env.example .env.local   # e coloque sua chave nele
npm install
npm run dev                  # abre em http://localhost:3000
```
