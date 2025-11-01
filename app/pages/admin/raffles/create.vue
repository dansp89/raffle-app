<!--
  @fileoverview Página administrativa para criar nova rifa
  @module pages/admin/raffles/create
  @author Raffle System
-->
<script setup lang="ts">
import type { RaffleFormData } from '~/types/raffle'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import RaffleWizard from '~/components/admin/RaffleWizard.vue'
import { Button } from '~/components/ui/button'

const { t } = useI18n()

/**
 * Meta tags
 */
useHead({
  title: `${t('admin.title')} - ${t('admin.createRaffle')}`,
})

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

/**
 * Handler para submit do wizard
 */
function handleSubmit(data: RaffleFormData) {
  // Mock: em produção, salvaria no banco
  console.warn('Raffle form data:', data)
  toast.success(t('admin.raffleCreated'))
  navigateTo('/admin/raffles')
}

/**
 * Handler para cancelar
 */
function handleCancel() {
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
        Crie uma nova rifa usando o assistente passo a passo
      </p>
    </div>

    <!-- Wizard -->
    <RaffleWizard
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
