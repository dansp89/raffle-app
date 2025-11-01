<!--
  @fileoverview Página de transações do usuário
  @module pages/transactions/index
  @author Raffle System
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useAuth } from '~/composables/useAuth'
import { mockTransactions } from '~/data/mocks/transactions'
import { Currency, TransactionStatus, TransactionType } from '~/types/raffle'

const { t } = useI18n()
const { user: currentUser } = useAuth()

/**
 * Meta tags
 */
useHead({
  title: () => t('transactions.title', 'Transações'),
})

definePageMeta({
  layout: 'panel',
})

/**
 * Transações do usuário ordenadas por data (mais recentes primeiro)
 */
const userTransactions = computed(() => {
  const userId = currentUser.value?.id || ''
  return mockTransactions
    .filter(tx => tx.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

/**
 * Estatísticas das transações
 */
const stats = computed(() => {
  const deposits = userTransactions.value.filter(tx => tx.type === TransactionType.DEPOSIT && tx.status === TransactionStatus.CONFIRMED)
  const withdrawals = userTransactions.value.filter(tx => tx.type === TransactionType.WITHDRAWAL && tx.status === TransactionStatus.CONFIRMED)
  const purchases = userTransactions.value.filter(tx => tx.type === TransactionType.TICKET_PURCHASE && tx.status === TransactionStatus.CONFIRMED)

  return {
    totalDeposits: deposits.reduce((sum, tx) => sum + tx.amount, 0),
    totalWithdrawals: withdrawals.reduce((sum, tx) => sum + tx.amount, 0),
    totalPurchases: purchases.reduce((sum, tx) => sum + tx.amount, 0),
    totalTransactions: userTransactions.value.length,
  }
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
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ t('transactions.title', 'Transações') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('transactions.subtitle', 'Histórico completo de suas transações') }}
        </p>
      </div>
      <Button @click="navigateTo('/wallet')">
        {{ t('transactions.goToWallet', 'Ir para Carteira') }}
      </Button>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ t('transactions.totalTransactions', 'Total de Transações') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ stats.totalTransactions }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ t('transactions.totalDeposits', 'Total Depositado') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">
            +{{ formatCurrency(stats.totalDeposits) }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ t('transactions.totalWithdrawn', 'Total Sacado') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-red-600">
            -{{ formatCurrency(stats.totalWithdrawals) }}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ t('transactions.totalSpent', 'Total Gasto') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-orange-600">
            -{{ formatCurrency(stats.totalPurchases) }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Lista de Transações -->
    <Card>
      <CardHeader>
        <CardTitle>
          {{ t('transactions.history', 'Histórico de Transações') }}
        </CardTitle>
        <CardDescription>
          {{ t('transactions.historyDescription', 'Todas as suas movimentações') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="userTransactions.length > 0" class="space-y-4">
          <div
            v-for="transaction in userTransactions"
            :key="transaction.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full"
                :class="{
                  'bg-green-100 text-green-600': transaction.type === TransactionType.DEPOSIT,
                  'bg-red-100 text-red-600': transaction.type === TransactionType.WITHDRAWAL,
                  'bg-orange-100 text-orange-600': transaction.type === TransactionType.TICKET_PURCHASE,
                }"
              >
                {{
                  transaction.type === TransactionType.DEPOSIT
                    ? '+'
                    : transaction.type === TransactionType.WITHDRAWAL
                      ? '-'
                      : '🎫'
                }}
              </div>
              <div>
                <p class="font-medium">
                  {{ t(`transactions.type.${transaction.type}`, transaction.type) }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ transaction.description || '-' }}
                </p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ formatDate(transaction.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p
                  class="font-semibold text-lg"
                  :class="{
                    'text-green-600': transaction.type === TransactionType.DEPOSIT,
                    'text-red-600': transaction.type === TransactionType.WITHDRAWAL || transaction.type === TransactionType.TICKET_PURCHASE,
                  }"
                >
                  {{
                    transaction.type === TransactionType.DEPOSIT
                      ? '+'
                      : '-'
                  }}{{ formatCurrency(transaction.amount, transaction.currency) }}
                </p>
                <Badge
                  :variant="transaction.status === TransactionStatus.CONFIRMED ? 'default' : 'secondary'"
                  class="mt-1"
                >
                  {{ t(`transactions.status.${transaction.status}`, transaction.status) }}
                </Badge>
              </div>
              <Button
                v-if="transaction.explorerUrl"
                variant="ghost"
                size="sm"
                @click="window.open(transaction.explorerUrl, '_blank')"
              >
                {{ t('transactions.viewOnExplorer', 'Ver no Explorer') }}
              </Button>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-center py-12 text-muted-foreground"
        >
          <p>{{ t('transactions.noTransactions', 'Nenhuma transação encontrada') }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
</style>
