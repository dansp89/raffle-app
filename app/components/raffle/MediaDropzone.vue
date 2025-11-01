<!--
  @fileoverview Componente de dropzone para upload de imagens e vídeos com drag and drop
  @module components/raffle/MediaDropzone
  @author Raffle System
-->
<script setup lang="ts">
import type { RaffleMedia } from '~/types/raffle'
import { GripVertical, Image as ImageIcon, Loader2, Upload, Video, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

/**
 * Props do componente
 */
interface Props {
  /** Se permite múltiplos arquivos */
  multiple?: boolean
  /** Tipos de arquivo aceitos */
  accept?: string
  /** Tamanho máximo do arquivo em MB */
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  accept: 'image/*,video/*',
  maxSize: 50,
})

/**
 * Models
 */
const images = defineModel<RaffleMedia[]>('images', { default: () => [] })
const videos = defineModel<RaffleMedia[]>('videos', { default: () => [] })

/**
 * Estados
 */
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref<Record<string, number>>({})
const draggedIndex = ref<number | null>(null)
const draggedOverIndex = ref<number | null>(null)

/**
 * Lista combinada de todas as mídias
 */
const allMedia = computed(() => {
  return [
    ...images.value.map((img, index) => ({ ...img, order: index, type: 'image' as const })),
    ...videos.value.map((vid, index) => ({ ...vid, order: images.value.length + index, type: 'video' as const })),
  ].sort((a, b) => a.order - b.order)
})

/**
 * Manipula drag over no dropzone
 */
function handleDropzoneDragOver(e: DragEvent) {
  // Se está arrastando um item da lista (não um arquivo), não faz nada
  if (draggedIndex.value !== null) {
    return
  }
  // Verifica se tem arquivos sendo arrastados
  if (e.dataTransfer?.types.includes('Files')) {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = true
  }
}

/**
 * Manipula drag leave no dropzone
 */
function handleDropzoneDragLeave(e: DragEvent) {
  // Se está arrastando um item da lista (não um arquivo), não faz nada
  if (draggedIndex.value !== null) {
    return
  }
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
}

/**
 * Manipula drop no dropzone
 */
function handleDropzoneDrop(e: DragEvent) {
  // Se está arrastando um item da lista (não um arquivo), não faz nada
  if (draggedIndex.value !== null) {
    return
  }
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false

  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    handleFiles(files)
  }
}

/**
 * Manipula seleção de arquivos
 */
function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  handleFiles(files)
  // Limpa o input para permitir selecionar o mesmo arquivo novamente
  input.value = ''
}

/**
 * Processa arquivos selecionados
 */
async function handleFiles(files: File[]) {
  if (files.length === 0)
    return

  uploading.value = true

  try {
    const newImages: RaffleMedia[] = []
    const newVideos: RaffleMedia[] = []

    for (const file of files) {
      // Valida tamanho
      if (file.size > props.maxSize * 1024 * 1024) {
        toast.error(`Arquivo ${file.name} excede o tamanho máximo de ${props.maxSize}MB`)
        continue
      }

      // Cria preview
      const preview = await createFilePreview(file)
      const id = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const media: RaffleMedia = {
        id,
        url: preview,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        order: allMedia.value.length + newImages.length + newVideos.length,
        filename: file.name,
        size: file.size,
      }

      if (media.type === 'image') {
        newImages.push(media)
      }
      else {
        newVideos.push(media)
      }

      // Simula upload (em produção, enviaria para servidor)
      uploadProgress.value[id] = 0
      await simulateUpload(id)
      uploadProgress.value[id] = 100
    }

    // Atualiza listas
    if (newImages.length > 0) {
      images.value = [...images.value, ...newImages]
    }
    if (newVideos.length > 0) {
      videos.value = [...videos.value, ...newVideos]
    }

    toast.success(`${files.length} arquivo(s) adicionado(s) com sucesso`)
  }
  catch (error) {
    console.error('Erro ao processar arquivos:', error)
    toast.error('Erro ao fazer upload dos arquivos')
  }
  finally {
    uploading.value = false
    uploadProgress.value = {}
  }
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
 * Simula upload (mock)
 */
function simulateUpload(id: string): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      uploadProgress.value[id] = (uploadProgress.value[id] || 0) + 10
      if (uploadProgress.value[id] >= 100) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })
}

/**
 * Remove mídia
 */
function removeMedia(media: RaffleMedia) {
  if (media.type === 'image') {
    images.value = images.value.filter(img => img.id !== media.id)
  }
  else {
    videos.value = videos.value.filter(vid => vid.id !== media.id)
  }
}

/**
 * Reordena mídias
 */
function reorderMedia(draggedIndex: number, targetIndex: number) {
  const media = [...allMedia.value]
  const [dragged] = media.splice(draggedIndex, 1)
  media.splice(targetIndex, 0, dragged)

  // Atualiza ordem
  const newImages: RaffleMedia[] = []
  const newVideos: RaffleMedia[] = []

  media.forEach((item, index) => {
    const updated = { ...item, order: index }
    if (item.type === 'image') {
      newImages.push(updated)
    }
    else {
      newVideos.push(updated)
    }
  })

  images.value = newImages
  videos.value = newVideos
}

/**
 * Drag and drop handlers para cada item
 */
function handleDragStart(e: DragEvent, index: number) {
  draggedIndex.value = index
  draggedOverIndex.value = null
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleDragEnter(e: DragEvent, index: number) {
  e.preventDefault()
  e.stopPropagation()
  if (draggedIndex.value === null || draggedIndex.value === index)
    return
  draggedOverIndex.value = index
}

function handleDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  e.stopPropagation()
  if (draggedIndex.value === null || draggedIndex.value === index)
    return

  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  // Só limpa se realmente saiu do elemento (não de um filho)
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX
  const y = e.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    draggedOverIndex.value = null
  }
}

function handleDrop(e: DragEvent, index: number) {
  e.preventDefault()
  e.stopPropagation()

  if (draggedIndex.value === null || draggedIndex.value === index) {
    draggedIndex.value = null
    draggedOverIndex.value = null
    return
  }

  // Reordena
  reorderMedia(draggedIndex.value, index)

  draggedIndex.value = null
  draggedOverIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
  draggedOverIndex.value = null
}

/**
 * Formata tamanho do arquivo
 */
function formatFileSize(bytes?: number): string {
  if (!bytes)
    return ''
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <div class="space-y-4">
    <!-- Dropzone -->
    <Card
      class="border-2 border-dashed transition-colors cursor-pointer" :class="[
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
        uploading && 'opacity-50 pointer-events-none',
      ]"
      @dragover.prevent="handleDropzoneDragOver"
      @dragleave.prevent="handleDropzoneDragLeave"
      @drop.prevent="handleDropzoneDrop"
      @click="fileInputRef?.click()"
    >
      <CardContent class="flex flex-col items-center justify-center py-12">
        <input
          ref="fileInputRef"
          type="file"
          :accept="accept"
          :multiple="multiple"
          class="hidden"
          @change="handleFileSelect"
        >
        <div class="flex flex-col items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-muted"
            :class="uploading && 'animate-pulse'"
          >
            <Upload v-if="!uploading" class="h-6 w-6 text-muted-foreground" />
            <Loader2 v-else class="h-6 w-6 animate-spin text-primary" />
          </div>
          <div class="text-center">
            <p class="text-sm font-medium">
              {{ uploading ? 'Fazendo upload...' : 'Arraste arquivos aqui ou clique para selecionar' }}
            </p>
            <p class="text-xs text-muted-foreground mt-1">
              Imagens e vídeos até {{ maxSize }}MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Lista de Mídias -->
    <div v-if="allMedia.length > 0" class="space-y-2">
      <div
        v-for="(media, index) in allMedia"
        :key="media.id"
        class="group relative flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 cursor-move" :class="[
          draggedIndex === index && 'opacity-50',
          draggedOverIndex === index && draggedIndex !== null && 'border-primary bg-primary/5',
        ]"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragenter="handleDragEnter($event, index)"
        @dragover="handleDragOver($event, index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
      >
        <!-- Ícone de arrastar -->
        <GripVertical class="h-5 w-5 cursor-move text-muted-foreground hover:text-foreground transition-colors" />

        <!-- Preview -->
        <div class="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            v-if="media.type === 'image'"
            :src="media.url"
            :alt="media.filename || 'Imagem'"
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
          <p class="text-sm font-medium truncate">
            {{ media.filename || `Mídia ${index + 1}` }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ formatFileSize(media.size) }}
          </p>
          <!-- Progress bar -->
          <div
            v-if="uploadProgress[media.id] !== undefined && uploadProgress[media.id] < 100"
            class="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary"
          >
            <div
              class="h-full bg-primary transition-all"
              :style="{ width: `${uploadProgress[media.id]}%` }"
            />
          </div>
        </div>

        <!-- Ações -->
        <div class="flex items-center gap-2">
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
      v-if="allMedia.length === 0 && !uploading"
      class="text-center py-8 text-muted-foreground"
    >
      <ImageIcon class="mx-auto h-12 w-12 mb-2 opacity-50" />
      <p class="text-sm">
        Nenhuma mídia adicionada ainda
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
