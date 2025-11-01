/**
 * @fileoverview Utilitários para trabalhar com rifas
 * @module utils/raffle
 * @author Raffle System
 */

import type { Raffle } from '~/types/raffle'

/**
 * Obtém a URL da imagem principal de uma rifa
 * Usa a primeira imagem do array images, ou fallback para imageUrl
 * @param {Raffle} raffle - Rifa
 * @returns {string} URL da imagem principal
 */
export function getRaffleMainImage(raffle: Raffle): string {
  // Tenta pegar a primeira imagem ordenada (order === 0)
  const mainImage = raffle.images.find(img => img.order === 0)
  if (mainImage) {
    return mainImage.url
  }

  // Se não tiver imagens ordenadas, pega a primeira do array
  if (raffle.images.length > 0) {
    return raffle.images[0].url
  }

  // Fallback para imageUrl (mantido para compatibilidade)
  return raffle.imageUrl || ''
}
