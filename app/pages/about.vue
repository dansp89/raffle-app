<!--
  @fileoverview Página sobre nós
  @module pages/about
  @author Raffle System
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('about.title', 'Sobre Nós'),
})

definePageMeta({
  layout: 'public',
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-4">
          {{ t('about.title', 'Sobre Nós') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('about.subtitle', 'Conheça nossa missão e valores') }}
        </p>
      </div>

      <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('about.mission.title', 'Nossa Missão') }}
          </h2>
          <p>
            {{ t('about.mission.content', 'Acreditamos que as rifas devem ser transparentes, seguras e acessíveis. Utilizamos tecnologia blockchain para garantir que cada sorteio seja justo e verificável.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('about.values.title', 'Nossos Valores') }}
          </h2>
          <ul class="list-disc pl-6 space-y-2">
            <li>{{ t('about.values.transparency', 'Transparência total nas operações') }}</li>
            <li>{{ t('about.values.security', 'Segurança baseada em blockchain') }}</li>
            <li>{{ t('about.values.fairness', 'Sorteios justos e verificáveis') }}</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
