<!--
  @fileoverview Página de política de privacidade
  @module pages/privacy
  @author Raffle System
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('privacy.title', 'Política de Privacidade'),
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
          {{ t('privacy.title', 'Política de Privacidade') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('privacy.lastUpdated', 'Última atualização') }}: {{ new Date().toLocaleDateString('pt-BR') }}
        </p>
      </div>

      <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('privacy.section1.title', '1. Informações que Coletamos') }}
          </h2>
          <p>
            {{ t('privacy.section1.content', 'Coletamos informações que você nos fornece diretamente, incluindo nome, email, endereços de carteira blockchain e informações de transação.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('privacy.section2.title', '2. Como Usamos suas Informações') }}
          </h2>
          <p>
            {{ t('privacy.section2.content', 'Utilizamos suas informações para processar transações, gerenciar sua conta, comunicar com você e melhorar nossos serviços.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('privacy.section3.title', '3. Compartilhamento de Informações') }}
          </h2>
          <p>
            {{ t('privacy.section3.content', 'Não vendemos suas informações pessoais. Podemos compartilhar informações apenas conforme necessário para operar o serviço ou conforme exigido por lei.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('privacy.section4.title', '4. Segurança') }}
          </h2>
          <p>
            {{ t('privacy.section4.content', 'Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('privacy.section5.title', '5. Seus Direitos') }}
          </h2>
          <p>
            {{ t('privacy.section5.content', 'Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode optar por não receber comunicações de marketing.') }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
