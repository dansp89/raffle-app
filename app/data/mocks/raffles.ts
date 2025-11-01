/**
 * @fileoverview Dados mockados de rifas para desenvolvimento
 * @module data/mocks/raffles
 * @author Raffle System
 */

import type { Raffle } from '~/types/raffle'
import { Currency, RaffleStatus } from '~/types/raffle'
import { generateId } from '~/utils/nanoid'
import { generateSlug } from '~/utils/slug'
import { USER_IDS } from './users'

/**
 * IDs fixos usando formato nanoid para os mocks
 * Em produção, estes serão gerados pelo banco de dados
 */
export const RAFFLE_IDS = {
  IPHONE: 'V1StGXR8_Z5jdHi6B-myT',
  PS5: 'V1StGXR8_Z5jdHi6B-myU',
  MACBOOK: 'V1StGXR8_Z5jdHi6B-myV',
  SOL: 'V1StGXR8_Z5jdHi6B-myW',
  SWITCH: 'V1StGXR8_Z5jdHi6B-myX',
  DINHEIRO: 'V1StGXR8_Z5jdHi6B-myY',
} as const

/**
 * Lista de rifas mockadas
 * @type {Raffle[]}
 */
export const mockRaffles: Raffle[] = [
  {
    id: RAFFLE_IDS.IPHONE,
    slug: generateSlug('iPhone 15 Pro Max 512GB'),
    name: 'iPhone 15 Pro Max 512GB',
    description: 'O smartphone mais avançado da Apple com display Super Retina XDR e chip A17 Pro. Inclui capa protetora e carregador.',
    imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800', // Mantido para compatibilidade
    images: [
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
        type: 'image' as const,
        order: 0,
        filename: 'iphone-15-pro-max-front.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        type: 'image' as const,
        order: 1,
        filename: 'iphone-15-pro-max-back.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        type: 'image' as const,
        order: 2,
        filename: 'iphone-15-pro-max-display.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
        type: 'image' as const,
        order: 3,
        filename: 'iphone-15-pro-max-camera.jpg',
      },
    ],
    videos: [
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video' as const,
        order: 0,
        filename: 'iphone-15-pro-max-video.mp4',
      },
    ],
    prizeAmount: 1500,
    prizeCurrency: Currency.SOL,
    collectedAmount: 3200,
    ticketPrice: 10,
    startDate: new Date('2024-12-01T00:00:00Z'),
    endDate: new Date('2024-12-08T23:59:59Z'),
    durationDays: 7,
    targetAmount: 3000,
    status: RaffleStatus.ACTIVE,
    isMain: true,
    targetReachedDate: new Date('2024-12-07T14:30:00Z'),
    scheduledDrawDate: new Date('2024-12-08T14:30:00Z'),
    winnerId: null,
    winnerWallet: null,
    prizeTransactionHash: null,
    solscanUrl: null,
    totalTicketsSold: 320,
    createdAt: new Date('2024-12-01T00:00:00Z'),
    updatedAt: new Date('2024-12-07T14:30:00Z'),
  },
  {
    id: RAFFLE_IDS.PS5,
    slug: generateSlug('PlayStation 5 + 2 Controles'),
    name: 'PlayStation 5 + 2 Controles',
    description: 'Console de última geração com SSD ultrarrápido, ray tracing e compatibilidade com PS4. Inclui 2 controles DualSense.',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800', // Mantido para compatibilidade
    images: [
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
        type: 'image' as const,
        order: 0,
        filename: 'playstation-5-front.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        type: 'image' as const,
        order: 1,
        filename: 'playstation-5-back.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800',
        type: 'image' as const,
        order: 2,
        filename: 'playstation-5-controller.jpg',
      },
    ],
    videos: [
      {
        id: generateId(),
        url: 'https://www.youtube.com/watch?v=QILiHiTD3uc',
        type: 'video' as const,
        order: 0,
        filename: 'playstation-5-youtube-review',
      },
      {
        id: generateId(),
        url: 'https://www.youtube.com/watch?v=a4QzPPRFdeg',
        type: 'video' as const,
        order: 0,
        filename: 'playstation-5-youtube-review-2',
      },
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        type: 'video' as const,
        order: 1,
        filename: 'playstation-5-gameplay.mp4',
      },
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        type: 'video' as const,
        order: 2,
        filename: 'playstation-5-features.mp4',
      },
      {
        id: generateId(),
        url: 'https://vimeo.com/253905163',
        type: 'video' as const,
        order: 3,
        filename: 'playstation-5-vimeo-demo.mp4',
      },
    ],
    prizeAmount: 600,
    prizeCurrency: Currency.SOL,
    collectedAmount: 1100,
    ticketPrice: 5,
    startDate: new Date('2024-12-05T00:00:00Z'),
    endDate: new Date('2024-12-12T23:59:59Z'),
    durationDays: 7,
    targetAmount: 1200,
    status: RaffleStatus.ACTIVE,
    isMain: false,
    targetReachedDate: null,
    scheduledDrawDate: null,
    winnerId: null,
    winnerWallet: null,
    prizeTransactionHash: null,
    solscanUrl: null,
    totalTicketsSold: 220,
    createdAt: new Date('2024-12-05T00:00:00Z'),
    updatedAt: new Date('2024-12-07T10:00:00Z'),
  },
  {
    id: RAFFLE_IDS.MACBOOK,
    slug: generateSlug('MacBook Pro 14" M3'),
    name: 'MacBook Pro 14" M3',
    description: 'Notebook profissional com chip M3 e tela Liquid Retina XDR. 16GB RAM, 512GB SSD.',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', // Mantido para compatibilidade
    images: [
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        type: 'image' as const,
        order: 0,
        filename: 'macbook-pro-m3-front.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        type: 'image' as const,
        order: 1,
        filename: 'macbook-pro-m3-keyboard.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        type: 'image' as const,
        order: 2,
        filename: 'macbook-pro-m3-display.jpg',
      },
    ],
    videos: [
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        type: 'video' as const,
        order: 0,
        filename: 'macbook-pro-m3-review.mp4',
      },
    ],
    prizeAmount: 2500,
    prizeCurrency: Currency.SOL,
    collectedAmount: 4800,
    ticketPrice: 20,
    startDate: new Date('2024-11-25T00:00:00Z'),
    endDate: new Date('2024-12-02T23:59:59Z'),
    durationDays: 7,
    targetAmount: 5000,
    status: RaffleStatus.PENDING_DRAW,
    isMain: false,
    targetReachedDate: new Date('2024-12-02T18:45:00Z'),
    scheduledDrawDate: new Date('2024-12-03T18:45:00Z'),
    winnerId: null,
    winnerWallet: null,
    prizeTransactionHash: null,
    solscanUrl: null,
    totalTicketsSold: 240,
    createdAt: new Date('2024-11-25T00:00:00Z'),
    updatedAt: new Date('2024-12-02T18:45:00Z'),
  },
  {
    id: RAFFLE_IDS.SOL,
    slug: generateSlug('100 SOL'),
    name: '100 SOL',
    description: 'Ganhe 100 tokens Solana (SOL) diretamente na sua carteira. Transferência instantânea após o sorteio.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', // Mantido para compatibilidade
    images: [
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
        type: 'image' as const,
        order: 0,
        filename: 'solana-logo.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        type: 'image' as const,
        order: 1,
        filename: 'solana-blockchain.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
        type: 'image' as const,
        order: 2,
        filename: 'solana-wallet.jpg',
      },
    ],
    videos: [
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        type: 'video' as const,
        order: 0,
        filename: 'solana-tutorial.mp4',
      },
    ],
    prizeAmount: 100,
    prizeCurrency: Currency.SOL,
    collectedAmount: 180,
    ticketPrice: 2,
    startDate: new Date('2024-12-03T00:00:00Z'),
    endDate: new Date('2024-12-10T23:59:59Z'),
    durationDays: 7,
    targetAmount: 200,
    status: RaffleStatus.ACTIVE,
    isMain: false,
    targetReachedDate: null,
    scheduledDrawDate: null,
    winnerId: null,
    winnerWallet: null,
    prizeTransactionHash: null,
    solscanUrl: null,
    totalTicketsSold: 90,
    createdAt: new Date('2024-12-03T00:00:00Z'),
    updatedAt: new Date('2024-12-07T12:00:00Z'),
  },
  {
    id: RAFFLE_IDS.SWITCH,
    slug: generateSlug('Nintendo Switch OLED'),
    name: 'Nintendo Switch OLED',
    description: 'Console portátil com tela OLED de 7 polegadas. Inclui Joy-Cons e dock.',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800', // Mantido para compatibilidade
    images: [
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
        type: 'image' as const,
        order: 0,
        filename: 'nintendo-switch-oled-front.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1578303512597-8e916f8e4b4f?w=800',
        type: 'image' as const,
        order: 1,
        filename: 'nintendo-switch-oled-docked.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
        type: 'image' as const,
        order: 2,
        filename: 'nintendo-switch-oled-joycons.jpg',
      },
      {
        id: generateId(),
        url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        type: 'image' as const,
        order: 3,
        filename: 'nintendo-switch-oled-handheld.jpg',
      },
    ],
    videos: [
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        type: 'video' as const,
        order: 0,
        filename: 'nintendo-switch-oled-review.mp4',
      },
      {
        id: generateId(),
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        type: 'video' as const,
        order: 1,
        filename: 'nintendo-switch-oled-gameplay.mp4',
      },
    ],
    prizeAmount: 350,
    prizeCurrency: Currency.SOL,
    collectedAmount: 720,
    ticketPrice: 5,
    startDate: new Date('2024-11-28T00:00:00Z'),
    endDate: new Date('2024-12-05T23:59:59Z'),
    durationDays: 7,
    targetAmount: 700,
    status: RaffleStatus.FINISHED,
    isMain: false,
    targetReachedDate: new Date('2024-12-04T15:20:00Z'),
    scheduledDrawDate: new Date('2024-12-05T15:20:00Z'),
    winnerId: USER_IDS.MARIA,
    winnerWallet: '7xKXtg2CZ3q5vz4G8U3z4z4z4z4z4z4z4z4z4z4z4z4z',
    prizeTransactionHash: '5xKXtg2CZ3q5vz4G8U3z4z4z4z4z4z4z4z4z4z4z4z4z4z4z4z',
    solscanUrl: 'https://solscan.io/tx/5xKXtg2CZ3q5vz4G8U3z4z4z4z4z4z4z4z4z4z4z4z4z4z4z4z',
    totalTicketsSold: 144,
    createdAt: new Date('2024-11-28T00:00:00Z'),
    updatedAt: new Date('2024-12-05T16:00:00Z'),
  },
  {
    id: RAFFLE_IDS.DINHEIRO,
    slug: generateSlug('R$ 5.000 em Dinheiro'),
    name: 'R$ 5.000 em Dinheiro',
    description: 'Ganhe R$ 5.000 em dinheiro depositados diretamente na sua conta bancária ou carteira digital.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800', // Mantido para compatibilidade
    images: [
      {
        id: 'img-dinheiro-1-V1StGXR8_Z',
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        type: 'image',
        order: 0,
        filename: 'dinheiro-1.jpg',
      },
      {
        id: 'img-dinheiro-2-V1StGXR8_Z',
        url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
        type: 'image',
        order: 1,
        filename: 'dinheiro-2.jpg',
      },
    ],
    videos: [
      {
        id: 'vid-dinheiro-1-V1StGXR8_Z',
        url: 'https://example.com/video-preview.mp4',
        type: 'video',
        order: 0,
        filename: 'video-promocional.mp4',
      },
    ],
    prizeAmount: 5000,
    prizeCurrency: Currency.BRL,
    collectedAmount: 8500,
    ticketPrice: 10,
    startDate: new Date('2024-12-06T00:00:00Z'),
    endDate: new Date('2024-12-13T23:59:59Z'),
    durationDays: 7,
    targetAmount: 10000,
    status: RaffleStatus.ACTIVE,
    isMain: false,
    targetReachedDate: null,
    scheduledDrawDate: null,
    winnerId: null,
    winnerWallet: null,
    prizeTransactionHash: null,
    solscanUrl: null,
    totalTicketsSold: 850,
    createdAt: new Date('2024-12-06T00:00:00Z'),
    updatedAt: new Date('2024-12-07T15:00:00Z'),
  },
]

/**
 * Obtém uma rifa por ID ou slug
 * @param {string} identifier - ID ou slug da rifa
 * @returns {Raffle | undefined} Rifa encontrada ou undefined
 */
export function getRaffleById(identifier: string): Raffle | undefined {
  return mockRaffles.find(raffle => raffle.id === identifier || raffle.slug === identifier)
}

/**
 * Obtém uma rifa por slug
 * @param {string} slug - Slug da rifa
 * @returns {Raffle | undefined} Rifa encontrada ou undefined
 */
export function getRaffleBySlug(slug: string): Raffle | undefined {
  return mockRaffles.find(raffle => raffle.slug === slug)
}

/**
 * Obtém a rifa principal
 * @returns {Raffle | undefined} Rifa principal ou undefined
 */
export function getMainRaffle(): Raffle | undefined {
  return mockRaffles.find(raffle => raffle.isMain && raffle.status === RaffleStatus.ACTIVE)
}

/**
 * Obtém rifas ativas
 * @returns {Raffle[]} Lista de rifas ativas
 */
export function getActiveRaffles(): Raffle[] {
  return mockRaffles.filter(raffle => raffle.status === RaffleStatus.ACTIVE)
}

/**
 * Obtém rifas secundárias (não principais e ativas)
 * @returns {Raffle[]} Lista de rifas secundárias
 */
export function getSecondaryRaffles(): Raffle[] {
  return mockRaffles.filter(raffle => !raffle.isMain && raffle.status === RaffleStatus.ACTIVE)
}

/**
 * Obtém todas as rifas finalizadas
 * @returns {Raffle[]} Lista de rifas finalizadas
 */
export function getFinishedRaffles(): Raffle[] {
  return mockRaffles.filter(raffle => raffle.status === RaffleStatus.FINISHED)
}
