<!--
  @fileoverview Página administrativa para editar rifa
  @module pages/admin/raffles/[id]
  @author Raffle System
-->
<script setup lang="ts">
import type { Raffle, RaffleFormData } from '~/types/raffle'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import RaffleWizard from '~/components/admin/RaffleWizard.vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import { getRaffleById } from '~/data/mocks/raffles'
import { RaffleStatus } from '~/types/raffle'

const { t } = useI18n()
const route = useRoute()

/**
 * Meta tags
 */
useHead({
  title: `${t('admin.title')} - ${t('admin.editRaffle')}`,
})

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

/**
 * Estado
 */
const raffle = ref<Raffle | null>(null)

/**
 * Dados iniciais para o wizard
 */
const initialData = computed<RaffleFormData | undefined>(() => {
  if (!raffle.value)
    return undefined

  return {
    name: raffle.value.name,
    description: raffle.value.description,
    imageUrl: raffle.value.imageUrl,
    images: raffle.value.images || [],
    videos: raffle.value.videos || [],
    prizeAmount: raffle.value.prizeAmount,
    prizeCurrency: raffle.value.prizeCurrency,
    ticketPrice: raffle.value.ticketPrice,
    durationDays: raffle.value.durationDays,
    isMain: raffle.value.isMain,
    totalTickets: raffle.value.totalTickets || null,
    drawConfiguration: raffle.value.drawConfiguration,
    ticketSelectionConfiguration: raffle.value.ticketSelectionConfiguration,
    reservationConfiguration: raffle.value.reservationConfiguration,
  }
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
})

/**
 * Handler para submit do wizard
 */
function handleSubmit(data: RaffleFormData) {
  if (!raffle.value)
    return

  // Mock: em produção, salvaria no banco
  console.warn('Raffle form data:', data)
  toast.success(t('admin.raffleUpdated'))
  navigateTo('/admin/raffles')
}

/**
 * Handler para cancelar
 */
function handleCancel() {
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

    <!-- Wizard -->
    <RaffleWizard
      :is-edit="true"
      :initial-data="initialData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
