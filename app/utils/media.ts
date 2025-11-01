/**
 * @fileoverview Utilitários para detecção e processamento de mídias
 * @module utils/media
 * @author Raffle System
 */

/**
 * Detecta se uma URL é um embed do YouTube
 * @param {string} url - URL para verificar
 * @returns {boolean} True se for um embed do YouTube
 */
export function isYouTubeEmbed(url: string): boolean {
  // eslint-disable-next-line regexp/no-useless-escape, regexp/no-unused-capturing-group
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  return youtubeRegex.test(url)
}

/**
 * Extrai o ID do vídeo do YouTube de uma URL
 * @param {string} url - URL do YouTube
 * @returns {string | null} ID do vídeo ou null
 */
export function extractYouTubeId(url: string): string | null {
  // eslint-disable-next-line regexp/no-useless-escape
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  const match = url.match(youtubeRegex)
  return match?.[1] ?? null
}

/**
 * Normaliza o origin para uma URL válida
 * Converte IPv6 ([::]) para localhost e remove caracteres inválidos
 * @param {string} origin - Origin a ser normalizado
 * @returns {string} Origin normalizado ou string vazia
 */
function normalizeOrigin(origin: string): string {
  if (!origin)
    return ''

  try {
    const url = new URL(origin)
    // Se o hostname contém colchetes (IPv6), converte para localhost
    if (url.hostname.includes('[') && url.hostname.includes(']')) {
      // Converte [::] ou [::1] para localhost
      url.hostname = 'localhost'
    }
    // Retorna apenas origin (protocol + hostname + port se houver)
    return url.origin
  }
  catch {
    // Se não for uma URL válida, retorna vazio
    return ''
  }
}

/**
 * Converte uma URL do YouTube para formato embed
 * @param {string} url - URL do YouTube
 * @returns {string | null} URL do embed ou null
 */
export function convertToYouTubeEmbed(url: string): string | null {
  const videoId = extractYouTubeId(url)
  if (!videoId)
    return null

  // Adiciona enablejsapi=1 para permitir controle via postMessage
  // O origin deve ser a origem do site atual para segurança
  let origin = ''
  if (import.meta.client && typeof window !== 'undefined' && window.location) {
    // Normaliza o origin para lidar com IPv6 ([::]) e outros casos
    origin = normalizeOrigin(window.location.origin)
  }
  else if (import.meta.server) {
    // Em SSR, tenta usar variável de ambiente pública
    try {
      const runtimeConfig = useRuntimeConfig()
      const siteUrl = (runtimeConfig.public.siteUrl as string) || ''
      origin = normalizeOrigin(siteUrl)
    }
    catch {
      // Fallback caso useRuntimeConfig não esteja disponível
      origin = ''
    }
  }

  // Se origin estiver vazio, não adiciona o parâmetro (YouTube funciona sem ele)
  if (origin) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}`
  }

  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
}

/**
 * Detecta se uma URL é um embed do Vimeo
 * @param {string} url - URL para verificar
 * @returns {boolean} True se for um embed do Vimeo
 */
export function isVimeoEmbed(url: string): boolean {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  return /vimeo\.com\/(\d+)/i.test(url)
}

/**
 * Extrai o ID do vídeo do Vimeo de uma URL
 * @param {string} url - URL do Vimeo
 * @returns {string | null} ID do vídeo ou null
 */
export function extractVimeoId(url: string): string | null {
  const vimeoRegex = /vimeo\.com\/(\d+)/i
  const match = url.match(vimeoRegex)
  return match?.[1] ?? null
}

/**
 * Converte uma URL do Vimeo para formato embed
 * @param {string} url - URL do Vimeo
 * @returns {string | null} URL do embed ou null
 */
export function convertToVimeoEmbed(url: string): string | null {
  const videoId = extractVimeoId(url)
  return videoId ? `https://player.vimeo.com/video/${videoId}` : null
}

/**
 * Detecta se uma URL é um embed (YouTube, Vimeo, etc)
 * @param {string} url - URL para verificar
 * @returns {boolean} True se for um embed
 */
export function isEmbedUrl(url: string): boolean {
  return isYouTubeEmbed(url) || isVimeoEmbed(url) || /embed|iframe/i.test(url)
}

/**
 * Detecta se uma URL é um vídeo direto (MP4, WebM, etc)
 * @param {string} url - URL para verificar
 * @returns {boolean} True se for um vídeo direto
 */
export function isDirectVideo(url: string): boolean {
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i
  return videoExtensions.test(url) || url.startsWith('blob:') || url.startsWith('data:video/')
}

/**
 * Obtém a URL do embed se for um embed, ou retorna a URL original
 * @param {string} url - URL da mídia
 * @returns {string} URL do embed ou URL original
 */
export function getEmbedUrl(url: string): string {
  if (isYouTubeEmbed(url)) {
    const embedUrl = convertToYouTubeEmbed(url)
    return embedUrl || url
  }
  if (isVimeoEmbed(url)) {
    const embedUrl = convertToVimeoEmbed(url)
    return embedUrl || url
  }
  return url
}

/**
 * Tipo de mídia detectado
 */
export type MediaType = 'image' | 'video-direct' | 'embed-youtube' | 'embed-vimeo' | 'embed-other'

/**
 * Detecta o tipo de mídia baseado na URL
 * @param {string} url - URL da mídia
 * @returns {MediaType} Tipo de mídia detectado
 */
export function detectMediaType(url: string): MediaType {
  if (isYouTubeEmbed(url)) {
    return 'embed-youtube'
  }
  if (isVimeoEmbed(url)) {
    return 'embed-vimeo'
  }
  if (isEmbedUrl(url)) {
    return 'embed-other'
  }
  if (isDirectVideo(url)) {
    return 'video-direct'
  }
  return 'image'
}

/**
 * Obtém a URL do thumbnail do YouTube.
 * @param {string} url - A URL do YouTube.
 * @returns {string | null} A URL do thumbnail ou null se não for possível obter.
 */
export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeId(url)
  if (!videoId)
    return null

  // Retorna thumbnail de alta qualidade usando o formato correto do YouTube
  return `https://i3.ytimg.com/vi/${videoId}/default.jpg`
}

/**
 * Obtém a URL do thumbnail do Vimeo usando serviço público.
 * @param {string} url - A URL do Vimeo.
 * @returns {string | null} A URL do thumbnail ou null se não for possível obter.
 */
export function getVimeoThumbnail(url: string): string | null {
  const videoId = extractVimeoId(url)
  if (!videoId)
    return null

  // Retorna URL de thumbnail do Vimeo (serviço público vumbnail.com)
  return `https://vumbnail.com/${videoId}.jpg`
}
