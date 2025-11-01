<!--
  @fileoverview Página de política de cookies
  @module pages/cookies
  @author Raffle System
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('cookies.title', 'Política de Cookies'),
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
          {{ t('cookies.title', 'Política de Cookies') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('cookies.lastUpdated', 'Última atualização') }}: {{ new Date().toLocaleDateString('pt-BR') }}
        </p>
      </div>

      <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('cookies.section1.title', 'O que são Cookies?') }}
          </h2>
          <p>
            {{ t('cookies.section1.content', 'Cookies são pequenos arquivos de texto armazenados em seu dispositivo quando você visita nosso site. Eles nos ajudam a melhorar sua experiência e a fornecer funcionalidades personalizadas.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('cookies.section2.title', 'Como Usamos Cookies') }}
          </h2>
          <p>
            {{ t('cookies.section2.content', 'Utilizamos cookies para autenticação, preferências do usuário, análise de uso e funcionalidades essenciais do site.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('cookies.section3.title', 'Gerenciamento de Cookies') }}
          </h2>
          <p>
            {{ t('cookies.section3.content', 'Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. Note que desabilitar alguns cookies pode afetar a funcionalidade do site.') }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
