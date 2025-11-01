<!--
  @fileoverview Página de suporte
  @module pages/support
  @author Raffle System
-->
<script setup lang="ts">
import { Book, Mail, MessageSquare } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const { t } = useI18n()

useHead({
  title: () => t('support.title', 'Suporte'),
})

definePageMeta({
  layout: 'public',
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('support.title', 'Suporte') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('support.subtitle', 'Nossa equipe está pronta para ajudar você') }}
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/help')">
          <CardHeader>
            <Book class="h-8 w-8 mb-2 text-primary" />
            <CardTitle>
              {{ t('support.helpCenter', 'Central de Ajuda') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('support.helpCenterDesc', 'Encontre respostas para suas dúvidas') }}
            </CardDescription>
          </CardContent>
        </Card>

        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/contact')">
          <CardHeader>
            <Mail class="h-8 w-8 mb-2 text-primary" />
            <CardTitle>
              {{ t('support.contact', 'Contato') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('support.contactDesc', 'Entre em contato conosco') }}
            </CardDescription>
          </CardContent>
        </Card>

        <Card class="cursor-pointer hover:shadow-lg transition-shadow" @click="navigateTo('/faq')">
          <CardHeader>
            <MessageSquare class="h-8 w-8 mb-2 text-primary" />
            <CardTitle>
              {{ t('support.faq', 'FAQ') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {{ t('support.faqDesc', 'Perguntas frequentes') }}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
