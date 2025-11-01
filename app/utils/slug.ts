/**
 * @fileoverview Utilitários para geração de slugs
 * @module utils/slug
 * @author Raffle System
 */

/**
 * Gera um slug amigável a partir de uma string
 * @param {string} text - Texto para converter em slug
 * @returns {string} Slug gerado
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens no início e fim
}
