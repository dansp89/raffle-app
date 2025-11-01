/**
 * @fileoverview Utilitários para geração de IDs com nanoid
 * @module utils/nanoid
 * @author Raffle System
 */

import { nanoid } from 'nanoid'

/**
 * Gera um ID único usando nanoid
 * @param {number} size - Tamanho do ID (padrão: 21)
 * @returns {string} ID único gerado
 */
export function generateId(size: number = 21): string {
  return nanoid(size)
}

/**
 * Gera um ID curto usando nanoid (útil para IDs visíveis)
 * @param {number} size - Tamanho do ID (padrão: 10)
 * @returns {string} ID curto gerado
 */
export function generateShortId(size: number = 10): string {
  return nanoid(size)
}
