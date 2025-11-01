<!--
  @fileoverview Página administrativa para gerenciar rifas
  @module pages/admin/raffles/index
  @author Raffle System
-->
<script setup lang="ts">
import type { Raffle } from '~/types/raffle'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { mockRaffles } from '~/data/mocks/raffles'
import { Currency, RaffleStatus } from '~/types/raffle'
import { getRaffleMainImage } from '~/utils/raffle'

const { t } = useI18n()

/**
 * Meta tags
 */
useHead({
  title: `${t('admin.title')} - ${t('admin.raffles')}`,
})

/**
 * Estado reativo
 */
const raffles = ref(mockRaffles)
const searchQuery = ref('')
const statusFilter = ref<RaffleStatus | 'all'>('all')

/**
 * Rifas filtradas
 */
const filteredRaffles = computed(() => {
  let result = raffles.value

  // Filtro por status
  if (statusFilter.value !== 'all') {
    result = result.filter(r => r.status === statusFilter.value)
  }

  // Filtro por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r =>
      r.name.toLowerCase().includes(query)
      || r.description.toLowerCase().includes(query),
    )
  }

  return result
})

/**
 * Formata valor monetário
 */
function formatCurrency(amount: number, currency: Currency): string {
  if (currency === Currency.BRL) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
  }
  return `${amount.toFixed(2)} ${currency}`
}

/**
 * Obtém badge de status
 */
function getStatusBadge(status: RaffleStatus) {
  const statusMap = {
    [RaffleStatus.ACTIVE]: { label: t('raffle.status.active'), variant: 'default' as const },
    [RaffleStatus.PAUSED]: { label: t('raffle.status.paused'), variant: 'secondary' as const },
    [RaffleStatus.PENDING_DRAW]: { label: t('raffle.status.pendingDraw'), variant: 'destructive' as const },
    [RaffleStatus.FINISHED]: { label: t('raffle.status.finished'), variant: 'outline' as const },
    [RaffleStatus.ENDED]: { label: t('raffle.status.ended'), variant: 'secondary' as const },
    [RaffleStatus.CANCELLED]: { label: t('raffle.status.cancelled'), variant: 'destructive' as const },
  }
  return statusMap[status] || statusMap[RaffleStatus.ACTIVE]
}

/**
 * Calcula progresso
 */
function getProgress(raffle: Raffle): number {
  if (raffle.targetAmount === 0)
    return 0
  return Math.min((raffle.collectedAmount / raffle.targetAmount) * 100, 100)
}
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold mb-2">
          {{ t('admin.raffles') }}
        </h1>
        <p class="text-muted-foreground">
          Gerenciar todas as rifas do sistema
        </p>
      </div>
      <Button @click="navigateTo('/admin/raffles/create')">
        {{ t('admin.createRaffle') }}
      </Button>
    </div>

    <!-- Filtros -->
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="t('common.search')"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
          </div>
          <select
            v-model="statusFilter"
            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">
              Todos os Status
            </option>
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
      </CardContent>
    </Card>

    <!-- Lista de Rifas -->
    <Card>
      <CardHeader>
        <CardTitle>Rifas ({{ filteredRaffles.length }})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prêmio</TableHead>
              <TableHead>Arrecadado</TableHead>
              <TableHead>Meta</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>{{ t('common.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="raffle in filteredRaffles" :key="raffle.id">
              <TableCell class="font-medium">
                <div class="flex items-center gap-2">
                  <img
                    :src="getRaffleMainImage(raffle)"
                    :alt="raffle.name"
                    class="w-10 h-10 rounded object-cover"
                  >
                  <div>
                    <div>{{ raffle.name }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ raffle.description.substring(0, 50) }}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusBadge(raffle.status).variant">
                  {{ getStatusBadge(raffle.status).label }}
                </Badge>
              </TableCell>
              <TableCell>
                {{ formatCurrency(raffle.prizeAmount, raffle.prizeCurrency) }}
              </TableCell>
              <TableCell>
                {{ formatCurrency(raffle.collectedAmount, raffle.prizeCurrency) }}
              </TableCell>
              <TableCell>
                {{ formatCurrency(raffle.targetAmount, raffle.prizeCurrency) }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div class="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary transition-all"
                      :style="`width: ${getProgress(raffle)}%`"
                    />
                  </div>
                  <span class="text-sm">{{ Math.round(getProgress(raffle)) }}%</span>
                </div>
              </TableCell>
              <TableCell>{{ raffle.totalTicketsSold }}</TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="navigateTo(`/admin/raffles/${raffle.id}`)"
                  >
                    {{ t('common.edit') }}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
