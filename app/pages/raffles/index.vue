<!--
  @fileoverview Página de listagem de rifas públicas
  @module pages/raffles/index
  @author Raffle System
-->
<script setup lang="ts">
import type { Raffle } from '~/types/raffle'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { mockRaffles } from '~/data/mocks/raffles'
import { Currency, RaffleStatus } from '~/types/raffle'
import { getRaffleMainImage } from '~/utils/raffle'

const { t } = useI18n()

/**
 * Meta tags
 */
useHead({
  title: () => t('raffles.title', 'Rifas Disponíveis'),
})

definePageMeta({
  layout: 'public',
})

/**
 * Rifas ativas filtradas
 */
const activeRaffles = computed(() => {
  return mockRaffles.filter(r => r.status === RaffleStatus.ACTIVE || r.status === RaffleStatus.PENDING_DRAW)
})

/**
 * Rifas finalizadas
 */
const finishedRaffles = computed(() => {
  return mockRaffles.filter(r => r.status === RaffleStatus.FINISHED)
})

/**
 * Formata valor monetário
 * @param {number} value - Valor a ser formatado
 * @param {Currency} currency - Moeda
 * @returns {string} Valor formatado
 */
function formatCurrency(value: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    [Currency.SOL]: '◎',
    [Currency.USDT]: '$',
    [Currency.BRL]: 'R$',
  }
  return `${symbols[currency]}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Calcula porcentagem de progresso
 * @param {Raffle} raffle - Rifa
 * @returns {number} Porcentagem (0-100)
 */
function getProgress(raffle: Raffle): number {
  return Math.min((raffle.collectedAmount / raffle.targetAmount) * 100, 100)
}

/**
 * Formata data
 * @param {Date} date - Data
 * @returns {string} Data formatada
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
 * Navega para detalhes da rifa usando slug
 * @param {string} slug - Slug da rifa
 */
function viewRaffle(slug: string): void {
  navigateTo(`/raffles/${slug}`)
}
</script>

<template>
  <div class="w-full">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="flex flex-col gap-6 max-w-7xl mx-auto">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">
              {{ t('raffles.title', 'Rifas Disponíveis') }}
            </h1>
            <p class="text-muted-foreground">
              {{ t('raffles.subtitle', 'Participe das rifas e concorra a prêmios incríveis!') }}
            </p>
          </div>
        </div>

        <!-- Rifas Ativas -->
        <div v-if="activeRaffles.length > 0" class="space-y-4">
          <h2 class="text-2xl font-semibold">
            {{ t('raffles.active', 'Rifas Ativas') }}
          </h2>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="raffle in activeRaffles"
              :key="raffle.id"
              class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="viewRaffle(raffle.id)"
            >
              <div class="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  :src="getRaffleMainImage(raffle)"
                  :alt="raffle.name"
                  class="h-full w-full object-cover"
                >
                <Badge
                  v-if="raffle.isMain"
                  class="absolute top-2 right-2"
                  variant="default"
                >
                  {{ t('raffles.main', 'Principal') }}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle class="line-clamp-2">
                  {{ raffle.name }}
                </CardTitle>
                <CardDescription class="line-clamp-2">
                  {{ raffle.description }}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-muted-foreground">
                      {{ t('raffles.progress', 'Progresso') }}
                    </span>
                    <span class="font-medium">
                      {{ Math.round(getProgress(raffle)) }}%
                    </span>
                  </div>
                  <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      class="h-full bg-primary transition-all"
                      :style="{ width: `${getProgress(raffle)}%` }"
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
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-muted-foreground">
                      {{ t('raffles.ticketPrice', 'Preço do Ticket') }}
                    </p>
                    <p class="font-semibold">
                      {{ formatCurrency(raffle.ticketPrice, raffle.prizeCurrency) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">
                      {{ t('raffles.ticketsSold', 'Tickets Vendidos') }}
                    </p>
                    <p class="font-semibold">
                      {{ raffle.totalTicketsSold.toLocaleString('pt-BR') }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {{ t('raffles.endDate', 'Termina em') }}: {{ formatDate(raffle.endDate) }}
                  </span>
                </div>
                <Button class="w-full" @click.stop="viewRaffle(raffle.slug || raffle.id)">
                  {{ t('raffles.viewDetails', 'Ver Detalhes') }}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Rifas Finalizadas -->
        <div v-if="finishedRaffles.length > 0" class="space-y-4">
          <h2 class="text-2xl font-semibold">
            {{ t('raffles.finished', 'Rifas Finalizadas') }}
          </h2>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="raffle in finishedRaffles"
              :key="raffle.id"
              class="overflow-hidden opacity-75"
            >
              <div class="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  :src="getRaffleMainImage(raffle)"
                  :alt="raffle.name"
                  class="h-full w-full object-cover"
                >
                <Badge
                  class="absolute top-2 right-2"
                  variant="secondary"
                >
                  {{ t('raffles.finished', 'Finalizada') }}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle class="line-clamp-2">
                  {{ raffle.name }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-muted-foreground">
                  {{ t('raffles.drawDate', 'Sorteada em') }}: {{ raffle.drawDate ? formatDate(raffle.drawDate) : '-' }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Estado vazio -->
        <div
          v-if="activeRaffles.length === 0 && finishedRaffles.length === 0"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <p class="text-lg font-medium text-muted-foreground">
            {{ t('raffles.noRaffles', 'Nenhuma rifa disponível no momento') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
