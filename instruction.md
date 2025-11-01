🎯 Objetivo

Criar uma plataforma totalmente automatizada, transparente e segura, onde os prêmios e sorteios sejam feitos com base em transações registradas na blockchain Solana, e os pagamentos sejam automáticos.
Já tenho a integração com a rede solana, não precisa criar nada relacionado a rede solana, apenas a parte de frontend e backend.
Quero usar Drizzle + PostgreSQL com minha aplicação nuxt + tailwindcss + shadcn + typescript.

⸻

🧩 Funcionalidades Principais

🪙 1. Sistema de Saldo
  •  Cada usuário tem uma carteira interna (saldo no site).
  •  O saldo é atualizado automaticamente após a confirmação on-chain.
  •  Também é possível sacar o saldo manualmente (enviado de volta para a carteira do usuário).

⸻

🎟 2. Rifas Simultâneas
  •  Várias rifas podem estar ativas ao mesmo tempo.
  •  Uma delas é marcada como “Rifa Principal” (em destaque na página inicial).
  •  Outras rifas aparecem em uma seção secundária, com prêmios menores.
  •  Cada rifa mostra:
  •  Nome e imagem do prêmio
  •  Valor do prêmio em USDT ou SOL
  •  Tempo restante (contador regressivo)
  •  Valor arrecadado até o momento
  •  Status (ativa / encerrada / aguardando sorteio)

⸻

🔢 3. Tickets Infinitos
  •  Não há limite fixo de tickets — os usuários podem comprar quantos quiserem.
  •  O usuário escolhe quantos tickets deseja e confirma a compra com saldo.
  •  Cada ticket gera um número aleatório único vinculado à conta do usuário.
  •  O sistema registra automaticamente todos os números de cada participante.

⸻

⏳ 4. Duração e Condição de Encerramento
  •  Cada rifa tem um prazo inicial (ex: 7 dias).
  •  Condição de encerramento: a rifa só é sorteada quando o valor arrecadado for pelo menos o dobro (2x) do valor do prêmio.
  •  Exemplo: prêmio de 100 USDT → precisa arrecadar 200 USDT.
  •  Se o prazo terminar e o valor mínimo não for atingido, o prazo é estendido automaticamente até a meta ser atingida.

⸻

🎰 5. Sorteio Automático
  •  Quando o valor arrecadado atingir 2x o valor do prêmio, o sistema agenda o sorteio para 24h após o atingimento da meta.
  •  O sorteio é feito de forma on-chain, usando um gerador de número aleatório descentralizado (ex: Chainlink VRF).
  •  O vencedor é escolhido automaticamente e o prêmio é transferido diretamente para a carteira Phantom vinculada à conta.

⸻

💵 6. Recompensas e Prêmios
  •  Prêmios pagos em SOL ou USDT (Solana), conforme definido na criação da rifa.
  •  Transferência automática via smart contract após o sorteio.
  •  Histórico de prêmios e vencedores visível publicamente no site, com link da transação na blockchain (transparência total).

⸻

👤 7. Painel do Usuário
  •  Mostrar:
  •  Saldo atual
  •  Tickets comprados
  •  Rifas em que está participando
  •  Rifas ganhas
  •  Histórico de depósitos e saques

⸻

⚙️ 8. Painel Administrativo
  •  Criar e editar rifas (imagem, prêmio, valor, moeda, duração, meta, etc.)
  •  Controlar status das rifas (ativa, pausada, finalizada)
  •  Visualizar todos os participantes e arrecadação
  •  Aprovar manualmente saques se necessário
  •  Acompanhar logs on-chain (transações, depósitos, prêmios pagos)

⸻

🧠 9. Experiência do Usuário (UX/UI)
  •  Design limpo e moderno, estilo “Web3 raffle”.
  •  Interface responsiva para celular e desktop.
  •  Página principal com rifas em destaque e contador em tempo real.

⸻

🔒 10. Segurança e Transparência
  •  Todos os depósitos, compras e prêmios são registrados na blockchain Solana.
  •  Código de sorteio open-source (auditoria pública).
  •  Links diretos para transações via Solscan.
  •  Sistema antifraude (não permite alterar rifas ou tickets após criados).

⸻

- JSDdoc em tudo que for possível, com o máximo de detalhes possíveis;
- Suporte a multi idiomas facilmente;
- Suporte a multi moedas facilmente;
- Idiomas iniciais: Brasileiro (BR), Inglês (US), Espanhol (MX);
- Moedas iniciais: USDT, SOL, BRL;
- Suporte a multi wallets facilmente;
- Wallets iniciais: Phantom, Solana Wallet, MetaMask, Trust Wallet, Coinbase Wallet, Ledger, Trezor, Exodus, Coinomi, Guarda, Nova Wallet, BitKeep, Bitpie, Trust Wallet, Coinbase Wallet, Ledger, Trezor, Exodus, Coinomi, Guarda, Nova Wallet, BitKeep, Bitpie;
- Suporte a multi blockchains facilmente;
- Blockchains iniciais: Solana;
