/**
 * @fileoverview Dados mockados de usuários para desenvolvimento
 * @module data/mocks/users
 * @author Raffle System
 */

import type { User } from '~/types/raffle'
import { Blockchain, Currency, UserRole, UserStatus, WalletType } from '~/types/raffle'
import { generateId } from '~/utils/nanoid'

/**
 * IDs fixos usando formato nanoid para os mocks de usuários
 * Em produção, estes serão gerados pelo banco de dados
 */
export const USER_IDS = {
  ADMIN: 'V1StGXR8_Z5jdHi6B-usr1',
  JOAO: 'V1StGXR8_Z5jdHi6B-usr2',
  MARIA: 'V1StGXR8_Z5jdHi6B-usr3',
} as const

/**
 * IDs fixos para carteiras
 */
const WALLET_IDS = {
  ADMIN_1: generateId(),
  JOAO_1: generateId(),
  JOAO_2: generateId(),
  MARIA_1: generateId(),
} as const

/**
 * Lista de usuários mockados
 * @type {User[]}
 */
export const mockUsers: User[] = [
  {
    id: USER_IDS.ADMIN,
    email: 'admin@raffle.com',
    name: 'Administrador',
    avatarUrl: null,
    walletAddresses: [
      {
        id: WALLET_IDS.ADMIN_1,
        address: '7xKXtg2CZ3q5vz4G8U3z4z4z4z4z4z4z4z4z4z4z4z4z',
        walletType: WalletType.PHANTOM,
        blockchain: Blockchain.SOLANA,
        isPrimary: true,
        linkedAt: new Date('2024-01-01T00:00:00Z'),
      },
    ],
    balances: [
      { currency: Currency.SOL, amount: 50.5, updatedAt: new Date('2024-12-07T10:00:00Z') },
      { currency: Currency.SOL, amount: 1250.75, updatedAt: new Date('2024-12-07T10:00:00Z') },
      { currency: Currency.BRL, amount: 5000.0, updatedAt: new Date('2024-12-07T10:00:00Z') },
    ],
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isAdmin: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-12-07T10:00:00Z'),
  },
  {
    id: USER_IDS.JOAO,
    email: 'joao@example.com',
    name: 'João Silva',
    avatarUrl: null,
    walletAddresses: [
      {
        id: WALLET_IDS.JOAO_1,
        address: '8yLYuh3DK4r6wx5H9V4a5a5a5a5a5a5a5a5a5a5a5a5a5a5a',
        walletType: WalletType.PHANTOM,
        blockchain: Blockchain.SOLANA,
        isPrimary: true,
        linkedAt: new Date('2024-06-15T00:00:00Z'),
      },
      {
        id: WALLET_IDS.JOAO_2,
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        walletType: WalletType.METAMASK,
        blockchain: Blockchain.SOLANA,
        isPrimary: false,
        linkedAt: new Date('2024-08-20T00:00:00Z'),
      },
    ],
    balances: [
      { currency: Currency.SOL, amount: 12.3, updatedAt: new Date('2024-12-07T08:30:00Z') },
      { currency: Currency.SOL, amount: 320.50, updatedAt: new Date('2024-12-07T08:30:00Z') },
      { currency: Currency.BRL, amount: 1500.0, updatedAt: new Date('2024-12-07T08:30:00Z') },
    ],
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    isAdmin: false,
    createdAt: new Date('2024-06-15T00:00:00Z'),
    updatedAt: new Date('2024-12-07T08:30:00Z'),
  },
  {
    id: USER_IDS.MARIA,
    email: 'maria@example.com',
    name: 'Maria Santos',
    avatarUrl: null,
    walletAddresses: [
      {
        id: WALLET_IDS.MARIA_1,
        address: '9zMZvi4EL5s7xy6I0W5b6b6b6b6b6b6b6b6b6b6b6b6b6b6b6b',
        walletType: WalletType.SOLANA_WALLET,
        blockchain: Blockchain.SOLANA,
        isPrimary: true,
        linkedAt: new Date('2024-08-20T00:00:00Z'),
      },
    ],
    balances: [
      { currency: Currency.SOL, amount: 25.8, updatedAt: new Date('2024-12-05T16:00:00Z') },
      { currency: Currency.SOL, amount: 650.25, updatedAt: new Date('2024-12-05T16:00:00Z') },
      { currency: Currency.BRL, amount: 350.0, updatedAt: new Date('2024-12-05T16:00:00Z') },
    ],
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    isAdmin: false,
    createdAt: new Date('2024-08-20T00:00:00Z'),
    updatedAt: new Date('2024-12-05T16:00:00Z'),
  },
]

/**
 * Usuário mockado atual (para desenvolvimento)
 * @type {User}
 */
export const mockCurrentUser: User = mockUsers[1]! // João Silva

/**
 * Obtém um usuário por ID
 * @param {string} id - ID do usuário
 * @returns {User | undefined} Usuário encontrado ou undefined
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id)
}

/**
 * Obtém um usuário por endereço de carteira
 * @param {string} walletAddress - Endereço da carteira
 * @returns {User | undefined} Usuário encontrado ou undefined
 */
export function getUserByWallet(walletAddress: string): User | undefined {
  return mockUsers.find(user =>
    user.walletAddresses.some(w => w.address === walletAddress),
  )
}

/**
 * Obtém saldo do usuário para uma moeda específica
 * @param {User} user - Usuário
 * @param {Currency} currency - Moeda
 * @returns {number} Saldo na moeda especificada
 */
export function getUserBalance(user: User, currency: Currency): number {
  const balance = user.balances.find(b => b.currency === currency)
  return balance?.amount || 0
}
