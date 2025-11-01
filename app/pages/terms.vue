<!--
  @fileoverview Página de termos de uso
  @module pages/terms
  @author Raffle System
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: () => t('terms.title', 'Termos de Uso'),
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
          {{ t('terms.title', 'Termos de Uso') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('terms.lastUpdated', 'Última atualização') }}: {{ new Date().toLocaleDateString('pt-BR') }}
        </p>
      </div>

      <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('terms.section1.title', '1. Aceitação dos Termos') }}
          </h2>
          <p>
            {{ t('terms.section1.content', 'Ao acessar e usar o Raffle App, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('terms.section2.title', '2. Descrição do Serviço') }}
          </h2>
          <p>
            {{ t('terms.section2.content', 'O Raffle App é uma plataforma de rifas online que utiliza tecnologia blockchain para garantir transparência e segurança nas transações.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('terms.section3.title', '3. Elegibilidade') }}
          </h2>
          <p>
            {{ t('terms.section3.content', 'Você deve ter pelo menos 18 anos de idade para usar nosso serviço. Ao usar o Raffle App, você declara e garante que tem a capacidade legal para celebrar contratos vinculativos.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('terms.section4.title', '4. Participação em Rifas') }}
          </h2>
          <p>
            {{ t('terms.section4.content', 'Ao participar de uma rifa, você concorda em pagar o valor do ticket conforme indicado. Os sorteios são realizados de forma transparente e podem ser verificados na blockchain.') }}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t('terms.section5.title', '5. Privacidade') }}
          </h2>
          <p>
            {{ t('terms.section5.content', 'Suas informações pessoais são tratadas de acordo com nossa Política de Privacidade. Ao usar nosso serviço, você concorda com a coleta e uso de informações conforme descrito na política.') }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
