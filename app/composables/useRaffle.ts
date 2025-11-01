/**
 * @fileoverview Composable para gerenciar rifas
 * @module composables/useRaffle
 * @author Raffle System
 */

import type { Ref } from 'vue'
import type { Raffle, RaffleStatus } from '~/types/raffle'
import { computed, ref } from 'vue'
import {
  getActiveRaffles,
  getFinishedRaffles,
  getMainRaffle,
  getRaffleById,
  getSecondaryRaffles,
  mockRaffles,
} from '~/data/mocks/raffles'

/**
 * Estado reativo das rifas
 * @type {Ref<Raffle[]>}
 */
const raffles: Ref<Raffle[]> = ref(mockRaffles)

/**
 * Composable para gerenciar rifas
 * @returns {object} Objeto com estado e métodos para gerenciar rifas
 */
export function useRaffle() {
  /**
   * Obtém todas as rifas
   * @returns {Ref<Raffle[]>} Lista de rifas
   */
  const getAllRaffles = computed(() => raffles.value)

  /**
   * Obtém rifas ativas
   * @returns {Ref<Raffle[]>} Lista de rifas ativas
   */
  const activeRaffles = computed(() => getActiveRaffles())

  /**
   * Obtém a rifa principal
   * @returns {Ref<Raffle | undefined>} Rifa principal
   */
  const mainRaffle = computed(() => getMainRaffle())

  /**
   * Obtém rifas secundárias
   * @returns {Ref<Raffle[]>} Lista de rifas secundárias
   */
  const secondaryRaffles = computed(() => getSecondaryRaffles())

  /**
   * Obtém rifas finalizadas
   * @returns {Ref<Raffle[]>} Lista de rifas finalizadas
   */
  const finishedRaffles = computed(() => getFinishedRaffles())

  /**
   * Busca uma rifa por ID
   * @param {string} id - ID da rifa
   * @returns {Raffle | undefined} Rifa encontrada ou undefined
   */
  function findRaffleById(id: string): Raffle | undefined {
    return getRaffleById(id)
  }

  /**
   * Calcula o progresso de arrecadação de uma rifa (em porcentagem)
   * @param {Raffle} raffle - Rifa para calcular progresso
   * @returns {number} Progresso em porcentagem (0-100)
   */
  function getProgressPercentage(raffle: Raffle): number {
    if (raffle.targetAmount === 0)
      return 0
    const percentage = (raffle.collectedAmount / raffle.targetAmount) * 100
    return Math.min(percentage, 100)
  }

  /**
   * Verifica se a rifa atingiu a meta
   * @param {Raffle} raffle - Rifa para verificar
   * @returns {boolean} True se atingiu a meta
   */
  function hasReachedTarget(raffle: Raffle): boolean {
    return raffle.collectedAmount >= raffle.targetAmount
  }

  /**
   * Calcula o tempo restante até o fim da rifa
   * @param {Raffle} raffle - Rifa para calcular
   * @returns {number} Tempo restante em milissegundos
   */
  function getTimeRemaining(raffle: Raffle): number {
    const now = new Date().getTime()
    const end = new Date(raffle.endDate).getTime()
    return Math.max(0, end - now)
  }

  /**
   * Formata o tempo restante em formato legível
   * @param {number} milliseconds - Tempo em milissegundos
   * @returns {string} Tempo formatado (ex: "2d 5h 30m")
   */
  function formatTimeRemaining(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  /**
   * Filtra rifas por status
   * @param {RaffleStatus} status - Status para filtrar
   * @returns {Raffle[]} Rifas com o status especificado
   */
  function filterByStatus(status: RaffleStatus): Raffle[] {
    return raffles.value.filter(r => r.status === status)
  }

  return {
    raffles,
    getAllRaffles,
    activeRaffles,
    mainRaffle,
    secondaryRaffles,
    finishedRaffles,
    findRaffleById,
    getProgressPercentage,
    hasReachedTarget,
    getTimeRemaining,
    formatTimeRemaining,
    filterByStatus,
  }
}
