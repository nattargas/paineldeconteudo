# Painel de Conteúdo — Natália Targas

Painel para acompanhar as peças de conteúdo dos perfis **Clínica** e **Profissional**, do roteiro pronto até a performance.

## Visões
- **Resumo:** números gerais, alertas dos próximos 5 dias, etapas de produção, resumo da semana e top 3 por compartilhamento e salvamento.
- **Produção:** quadro kanban com as etapas da especificação, com filtros por perfil, formato, tipo e responsável.
- **Calendário:** mês a mês, com status de cada peça, e a lista das peças sem data fixa (cadência, reservas, janelas de anúncio).
- **Pendências:** autorizações e ajustes, com checklist.
- **Pauta de gravação:** reels ainda não gravados, agrupados por local ou por quem grava.
- **Performance:** médias por avatar, produto, série, template/gatilho, formato e dia da semana, além do ranking das peças.
- **Instagram:** sincroniza as métricas dos posts pelo conector Genna, sugere a peça de cada post e grava as métricas em D+1, D+7 ou D+30.
- **Anúncios:** investimento, CPM, CTR, frequência, custo por conversa ou por venda, ROAS e a sugestão de troca a cada 15 dias.

Toque em qualquer peça para ler o roteiro (texto falado, CTAs e legenda, com botões de copiar) e para editar a etapa, o responsável, as pendências, a gravação, os links, as métricas (D+1, D+7 e D+30, ou semanas de anúncio) e as observações. O botão **+ Nova peça** cadastra novas séries e códigos.

## Arquivos
- `index.html`: o painel inteiro, em um único arquivo.
- `dados/inventario.json`: as 94 peças iniciais, geradas a partir de `dados/inventario_pecas.csv`, com os roteiros.
- `dados/roteiros.json`: os 72 roteiros extraídos de `docs/roteiros-semana-1.pdf`, por código.
- `docs/especificacao.pdf`: a especificação original.

## Onde os dados ficam
- Pelo link publicado no Claude, os dados ficam num banco compartilhado e sincronizam entre aparelhos.
- Aberto fora do Claude (por exemplo, pelo GitHub Pages), o painel funciona em modo local e salva as alterações só naquele navegador.
