<!--
  @fileoverview Página de tickets do usuário
  @module pages/my-tickets/index
  @author Raffle System
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useAuth } from '~/composables/useAuth'
import { mockRaffles } from '~/data/mocks/raffles'
import { mockTickets } from '~/data/mocks/tickets'
import { Currency } from '~/types/raffle'
import { getRaffleMainImage } from '~/utils/raffle'

const { t } = useI18n()
const { user: currentUser } = useAuth()

/**
 * Meta tags
 */
useHead({
  title: () => t('myTickets.title', 'Meus Tickets'),
})

definePageMeta({
  layout: 'panel',
})

/**
 * Tickets do usuário agrupados por rifa
 */
const userTickets = computed(() => {
  const userId = currentUser.value?.id || ''
  const tickets = mockTickets.filter(t => t.userId === userId)

  // Agrupa por rifaId
  const grouped = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.raffleId]) {
      acc[ticket.raffleId] = []
    }
    acc[ticket.raffleId]!.push(ticket)
    return acc
  }, {} as Record<string, typeof tickets>)

  return Object.entries(grouped).map(([raffleId, tickets]) => ({
    raffleId,
    raffle: mockRaffles.find(r => r.id === raffleId),
    tickets,
    totalTickets: tickets.length,
    totalValue: tickets.reduce((sum, t) => sum + t.price, 0),
  }))
})

/**
 * Formata valor monetário
 */
function formatCurrency(value: number, currency: Currency = Currency.USDT): string {
  const symbols: Record<Currency, string> = {
    [Currency.SOL]: '◎',
    [Currency.USDT]: '$',
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
 * Abre URL no explorer (Solscan)
 */
function openInExplorer(url: string) {
  if (import.meta.client) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ t('myTickets.title', 'Meus Tickets') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('myTickets.subtitle', 'Visualize todos os seus tickets adquiridos') }}
        </p>
      </div>
      <Button @click="navigateTo('/raffles')">
        {{ t('myTickets.buyMore', 'Comprar Mais') }}
      </Button>
    </div>

    <div v-if="userTickets.length > 0" class="space-y-6">
      <Card
        v-for="group in userTickets"
        :key="group.raffleId"
        class="overflow-hidden"
      >
        <CardHeader>
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <img
                v-if="group.raffle"
                :src="getRaffleMainImage(group.raffle)"
                :alt="group.raffle.name"
                class="h-20 w-20 rounded-lg object-cover"
              >
              <div>
                <CardTitle>
                  {{ group.raffle?.name || 'Rifa não encontrada' }}
                </CardTitle>
                <CardDescription>
                  {{ t('myTickets.totalTickets', 'Total de tickets') }}: {{ group.totalTickets }}
                </CardDescription>
                <CardDescription>
                  {{ t('myTickets.totalValue', 'Valor total') }}: {{ formatCurrency(group.totalValue) }}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              @click="navigateTo(`/raffles/${group.raffleId}`)"
            >
              {{ t('myTickets.viewRaffle', 'Ver Rifa') }}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="ticket in group.tickets"
              :key="ticket.id"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p class="font-medium">
                  {{ t('myTickets.ticketNumber', 'Ticket') }} #{{ ticket.ticketNumber }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(ticket.purchasedAt) }}
                </p>
              </div>
              <div class="flex items-center gap-4">
                <Badge variant="outline">
                  {{ formatCurrency(ticket.price, ticket.currency) }}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="!ticket.solscanUrl"
                  @click="ticket.solscanUrl && openInExplorer(ticket.solscanUrl)"
                >
                  {{ t('myTickets.viewOnExplorer', 'Ver no Explorer') }}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <p class="text-lg font-medium text-muted-foreground mb-4">
        {{ t('myTickets.noTickets', 'Você ainda não adquiriu nenhum ticket') }}
      </p>
      <Button @click="navigateTo('/raffles')">
        {{ t('myTickets.buyTickets', 'Comprar Tickets') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
</style>
