<!--
  @fileoverview Home pública com hero section
  @module pages/index
  @author Raffle System
-->
<script setup lang="ts">
import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-vue-next'
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
  title: () => t('home.title', 'Raffle App - Rifas Seguras e Transparentes'),
  meta: [
    {
      name: 'description',
      content: t('home.description', 'Participe de rifas seguras e transparentes. Ganhe prêmios incríveis!'),
    },
  ],
})

definePageMeta({
  layout: 'public',
})

/**
 * Rifa principal
 */
const mainRaffle = computed(() => {
  return mockRaffles.find(r => r.isMain && r.status === RaffleStatus.ACTIVE) || mockRaffles[0]
})

/**
 * Rifas ativas (limitadas)
 */
const featuredRaffles = computed(() => {
  return mockRaffles
    .filter(r => r.status === RaffleStatus.ACTIVE)
    .slice(0, 3)
})

/**
 * Features
 */
const features = [
  {
    icon: Shield,
    title: t('home.features.secure', '100% Seguro'),
    description: t('home.features.secureDesc', 'Transações na blockchain com total transparência'),
  },
  {
    icon: Zap,
    title: t('home.features.fast', 'Rápido'),
    description: t('home.features.fastDesc', 'Sorteios automáticos e instantâneos'),
  },
  {
    icon: Sparkles,
    title: t('home.features.transparent', 'Transparente'),
    description: t('home.features.transparentDesc', 'Todas as transações são verificáveis'),
  },
]

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
 * Calcula progresso
 */
function getProgress(raffle: typeof mockRaffles[0]): number {
  return Math.min((raffle.collectedAmount / raffle.targetAmount) * 100, 100)
}
</script>

<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 lg:py-32">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <!-- Content -->
          <div class="space-y-8">
            <div class="space-y-4">
              <Badge variant="secondary" class="w-fit">
                {{ t('home.badge', 'Plataforma #1 de Rifas') }}
              </Badge>
              <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {{ t('home.headline', 'Rifas Seguras e Transparentes') }}
              </h1>
              <p class="text-lg text-muted-foreground max-w-xl">
                {{ t('home.subheadline', 'Participe de rifas verificadas na blockchain. Ganhe prêmios incríveis com total transparência e segurança.') }}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <Button size="lg" @click="navigateTo('/raffles')">
                {{ t('home.cta.primary', 'Ver Rifas') }}
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" @click="navigateTo('/how-it-works')">
                {{ t('home.cta.secondary', 'Como Funciona') }}
              </Button>
            </div>
          </div>

          <!-- Rifa Principal -->
          <div v-if="mainRaffle" class="relative">
            <Card class="overflow-hidden hover:shadow-xl transition-shadow">
              <div class="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  :src="getRaffleMainImage(mainRaffle)"
                  :alt="mainRaffle.name"
                  class="h-full w-full object-cover"
                >
                <Badge
                  class="absolute top-4 right-4"
                  variant="default"
                >
                  {{ t('raffles.main', 'Principal') }}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle class="text-xl">
                  {{ mainRaffle.name }}
                </CardTitle>
                <CardDescription>
                  {{ mainRaffle.description }}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div>
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span class="text-muted-foreground">
                      {{ t('raffles.progress', 'Progresso') }}
                    </span>
                    <span class="font-medium">
                      {{ Math.round(getProgress(mainRaffle)) }}%
                    </span>
                  </div>
                  <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      class="h-full bg-primary transition-all"
                      :style="{ width: `${getProgress(mainRaffle)}%` }"
                    />
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-muted-foreground">
                      {{ t('raffles.ticketPrice', 'Preço do Ticket') }}
                    </p>
                    <p class="font-semibold">
                      {{ formatCurrency(mainRaffle.ticketPrice, mainRaffle.prizeCurrency) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">
                      {{ t('raffles.prize', 'Prêmio') }}
                    </p>
                    <p class="font-semibold">
                      {{ formatCurrency(mainRaffle.prizeAmount, mainRaffle.prizeCurrency) }}
                    </p>
                  </div>
                </div>
                <Button
                  class="w-full"
                  @click="navigateTo(`/raffles/${mainRaffle.slug || mainRaffle.id}`)"
                >
                  {{ t('raffleDetails.viewDetails', 'Ver Detalhes') }}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-muted/50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-4 mb-12">
          <h2 class="text-3xl font-bold tracking-tight">
            {{ t('home.features.title', 'Por que escolher o Raffle App?') }}
          </h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            {{ t('home.features.subtitle', 'Tecnologia blockchain para garantir segurança e transparência total') }}
          </p>
        </div>
        <div class="grid gap-8 md:grid-cols-3">
          <Card
            v-for="feature in features"
            :key="feature.title"
            class="text-center"
          >
            <CardHeader>
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <component :is="feature.icon" class="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{{ feature.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {{ feature.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Featured Raffles -->
    <section v-if="featuredRaffles.length > 0" class="py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-3xl font-bold tracking-tight">
              {{ t('home.featuredRaffles', 'Rifas em Destaque') }}
            </h2>
            <p class="text-muted-foreground mt-2">
              {{ t('home.featuredRafflesDesc', 'Confira as rifas mais populares') }}
            </p>
          </div>
          <Button variant="outline" @click="navigateTo('/raffles')">
            {{ t('home.viewAll', 'Ver Todas') }}
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="raffle in featuredRaffles"
            :key="raffle.id"
            class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/raffles/${raffle.slug || raffle.id}`)"
          >
            <div class="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                :src="getRaffleMainImage(raffle)"
                :alt="raffle.name"
                class="h-full w-full object-cover"
              >
            </div>
            <CardHeader>
              <CardTitle class="line-clamp-2">
                {{ raffle.name }}
              </CardTitle>
              <CardDescription class="line-clamp-2">
                {{ raffle.description }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="mb-4">
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
              </div>
              <div class="flex items-center justify-between mb-4">
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
                    {{ t('raffles.prize', 'Prêmio') }}
                  </p>
                  <p class="font-semibold">
                    {{ formatCurrency(raffle.prizeAmount, raffle.prizeCurrency) }}
                  </p>
                </div>
              </div>
              <Button class="w-full" variant="outline">
                {{ t('raffleDetails.viewDetails', 'Ver Detalhes') }}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
