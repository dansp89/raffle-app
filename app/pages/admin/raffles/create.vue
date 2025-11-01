<!--
  @fileoverview Página administrativa para criar nova rifa
  @module pages/admin/raffles/create
  @author Raffle System
-->
<script setup lang="ts">
import type { RaffleMedia } from '~/types/raffle'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import MediaDropzone from '~/components/raffle/MediaDropzone.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Currency } from '~/types/raffle'

const { t } = useI18n()

/**
 * Meta tags
 */
useHead({
  title: `${t('admin.title')} - ${t('admin.createRaffle')}`,
})

/**
 * Estado do formulário
 */
const form = ref({
  name: '',
  description: '',
  imageUrl: '', // Mantido para compatibilidade
  images: [] as RaffleMedia[],
  videos: [] as RaffleMedia[],
  prizeAmount: 0,
  prizeCurrency: Currency.USDT,
  ticketPrice: 10,
  durationDays: 7,
  isMain: false,
})

/**
 * Validação e submit
 */
function handleSubmit() {
  // Validação básica
  if (!form.value.name || !form.value.description) {
    toast.error('Preencha todos os campos obrigatórios')
    return
  }

  // Valida se tem pelo menos uma imagem
  if (form.value.images.length === 0) {
    toast.error('Adicione pelo menos uma imagem')
    return
  }

  if (form.value.prizeAmount <= 0 || form.value.ticketPrice <= 0) {
    toast.error('Valores devem ser maiores que zero')
    return
  }

  // Define imageUrl principal da primeira imagem
  if (form.value.images.length > 0) {
    form.value.imageUrl = form.value.images[0]?.url || ''
  }

  // Mock: em produção, salvaria no banco
  console.warn('Form data:', form.value)
  toast.success(t('admin.raffleCreated'))
  navigateTo('/admin/raffles')
}
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Header -->
    <div>
      <Button variant="ghost" @click="navigateTo('/admin/raffles')">
        ← {{ t('common.back') }}
      </Button>
      <h1 class="text-4xl font-bold mt-4 mb-2">
        {{ t('admin.createRaffle') }}
      </h1>
      <p class="text-muted-foreground">
        Crie uma nova rifa no sistema
      </p>
    </div>

    <!-- Formulário -->
    <Card>
      <CardHeader>
        <CardTitle>Informações da Rifa</CardTitle>
        <CardDescription>Preencha os dados da rifa</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="name">{{ t('admin.raffleName') }} *</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Ex: iPhone 15 Pro Max"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="description">{{ t('admin.description') }} *</Label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Descrição detalhada do prêmio"
            class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <!-- Upload de Mídias -->
        <div class="space-y-2">
          <Label>{{ t('admin.media', 'Imagens e Vídeos') }}</Label>
          <p class="text-sm text-muted-foreground mb-2">
            Adicione imagens e vídeos da rifa. Você pode arrastar para reorganizar a ordem.
          </p>
          <MediaDropzone
            v-model:images="form.images"
            v-model:videos="form.videos"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="prizeAmount">{{ t('admin.prizeAmount') }} *</Label>
            <Input
              id="prizeAmount"
              v-model.number="form.prizeAmount"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="prizeCurrency">{{ t('admin.prizeCurrency') }} *</Label>
            <select
              id="prizeCurrency"
              v-model="form.prizeCurrency"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option :value="Currency.SOL">
                SOL
              </option>
              <option :value="Currency.USDT">
                USDT
              </option>
              <option :value="Currency.BRL">
                BRL
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="ticketPrice">{{ t('admin.ticketPrice') }} *</Label>
            <Input
              id="ticketPrice"
              v-model.number="form.ticketPrice"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="durationDays">{{ t('admin.duration') }} *</Label>
            <Input
              id="durationDays"
              v-model.number="form.durationDays"
              type="number"
              min="1"
              required
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <input
            id="isMain"
            v-model="form.isMain"
            type="checkbox"
            class="h-4 w-4"
          >
          <Label for="isMain">{{ t('admin.isMain') }}</Label>
        </div>

        <div class="flex gap-4">
          <Button @click="handleSubmit">
            {{ t('common.save') }}
          </Button>
          <Button variant="outline" @click="navigateTo('/admin/raffles')">
            {{ t('common.cancel') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
