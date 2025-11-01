<!--
  @fileoverview Página de FAQ
  @module pages/faq
  @author Raffle System
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const { t } = useI18n()

useHead({
  title: () => t('faq.title', 'Perguntas Frequentes'),
})

definePageMeta({
  layout: 'public',
})

const faqs = [
  {
    question: t('faq.q1.question', 'Como participar de uma rifa?'),
    answer: t('faq.q1.answer', 'Navegue até a página de rifas, escolha uma rifa ativa e clique em "Comprar Tickets". Você precisará conectar sua carteira e confirmar a transação.'),
  },
  {
    question: t('faq.q2.question', 'Como funciona o sorteio?'),
    answer: t('faq.q2.answer', 'Os sorteios são realizados automaticamente na blockchain após a rifa atingir sua meta de arrecadação. O processo é totalmente transparente e verificável.'),
  },
  {
    question: t('faq.q3.question', 'Como recebo meu prêmio?'),
    answer: t('faq.q3.answer', 'Se você for o vencedor, o prêmio será transferido automaticamente para sua carteira cadastrada após a confirmação do sorteio.'),
  },
  {
    question: t('faq.q4.question', 'As rifas são seguras?'),
    answer: t('faq.q4.answer', 'Sim! Todas as transações são realizadas na blockchain, garantindo transparência total. Você pode verificar todas as transações em exploradores públicos.'),
  },
  {
    question: t('faq.q5.question', 'Posso cancelar minha compra?'),
    answer: t('faq.q5.answer', 'Não, após a confirmação da transação na blockchain, não é possível cancelar a compra de tickets. Certifique-se de revisar todos os detalhes antes de confirmar.'),
  },
  {
    question: t('faq.q6.question', 'Quais carteiras são suportadas?'),
    answer: t('faq.q6.answer', 'Suportamos Phantom, MetaMask e Solana Wallet. Certifique-se de ter fundos suficientes na sua carteira antes de participar.'),
  },
]
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-3xl mx-auto space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('faq.title', 'Perguntas Frequentes') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('faq.subtitle', 'Encontre respostas para as dúvidas mais comuns') }}
        </p>
      </div>

      <div class="space-y-4">
        <Card
          v-for="(faq, index) in faqs"
          :key="index"
        >
          <CardHeader>
            <CardTitle class="text-lg">
              {{ faq.question }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              {{ faq.answer }}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
