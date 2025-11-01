<!--
  @fileoverview Página administrativa para editar rifa
  @module pages/admin/raffles/[id]
  @author Raffle System
-->
<script setup lang="ts">
import type { Raffle, RaffleMedia } from '~/types/raffle'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import MediaDropzone from '~/components/raffle/MediaDropzone.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { getRaffleById } from '~/data/mocks/raffles'
import { Currency, RaffleStatus } from '~/types/raffle'

const { t } = useI18n()
const route = useRoute()

/**
 * Meta tags
 */
useHead({
  title: `${t('admin.title')} - ${t('admin.editRaffle')}`,
})

/**
 * Estado
 */
const raffle = ref<Raffle | null>(null)
const form = ref({
  name: '',
  description: '',
  imageUrl: '',
  images: [] as RaffleMedia[],
  videos: [] as RaffleMedia[],
  prizeAmount: 0,
  prizeCurrency: Currency.USDT,
  ticketPrice: 10,
  durationDays: 7,
  isMain: false,
  status: RaffleStatus.ACTIVE,
})

/**
 * Carrega dados da rifa
 */
onMounted(() => {
  const raffleId = route.params.id as string
  const found = getRaffleById(raffleId)

  if (!found) {
    toast.error('Rifa não encontrada')
    navigateTo('/admin/raffles')
    return
  }

  raffle.value = found
  form.value = {
    name: found.name,
    description: found.description,
    imageUrl: found.imageUrl,
    images: found.images || [],
    videos: found.videos || [],
    prizeAmount: found.prizeAmount,
    prizeCurrency: found.prizeCurrency,
    ticketPrice: found.ticketPrice,
    durationDays: found.durationDays,
    isMain: found.isMain,
    status: found.status,
  }
})

/**
 * Salva alterações
 */
function handleSave() {
  if (!raffle.value)
    return

  // Validação
  if (!form.value.name || !form.value.description) {
    toast.error('Preencha todos os campos obrigatórios')
    return
  }

  // Valida se tem pelo menos uma imagem
  if (form.value.images.length === 0) {
    toast.error('Adicione pelo menos uma imagem')
    return
  }

  // Define imageUrl principal da primeira imagem
  if (form.value.images.length > 0) {
    form.value.imageUrl = form.value.images[0]?.url || ''
  }

  // Mock: em produção, salvaria no banco
  console.warn('Form data:', form.value)
  toast.success(t('admin.raffleUpdated'))
  navigateTo('/admin/raffles')
}

/**
 * Obtém badge de status
 */
function getStatusBadge(status: RaffleStatus) {
  const statusMap: Record<RaffleStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    [RaffleStatus.ACTIVE]: { label: t('raffle.status.active'), variant: 'default' },
    [RaffleStatus.PAUSED]: { label: t('raffle.status.paused'), variant: 'secondary' },
    [RaffleStatus.PENDING_DRAW]: { label: t('raffle.status.pendingDraw'), variant: 'destructive' },
    [RaffleStatus.FINISHED]: { label: t('raffle.status.finished'), variant: 'outline' },
    [RaffleStatus.ENDED]: { label: t('raffle.status.ended'), variant: 'secondary' },
    [RaffleStatus.CANCELLED]: { label: t('raffle.status.cancelled'), variant: 'destructive' },
  }
  return statusMap[status] || statusMap[RaffleStatus.ACTIVE]
}
</script>

<template>
  <div v-if="raffle" class="container mx-auto py-8 space-y-8">
    <!-- Header -->
    <div>
      <Button variant="ghost" @click="navigateTo('/admin/raffles')">
        ← {{ t('common.back') }}
      </Button>
      <div class="flex items-center justify-between mt-4">
        <div>
          <h1 class="text-4xl font-bold mb-2">
            {{ t('admin.editRaffle') }}
          </h1>
          <p class="text-muted-foreground">
            {{ raffle.name }}
          </p>
        </div>
        <Badge :variant="getStatusBadge(raffle.status).variant">
          {{ getStatusBadge(raffle.status).label }}
        </Badge>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardDescription>Arrecadado</CardDescription>
          <CardTitle class="text-xl">
            {{ raffle.collectedAmount.toFixed(2) }} {{ raffle.prizeCurrency }}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Meta</CardDescription>
          <CardTitle class="text-xl">
            {{ raffle.targetAmount.toFixed(2) }} {{ raffle.prizeCurrency }}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Tickets Vendidos</CardDescription>
          <CardTitle class="text-xl">
            {{ raffle.totalTicketsSold }}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Progresso</CardDescription>
          <CardTitle class="text-xl">
            {{ Math.round((raffle.collectedAmount / raffle.targetAmount) * 100) }}%
          </CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Formulário -->
    <Card>
      <CardHeader>
        <CardTitle>Editar Rifa</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="name">{{ t('admin.raffleName') }} *</Label>
          <Input id="name" v-model="form.name" required />
        </div>

        <div class="space-y-2">
          <Label for="description">{{ t('admin.description') }} *</Label>
          <textarea
            id="description"
            v-model="form.description"
            class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <!-- Upload de Mídias -->
        <div class="space-y-2">
          <Label>{{ t('admin.media', 'Imagens e Vídeos') }}</Label>
          <p class="text-sm text-muted-foreground mb-2">
            Adicione imagens e vídeos da rifa. Você pode arrastar para reorganizar a ordem.
          </p>
          <MediaDropzone
            v-model:images="form.images"
            v-model:videos="form.videos"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label for="prizeAmount">{{ t('admin.prizeAmount') }}</Label>
            <Input id="prizeAmount" v-model.number="form.prizeAmount" type="number" />
          </div>
          <div class="space-y-2">
            <Label for="ticketPrice">{{ t('admin.ticketPrice') }}</Label>
            <Input id="ticketPrice" v-model.number="form.ticketPrice" type="number" />
          </div>
          <div class="space-y-2">
            <Label for="status">{{ t('admin.changeStatus') }}</Label>
            <select
              id="status"
              v-model="form.status"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option :value="RaffleStatus.ACTIVE">
                {{ t('raffle.status.active') }}
              </option>
              <option :value="RaffleStatus.PAUSED">
                {{ t('raffle.status.paused') }}
              </option>
              <option :value="RaffleStatus.PENDING_DRAW">
                {{ t('raffle.status.pendingDraw') }}
              </option>
              <option :value="RaffleStatus.FINISHED">
                {{ t('raffle.status.finished') }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <input id="isMain" v-model="form.isMain" type="checkbox" class="h-4 w-4">
          <Label for="isMain">{{ t('admin.isMain') }}</Label>
        </div>

        <div class="flex gap-4">
          <Button @click="handleSave">
            {{ t('common.save') }}
          </Button>
          <Button variant="outline" @click="navigateTo('/admin/raffles')">
            {{ t('common.cancel') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
