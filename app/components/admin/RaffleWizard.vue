<!--
  @fileoverview Wizard para criação/edição de rifas
  @module components/admin/RaffleWizard
  @author Raffle System
-->
<script setup lang="ts">
import type { RaffleFormData, RaffleMedia } from '~/types/raffle'
import { Check, GripVertical, Image as ImageIcon, Plus, Upload, Video, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import CurrencyInput from '~/components/ui/currency-input/CurrencyInput.vue'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '~/components/ui/stepper'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import { Currency, DrawMethod, TicketSelectionMethod } from '~/types/raffle'
import { getVimeoThumbnail, getVimeoTitle, getYouTubeThumbnail, getYouTubeTitle, isDirectVideo, isVimeoEmbed, isYouTubeEmbed } from '~/utils/media'
import { generateId } from '~/utils/nanoid'

interface Props {
  /** Se está em modo de edição */
  isEdit?: boolean
  /** Dados iniciais do formulário (para edição) */
  initialData?: RaffleFormData
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
})

const emit = defineEmits<{
  (e: 'submit', data: RaffleFormData): void
  (e: 'cancel'): void
}>()

/**
 * Etapa atual do wizard
 */
const currentStep = ref(1)

/**
 * Total de etapas
 */
const totalSteps = 6

/**
 * Definição das etapas
 */
const steps = [
  { step: 1, title: 'Informações Básicas', description: 'Nome, descrição e valores' },
  { step: 2, title: 'Mídias', description: 'Imagens e vídeos' },
  { step: 3, title: 'Método de Sorteio', description: 'Como será realizado o sorteio' },
  { step: 4, title: 'Seleção de Tickets', description: 'Como os tickets serão selecionados' },
  { step: 5, title: 'Configurações de Reserva', description: 'Regras de reserva de tickets' },
  { step: 6, title: 'Revisão', description: 'Confirme os dados' },
]

/**
 * Estado do formulário
 */
const form = ref<RaffleFormData>({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  imageUrl: props.initialData?.imageUrl || '',
  images: props.initialData?.images || [],
  videos: props.initialData?.videos || [],
  prizeAmount: props.initialData?.prizeAmount || 0,
  prizeCurrency: props.initialData?.prizeCurrency || Currency.SOL,
  ticketPrice: props.initialData?.ticketPrice || 10,
  durationDays: props.initialData?.durationDays || 7,
  isMain: props.initialData?.isMain || false,
  totalTickets: props.initialData?.totalTickets || null,
  drawConfiguration: props.initialData?.drawConfiguration || {
    methods: [],
    customRules: '',
  },
  ticketSelectionConfiguration: props.initialData?.ticketSelectionConfiguration || {
    method: TicketSelectionMethod.RANDOM_WITH_BUTTONS,
    quickButtons: [1, 20, 50, 100, 300, 500],
    randomizeExposed: false,
    minTicketNumber: undefined,
    maxTicketNumber: null,
  },
  reservationConfiguration: props.initialData?.reservationConfiguration || {
    minimumReservationMinutes: undefined,
    minimumReservationQuantity: 1,
    maximumReservationQuantity: null,
  },
})

/**
 * Métodos de sorteio disponíveis
 */
const drawMethods = [
  { value: DrawMethod.FEDERAL_LOTTERY, label: 'Loteria Federal' },
  { value: DrawMethod.INTERNAL_DRAWER, label: 'Sorteador Interno' },
  { value: DrawMethod.SOCIAL_MEDIA_POST, label: 'Post em Rede Social' },
  { value: DrawMethod.TELEGRAM, label: 'Telegram' },
  { value: DrawMethod.ORGANIZER, label: 'Organizador' },
]

/**
 * Métodos de seleção de tickets disponíveis
 */
const ticketSelectionMethods = [
  { value: TicketSelectionMethod.RANDOM_WITH_BUTTONS, label: 'Aleatório com Botões (+1, +20, +50, etc)' },
  { value: TicketSelectionMethod.EXPOSED_NUMBERS, label: 'Números Expostos (escolha manual)' },
]

/**
 * Verifica se pode avançar para próxima etapa
 */
const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.value.name && form.value.description && form.value.prizeAmount > 0 && form.value.ticketPrice > 0
    case 2:
      return form.value.images.length > 0 // Pelo menos uma imagem
    case 3:
      return form.value.drawConfiguration?.methods && form.value.drawConfiguration.methods.length > 0
    case 4:
      return true // Sempre válido
    case 5:
      return true // Opcional
    case 6:
      return true // Revisão
    default:
      return false
  }
})

/**
 * Verifica se Telegram está selecionado
 */
const isTelegramSelected = computed(() => {
  return form.value.drawConfiguration?.methods?.includes(DrawMethod.TELEGRAM) || false
})

/**
 * Computed para métodos selecionados (garante reatividade)
 */
const selectedMethods = computed(() => {
  return form.value.drawConfiguration?.methods || []
})

/**
 * Counter para forçar re-render dos checkboxes
 */
const checkboxKeyCounter = ref(0)

/**
 * Navega para próxima etapa
 */
function nextStep() {
  if (canGoNext.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

/**
 * Navega para etapa anterior
 */
function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

/**
 * Navega para etapa específica
 */
function goToStep(step: number) {
  if (step >= 1 && step <= totalSteps) {
    currentStep.value = step
  }
}

/**
 * Alterna método de sorteio
 */
function toggleDrawMethod(method: DrawMethod) {
  if (!form.value.drawConfiguration) {
    form.value.drawConfiguration = { methods: [] }
  }
  const currentMethods = form.value.drawConfiguration.methods || []
  const index = currentMethods.indexOf(method)

  // Cria uma nova referência do objeto completo para garantir reatividade
  const newMethods = index > -1
    ? currentMethods.filter(m => m !== method)
    : [...currentMethods, method]

  // Força atualização criando nova referência do objeto form também
  form.value = {
    ...form.value,
    drawConfiguration: {
      ...form.value.drawConfiguration,
      methods: newMethods,
    },
  }

  // Incrementa contador para forçar re-render dos checkboxes
  checkboxKeyCounter.value++
}

/**
 * URL do vídeo a ser adicionado
 */
const videoUrlInput = ref('')

/**
 * Verifica se a URL do vídeo é válida (YouTube, Vimeo ou vídeo direto)
 */
const isVideoUrlValid = computed(() => {
  const url = videoUrlInput.value.trim()
  if (!url)
    return false

  return isYouTubeEmbed(url) || isVimeoEmbed(url) || isDirectVideo(url)
})

/**
 * Obtém o nome do arquivo de uma URL
 */
function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop() || 'video'
    return filename
  }
  catch {
    // Se não for uma URL válida, tenta extrair do path
    const parts = url.split('/')
    return parts[parts.length - 1] || 'video'
  }
}

/**
 * Adiciona um vídeo pela URL
 */
async function addVideoByUrl() {
  const url = videoUrlInput.value.trim()
  if (!isVideoUrlValid.value || !url)
    return

  // Verifica se o vídeo já existe (verifica em ambas as listas: uploads e URLs)
  const existsInVideos = form.value.videos.some(v => v.url === url)
  if (existsInVideos) {
    toast.error('Este vídeo já foi adicionado')
    return
  }

  // Cria o objeto de mídia inicial (será atualizado com thumbnail e título)
  const videoMedia: RaffleMedia = {
    id: generateId(),
    url,
    type: 'video',
    order: 0, // Adiciona no início (ordem 0)
    filename: getFilenameFromUrl(url),
  }

  // Busca thumbnail e título baseado no tipo de vídeo
  try {
    if (isYouTubeEmbed(url)) {
      const [thumbnail, title] = await Promise.all([
        Promise.resolve(getYouTubeThumbnail(url)),
        getYouTubeTitle(url),
      ])
      videoMedia.thumbnail = thumbnail || undefined
      videoMedia.title = title || undefined
    }
    else if (isVimeoEmbed(url)) {
      const [thumbnail, title] = await Promise.all([
        Promise.resolve(getVimeoThumbnail(url)),
        getVimeoTitle(url),
      ])
      videoMedia.thumbnail = thumbnail || undefined
      videoMedia.title = title || undefined
    }
    else if (isDirectVideo(url)) {
      // Para vídeos diretos, não há como buscar thumbnail/título via API
      // O thumbnail será gerado pelo MediaRenderer ou deixado vazio
      videoMedia.title = getFilenameFromUrl(url)
    }
  }
  catch (error) {
    console.error('Erro ao buscar metadados do vídeo:', error)
    // Continua mesmo se falhar ao buscar metadados
  }

  // Incrementa a ordem de todos os itens existentes (imagens + vídeos)
  const totalNewItems = 1 // Apenas 1 vídeo sendo adicionado
  form.value.images = form.value.images.map(img => ({ ...img, order: (img.order ?? 0) + totalNewItems }))
  form.value.videos = form.value.videos.map(vid => ({ ...vid, order: (vid.order ?? 0) + totalNewItems }))

  // Adiciona ao início do array de vídeos
  form.value.videos.unshift(videoMedia)

  // Limpa o campo de input
  videoUrlInput.value = ''

  toast.success('Vídeo adicionado com sucesso!')
}

/**
 * Lista combinada de todas as mídias
 */
const allMedia = computed(() => {
  const images = form.value.images.map((img, index) => ({ ...img, order: img.order ?? index, type: 'image' as const }))
  const videos = form.value.videos.map((vid, index) => ({ ...vid, order: vid.order ?? images.length + index, type: 'video' as const }))
  return [...images, ...videos].sort((a, b) => a.order - b.order)
})

/**
 * Estados para drag and drop
 */
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const draggedIndex = ref<number | null>(null)
const draggedOverIndex = ref<number | null>(null)

/**
 * Manipula seleção de arquivos
 */
function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length === 0)
    return

  handleFiles(files)
  input.value = ''
}

/**
 * Processa arquivos selecionados
 */
async function handleFiles(files: File[]) {
  const maxSize = 50 // MB
  const newImages: RaffleMedia[] = []
  const newVideos: RaffleMedia[] = []

  for (const file of files) {
    // Valida tamanho
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Arquivo ${file.name} excede o tamanho máximo de ${maxSize}MB`)
      continue
    }

    // Cria preview
    const preview = await createFilePreview(file)
    const id = generateId()

    const media: RaffleMedia = {
      id,
      url: preview,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      order: 0, // Adiciona no início (ordem 0)
      filename: file.name,
      size: file.size,
    }

    if (media.type === 'image') {
      newImages.push(media)
    }
    else {
      newVideos.push(media)
    }
  }

  // Incrementa a ordem de todos os itens existentes (imagens + vídeos)
  const totalNewItems = newImages.length + newVideos.length
  form.value.images = form.value.images.map(img => ({ ...img, order: (img.order ?? 0) + totalNewItems }))
  form.value.videos = form.value.videos.map(vid => ({ ...vid, order: (vid.order ?? 0) + totalNewItems }))

  // Atualiza ordem dos novos itens para serem sequenciais no início
  newImages.forEach((img, index) => {
    img.order = index
  })
  newVideos.forEach((vid, index) => {
    vid.order = newImages.length + index
  })

  // Adiciona novos itens no início dos arrays
  if (newImages.length > 0) {
    form.value.images = [...newImages, ...form.value.images]
  }
  if (newVideos.length > 0) {
    form.value.videos = [...newVideos, ...form.value.videos]
  }

  toast.success(`${files.length} arquivo(s) adicionado(s) com sucesso`)
}

/**
 * Cria preview do arquivo
 */
function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Formata tamanho do arquivo
 */
function formatFileSize(bytes?: number): string {
  if (!bytes)
    return 'N/A'
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Remove mídia
 */
function removeMedia(media: RaffleMedia) {
  if (media.type === 'image') {
    form.value.images = form.value.images.filter(img => img.id !== media.id)
  }
  else {
    form.value.videos = form.value.videos.filter(vid => vid.id !== media.id)
  }
}

/**
 * Reordena mídias
 */
function reorderMedia(draggedIndex: number, targetIndex: number) {
  // Cria uma cópia da lista atual mantendo os objetos originais
  const media = allMedia.value.map((item, idx) => ({
    ...item,
    originalIndex: idx,
  }))

  const [dragged] = media.splice(draggedIndex, 1)
  if (!dragged)
    return

  media.splice(targetIndex, 0, dragged)

  // Atualiza ordem preservando os objetos originais
  const newImages: RaffleMedia[] = []
  const newVideos: RaffleMedia[] = []

  media.forEach((item, index) => {
    if (item.type === 'image' && item.id && item.url) {
      // Encontra a imagem original no array e atualiza
      const originalIndex = form.value.images.findIndex(img => img.id === item.id)
      if (originalIndex > -1) {
        const original = form.value.images[originalIndex]
        // Garante que tem todos os campos obrigatórios (já verificamos que originalIndex > -1)
        if (original && original.id && original.url) {
          newImages.push({ ...original, order: index })
        }
      }
      else {
        // Fallback: cria novo objeto garantindo campos obrigatórios
        const { originalIndex: _, ...rest } = item
        newImages.push({
          ...rest,
          order: index,
        } as RaffleMedia)
      }
    }
    else if (item.type === 'video' && item.id && item.url) {
      // Encontra o vídeo original no array e atualiza
      const originalIndex = form.value.videos.findIndex(vid => vid.id === item.id)
      if (originalIndex > -1) {
        const original = form.value.videos[originalIndex]
        // Garante que tem todos os campos obrigatórios (já verificamos que originalIndex > -1)
        if (original && original.id && original.url) {
          newVideos.push({ ...original, order: index })
        }
      }
      else {
        // Fallback: cria novo objeto garantindo campos obrigatórios
        const { originalIndex: _, ...rest } = item
        newVideos.push({
          ...rest,
          order: index,
        } as RaffleMedia)
      }
    }
  })

  // Atualiza os arrays com nova ordem
  form.value.images = newImages
  form.value.videos = newVideos
}

/**
 * Handlers de drag and drop
 */
function handleDragOver(e: DragEvent) {
  if (draggedIndex.value !== null)
    return
  if (e.dataTransfer?.types.includes('Files')) {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = true
  }
}

function handleDragLeave(e: DragEvent) {
  if (draggedIndex.value !== null)
    return
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  if (draggedIndex.value !== null)
    return
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false

  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    handleFiles(files)
  }
}

function handleItemDragStart(e: DragEvent, index: number) {
  draggedIndex.value = index
  draggedOverIndex.value = null
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleItemDragEnter(e: DragEvent, index: number) {
  e.preventDefault()
  e.stopPropagation()
  if (draggedIndex.value === null || draggedIndex.value === index)
    return
  draggedOverIndex.value = index
}

function handleItemDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  e.stopPropagation()
  if (draggedIndex.value === null || draggedIndex.value === index)
    return
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleItemDragLeave() {
  // Não limpar aqui para permitir drag entre items
}

function handleItemDrop(e: DragEvent, index: number) {
  e.preventDefault()
  e.stopPropagation()

  if (draggedIndex.value === null || draggedIndex.value === index) {
    draggedIndex.value = null
    draggedOverIndex.value = null
    return
  }

  reorderMedia(draggedIndex.value, index)
  draggedIndex.value = null
  draggedOverIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
  draggedOverIndex.value = null
}

/**
 * Submete o formulário
 */
function handleSubmit() {
  // Define imageUrl principal da primeira imagem
  if (form.value.images.length > 0) {
    form.value.imageUrl = form.value.images[0]?.url || ''
  }

  emit('submit', form.value)
}
</script>

<template>
  <div class="w-full space-y-6">
    <!-- Stepper Navigation -->
    <Card>
      <CardContent class="pt-6">
        <div class="w-full overflow-x-auto pb-2">
          <Stepper :step="currentStep" class="w-full min-w-max md:min-w-0">
            <StepperItem
              v-for="step in steps"
              :key="step.step"
              v-slot="{ state }"
              :step="step.step"
              class="flex-shrink-0 md:flex-1 min-w-[120px] md:min-w-0"
            >
              <StepperTrigger
                class="w-full px-2 md:px-0"
                @click="goToStep(step.step)"
              >
                <StepperIndicator class="shrink-0">
                  <span v-if="state === 'completed'" class="text-xs md:text-sm font-semibold">✓</span>
                  <span v-else-if="state === 'active'" class="text-xs md:text-sm font-semibold">{{ step.step }}</span>
                  <span v-else class="text-xs md:text-sm text-muted-foreground">{{ step.step }}</span>
                </StepperIndicator>
                <div class="flex flex-col items-center gap-1 min-w-0 w-full">
                  <StepperTitle class="text-[10px] sm:text-xs md:text-sm text-center truncate w-full">
                    {{ step.title }}
                  </StepperTitle>
                  <StepperDescription class="text-[9px] sm:text-[10px] md:text-xs hidden md:block text-center">
                    {{ step.description }}
                  </StepperDescription>
                </div>
              </StepperTrigger>
              <StepperSeparator v-if="step.step < totalSteps" class="hidden md:block" />
            </StepperItem>
          </Stepper>
        </div>
      </CardContent>
    </Card>

    <!-- Step Content -->
    <Card>
      <CardHeader>
        <CardTitle>{{ steps[currentStep - 1]?.title }}</CardTitle>
        <CardDescription>{{ steps[currentStep - 1]?.description }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Etapa 1: Informações Básicas -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="space-y-2">
            <Label for="name">Nome da Rifa *</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Ex: iPhone 15 Pro Max"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="description">Descrição *</Label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Descrição detalhada do prêmio"
              class="min-h-[100px]"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="prizeAmount">Valor do Prêmio *</Label>
              <CurrencyInput
                id="prizeAmount"
                v-model="form.prizeAmount"
                :currency="form.prizeCurrency"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="prizeCurrency">Moeda do Prêmio *</Label>
              <select
                id="prizeCurrency"
                v-model="form.prizeCurrency"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <!-- Criptomoedas -->
                <optgroup label="Criptomoedas">
                  <option :value="Currency.SOL">
                    SOL - Solana
                  </option>
                </optgroup>
                <!-- Américas -->
                <optgroup label="Américas">
                  <option :value="Currency.USD">
                    USD - Dólar Americano
                  </option>
                  <option :value="Currency.BRL">
                    BRL - Real Brasileiro
                  </option>
                  <option :value="Currency.CAD">
                    CAD - Dólar Canadense
                  </option>
                  <option :value="Currency.MXN">
                    MXN - Peso Mexicano
                  </option>
                  <option :value="Currency.ARS">
                    ARS - Peso Argentino
                  </option>
                  <option :value="Currency.CLP">
                    CLP - Peso Chileno
                  </option>
                  <option :value="Currency.COP">
                    COP - Peso Colombiano
                  </option>
                  <option :value="Currency.PEN">
                    PEN - Sol Peruano
                  </option>
                </optgroup>
                <!-- Europa -->
                <optgroup label="Europa">
                  <option :value="Currency.EUR">
                    EUR - Euro
                  </option>
                  <option :value="Currency.GBP">
                    GBP - Libra Esterlina
                  </option>
                  <option :value="Currency.CHF">
                    CHF - Franco Suíço
                  </option>
                  <option :value="Currency.PLN">
                    PLN - Zloty Polonês
                  </option>
                  <option :value="Currency.RUB">
                    RUB - Rublo Russo
                  </option>
                  <option :value="Currency.TRY">
                    TRY - Lira Turca
                  </option>
                  <option :value="Currency.SEK">
                    SEK - Coroa Sueca
                  </option>
                  <option :value="Currency.NOK">
                    NOK - Coroa Norueguesa
                  </option>
                  <option :value="Currency.DKK">
                    DKK - Coroa Dinamarquesa
                  </option>
                </optgroup>
                <!-- Ásia -->
                <optgroup label="Ásia">
                  <option :value="Currency.JPY">
                    JPY - Iene Japonês
                  </option>
                  <option :value="Currency.CNY">
                    CNY - Yuan Chinês
                  </option>
                  <option :value="Currency.KRW">
                    KRW - Won Sul-Coreano
                  </option>
                  <option :value="Currency.INR">
                    INR - Rupia Indiana
                  </option>
                  <option :value="Currency.IDR">
                    IDR - Rupia Indonésia
                  </option>
                  <option :value="Currency.THB">
                    THB - Baht Tailandês
                  </option>
                  <option :value="Currency.SGD">
                    SGD - Dólar de Singapura
                  </option>
                  <option :value="Currency.HKD">
                    HKD - Dólar de Hong Kong
                  </option>
                  <option :value="Currency.MYR">
                    MYR - Ringgit Malaio
                  </option>
                  <option :value="Currency.PHP">
                    PHP - Peso Filipino
                  </option>
                  <option :value="Currency.VND">
                    VND - Dong Vietnamita
                  </option>
                </optgroup>
                <!-- Oceania -->
                <optgroup label="Oceania">
                  <option :value="Currency.AUD">
                    AUD - Dólar Australiano
                  </option>
                  <option :value="Currency.NZD">
                    NZD - Dólar Neozelandês
                  </option>
                </optgroup>
                <!-- África -->
                <optgroup label="África">
                  <option :value="Currency.ZAR">
                    ZAR - Rand Sul-Africano
                  </option>
                  <option :value="Currency.NGN">
                    NGN - Naira Nigeriana
                  </option>
                  <option :value="Currency.EGP">
                    EGP - Libra Egípcia
                  </option>
                </optgroup>
                <!-- Oriente Médio -->
                <optgroup label="Oriente Médio">
                  <option :value="Currency.AED">
                    AED - Dirham dos Emirados Árabes
                  </option>
                  <option :value="Currency.SAR">
                    SAR - Riyal Saudita
                  </option>
                  <option :value="Currency.ILS">
                    ILS - Novo Shekel Israelense
                  </option>
                </optgroup>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="ticketPrice">Preço por Ticket *</Label>
              <CurrencyInput
                id="ticketPrice"
                v-model="form.ticketPrice"
                :currency="form.prizeCurrency"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="durationDays">Duração (dias) *</Label>
              <Input
                id="durationDays"
                v-model.number="form.durationDays"
                type="number"
                min="1"
                required
              />
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <Switch
              id="isMain"
              v-model:checked="form.isMain"
            />
            <Label for="isMain">Rifa Principal (destaque na home)</Label>
          </div>
        </div>

        <!-- Etapa 2: Mídias -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <Label>Imagens e Vídeos *</Label>
              <p class="text-sm text-muted-foreground">
                Adicione pelo menos uma imagem. Você pode arrastar para reorganizar.
              </p>
            </div>

            <!-- Campo para adicionar vídeo por URL (linha superior) -->
            <div class="space-y-2">
              <Label for="videoUrl">Adicionar Vídeo por URL</Label>
              <div class="flex gap-2">
                <Input
                  id="videoUrl"
                  v-model="videoUrlInput"
                  type="url"
                  placeholder="YouTube, Vimeo ou MP4/WebM"
                  class="flex-1"
                  @keyup.enter="addVideoByUrl"
                />
                <Button
                  type="button"
                  :disabled="!isVideoUrlValid"
                  @click="addVideoByUrl"
                >
                  <Plus class="size-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                Suporte para YouTube, Vimeo ou URLs diretas de vídeos (MP4, WebM, etc)
              </p>
            </div>

            <!-- Layout 50/50: Dropzone | Lista -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Dropzone (lado esquerdo) -->
              <div class="w-full">
                <Card
                  class="border-2 border-dashed transition-colors cursor-pointer h-full"
                  :class="[
                    isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                  ]"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="handleDrop"
                  @click="fileInputRef?.click()"
                >
                  <CardContent class="flex flex-col items-center justify-center py-12 h-full">
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      class="hidden"
                      @change="handleFileSelect"
                    >
                    <div class="flex flex-col items-center gap-4">
                      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Upload class="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div class="text-center">
                        <p class="text-sm font-medium">
                          Arraste arquivos aqui ou clique para selecionar
                        </p>
                        <p class="text-xs text-muted-foreground mt-1">
                          Imagens e vídeos até 50MB
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Lista de Mídias (lado direito) -->
              <div class="w-full">
                <div v-if="allMedia.length > 0" class="space-y-2 max-h-[400px] overflow-y-auto">
                  <div
                    v-for="(media, index) in allMedia"
                    :key="media.id"
                    class="group relative flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 cursor-move"
                    :class="[
                      draggedIndex === index && 'opacity-50',
                      draggedOverIndex === index && draggedIndex !== null && 'border-primary bg-primary/5',
                    ]"
                    draggable="true"
                    @dragstart="handleItemDragStart($event, index)"
                    @dragenter="handleItemDragEnter($event, index)"
                    @dragover="handleItemDragOver($event, index)"
                    @dragleave="handleItemDragLeave"
                    @drop="handleItemDrop($event, index)"
                    @dragend="handleDragEnd"
                  >
                    <!-- Ícone de arrastar -->
                    <GripVertical class="h-5 w-5 cursor-move text-muted-foreground hover:text-foreground transition-colors shrink-0" />

                    <!-- Preview -->
                    <div class="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        v-if="media.type === 'image'"
                        :src="media.url"
                        :alt="media.filename || 'Imagem'"
                        class="h-full w-full object-cover"
                      >
                      <img
                        v-else-if="media.type === 'video' && media.thumbnail"
                        :src="media.thumbnail"
                        :alt="media.title || media.filename || 'Vídeo'"
                        class="h-full w-full object-cover"
                      >
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center bg-muted"
                      >
                        <Video class="h-8 w-8 text-muted-foreground" />
                      </div>
                      <!-- Badge de tipo -->
                      <Badge
                        class="absolute top-1 right-1"
                        variant="secondary"
                        size="sm"
                      >
                        {{ media.type === 'image' ? 'IMG' : 'VID' }}
                      </Badge>
                    </div>

                    <!-- Informações -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate" :title="media.title || media.filename || `Mídia ${index + 1}`">
                        {{ media.title || media.filename || `Mídia ${index + 1}` }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ formatFileSize(media.size) }}
                      </p>
                    </div>

                    <!-- Ações -->
                    <div class="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" class="text-xs">
                        #{{ media.order + 1 }}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8"
                        @click.stop="removeMedia(media)"
                        @mousedown.stop
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <!-- Estado vazio -->
                <div
                  v-else
                  class="text-center py-8 text-muted-foreground border rounded-lg"
                >
                  <ImageIcon class="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p class="text-sm">
                    Nenhuma mídia adicionada ainda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Etapa 3: Método de Sorteio -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="space-y-4">
            <Label>Métodos de Sorteio *</Label>
            <p class="text-sm text-muted-foreground">
              Selecione um ou mais métodos para extrair o resultado:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="method in drawMethods"
                :key="method.value"
                class="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                @click.stop.prevent="toggleDrawMethod(method.value)"
              >
                <div
                  class="flex items-center justify-center size-4 shrink-0 rounded-[4px] border transition-colors"
                  :class="selectedMethods.includes(method.value) ? 'bg-primary border-primary' : 'border-input'"
                >
                  <Check
                    v-if="selectedMethods.includes(method.value)"
                    class="size-3 text-primary-foreground"
                  />
                </div>
                <Label :for="`draw-method-${method.value}`" class="flex-1 cursor-pointer" @click.stop.prevent="toggleDrawMethod(method.value)">
                  {{ method.label }}
                </Label>
              </div>
            </div>
          </div>

          <!-- Configuração do Telegram -->
          <div v-if="isTelegramSelected" class="space-y-4 border-t pt-4">
            <Label>Configuração do Telegram</Label>
            <div class="space-y-2">
              <Label for="telegramBotToken">Token do Bot Telegram *</Label>
              <Input
                id="telegramBotToken"
                v-model="form.drawConfiguration!.telegramBotToken"
                type="text"
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
              <p class="text-xs text-muted-foreground">
                Token do bot do Telegram para envio de mensagens
              </p>
            </div>
            <div class="space-y-2">
              <Label for="telegramChannelId">ID do Canal/Grupo *</Label>
              <Input
                id="telegramChannelId"
                v-model="form.drawConfiguration!.telegramChannelId"
                type="text"
                placeholder="@canal ou -1001234567890"
              />
              <p class="text-xs text-muted-foreground">
                ID do canal ou grupo onde o resultado será publicado
              </p>
            </div>
          </div>
        </div>

        <!-- Etapa 4: Seleção de Tickets -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="space-y-4">
            <Label>Método de Seleção de Tickets *</Label>
            <p class="text-sm text-muted-foreground">
              Escolha como os usuários selecionarão os tickets:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="method in ticketSelectionMethods"
                :key="method.value"
                class="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                @click="form.ticketSelectionConfiguration!.method = method.value"
              >
                <input
                  :id="`method-${method.value}`"
                  v-model="form.ticketSelectionConfiguration!.method"
                  type="radio"
                  :value="method.value"
                  class="h-4 w-4"
                >
                <Label :for="`method-${method.value}`" class="flex-1 cursor-pointer">
                  {{ method.label }}
                </Label>
              </div>
            </div>
          </div>

          <!-- Configuração de Números Mínimo e Máximo -->
          <div class="space-y-4 border-t pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="minTicketNumber">Número Mínimo de Tickets</Label>
                <Input
                  id="minTicketNumber"
                  v-model.number="form.ticketSelectionConfiguration!.minTicketNumber"
                  type="number"
                  min="1"
                  placeholder="Ex: 1"
                />
                <p class="text-xs text-muted-foreground">
                  Número inicial da sequência de tickets
                </p>
              </div>
              <div class="space-y-2">
                <Label for="maxTicketNumber">Número Máximo de Tickets</Label>
                <Input
                  id="maxTicketNumber"
                  :model-value="form.ticketSelectionConfiguration?.maxTicketNumber ?? undefined"
                  type="number"
                  min="1"
                  placeholder="Sem limite (opcional)"
                  @update:model-value="(value) => {
                    if (form.ticketSelectionConfiguration) {
                      form.ticketSelectionConfiguration.maxTicketNumber = value === '' || value === null || value === undefined ? null : Number(value)
                    }
                  }"
                />
                <p class="text-xs text-muted-foreground">
                  Número final da sequência. Deixe vazio para sem limite.
                </p>
              </div>
            </div>
          </div>

          <!-- Configuração de Números Expostos (Randomização) -->
          <div v-if="form.ticketSelectionConfiguration?.method === TicketSelectionMethod.EXPOSED_NUMBERS" class="space-y-4 border-t pt-4">
            <div class="flex items-center space-x-2">
              <Switch
                v-model:checked="form.ticketSelectionConfiguration.randomizeExposed"
              />
              <Label class="cursor-pointer">
                Números aleatórios ou em sequência?
              </Label>
            </div>
            <p class="text-xs text-muted-foreground">
              Se desativado, números serão exibidos em sequência (1, 2, 3...). Se ativado, serão randomizados.
            </p>
          </div>
        </div>

        <!-- Etapa 5: Configurações de Reserva -->
        <div v-if="currentStep === 5" class="space-y-6">
          <div class="space-y-2">
            <Label for="minimumReservationMinutes">Prazo Mínimo para Reserva (minutos)</Label>
            <Input
              id="minimumReservationMinutes"
              v-model.number="form.reservationConfiguration!.minimumReservationMinutes"
              type="number"
              min="0"
              placeholder="Ex: 15 (opcional)"
            />
            <p class="text-xs text-muted-foreground">
              Tempo mínimo que um ticket ficará reservado antes de ser liberado novamente
            </p>
          </div>

          <div class="space-y-2">
            <Label for="minimumReservationQuantity">Quantidade Mínima de Tickets por Reserva</Label>
            <Input
              id="minimumReservationQuantity"
              v-model.number="form.reservationConfiguration!.minimumReservationQuantity"
              type="number"
              min="1"
              placeholder="Padrão: 1"
            />
            <p class="text-xs text-muted-foreground">
              Quantidade mínima de tickets que podem ser reservados por vez
            </p>
          </div>

          <div class="space-y-2">
            <Label for="maximumReservationQuantity">Quantidade Máxima de Tickets por Reserva</Label>
            <Input
              id="maximumReservationQuantity"
              :model-value="form.reservationConfiguration!.maximumReservationQuantity ?? undefined"
              type="number"
              min="1"
              placeholder="Sem limite (opcional)"
              @update:model-value="(value) => {
                form.reservationConfiguration!.maximumReservationQuantity = value === '' || value === null ? null : Number(value)
              }"
            />
            <p class="text-xs text-muted-foreground">
              Quantidade máxima de tickets que podem ser reservados por vez. Deixe vazio para sem limite.
            </p>
          </div>
        </div>

        <!-- Etapa 6: Revisão -->
        <div v-if="currentStep === 6" class="space-y-6">
          <div class="space-y-4">
            <h3 class="font-semibold">
              Informações Básicas
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-foreground">Nome:</span>
                <p class="font-medium">
                  {{ form.name }}
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Prêmio:</span>
                <p class="font-medium">
                  {{ form.prizeAmount }} {{ form.prizeCurrency }}
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Preço do Ticket:</span>
                <p class="font-medium">
                  {{ form.ticketPrice }} {{ form.prizeCurrency }}
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Duração:</span>
                <p class="font-medium">
                  {{ form.durationDays }} dias
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Rifa Principal:</span>
                <Badge :variant="form.isMain ? 'default' : 'secondary'">
                  {{ form.isMain ? 'Sim' : 'Não' }}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <h3 class="font-semibold">
              Mídias
            </h3>
            <div class="space-y-2">
              <p class="text-sm text-muted-foreground">
                Imagens: {{ form.images.length }}
              </p>
              <p class="text-sm text-muted-foreground">
                Vídeos: {{ form.videos.length }}
              </p>
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <h3 class="font-semibold">
              Métodos de Sorteio
            </h3>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="method in form.drawConfiguration?.methods || []"
                :key="method"
              >
                {{ drawMethods.find(m => m.value === method)?.label }}
              </Badge>
            </div>
            <div v-if="isTelegramSelected" class="text-sm space-y-1">
              <p>
                <span class="text-muted-foreground">Telegram Bot Token:</span>
                {{ form.drawConfiguration?.telegramBotToken ? `***${form.drawConfiguration.telegramBotToken.slice(-10)}` : 'Não configurado' }}
              </p>
              <p>
                <span class="text-muted-foreground">Telegram Channel:</span>
                {{ form.drawConfiguration?.telegramChannelId || 'Não configurado' }}
              </p>
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <h3 class="font-semibold">
              Seleção de Tickets
            </h3>
            <p class="text-sm">
              Método: {{ ticketSelectionMethods.find(m => m.value === form.ticketSelectionConfiguration?.method)?.label }}
            </p>
            <div class="text-sm mt-2 space-y-1">
              <p>
                <span class="text-muted-foreground">Número Mínimo:</span>
                {{ form.ticketSelectionConfiguration?.minTicketNumber ?? 'Não definido' }}
              </p>
              <p>
                <span class="text-muted-foreground">Número Máximo:</span>
                {{ form.ticketSelectionConfiguration?.maxTicketNumber ?? 'Sem limite' }}
              </p>
              <p v-if="form.ticketSelectionConfiguration?.method === TicketSelectionMethod.EXPOSED_NUMBERS">
                <span class="text-muted-foreground">Randomização:</span>
                {{ form.ticketSelectionConfiguration?.randomizeExposed ? 'Ativada' : 'Desativada (sequencial)' }}
              </p>
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <h3 class="font-semibold">
              Configurações de Reserva
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-foreground">Prazo Mínimo:</span>
                <p class="font-medium">
                  {{ form.reservationConfiguration?.minimumReservationMinutes || 'Não definido' }} minutos
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Quantidade Mínima:</span>
                <p class="font-medium">
                  {{ form.reservationConfiguration?.minimumReservationQuantity || 1 }} tickets
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Quantidade Máxima:</span>
                <p class="font-medium">
                  {{ form.reservationConfiguration?.maximumReservationQuantity || 'Sem limite' }} tickets
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Navigation Buttons -->
    <div class="flex justify-between gap-4">
      <Button
        variant="outline"
        :disabled="currentStep === 1"
        @click="prevStep"
      >
        ← Anterior
      </Button>
      <div class="flex gap-2">
        <Button
          v-if="currentStep < totalSteps"
          :disabled="!canGoNext"
          @click="nextStep"
        >
          Próximo →
        </Button>
        <Button
          v-else
          :disabled="!canGoNext"
          @click="handleSubmit"
        >
          {{ isEdit ? 'Salvar Alterações' : 'Criar Rifa' }}
        </Button>
        <Button
          variant="ghost"
          @click="emit('cancel')"
        >
          Cancelar
        </Button>
      </div>
    </div>
  </div>
</template>
