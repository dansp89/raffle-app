/**
 * @fileoverview Tipos e interfaces TypeScript para o sistema de rifas
 * @module types/raffle
 * @author Raffle System
 */

/**
 * Enum para o status de uma rifa
 * @enum {string}
 */
export enum RaffleStatus {
  /** Rifa ativa e aceitando tickets */
  ACTIVE = 'active',
  /** Rifa pausada temporariamente */
  PAUSED = 'paused',
  /** Rifa encerrada e aguardando sorteio */
  ENDED = 'ended',
  /** Rifa sorteada e finalizada */
  FINISHED = 'finished',
  /** Rifa aguardando sorteio após atingir meta */
  PENDING_DRAW = 'pending_draw',
  /** Rifa cancelada */
  CANCELLED = 'cancelled',
}

/**
 * Enum para moedas suportadas
 * @enum {string}
 */
export enum Currency {
  SOL = 'SOL',
  USDT = 'USDT',
  BRL = 'BRL',
}

/**
 * Enum para roles de usuário
 * @enum {string}
 */
export enum UserRole {
  /** Administrador - acesso total */
  ADMIN = 'admin',
  /** Financeiro - gestão financeira */
  FINANCIAL = 'financial',
  /** Suporte - atendimento ao cliente */
  SUPPORT = 'support',
  /** Cliente - usuário comum */
  CLIENT = 'client',
}

/**
 * Interface para uma rifa
 * @interface Raffle
 */
/**
 * Interface para mídia da rifa (imagem ou vídeo)
 * @interface RaffleMedia
 */
export interface RaffleMedia {
  /** ID único da mídia */
  id: string
  /** URL da mídia */
  url: string
  /** Tipo de mídia */
  type: 'image' | 'video'
  /** Ordem de exibição */
  order: number
  /** Nome do arquivo original */
  filename?: string
  /** Tamanho do arquivo em bytes */
  size?: number
}

export interface Raffle {
  /** ID único da rifa (UUID) */
  id: string
  /** Slug amigável para URLs públicas */
  slug: string
  /** Nome/título da rifa */
  name: string
  /** Descrição do prêmio */
  description: string
  /** URL da imagem do prêmio (mantida para compatibilidade) */
  imageUrl: string
  /** Lista de imagens da rifa */
  images: RaffleMedia[]
  /** Lista de vídeos da rifa */
  videos: RaffleMedia[]
  /** Valor do prêmio */
  prizeAmount: number
  /** Moeda do prêmio (SOL, USDT ou BRL) */
  prizeCurrency: Currency
  /** Valor arrecadado até o momento */
  collectedAmount: number
  /** Preço por ticket */
  ticketPrice: number
  /** Data de início da rifa */
  startDate: Date
  /** Data de término original (pode ser estendida) */
  endDate: Date
  /** Duração inicial em dias */
  durationDays: number
  /** Meta de arrecadação (2x o valor do prêmio) */
  targetAmount: number
  /** Status atual da rifa */
  status: RaffleStatus
  /** Se esta é a rifa principal (destaque) */
  isMain: boolean
  /** Data em que a meta foi atingida (null se ainda não atingiu) */
  targetReachedDate: Date | null
  /** Data agendada para o sorteio (24h após atingir meta) */
  scheduledDrawDate: Date | null
  /** ID do vencedor (null se ainda não sorteada) */
  winnerId: string | null
  /** Endereço da carteira do vencedor */
  winnerWallet: string | null
  /** Link da transação do prêmio na blockchain */
  prizeTransactionHash: string | null
  /** Link para visualizar no Solscan */
  solscanUrl: string | null
  /** Total de tickets vendidos */
  totalTicketsSold: number
  /** Timestamp de criação */
  createdAt: Date
  /** Timestamp de atualização */
  updatedAt: Date
}

/**
 * Interface para um ticket de rifa
 * @interface Ticket
 */
export interface Ticket {
  /** ID único do ticket (UUID) */
  id: string
  /** ID da rifa */
  raffleId: string
  /** ID do usuário que comprou o ticket */
  userId: string
  /** Número único do ticket (aleatório) */
  ticketNumber: number
  /** Preço pago pelo ticket */
  price: number
  /** Moeda usada no pagamento */
  currency: Currency
  /** Hash da transação na blockchain */
  transactionHash: string | null
  /** Link para visualizar no Solscan */
  solscanUrl: string | null
  /** Timestamp de compra */
  purchasedAt: Date
}

/**
 * Enum para status do usuário
 * @enum {string}
 */
export enum UserStatus {
  /** Usuário ativo */
  ACTIVE = 'active',
  /** Usuário bloqueado */
  BLOCKED = 'blocked',
  /** Usuário suspenso temporariamente */
  SUSPENDED = 'suspended',
  /** Conta pendente de ativação */
  PENDING = 'pending',
}

/**
 * Interface para um usuário
 * @interface User
 */
export interface User {
  /** ID único do usuário (UUID) */
  id: string
  /** Email do usuário */
  email: string
  /** Nome completo */
  name: string
  /** URL do avatar (opcional) */
  avatarUrl: string | null
  /** Endereços de carteiras vinculadas */
  walletAddresses: WalletAddress[]
  /** Saldo atual por moeda */
  balances: Balance[]
  /** Role do usuário */
  role: UserRole
  /** Status do usuário */
  status: UserStatus
  /** Se o usuário é administrador (mantido para compatibilidade) */
  isAdmin: boolean
  /** Timestamp de criação da conta */
  createdAt: Date
  /** Timestamp da última atualização */
  updatedAt: Date
}

/**
 * Interface para endereço de carteira
 * @interface WalletAddress
 */
export interface WalletAddress {
  /** ID único (UUID) */
  id: string
  /** Endereço da carteira */
  address: string
  /** Tipo de carteira (Phantom, MetaMask, etc.) */
  walletType: WalletType
  /** Blockchain (Solana, Ethereum, etc.) */
  blockchain: Blockchain
  /** Se é a carteira principal */
  isPrimary: boolean
  /** Timestamp de vinculação */
  linkedAt: Date
}

/**
 * Interface para saldo por moeda
 * @interface Balance
 */
export interface Balance {
  /** Moeda */
  currency: Currency
  /** Quantidade */
  amount: number
  /** Timestamp da última atualização */
  updatedAt: Date
}

/**
 * Enum para tipos de carteira
 * @enum {string}
 */
export enum WalletType {
  PHANTOM = 'phantom',
  SOLANA_WALLET = 'solana_wallet',
  METAMASK = 'metamask',
  TRUST_WALLET = 'trust_wallet',
  COINBASE_WALLET = 'coinbase_wallet',
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  EXODUS = 'exodus',
  COINOMI = 'coinomi',
  GUARDA = 'guarda',
  NOVA_WALLET = 'nova_wallet',
  BITKEEP = 'bitkeep',
  BITPIE = 'bitpie',
}

/**
 * Enum para blockchains suportadas
 * @enum {string}
 */
export enum Blockchain {
  SOLANA = 'solana',
  // Futuras: Ethereum, BSC, etc.
}

/**
 * Interface para uma transação
 * @interface Transaction
 */
export interface Transaction {
  /** ID único da transação (UUID) */
  id: string
  /** ID do usuário */
  userId: string
  /** Tipo de transação */
  type: TransactionType
  /** Valor da transação */
  amount: number
  /** Moeda (SOL, USDT ou BRL) */
  currency: Currency
  /** Hash da transação na blockchain */
  transactionHash: string
  /** Link para visualizar no explorador */
  explorerUrl: string | null
  /** Status da transação */
  status: TransactionStatus
  /** Descrição/observações */
  description: string | null
  /** ID da rifa relacionada (se aplicável) */
  raffleId: string | null
  /** Timestamp da transação */
  createdAt: Date
  /** Timestamp da última atualização */
  updatedAt: Date
}

/**
 * Enum para tipos de transação
 * @enum {string}
 */
export enum TransactionType {
  /** Depósito na conta */
  DEPOSIT = 'deposit',
  /** Saque da conta */
  WITHDRAWAL = 'withdrawal',
  /** Compra de tickets */
  TICKET_PURCHASE = 'ticket_purchase',
  /** Recebimento de prêmio */
  PRIZE_WIN = 'prize_win',
  /** Reembolso */
  REFUND = 'refund',
}

/**
 * Enum para status de transação
 * @enum {string}
 */
export enum TransactionStatus {
  /** Transação pendente/aguardando confirmação */
  PENDING = 'pending',
  /** Transação confirmada */
  CONFIRMED = 'confirmed',
  /** Transação falhou */
  FAILED = 'failed',
  /** Transação cancelada */
  CANCELLED = 'cancelled',
}

/**
 * Interface para payload do webhook do gateway
 * @interface GatewayWebhookPayload
 */
export interface GatewayWebhookPayload {
  /** ID único da transação no gateway */
  transactionId: string
  /** Endereço da carteira de origem */
  fromWallet: string
  /** Endereço da carteira de destino */
  toWallet: string
  /** Quantidade transferida */
  amount: string
  /** Moeda (SOL, USDT ou BRL) */
  currency: Currency
  /** Hash da transação na blockchain */
  transactionHash: string
  /** Status da transação */
  status: 'confirmed' | 'pending' | 'failed'
  /** Timestamp da transação */
  timestamp: string
  /** Blockchain utilizada */
  blockchain: Blockchain
  /** Dados adicionais (opcional) */
  metadata?: Record<string, unknown>
}

/**
 * Interface para dados de participação do usuário em uma rifa
 * @interface UserRaffleParticipation
 */
export interface UserRaffleParticipation {
  /** ID da rifa */
  raffleId: string
  /** Nome da rifa */
  raffleName: string
  /** Quantidade de tickets do usuário nesta rifa */
  ticketCount: number
  /** Números dos tickets */
  ticketNumbers: number[]
  /** Valor total investido */
  totalInvested: number
  /** Moeda */
  currency: Currency
  /** Se o usuário ganhou esta rifa */
  isWinner: boolean
  /** Status da rifa */
  raffleStatus: RaffleStatus
}

/**
 * Interface para resposta de estatísticas do dashboard
 * @interface DashboardStats
 */
export interface DashboardStats {
  /** Saldo total por moeda */
  balances: Balance[]
  /** Total de tickets comprados */
  totalTickets: number
  /** Rifas em que está participando */
  activeRafflesCount: number
  /** Rifas ganhas */
  wonRafflesCount: number
  /** Valor total investido */
  totalInvested: number
  /** Valor total ganho em prêmios */
  totalWon: number
  /** Última transação */
  lastTransaction: Transaction | null
}

/**
 * Interface para dados de criação/edição de rifa (Admin)
 * @interface RaffleFormData
 */
export interface RaffleFormData {
  /** Nome/título da rifa */
  name: string
  /** Descrição do prêmio */
  description: string
  /** URL da imagem do prêmio */
  imageUrl: string
  /** Valor do prêmio */
  prizeAmount: number
  /** Moeda do prêmio */
  prizeCurrency: Currency
  /** Preço por ticket */
  ticketPrice: number
  /** Duração em dias */
  durationDays: number
  /** Se é a rifa principal */
  isMain: boolean
}

/**
 * Interface para estatísticas administrativas
 * @interface AdminStats
 */
export interface AdminStats {
  /** Total de rifas */
  totalRaffles: number
  /** Rifas ativas */
  activeRaffles: number
  /** Total de usuários */
  totalUsers: number
  /** Total de tickets vendidos */
  totalTicketsSold: number
  /** Valor total arrecadado */
  totalCollected: number
  /** Valor total pago em prêmios */
  totalPrizesPaid: number
  /** Rifas aguardando sorteio */
  pendingDraws: number
}
