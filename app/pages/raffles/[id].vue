<!--
  @fileoverview Página de detalhes de uma rifa específica
  @module pages/raffles/[id]
  @author Raffle System
-->
<script setup lang="ts">
import type { RaffleMedia } from '~/types/raffle'
import { Image as ImageIcon, Play, Video } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import RaffleMediaRenderer from '~/components/raffle/MediaRenderer.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useAuth } from '~/composables/useAuth'
import { mockRaffles } from '~/data/mocks/raffles'
import { mockTickets } from '~/data/mocks/tickets'
import { Currency, RaffleStatus } from '~/types/raffle'
import { getVimeoThumbnail, getYouTubeThumbnail, isDirectVideo, isVimeoEmbed, isYouTubeEmbed } from '~/utils/media'
import { getRaffleMainImage } from '~/utils/raffle'

const { t } = useI18n()
const route = useRoute()
const { user: currentUser } = useAuth()

/**
 * Slug da rifa da rota
 */
const raffleSlug = computed(() => route.params.id as string)

/**
 * Rifa encontrada (por slug ou ID)
 */
const raffle = computed(() => {
  return mockRaffles.find(r => r.slug === raffleSlug.value || r.id === raffleSlug.value)
})

/**
 * Verifica se a rifa existe
 */
if (!raffle.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Rifa não encontrada',
  })
}

/**
 * Meta tags
 */
useHead({
  title: () => raffle.value?.name || 'Detalhes da Rifa',
})

definePageMeta({
  layout: 'public',
})

/**
 * Estados do diálogo de compra
 */
const showPurchaseDialog = ref(false)
const ticketQuantity = ref<number | undefined>(1)
const userTicketsForRaffle = computed(() => {
  if (!raffle.value)
    return []
  const userId = currentUser.value?.id || ''
  return mockTickets.filter(t => t.userId === userId && t.raffleId === raffle.value?.id)
})

/**
 * Calcula porcentagem de progresso
 */
const progress = computed(() => {
  if (!raffle.value)
    return 0
  return Math.min((raffle.value.collectedAmount / raffle.value.targetAmount) * 100, 100)
})

/**
 * Calcula valor total da compra
 */
const totalPrice = computed(() => {
  if (!raffle.value || !ticketQuantity.value)
    return 0
  return raffle.value.ticketPrice * ticketQuantity.value
})

/**
 * Formata valor monetário
 */
function formatCurrency(value: number, currency: Currency = Currency.SOL): string {
  const symbols: Partial<Record<Currency, string>> = {
    [Currency.SOL]: '◎',
    [Currency.BRL]: 'R$',
  }
  return `${symbols[currency]}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Formata data
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Processa compra de tickets
 */
function handlePurchase(): void {
  if (!ticketQuantity.value || ticketQuantity.value <= 0) {
    return
  }
  // Em produção, aqui seria feita a integração com a blockchain
  console.warn('Purchase tickets:', ticketQuantity.value, 'for raffle:', raffle.value?.id)
  showPurchaseDialog.value = false
  ticketQuantity.value = 1
}

/**
 * Mídias filtradas (removendo as que falharam ao carregar)
 */
const failedMediaIds = ref<Set<string>>(new Set())

/**
 * Mídias ordenadas (imagens + vídeos)
 */
const allMedia = computed(() => {
  if (!raffle.value)
    return []
  const media: RaffleMedia[] = [
    ...raffle.value.images.map(img => ({ ...img, type: 'image' as const })),
    ...raffle.value.videos.map(vid => ({ ...vid, type: 'video' as const })),
  ]
  // Remove mídias que falharam ao carregar
  return media
    .filter(m => !failedMediaIds.value.has(m.id))
    .sort((a, b) => a.order - b.order)
})

/**
 * Handler para quando uma mídia falha ao carregar
 */
function handleMediaError(mediaId: string, url: string) {
  if (!failedMediaIds.value.has(mediaId)) {
    failedMediaIds.value.add(mediaId)
    console.error(`[RaffleDetail] Mídia removida devido a erro de carregamento:`, {
      mediaId,
      url,
    })
  }
}

/**
 * Thumbnails cache para evitar múltiplas requisições
 */
const thumbnailCache = ref<Record<string, string>>({})

/**
 * Obtém a URL do thumbnail para uma mídia
 */
async function getThumbnailUrl(media: RaffleMedia): Promise<string | null> {
  const cacheKey = media.id

  // Se já está no cache, retorna
  if (thumbnailCache.value[cacheKey]) {
    return thumbnailCache.value[cacheKey]
  }

  // Se é imagem, retorna a própria URL
  if (media.type === 'image') {
    thumbnailCache.value[cacheKey] = media.url
    return media.url
  }

  // Se é YouTube, obtém thumbnail
  if (isYouTubeEmbed(media.url)) {
    const thumbnail = getYouTubeThumbnail(media.url)
    if (thumbnail) {
      thumbnailCache.value[cacheKey] = thumbnail
      return thumbnail
    }
  }

  // Se é Vimeo, obtém thumbnail via API
  if (isVimeoEmbed(media.url)) {
    const thumbnail = await getVimeoThumbnail(media.url)
    if (thumbnail) {
      thumbnailCache.value[cacheKey] = thumbnail
      return thumbnail
    }
  }

  // Para vídeos diretos (MP4), retorna null (será usado video element)
  return null
}

/**
 * Thumbnails computados para cada mídia
 */
const mediaThumbnails = ref<Record<string, string>>({})

/**
 * Carrega thumbnails para todas as mídias
 */
async function loadThumbnails() {
  for (const media of allMedia.value) {
    if (!mediaThumbnails.value[media.id]) {
      const thumbnail = await getThumbnailUrl(media)
      if (thumbnail) {
        mediaThumbnails.value[media.id] = thumbnail
      }
    }
  }
}

/**
 * Carrega thumbnails quando as mídias mudarem
 */
watch(allMedia, () => {
  if (import.meta.client) {
    loadThumbnails()
  }
}, { immediate: true })

/**
 * Carrega thumbnails no mount
 */
onMounted(() => {
  if (import.meta.client) {
    loadThumbnails()
  }
})

/**
 * Imagem principal (primeira imagem do array ou fallback)
 */
const mainImage = computed(() => {
  if (!raffle.value)
    return ''
  return getRaffleMainImage(raffle.value)
})

/**
 * Referência do componente Carousel
 */
const carouselRef = ref<any>(null)

/**
 * Referência do carousel API
 */
const carouselApi = computed(() => {
  return carouselRef.value?.carouselApi || null
})

/**
 * Referências para os elementos de vídeo
 */
const videoRefs = ref<Record<string, HTMLVideoElement>>({})

/**
 * Referências para os elementos iframe (YouTube/Vimeo)
 */
const iframeRefs = ref<Record<string, HTMLIFrameElement>>({})

/**
 * Índice do slide ativo
 */
const activeSlideIndex = ref(0)

/**
 * Registra referência de vídeo
 */
function registerVideoRef(mediaId: string, videoElement: HTMLVideoElement | null) {
  if (videoElement) {
    videoRefs.value[mediaId] = videoElement
  }
  else {
    delete videoRefs.value[mediaId]
  }
}

/**
 * Registra referência de iframe
 */
function registerIframeRef(mediaId: string, iframeElement: HTMLIFrameElement | null, _mediaUrl: string) {
  if (iframeElement) {
    iframeRefs.value[mediaId] = iframeElement
  }
  else {
    delete iframeRefs.value[mediaId]
  }
}

/**
 * Controla play/pause dos vídeos e embeds baseado no slide ativo
 */
function controlVideos() {
  // Pausa todos os vídeos diretos
  Object.entries(videoRefs.value).forEach(([_mediaId, video]) => {
    if (video && !video.paused) {
      video.pause()
    }
  })

  // Pausa todos os iframes (YouTube/Vimeo) que não estão ativos
  Object.entries(iframeRefs.value).forEach(([mediaId, iframe]) => {
    if (!iframe)
      return

    const activeMedia = allMedia.value[activeSlideIndex.value]
    const media = allMedia.value.find(m => m.id === mediaId)

    if (!media || (activeMedia && activeMedia.id !== mediaId)) {
      // Pausa iframe que não está ativo
      const url = media?.url || ''
      if (isYouTubeEmbed(url)) {
        // Tenta múltiplas formas de pausar o YouTube
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        // Fallback adicional para garantir que pare
        setTimeout(() => {
          iframe.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
        }, 50)
      }
      else if (isVimeoEmbed(url)) {
        iframe.contentWindow?.postMessage('{"method":"pause"}', '*')
      }
    }
  })

  // Se o slide ativo contém um vídeo direto, dá play
  const activeMedia = allMedia.value[activeSlideIndex.value]
  if (activeMedia && activeMedia.type === 'video') {
    if (isDirectVideo(activeMedia.url)) {
      const video = videoRefs.value[activeMedia.id]
      if (video) {
        // Usa nextTick para garantir que o DOM está atualizado
        nextTick(() => {
          video.play().catch((err) => {
            // Ignora erros de autoplay (alguns navegadores bloqueiam)
            console.warn('Autoplay bloqueado:', err)
          })
        })
      }
    }
    else if (isEmbedUrl(activeMedia.url)) {
      // Play no iframe ativo (YouTube/Vimeo)
      const iframe = iframeRefs.value[activeMedia.id]
      if (iframe) {
        const url = activeMedia.url
        nextTick(() => {
          if (isYouTubeEmbed(url)) {
            iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
          }
          else if (isVimeoEmbed(url)) {
            iframe.contentWindow?.postMessage('{"method":"play"}', '*')
          }
        })
      }
    }
  }
}

/**
 * Navega para um slide específico
 */
function goToSlide(index: number) {
  if (carouselApi.value) {
    carouselApi.value.scrollTo(index)
  }
}

/**
 * Inicializa controle de vídeos quando o carousel API estiver disponível
 */
watch(carouselApi, (api) => {
  if (api) {
    // Obtém o índice inicial
    activeSlideIndex.value = api.selectedScrollSnap() || 0

    // Escuta mudanças de slide
    api.on('select', () => {
      activeSlideIndex.value = api.selectedScrollSnap() || 0
      controlVideos()
    })

    // Controla o vídeo inicial se necessário
    nextTick(() => {
      controlVideos()
    })
  }
}, { immediate: true })
</script>

<template>
  <div v-if="raffle" class="w-full overflow-x-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="flex flex-col gap-6 max-w-7xl mx-auto">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            @click="navigateTo('/raffles')"
          >
            {{ t('raffles.title', 'Rifas') }}
          </Button>
          <span>/</span>
          <span>{{ raffle.name }}</span>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Imagem e Informações Principais -->
          <div class="space-y-4 min-w-0">
            <!-- Galeria de Mídias -->
            <div v-if="allMedia.length > 0" class="space-y-4 w-full">
              <Carousel
                ref="carouselRef"
                class="w-full relative"
                :opts="{ loop: true }"
              >
                <CarouselContent>
                  <CarouselItem
                    v-for="media in allMedia"
                    :key="media.id"
                  >
                    <div class="relative w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center" :class="media.type === 'video' ? 'aspect-video' : 'aspect-square'">
                      <RaffleMediaRenderer
                        :media="media"
                        :alt="media.filename || raffle.name"
                        :autoplay="activeSlideIndex === allMedia.indexOf(media) && media.type === 'video'"
                        :muted="false"
                        :is-active="activeSlideIndex === allMedia.indexOf(media)"
                        :on-video-register="(el) => {
                          if (isDirectVideo(media.url)) {
                            registerVideoRef(media.id, el as HTMLVideoElement)
                          }
                        }"
                        :on-iframe-register="(el, url) => {
                          if (isEmbedUrl(url)) {
                            registerIframeRef(media.id, el, url)
                          }
                        }"
                        @media-error="handleMediaError"
                      />
                      <Badge
                        v-if="media.type === 'video'"
                        class="absolute top-4 right-4"
                        variant="secondary"
                      >
                        <Video class="mr-1 h-3 w-3" />
                        Vídeo
                      </Badge>
                      <Badge
                        v-if="media.type === 'image' && media.order === 0"
                        class="absolute top-4 right-4"
                        variant="secondary"
                      >
                        <ImageIcon class="mr-1 h-3 w-3" />
                        Principal
                      </Badge>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious variant="default" class="!left-4 top-1/2 -translate-y-1/2 z-10 shadow-lg" />
                <CarouselNext variant="default" class="!right-4 top-1/2 -translate-y-1/2 z-10 shadow-lg" />
              </Carousel>

              <!-- Preview de Miniaturas -->
              <div v-if="allMedia.length > 1" class="w-full overflow-hidden">
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent md:grid md:grid-cols-6 lg:grid-cols-8 md:overflow-x-visible md:pb-0 md:gap-2">
                  <button
                    v-for="(media, index) in allMedia"
                    :key="media.id"
                    type="button"
                    class="relative flex-shrink-0 h-20 w-20 md:h-auto md:w-full aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:opacity-80" :class="[
                      activeSlideIndex === index
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent opacity-60 hover:opacity-100',
                    ]"
                    @click="goToSlide(index)"
                  >
                    <!-- Imagem -->
                    <img
                      v-if="media.type === 'image'"
                      :src="media.url"
                      :alt="media.filename || raffle.name"
                      class="h-full w-full object-cover"
                    >
                    <!-- Thumbnail de YouTube ou Vimeo -->
                    <div
                      v-else-if="mediaThumbnails[media.id]"
                      class="relative h-full w-full"
                    >
                      <img
                        :src="mediaThumbnails[media.id]"
                        :alt="media.filename || raffle.name"
                        class="h-full w-full object-cover"
                      >
                      <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div class="rounded-full bg-primary/80 p-2 flex items-center justify-center">
                          <Play class="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <!-- Vídeo direto (MP4) - usa primeira frame -->
                    <div
                      v-else
                      class="relative h-full w-full bg-muted flex items-center justify-center"
                    >
                      <video
                        :src="media.url"
                        class="h-full w-full object-cover"
                        muted
                        playsinline
                        preload="metadata"
                        @loadedmetadata="(e) => {
                          const video = e.target as HTMLVideoElement
                          video.currentTime = 0.1
                        }"
                      />
                      <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div class="rounded-full bg-primary/80 p-2 flex items-center justify-center">
                          <Play class="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Badges de status e principal -->
              <div class="flex gap-2">
                <Badge
                  v-if="raffle.isMain"
                  variant="default"
                >
                  {{ t('raffles.main', 'Principal') }}
                </Badge>
                <Badge
                  :variant="raffle.status === RaffleStatus.ACTIVE ? 'default' : 'secondary'"
                >
                  {{ t(`raffles.status.${raffle.status}`, raffle.status) }}
                </Badge>
              </div>
            </div>
            <!-- Fallback: imagem única se não houver mídias -->
            <div v-else class="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
              <img
                :src="mainImage"
                :alt="raffle.name"
                class="h-full w-full object-cover"
              >
              <Badge
                v-if="raffle.isMain"
                class="absolute top-4 right-4"
                variant="default"
              >
                {{ t('raffles.main', 'Principal') }}
              </Badge>
              <Badge
                class="absolute top-4 left-4"
                :variant="raffle.status === RaffleStatus.ACTIVE ? 'default' : 'secondary'"
              >
                {{ t(`raffles.status.${raffle.status}`, raffle.status) }}
              </Badge>
            </div>

            <!-- Minhas Participações -->
            <Card v-if="userTicketsForRaffle.length > 0">
              <CardHeader>
                <CardTitle class="text-lg">
                  {{ t('raffleDetails.myTickets', 'Meus Tickets nesta Rifa') }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="ticket in userTicketsForRaffle"
                    :key="ticket.id"
                    variant="outline"
                    class="text-lg px-3 py-1"
                  >
                    #{{ ticket.ticketNumber }}
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground mt-2">
                  {{ t('raffleDetails.totalTickets', 'Total') }}: {{ userTicketsForRaffle.length }}
                </p>
              </CardContent>
            </Card>
          </div>

          <!-- Detalhes e Ações -->
          <div class="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle class="text-2xl">
                  {{ raffle.name }}
                </CardTitle>
                <CardDescription>
                  {{ raffle.description }}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Prêmio -->
                <div>
                  <p class="text-sm text-muted-foreground mb-1">
                    {{ t('raffleDetails.prize', 'Prêmio') }}
                  </p>
                  <p class="text-2xl font-bold">
                    {{ formatCurrency(raffle.prizeAmount, raffle.prizeCurrency) }}
                  </p>
                </div>

                <!-- Progresso -->
                <div>
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-muted-foreground">
                      {{ t('raffleDetails.progress', 'Progresso') }}
                    </span>
                    <span class="font-medium">
                      {{ Math.round(progress) }}%
                    </span>
                  </div>
                  <div class="h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      class="h-full bg-primary transition-all"
                      :style="{ width: `${progress}%` }"
                    />
                  </div>
                  <div class="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {{ formatCurrency(raffle.collectedAmount, raffle.prizeCurrency) }}
                    </span>
                    <span>
                      {{ formatCurrency(raffle.targetAmount, raffle.prizeCurrency) }}
                    </span>
                  </div>
                </div>

                <!-- Informações -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-muted-foreground mb-1">
                      {{ t('raffleDetails.ticketPrice', 'Preço do Ticket') }}
                    </p>
                    <p class="font-semibold">
                      {{ formatCurrency(raffle.ticketPrice, raffle.prizeCurrency) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground mb-1">
                      {{ t('raffleDetails.ticketsSold', 'Tickets Vendidos') }}
                    </p>
                    <p class="font-semibold">
                      {{ raffle.totalTicketsSold.toLocaleString('pt-BR') }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground mb-1">
                      {{ t('raffleDetails.startDate', 'Data de Início') }}
                    </p>
                    <p class="font-semibold text-sm">
                      {{ formatDate(raffle.startDate) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground mb-1">
                      {{ t('raffleDetails.endDate', 'Data de Término') }}
                    </p>
                    <p class="font-semibold text-sm">
                      {{ formatDate(raffle.endDate) }}
                    </p>
                  </div>
                </div>

                <!-- Botão de Compra -->
                <Button
                  v-if="raffle.status === RaffleStatus.ACTIVE"
                  class="w-full"
                  size="lg"
                  @click="showPurchaseDialog = true"
                >
                  {{ t('raffleDetails.buyTickets', 'Comprar Tickets') }}
                </Button>
                <Button
                  v-else
                  class="w-full"
                  size="lg"
                  variant="secondary"
                  disabled
                >
                  {{ t('raffleDetails.notAvailable', 'Rifa não disponível') }}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Dialog de Compra -->
        <Dialog :open="showPurchaseDialog" @update:open="showPurchaseDialog = $event">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {{ t('raffleDetails.buyTickets', 'Comprar Tickets') }}
              </DialogTitle>
              <DialogDescription>
                {{ t('raffleDetails.selectQuantity', 'Selecione a quantidade de tickets que deseja comprar') }}
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label for="ticket-quantity">
                  {{ t('raffleDetails.quantity', 'Quantidade') }}
                </Label>
                <Input
                  id="ticket-quantity"
                  v-model.number="ticketQuantity"
                  type="number"
                  :placeholder="t('raffleDetails.enterQuantity', 'Digite a quantidade')"
                  min="1"
                  :max="100"
                />
              </div>
              <div class="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span class="text-sm text-muted-foreground">
                  {{ t('raffleDetails.totalPrice', 'Valor Total') }}:
                </span>
                <span class="text-xl font-bold">
                  {{ formatCurrency(totalPrice, raffle.prizeCurrency) }}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                @click="showPurchaseDialog = false"
              >
                {{ t('common.cancel', 'Cancelar') }}
              </Button>
              <Button
                :disabled="!ticketQuantity || ticketQuantity <= 0"
                @click="handlePurchase"
              >
                {{ t('raffleDetails.confirmPurchase', 'Confirmar Compra') }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
