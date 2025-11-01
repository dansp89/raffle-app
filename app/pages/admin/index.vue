<!--
  @fileoverview Dashboard administrativo principal
  @module pages/admin/index
  @author Raffle System
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { mockRaffles } from '~/data/mocks/raffles'
import { mockUsers } from '~/data/mocks/users'
import { Currency, RaffleStatus } from '~/types/raffle'

const { t } = useI18n()

/**
 * Meta tags
 */
useHead({
  title: () => t('admin.title'),
})

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

/**
 * Estatísticas administrativas calculadas
 */
const stats = computed(() => {
  const totalRaffles = mockRaffles.length
  const activeRaffles = mockRaffles.filter(r => r.status === RaffleStatus.ACTIVE).length
  const totalUsers = mockUsers.length
  const totalTicketsSold = mockRaffles.reduce((sum, r) => sum + r.totalTicketsSold, 0)
  const totalCollected = mockRaffles.reduce((sum, r) => sum + r.collectedAmount, 0)
  const finishedRaffles = mockRaffles.filter(r => r.status === RaffleStatus.FINISHED)
  const totalPrizesPaid = finishedRaffles.reduce((sum, r) => sum + r.prizeAmount, 0)
  const pendingDraws = mockRaffles.filter(r => r.status === RaffleStatus.PENDING_DRAW).length

  return {
    totalRaffles,
    activeRaffles,
    totalUsers,
    totalTicketsSold,
    totalCollected,
    totalPrizesPaid,
    pendingDraws,
  }
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
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold mb-2">
        {{ t('admin.title') }}
      </h1>
      <p class="text-muted-foreground">
        {{ t('admin.dashboard') }}
      </p>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.totalRaffles') }}</CardDescription>
          <CardTitle class="text-3xl font-bold">
            {{ stats.totalRaffles }}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.activeRaffles') }}</CardDescription>
          <CardTitle class="text-3xl font-bold">
            {{ stats.activeRaffles }}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.totalUsers') }}</CardDescription>
          <CardTitle class="text-3xl font-bold">
            {{ stats.totalUsers }}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.totalTicketsSold') }}</CardDescription>
          <CardTitle class="text-3xl font-bold">
            {{ stats.totalTicketsSold }}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.totalCollected') }}</CardDescription>
          <CardTitle class="text-2xl font-bold">
            {{ formatCurrency(stats.totalCollected, Currency.SOL) }}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.totalPrizesPaid') }}</CardDescription>
          <CardTitle class="text-2xl font-bold">
            {{ formatCurrency(stats.totalPrizesPaid, Currency.SOL) }}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>{{ t('admin.pendingDraws') }}</CardDescription>
          <CardTitle class="text-3xl font-bold">
            {{ stats.pendingDraws }}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Links rápidos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card class="cursor-pointer hover:bg-muted transition-colors" @click="navigateTo('/admin/raffles')">
        <CardHeader>
          <CardTitle>{{ t('admin.raffles') }}</CardTitle>
          <CardDescription>Gerenciar todas as rifas</CardDescription>
        </CardHeader>
      </Card>

      <Card class="cursor-pointer hover:bg-muted transition-colors" @click="navigateTo('/admin/users')">
        <CardHeader>
          <CardTitle>{{ t('admin.users') }}</CardTitle>
          <CardDescription>Visualizar e gerenciar usuários</CardDescription>
        </CardHeader>
      </Card>

      <Card class="cursor-pointer hover:bg-muted transition-colors" @click="navigateTo('/admin/transactions')">
        <CardHeader>
          <CardTitle>{{ t('admin.transactions') }}</CardTitle>
          <CardDescription>Histórico completo de transações</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
