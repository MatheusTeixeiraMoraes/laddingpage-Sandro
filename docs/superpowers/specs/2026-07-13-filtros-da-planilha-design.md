# Filtros vindos da planilha do Sandro — decisão

**Data:** 13/07/2026
**Fonte:** `Material Sandro/Empreendimentos informações.xlsx`, aba **TODOS EMPREENDIMENTOS**
(88 imóveis reais, 22 colunas). As demais abas são recortes manuais da mesma tabela.

**Status:** decidido o QUE vira filtro. A importação em si fica para quando a
planilha for subida.

---

## O que a própria planilha já dizia

As abas que o Sandro mantém à mão **são** os filtros que ele usa:

| Abas dele | Filtro correspondente |
|---|---|
| `ZONA LESTE`, `NORTE`, `ZONA SUL`, `ZONA OESTE`, `CENTRAL` | Região |
| `Prontos`, `2026`, `2027`, `2028`, `2029` | Prazo de entrega |
| `1 DORMITÓRIO`, `3 DORMITÓRIOS` | Dormitórios |
| `QUINTAL` | Quintal |

Os três primeiros já estão no ar. O quarto entra agora.

## Poder de discriminação (por que cada coluna entrou ou não)

Um filtro só vale se divide a lista. Sobre os 88 imóveis:

| Coluna | Divisão | Decisão |
|---|---|---|
| SUÍTE | 44 sim / 42 não | **Filtro** — divisão mais equilibrada da planilha |
| QUINTAL | 57 sim / 29 não | **Filtro** |
| VARANDA | 66 sim / 20 não | **Filtro** |
| GARAG. COB | 33 sim / 53 não | **Filtro** |
| ELEVADORES | 73 com / 12 sem | **Filtro** (a pedido do cliente; os dados dizem que rende pouco — 86% têm) |
| P. AR COND. | 1 (33) · 2 (29) · 3 (18) | **Filtro** (a pedido do cliente) |
| ENTREGA COM PISO | 45 completo / 32 só áreas molhadas | Fora (recomendado, não escolhido) |
| DOCUMENTAÇÃO | 33 grátis / 30 pago | Fora (recomendado, não escolhido) |
| VAGA DUPLA | 19 sim / 66 não | Fora — nicho |
| FAIXA / RENDA IDEAL | 76% / 71% preenchidas, formato sujo | Fora por ora — ver "Bloqueios" |
| Construtora | 37 valores distintos | Fora — lista grande demais; lead não escolhe por construtora |
| Torres, Andares, Ap/Andar | — | Fora — informação de ficha, não de busca |
| ENDEREÇO | — | Fora — alimenta o mapa, não o filtro |

## Desenho final da busca

**Barra principal (já no ar):** Região · Entrega · Dormitórios · Valor (mín/máx) · Área (mín/máx).

**Painel "Mais filtros" (a construir):**

| Filtro | Controle | Origem |
|---|---|---|
| Suíte | caixa "Com suíte" | `SUÍTE` |
| Quintal | caixa "Com quintal" | `QUINTAL` |
| Varanda | caixa "Com varanda" | `VARANDA` |
| Garagem coberta | caixa "Com garagem coberta" | `GARAG. COB` |
| Elevador | caixa "Com elevador" | `ELEVADORES` > 0 |
| Ar-condicionado | seletor 1+ / 2+ / 3+ pontos | `P. AR COND.` |

Caixa marcada = exige ter. Caixa vazia = não filtra (ninguém procura "sem varanda").

## Bloqueios — precisam do Sandro ANTES da importação

Nenhum é impeditivo para decidir os filtros, mas todos travam a importação:

1. **m² e quartos não pareiam.** O Apoena tem `93/97/ e 99` m² e `2 e 3` quartos, e
   **um único** "a partir de". Não dá para saber qual metragem tem 2 quartos, qual
   tem 3, nem o preço de cada uma. Nosso modelo guarda planta a planta (m² + dorms
   + preço juntos). Ou o Sandro pareia, ou o modelo passa a guardar faixa de m²,
   lista de dorms e um preço "a partir de" por empreendimento.
2. **17 dos 88 sem preço** (Harmony, Mirage, Portugal fase 1/2/3…). Sumiriam de
   qualquer filtro de valor.
3. **Entrega bagunçada:** 6 imóveis dizem `36 MESES` (a partir de quando?), um diz
   `ju/29`, um está vazio.
4. **Regiões não batem:** a planilha tem 11 valores, incluindo **Votorantim** (outra
   cidade) e combinações (`Norte/Central`, `Leste/Indust`). O site tem 5 zonas.

Também: as linhas de cabeçalho se repetem 3× dentro da aba (separadores de seção) —
a importação precisa ignorá-las.
