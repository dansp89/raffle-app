<!--
  @fileoverview Página de como funciona
  @module pages/how-it-works
  @author Raffle System
-->
<script setup lang="ts">
import { CheckCircle2, Shield, Ticket, Trophy, Wallet } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const { t } = useI18n()

useHead({
  title: () => t('howItWorks.title', 'Como Funciona'),
})

definePageMeta({
  layout: 'public',
})

const steps = [
  {
    icon: Wallet,
    title: t('howItWorks.step1.title', '1. Conecte sua Carteira'),
    description: t('howItWorks.step1.description', 'Conecte sua carteira Phantom ou MetaMask para começar'),
  },
  {
    icon: Ticket,
    title: t('howItWorks.step2.title', '2. Escolha uma Rifa'),
    description: t('howItWorks.step2.description', 'Navegue pelas rifas disponíveis e escolha aquela que deseja participar'),
  },
  {
    icon: CheckCircle2,
    title: t('howItWorks.step3.title', '3. Compre Tickets'),
    description: t('howItWorks.step3.description', 'Selecione a quantidade de tickets e confirme a transação na blockchain'),
  },
  {
    icon: Trophy,
    title: t('howItWorks.step4.title', '4. Aguarde o Sorteio'),
    description: t('howItWorks.step4.description', 'Quando a meta for atingida, o sorteio acontece automaticamente'),
  },
]

const benefits = [
  {
    icon: Shield,
    title: t('howItWorks.benefit1.title', '100% Transparente'),
    description: t('howItWorks.benefit1.description', 'Todas as transações são verificáveis na blockchain'),
  },
  {
    icon: CheckCircle2,
    title: t('howItWorks.benefit2.title', 'Sorteios Automáticos'),
    description: t('howItWorks.benefit2.description', 'Sorteios executados por smart contracts'),
  },
  {
    icon: Wallet,
    title: t('howItWorks.benefit3.title', 'Pagamentos Instantâneos'),
    description: t('howItWorks.benefit3.description', 'Prêmios pagos automaticamente aos vencedores'),
  },
]
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('howItWorks.title', 'Como Funciona') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('howItWorks.subtitle', 'Processo simples e transparente para participar de rifas') }}
        </p>
      </div>

      <!-- Steps -->
      <div class="space-y-8">
        <h2 class="text-2xl font-bold text-center">
          {{ t('howItWorks.stepsTitle', 'Passo a Passo') }}
        </h2>
        <div class="grid gap-6 md:grid-cols-2">
          <Card
            v-for="(step, index) in steps"
            :key="index"
            class="relative"
          >
            <CardHeader>
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <component :is="step.icon" class="h-6 w-6 text-primary" />
                </div>
                <CardTitle class="text-xl">
                  {{ step.title }}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription class="text-base">
                {{ step.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Benefits -->
      <div class="space-y-8">
        <h2 class="text-2xl font-bold text-center">
          {{ t('howItWorks.benefitsTitle', 'Vantagens') }}
        </h2>
        <div class="grid gap-6 md:grid-cols-3">
          <Card
            v-for="(benefit, index) in benefits"
            :key="index"
            class="text-center"
          >
            <CardHeader>
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <component :is="benefit.icon" class="h-6 w-6 text-primary" />
              </div>
              <CardTitle>
                {{ benefit.title }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {{ benefit.description }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- CTA -->
      <Card class="bg-gradient-to-r from-primary/10 to-primary/5 text-center">
        <CardHeader>
          <CardTitle class="text-2xl">
            {{ t('howItWorks.ready', 'Pronto para começar?') }}
          </CardTitle>
          <CardDescription class="text-base">
            {{ t('howItWorks.readyDesc', 'Participe das rifas e concorra a prêmios incríveis!') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" @click="navigateTo('/raffles')">
            {{ t('howItWorks.viewRaffles', 'Ver Rifas Disponíveis') }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
</style>
