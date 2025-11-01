/**
 * @fileoverview Dados mockados de tickets para desenvolvimento
 * @module data/mocks/tickets
 * @author Raffle System
 */

import type { Ticket } from '~/types/raffle'
import { Currency } from '~/types/raffle'
import { generateId } from '~/utils/nanoid'
import { RAFFLE_IDS } from './raffles'
import { USER_IDS } from './users'

/**
 * IDs fixos usando formato nanoid para os mocks de tickets
 */
const TICKET_IDS = {
  TICKET_1: generateId(),
  TICKET_2: generateId(),
  TICKET_3: generateId(),
  TICKET_4: generateId(),
  TICKET_5: generateId(),
  TICKET_6: generateId(),
} as const

/**
 * Lista de tickets mockados
 * @type {Ticket[]}
 */
export const mockTickets: Ticket[] = [
  {
    id: TICKET_IDS.TICKET_1,
    raffleId: RAFFLE_IDS.IPHONE,
    userId: USER_IDS.JOAO,
    ticketNumber: 15423,
    price: 10,
    currency: Currency.SOL,
    transactionHash: '3xJYsh5DL6t8yz7K1X6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c',
    solscanUrl: 'https://solscan.io/tx/3xJYsh5DL6t8yz7K1X6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c',
    purchasedAt: new Date('2024-12-07T10:00:00Z'),
  },
  {
    id: TICKET_IDS.TICKET_2,
    raffleId: RAFFLE_IDS.IPHONE,
    userId: USER_IDS.JOAO,
    ticketNumber: 21345,
    price: 10,
    currency: Currency.SOL,
    transactionHash: '4xKZti6EM7u9za8L2Y7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d',
    solscanUrl: 'https://solscan.io/tx/4xKZti6EM7u9za8L2Y7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d',
    purchasedAt: new Date('2024-12-07T11:30:00Z'),
  },
  {
    id: TICKET_IDS.TICKET_3,
    raffleId: RAFFLE_IDS.PS5,
    userId: USER_IDS.JOAO,
    ticketNumber: 8765,
    price: 5,
    currency: Currency.SOL,
    transactionHash: '5xLAuj7FN8v0ab9M3Z8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e',
    solscanUrl: 'https://solscan.io/tx/5xLAuj7FN8v0ab9M3Z8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e',
    purchasedAt: new Date('2024-12-06T14:20:00Z'),
  },
  {
    id: TICKET_IDS.TICKET_4,
    raffleId: RAFFLE_IDS.IPHONE,
    userId: USER_IDS.MARIA,
    ticketNumber: 34567,
    price: 10,
    currency: Currency.SOL,
    transactionHash: '6xMBvk8GO9w1bc0N4a9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f',
    solscanUrl: 'https://solscan.io/tx/6xMBvk8GO9w1bc0N4a9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f',
    purchasedAt: new Date('2024-12-07T09:15:00Z'),
  },
  {
    id: TICKET_IDS.TICKET_5,
    raffleId: RAFFLE_IDS.SOL,
    userId: USER_IDS.JOAO,
    ticketNumber: 1234,
    price: 2,
    currency: Currency.SOL,
    transactionHash: '7xNCwl9HP0x2cd1O5b0g0g0g0g0g0g0g0g0g0g0g0g0g0g0g0g',
    solscanUrl: 'https://solscan.io/tx/7xNCwl9HP0x2cd1O5b0g0g0g0g0g0g0g0g0g0g0g0g0g0g0g0g',
    purchasedAt: new Date('2024-12-07T08:00:00Z'),
  },
  {
    id: TICKET_IDS.TICKET_6,
    raffleId: RAFFLE_IDS.DINHEIRO,
    userId: USER_IDS.JOAO,
    ticketNumber: 5678,
    price: 10,
    currency: Currency.BRL,
    transactionHash: '8xODxm0IQ1y3de2P6c1h1h1h1h1h1h1h1h1h1h1h1h1h1h1h1h',
    solscanUrl: 'https://solscan.io/tx/8xODxm0IQ1y3de2P6c1h1h1h1h1h1h1h1h1h1h1h1h1h1h1h1h',
    purchasedAt: new Date('2024-12-07T12:30:00Z'),
  },
]

/**
 * Obtém tickets por ID da rifa
 * @param {string} raffleId - ID da rifa
 * @returns {Ticket[]} Lista de tickets da rifa
 */
export function getTicketsByRaffleId(raffleId: string): Ticket[] {
  return mockTickets.filter(ticket => ticket.raffleId === raffleId)
}

/**
 * Obtém tickets por ID do usuário
 * @param {string} userId - ID do usuário
 * @returns {Ticket[]} Lista de tickets do usuário
 */
export function getTicketsByUserId(userId: string): Ticket[] {
  return mockTickets.filter(ticket => ticket.userId === userId)
}

/**
 * Obtém tickets por ID do usuário e ID da rifa
 * @param {string} userId - ID do usuário
 * @param {string} raffleId - ID da rifa
 * @returns {Ticket[]} Lista de tickets do usuário na rifa
 */
export function getTicketsByUserAndRaffle(userId: string, raffleId: string): Ticket[] {
  return mockTickets.filter(ticket => ticket.userId === userId && ticket.raffleId === raffleId)
}

/**
 * Conta tickets vendidos por rifa
 * @param {string} raffleId - ID da rifa
 * @returns {number} Quantidade de tickets vendidos
 */
export function getTicketCountByRaffle(raffleId: string): number {
  return mockTickets.filter(ticket => ticket.raffleId === raffleId).length
}
