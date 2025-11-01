<!--
  @fileoverview Componente para renderizar mídias (imagens, vídeos diretos, embeds)
  @module components/raffle/MediaRenderer
  @author Raffle System
-->
<script setup lang="ts">
import type { RaffleMedia } from '~/types/raffle'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  detectMediaType,
  getEmbedUrl,
  isDirectVideo,
  isEmbedUrl,
  isVimeoEmbed,
  isYouTubeEmbed,
} from '~/utils/media'

interface Props {
  /** Mídia a ser renderizada */
  media: RaffleMedia
  /** Alt text para imagens */
  alt?: string
  /** Se deve autoplay (para vídeos) */
  autoplay?: boolean
  /** Se deve ser mutado (para vídeos) */
  muted?: boolean
  /** Se o vídeo está ativo na tela */
  isActive?: boolean
  /** Callback quando o vídeo é registrado (para controle de play/pause) */
  onVideoRegister?: (videoElement: HTMLVideoElement | null) => void
  /** Callback quando o iframe é registrado (para controle de play/pause) */
  onIframeRegister?: (iframeElement: HTMLIFrameElement | null, mediaUrl: string) => void
}

interface Emits {
  (e: 'mediaError', mediaId: string, url: string): void
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  autoplay: false,
  muted: false,
  isActive: false,
})

const emit = defineEmits<Emits>()

// Importa Plyr apenas no cliente para evitar erros de SSR
let Plyr: any = null

/**
 * Referência para o elemento de vídeo
 */
const videoRef = ref<HTMLVideoElement | null>(null)

/**
 * Referência para o elemento iframe
 */
const iframeRef = ref<HTMLIFrameElement | null>(null)

/**
 * Instância do Plyr
 */
let plyrInstance: any = null

/**
 * Tipo de mídia detectado
 */
const mediaType = ref(detectMediaType(props.media.url))

/**
 * URL do embed processada (computed para garantir atualização quando props mudarem)
 */
const embedUrl = computed(() => {
  // Recalcula a URL do embed para garantir que o origin seja atualizado corretamente no cliente
  return getEmbedUrl(props.media.url)
})

/**
 * Inicializa o Plyr para vídeos diretos
 */
onMounted(async () => {
  // Carrega Plyr apenas no cliente
  if (import.meta.client && !Plyr) {
    try {
      const plyrModule = await import('plyr')
      Plyr = plyrModule.default || plyrModule
      await import('plyr/dist/plyr.css')
    }
    catch (error) {
      console.error('Erro ao carregar Plyr:', error)
      Plyr = null
    }
  }

  if (mediaType.value === 'video-direct' && videoRef.value && Plyr) {
    plyrInstance = new Plyr(videoRef.value, {
      autoplay: props.autoplay,
      muted: props.muted,
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
      settings: ['quality', 'speed'],
      ratio: '16:9',
    })

    // Registra o elemento de vídeo do Plyr para controle externo
    if (props.onVideoRegister) {
      props.onVideoRegister(videoRef.value)
    }

    // Escuta eventos do Plyr
    if (plyrInstance && typeof plyrInstance.on === 'function') {
      plyrInstance.on('ready', () => {
        if (props.autoplay && plyrInstance && typeof plyrInstance.play === 'function') {
          const playPromise = plyrInstance.play()
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((err: Error) => {
              console.error('Autoplay bloqueado:', err.message)
            })
          }
        }
      })
    }
  }
  else if (props.onVideoRegister && mediaType.value === 'video-direct' && videoRef.value) {
    // Registra o elemento de vídeo mesmo sem Plyr (fallback)
    props.onVideoRegister(videoRef.value)
  }

  // Registra iframe se for embed
  if (isEmbedUrl(props.media.url) && iframeRef.value && props.onIframeRegister) {
    props.onIframeRegister(iframeRef.value, props.media.url)
  }
})

/**
 * Controla play/pause de iframes (YouTube/Vimeo) baseado em isActive
 */
watch(() => props.isActive, (isActive) => {
  if (!iframeRef.value || !isEmbedUrl(props.media.url))
    return

  const iframe = iframeRef.value
  const url = props.media.url

  // Aguarda um pequeno delay para garantir que o iframe está pronto
  setTimeout(() => {
    if (isActive) {
      // Play no iframe
      if (isYouTubeEmbed(url)) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
      }
      else if (isVimeoEmbed(url)) {
        iframe.contentWindow?.postMessage('{"method":"play"}', '*')
      }
    }
    else {
      // Pause no iframe - prioridade para pausar
      if (isYouTubeEmbed(url)) {
        // Tenta múltiplas formas de pausar o YouTube
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        // Fallback adicional
        iframe.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
      }
      else if (isVimeoEmbed(url)) {
        iframe.contentWindow?.postMessage('{"method":"pause"}', '*')
      }
    }
  }, 100)
}, { immediate: true })

/**
 * Limpa a instância do Plyr ao desmontar
 */
onUnmounted(() => {
  if (plyrInstance) {
    plyrInstance.destroy()
    plyrInstance = null
  }
  if (props.onVideoRegister) {
    props.onVideoRegister(null)
  }
})

/**
 * Handler para erro ao carregar imagem
 */
function handleImageError() {
  console.error(`[MediaRenderer] Erro ao carregar imagem: ${props.media.url}`, {
    mediaId: props.media.id,
    filename: props.media.filename,
    type: props.media.type,
  })
  emit('mediaError', props.media.id, props.media.url)
}

/**
 * Handler para erro ao carregar vídeo
 */
function handleVideoError() {
  console.error(`[MediaRenderer] Erro ao carregar vídeo: ${props.media.url}`, {
    mediaId: props.media.id,
    filename: props.media.filename,
    type: props.media.type,
  })
  emit('mediaError', props.media.id, props.media.url)
}
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <!-- Carousel: Image -->
    <img
      v-if="mediaType === 'image'"
      :src="media.url"
      :alt="alt || media.filename || 'Mídia'"
      class="w-full h-full object-cover"
      @error="handleImageError"
    >

    <!-- Carousel: Embed responsivo (YouTube, Vimeo, etc) -->
    <div
      v-else-if="isEmbedUrl(media.url)"
      class="embed-container"
    >
      <iframe
        ref="iframeRef"
        :src="embedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        @error="handleVideoError"
        @load="() => {
          if (onIframeRegister && iframeRef) {
            onIframeRegister(iframeRef, media.url)
          }
        }"
      />
    </div>

    <!-- Carousel: Vídeo direto com Plyr -->
    <div
      v-else-if="isDirectVideo(media.url)"
      class="plyr-video-container"
    >
      <video
        ref="videoRef"
        :src="media.url"
        class="plyr-video"
        playsinline
        webkit-playsinline
        @error="handleVideoError"
      >
        Your browser does not support HTML5 videos.
      </video>
    </div>
  </div>
</template>

<style scoped>
/* Embed responsivo - funciona para YouTube, Vimeo e outros */
/* O container pai já define aspect-video (16:9), então este container precisa ocupar 100% */
.embed-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Container do vídeo Plyr - deve ocupar 100% do espaço disponível */
/* O container pai já define aspect-video (16:9), então este container só precisa ocupar o espaço */
.plyr-video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plyr-video {
  width: 100%;
  height: 100%;
  display: block;
}

/* Garante que o Plyr ocupe todo o espaço do container mantendo 16:9 e centralizado */
.plyr-video-container :deep(.plyr) {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.plyr-video-container :deep(.plyr__video-wrapper) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plyr-video-container :deep(.plyr__poster) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plyr-video-container :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin: 0 auto;
}
</style>
