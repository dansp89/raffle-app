<!--
  @fileoverview Página de contato
  @module pages/contact
  @author Raffle System
-->
<script setup lang="ts">
import { Clock, Mail, MessageSquare } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

const { t } = useI18n()

useHead({
  title: () => t('contact.title', 'Contato'),
})

definePageMeta({
  layout: 'public',
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) {
    toast.error(t('contact.fillAllFields', 'Preencha todos os campos'))
    return
  }
  // Mock: em produção, enviaria para API
  toast.success(t('contact.messageSent', 'Mensagem enviada com sucesso!'))
  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('contact.title', 'Entre em Contato') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('contact.subtitle', 'Tem alguma dúvida? Estamos aqui para ajudar!') }}
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Info Cards -->
        <div class="space-y-4">
          <Card>
            <CardHeader>
              <Mail class="h-8 w-8 mb-2 text-primary" />
              <CardTitle class="text-lg">
                {{ t('contact.email', 'Email') }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                suporte@raffleapp.com
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare class="h-8 w-8 mb-2 text-primary" />
              <CardTitle class="text-lg">
                {{ t('contact.support', 'Suporte') }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {{ t('contact.supportHours', 'Segunda a Sexta, 9h às 18h') }}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock class="h-8 w-8 mb-2 text-primary" />
              <CardTitle class="text-lg">
                {{ t('contact.responseTime', 'Tempo de Resposta') }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {{ t('contact.responseTimeDesc', 'Até 24 horas') }}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <!-- Form -->
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {{ t('contact.sendMessage', 'Envie uma Mensagem') }}
            </CardTitle>
            <CardDescription>
              {{ t('contact.sendMessageDesc', 'Preencha o formulário abaixo e entraremos em contato') }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label for="name">{{ t('contact.name', 'Nome') }} *</Label>
                  <Input id="name" v-model="form.name" required />
                </div>
                <div class="space-y-2">
                  <Label for="email">{{ t('contact.email', 'Email') }} *</Label>
                  <Input id="email" v-model="form.email" type="email" required />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="subject">{{ t('contact.subject', 'Assunto') }}</Label>
                <Input id="subject" v-model="form.subject" />
              </div>
              <div class="space-y-2">
                <Label for="message">{{ t('contact.message', 'Mensagem') }} *</Label>
                <Textarea
                  id="message"
                  v-model="form.message"
                  class="min-h-[150px]"
                  required
                />
              </div>
              <Button type="submit" class="w-full">
                {{ t('contact.send', 'Enviar Mensagem') }}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
