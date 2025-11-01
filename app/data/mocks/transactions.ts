/**
 * @fileoverview Dados mockados de transações para desenvolvimento
 * @module data/mocks/transactions
 * @author Raffle System
 */

import type { Transaction } from '~/types/raffle'
import { Currency, TransactionStatus, TransactionType } from '~/types/raffle'
import { generateId } from '~/utils/nanoid'
import { RAFFLE_IDS } from './raffles'
import { USER_IDS } from './users'

/**
 * IDs fixos usando formato nanoid para os mocks de transações
 */
const TRANSACTION_IDS = {
  TX_1: generateId(),
  TX_2: generateId(),
  TX_3: generateId(),
  TX_4: generateId(),
  TX_5: generateId(),
  TX_6: generateId(),
  TX_7: generateId(),
  TX_8: generateId(),
} as const

/**
 * Lista de transações mockadas
 * @type {Transaction[]}
 */
export const mockTransactions: Transaction[] = [
  {
    id: TRANSACTION_IDS.TX_1,
    userId: USER_IDS.JOAO,
    type: TransactionType.DEPOSIT,
    amount: 100,
    currency: Currency.SOL,
    transactionHash: '1xABcd2EF3gh4IJ5kl6MN7op8QR9st0UV1wx2yz3AB4cd',
    explorerUrl: 'https://solscan.io/tx/1xABcd2EF3gh4IJ5kl6MN7op8QR9st0UV1wx2yz3AB4cd',
    status: TransactionStatus.CONFIRMED,
    description: 'Depósito inicial',
    raffleId: null,
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2024-12-01T10:05:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_2,
    userId: USER_IDS.JOAO,
    type: TransactionType.TICKET_PURCHASE,
    amount: 10,
    currency: Currency.SOL,
    transactionHash: '2xBCde3FG4hi5JK6lm7NO8pq9RS0tu1VW2xy3za4BC5de',
    explorerUrl: 'https://solscan.io/tx/2xBCde3FG4hi5JK6lm7NO8pq9RS0tu1VW2xy3za4BC5de',
    status: TransactionStatus.CONFIRMED,
    description: 'Compra de ticket - iPhone 15 Pro Max',
    raffleId: RAFFLE_IDS.IPHONE,
    createdAt: new Date('2024-12-07T10:00:00Z'),
    updatedAt: new Date('2024-12-07T10:01:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_3,
    userId: USER_IDS.JOAO,
    type: TransactionType.TICKET_PURCHASE,
    amount: 10,
    currency: Currency.SOL,
    transactionHash: '3xCDef4GH5ij6KL7mn8OP9qr0ST1uv2WX3yz4ab5CD6ef',
    explorerUrl: 'https://solscan.io/tx/3xCDef4GH5ij6KL7mn8OP9qr0ST1uv2WX3yz4ab5CD6ef',
    status: TransactionStatus.CONFIRMED,
    description: 'Compra de ticket - iPhone 15 Pro Max',
    raffleId: RAFFLE_IDS.IPHONE,
    createdAt: new Date('2024-12-07T11:30:00Z'),
    updatedAt: new Date('2024-12-07T11:31:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_4,
    userId: USER_IDS.JOAO,
    type: TransactionType.TICKET_PURCHASE,
    amount: 5,
    currency: Currency.SOL,
    transactionHash: '4xDEfg5HI6jk7LM8no9PQ0rs1TU2vw3XY4za5bc6DE7fg',
    explorerUrl: 'https://solscan.io/tx/4xDEfg5HI6jk7LM8no9PQ0rs1TU2vw3XY4za5bc6DE7fg',
    status: TransactionStatus.CONFIRMED,
    description: 'Compra de ticket - PlayStation 5',
    raffleId: RAFFLE_IDS.PS5,
    createdAt: new Date('2024-12-06T14:20:00Z'),
    updatedAt: new Date('2024-12-06T14:21:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_5,
    userId: USER_IDS.JOAO,
    type: TransactionType.DEPOSIT,
    amount: 50,
    currency: Currency.SOL,
    transactionHash: '5xEFgh6IJ7kl8MN9op0QR1st2UV3wx4YZ5ab6cd7EF8gh',
    explorerUrl: 'https://solscan.io/tx/5xEFgh6IJ7kl8MN9op0QR1st2UV3wx4YZ5ab6cd7EF8gh',
    status: TransactionStatus.CONFIRMED,
    description: 'Depósito em SOL',
    raffleId: null,
    createdAt: new Date('2024-12-05T08:00:00Z'),
    updatedAt: new Date('2024-12-05T08:02:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_6,
    userId: USER_IDS.MARIA,
    type: TransactionType.PRIZE_WIN,
    amount: 350,
    currency: Currency.SOL,
    transactionHash: '6xFGhi7JK8lm9NO0pq1RS2tu3VW4xy5ZA6bc7de8FG9hi',
    explorerUrl: 'https://solscan.io/tx/6xFGhi7JK8lm9NO0pq1RS2tu3VW4xy5ZA6bc7de8FG9hi',
    status: TransactionStatus.CONFIRMED,
    description: 'Prêmio - Nintendo Switch OLED',
    raffleId: RAFFLE_IDS.SWITCH,
    createdAt: new Date('2024-12-05T16:00:00Z'),
    updatedAt: new Date('2024-12-05T16:05:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_7,
    userId: USER_IDS.JOAO,
    type: TransactionType.DEPOSIT,
    amount: 2000,
    currency: Currency.BRL,
    transactionHash: '7xGHij8KL9mn0OP1qr2ST3uv4WX5yz6AB7cd8ef9GH0ij',
    explorerUrl: 'https://solscan.io/tx/7xGHij8KL9mn0OP1qr2ST3uv4WX5yz6AB7cd8ef9GH0ij',
    status: TransactionStatus.CONFIRMED,
    description: 'Depósito em BRL',
    raffleId: null,
    createdAt: new Date('2024-12-06T09:00:00Z'),
    updatedAt: new Date('2024-12-06T09:01:00Z'),
  },
  {
    id: TRANSACTION_IDS.TX_8,
    userId: USER_IDS.JOAO,
    type: TransactionType.TICKET_PURCHASE,
    amount: 10,
    currency: Currency.BRL,
    transactionHash: '8xHIjk9LM0no1OP2rs3TU4vw5XY6za7BC8de9fg0HI1jk',
    explorerUrl: 'https://solscan.io/tx/8xHIjk9LM0no1OP2rs3TU4vw5XY6za7BC8de9fg0HI1jk',
    status: TransactionStatus.CONFIRMED,
    description: 'Compra de ticket - R$ 5.000 em Dinheiro',
    raffleId: RAFFLE_IDS.DINHEIRO,
    createdAt: new Date('2024-12-07T12:30:00Z'),
    updatedAt: new Date('2024-12-07T12:31:00Z'),
  },
]

/**
 * Obtém transações por ID do usuário
 * @param {string} userId - ID do usuário
 * @returns {Transaction[]} Lista de transações do usuário ordenada por data (mais recente primeiro)
 */
export function getTransactionsByUserId(userId: string): Transaction[] {
  return mockTransactions.filter(tx => tx.userId === userId).sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

/**
 * Obtém transações por tipo
 * @param {TransactionType} type - Tipo de transação
 * @returns {Transaction[]} Lista de transações do tipo
 */
export function getTransactionsByType(type: TransactionType): Transaction[] {
  return mockTransactions.filter(tx => tx.type === type)
}

/**
 * Obtém transações por status
 * @param {TransactionStatus} status - Status da transação
 * @returns {Transaction[]} Lista de transações com o status
 */
export function getTransactionsByStatus(status: TransactionStatus): Transaction[] {
  return mockTransactions.filter(tx => tx.status === status)
}

/**
 * Obtém transações por ID da rifa
 * @param {string} raffleId - ID da rifa
 * @returns {Transaction[]} Lista de transações relacionadas à rifa
 */
export function getTransactionsByRaffleId(raffleId: string): Transaction[] {
  return mockTransactions.filter(tx => tx.raffleId === raffleId)
}
