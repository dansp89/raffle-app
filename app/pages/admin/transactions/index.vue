<!--
  @fileoverview Página administrativa para visualizar transações
  @module pages/admin/transactions/index
  @author Raffle System
-->
<script setup lang="ts">
import type { TransactionType } from '~/types/raffle'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { mockTransactions } from '~/data/mocks/transactions'
import { Currency, TransactionStatus } from '~/types/raffle'

const { t } = useI18n()

useHead({
  title: `${t('admin.title')} - ${t('admin.transactions')}`,
})

const transactions = ref(mockTransactions)
const statusFilter = ref<TransactionStatus | 'all'>('all')

const filteredTransactions = computed(() => {
  if (statusFilter.value === 'all')
    return transactions.value
  return transactions.value.filter(tx => tx.status === statusFilter.value)
})

function formatType(type: TransactionType): string {
  return t(`transaction.type.${type}`)
}

function formatStatus(status: TransactionStatus): string {
  return t(`transaction.status.${status}`)
}

function formatCurrency(amount: number, currency: Currency): string {
  if (currency === Currency.BRL) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
  }
  return `${amount.toFixed(2)} ${currency}`
}

function getStatusBadge(status: TransactionStatus) {
  const map = {
    [TransactionStatus.CONFIRMED]: { variant: 'default' as const },
    [TransactionStatus.PENDING]: { variant: 'secondary' as const },
    [TransactionStatus.FAILED]: { variant: 'destructive' as const },
    [TransactionStatus.CANCELLED]: { variant: 'outline' as const },
  }
  return map[status] || map[TransactionStatus.PENDING]
}
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <div>
      <h1 class="text-4xl font-bold mb-2">
        {{ t('admin.transactions') }}
      </h1>
      <p class="text-muted-foreground">
        Total: {{ transactions.length }} transações
      </p>
    </div>

    <Card>
      <CardHeader>
        <select
          v-model="statusFilter"
          class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">
            Todos os Status
          </option>
          <option :value="TransactionStatus.CONFIRMED">
            {{ t('transaction.status.confirmed') }}
          </option>
          <option :value="TransactionStatus.PENDING">
            {{ t('transaction.status.pending') }}
          </option>
          <option :value="TransactionStatus.FAILED">
            {{ t('transaction.status.failed') }}
          </option>
        </select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('transaction.date') }}</TableHead>
              <TableHead>{{ t('transaction.type') }}</TableHead>
              <TableHead>{{ t('transaction.amount') }}</TableHead>
              <TableHead>{{ t('transaction.status') }}</TableHead>
              <TableHead>{{ t('transaction.description') }}</TableHead>
              <TableHead>Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="tx in filteredTransactions" :key="tx.id">
              <TableCell>
                {{ new Date(tx.createdAt).toLocaleString('pt-BR') }}
              </TableCell>
              <TableCell>{{ formatType(tx.type) }}</TableCell>
              <TableCell>{{ formatCurrency(tx.amount, tx.currency) }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusBadge(tx.status).variant">
                  {{ formatStatus(tx.status) }}
                </Badge>
              </TableCell>
              <TableCell>{{ tx.description || '-' }}</TableCell>
              <TableCell>
                <a
                  v-if="tx.explorerUrl"
                  :href="tx.explorerUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline text-sm"
                >
                  Ver no Solscan
                </a>
                <span v-else class="text-muted-foreground text-xs">
                  {{ tx.transactionHash.substring(0, 10) }}...
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
