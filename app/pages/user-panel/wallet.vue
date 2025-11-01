<!--
  @fileoverview Página de carteira do usuário
  @module pages/wallet/index
  @author Raffle System
-->
<script setup lang="ts">
import type { User } from '~/types/raffle'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useAuth } from '~/composables/useAuth'
import { Currency } from '~/types/raffle'

const { t } = useI18n()
const { user: currentUser } = useAuth() as unknown as { user: Ref<User | null> }

/**
 * Meta tags
 */
useHead({
  title: () => t('wallet.title', 'Carteira'),
})

definePageMeta({
  layout: 'panel',
})

/**
 * Estados dos diálogos
 */
const showDepositDialog = ref(false)
const showWithdrawDialog = ref(false)

/**
 * Valores dos formulários
 */
const depositAmount = ref<number | undefined>(undefined)
const withdrawAmount = ref<number | undefined>(undefined)

/**
 * Copia texto para a área de transferência
 */
function copyToClipboard(text: string) {
  if (import.meta.client && 'clipboard' in navigator) {
    navigator.clipboard.writeText(text).catch(() => {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    })
  }
}

/**
 * Saldo da carteira (mock)
 */
const walletBalance = computed(() => {
  return currentUser.value?.balances.reduce((acc, curr) => acc + curr.amount, 0) || 0
})

/**
 * Endereço da carteira
 */
const walletAddress = computed(() => {
  return currentUser.value?.walletAddresses[0]?.address || 'Não configurado'
})

/**
 * Formata valor monetário
 */
function formatCurrency(value: number, currency: Currency = Currency.SOL): string {
  const symbols: Partial<Record<Currency, string>> = {
    [Currency.SOL]: '◎',
    [Currency.BRL]: 'R$',
  }
  return `${symbols[currency]}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Processa depósito
 */
function handleDeposit(): void {
  if (!depositAmount.value || depositAmount.value <= 0) {
    return
  }
  // Em produção, aqui seria feita a integração com o gateway de pagamento
  console.warn('Deposit:', depositAmount.value)
  showDepositDialog.value = false
  depositAmount.value = undefined
}

/**
 * Processa saque
 */
function handleWithdraw(): void {
  if (!withdrawAmount.value || withdrawAmount.value <= 0 || withdrawAmount.value > walletBalance.value) {
    return
  }
  // Em produção, aqui seria feita a integração com a blockchain
  console.warn('Withdraw:', withdrawAmount.value)
  showWithdrawDialog.value = false
  withdrawAmount.value = undefined
}
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ t('wallet.title', 'Carteira') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('wallet.subtitle', 'Gerencie seus fundos e transações') }}
        </p>
      </div>
    </div>

    <!-- Card de Saldo -->
    <Card class="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader>
        <CardTitle class="text-muted-foreground">
          {{ t('wallet.balance', 'Saldo Disponível') }}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-4xl font-bold mb-2">
          {{ formatCurrency(walletBalance) }}
        </div>
        <div class="flex gap-4 mt-6">
          <Button
            class="flex-1"
            @click="showDepositDialog = true"
          >
            {{ t('wallet.deposit', 'Depositar') }}
          </Button>
          <Button
            variant="outline"
            class="flex-1"
            :disabled="walletBalance === 0"
            @click="showWithdrawDialog = true"
          >
            {{ t('wallet.withdraw', 'Sacar') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Informações da Carteira -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">
            {{ t('wallet.walletAddress', 'Endereço da Carteira') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <code class="text-sm font-mono break-all">
              {{ walletAddress }}
            </code>
            <Button
              variant="ghost"
              size="sm"
              @click="() => copyToClipboard(walletAddress || '')"
            >
              {{ t('wallet.copy', 'Copiar') }}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-lg">
            {{ t('wallet.quickActions', 'Ações Rápidas') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
          <Button
            variant="outline"
            class="w-full justify-start"
            @click="navigateTo('/transactions')"
          >
            {{ t('wallet.viewTransactions', 'Ver Transações') }}
          </Button>
          <Button
            variant="outline"
            class="w-full justify-start"
            @click="navigateTo('/raffles')"
          >
            {{ t('wallet.buyTickets', 'Comprar Tickets') }}
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Dialog de Depósito -->
    <Dialog :open="showDepositDialog" @update:open="showDepositDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{ t('wallet.deposit', 'Depositar') }}
          </DialogTitle>
          <DialogDescription>
            {{ t('wallet.depositDescription', 'Deposite fundos na sua carteira') }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="deposit-amount">
              {{ t('wallet.amount', 'Valor') }}
            </Label>
            <Input
              id="deposit-amount"
              v-model.number="depositAmount"
              type="number"
              :placeholder="t('wallet.enterAmount', 'Digite o valor')"
              min="0"
              step="0.01"
            />
          </div>
          <p class="text-sm text-muted-foreground">
            {{ t('wallet.depositNote', 'Você será redirecionado para o gateway de pagamento') }}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            @click="showDepositDialog = false"
          >
            {{ t('common.cancel', 'Cancelar') }}
          </Button>
          <Button
            :disabled="!depositAmount || depositAmount <= 0"
            @click="handleDeposit"
          >
            {{ t('wallet.continue', 'Continuar') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Dialog de Saque -->
    <Dialog :open="showWithdrawDialog" @update:open="showWithdrawDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{ t('wallet.withdraw', 'Sacar') }}
          </DialogTitle>
          <DialogDescription>
            {{ t('wallet.withdrawDescription', 'Saque fundos da sua carteira') }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="withdraw-amount">
              {{ t('wallet.amount', 'Valor') }}
            </Label>
            <Input
              id="withdraw-amount"
              v-model.number="withdrawAmount"
              type="number"
              :placeholder="t('wallet.enterAmount', 'Digite o valor')"
              min="0"
              :max="walletBalance"
              step="0.01"
            />
            <p class="text-xs text-muted-foreground">
              {{ t('wallet.availableBalance', 'Saldo disponível') }}: {{ formatCurrency(walletBalance) }}
            </p>
          </div>
          <p class="text-sm text-muted-foreground">
            {{ t('wallet.withdrawNote', 'O saque será processado na blockchain') }}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            @click="showWithdrawDialog = false"
          >
            {{ t('common.cancel', 'Cancelar') }}
          </Button>
          <Button
            :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > walletBalance"
            @click="handleWithdraw"
          >
            {{ t('wallet.confirm', 'Confirmar') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
</style>
