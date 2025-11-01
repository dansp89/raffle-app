<!--
  @fileoverview Página de ajuda e suporte
  @module pages/help
  @author Raffle System
-->
<script setup lang="ts">
import { Book, HelpCircle, Mail, MessageCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const { t } = useI18n()

useHead({
  title: () => t('help.title', 'Ajuda e Suporte'),
})

definePageMeta({
  layout: 'public',
})

/**
 * FAQs
 */
const faqs = [
  {
    question: t('help.faq1.question', 'Como participar de uma rifa?'),
    answer: t('help.faq1.answer', 'Navegue até a página de rifas, escolha uma rifa ativa e clique em "Comprar Tickets". Você precisará conectar sua carteira e confirmar a transação.'),
  },
  {
    question: t('help.faq2.question', 'Como funciona o sorteio?'),
    answer: t('help.faq2.answer', 'Os sorteios são realizados automaticamente na blockchain após a rifa atingir sua meta de arrecadação. O processo é totalmente transparente e verificável.'),
  },
  {
    question: t('help.faq3.question', 'Como recebo meu prêmio?'),
    answer: t('help.faq3.answer', 'Se você for o vencedor, o prêmio será transferido automaticamente para sua carteira cadastrada após a confirmação do sorteio.'),
  },
  {
    question: t('help.faq4.question', 'As rifas são seguras?'),
    answer: t('help.faq4.answer', 'Sim! Todas as transações são realizadas na blockchain, garantindo transparência total. Você pode verificar todas as transações em exploradores públicos.'),
  },
]
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('help.title', 'Ajuda e Suporte') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('help.subtitle', 'Estamos aqui para ajudar você!') }}
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/contact')">
          <CardHeader>
            <Mail class="h-8 w-8 mb-2 text-primary" />
            <CardTitle class="text-lg">
              {{ t('help.contact', 'Contato') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('help.contactDesc', 'Entre em contato conosco') }}
            </CardDescription>
          </CardContent>
        </Card>

        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/support')">
          <CardHeader>
            <MessageCircle class="h-8 w-8 mb-2 text-primary" />
            <CardTitle class="text-lg">
              {{ t('help.support', 'Suporte') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('help.supportDesc', 'Suporte técnico') }}
            </CardDescription>
          </CardContent>
        </Card>

        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/how-it-works')">
          <CardHeader>
            <Book class="h-8 w-8 mb-2 text-primary" />
            <CardTitle class="text-lg">
              {{ t('help.howItWorks', 'Como Funciona') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('help.howItWorksDesc', 'Saiba mais sobre a plataforma') }}
            </CardDescription>
          </CardContent>
        </Card>

        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/faq')">
          <CardHeader>
            <HelpCircle class="h-8 w-8 mb-2 text-primary" />
            <CardTitle class="text-lg">
              {{ t('help.faq', 'FAQ') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('help.faqDesc', 'Perguntas frequentes') }}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <!-- FAQs -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold">
          {{ t('help.faqTitle', 'Perguntas Frequentes') }}
        </h2>
        <div class="space-y-4">
          <Card v-for="(faq, index) in faqs" :key="index">
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

      <!-- Contact CTA -->
      <Card class="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle>
            {{ t('help.needMoreHelp', 'Precisa de mais ajuda?') }}
          </CardTitle>
          <CardDescription>
            {{ t('help.needMoreHelpDesc', 'Nossa equipe de suporte está pronta para ajudar você') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button @click="navigateTo('/contact')">
            {{ t('help.contactUs', 'Entre em Contato') }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
</style>
