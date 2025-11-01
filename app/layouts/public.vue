<!--
  @fileoverview Layout público com header e footer
  @module layouts/public
  @author DanSP8 <daniel.adg1337@gmail.com>
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/composables/useAuth'
import { useYear } from '~/composables/year'

const { t } = useI18n()
const { isAuthenticated, isAdmin } = useAuth()
const year = useYear()
/**
 * Navegação principal
 */
const navigation = [
  { name: t('nav.raffles', 'Rifas'), href: '/raffles' },
  { name: t('nav.howItWorks', 'Como Funciona'), href: '/how-it-works' },
  { name: t('nav.about', 'Sobre'), href: '/about' },
  { name: t('nav.contact', 'Contato'), href: '/contact' },
]

/**
 * Links do footer
 */
const footerLinks = {
  company: [
    { name: t('footer.about', 'Sobre'), href: '/about' },
    { name: t('footer.howItWorks', 'Como Funciona'), href: '/how-it-works' },
    { name: t('footer.faq', 'FAQ'), href: '/faq' },
  ],
  legal: [
    { name: t('footer.terms', 'Termos de Uso'), href: '/terms' },
    { name: t('footer.privacy', 'Política de Privacidade'), href: '/privacy' },
    { name: t('footer.cookies', 'Cookies'), href: '/cookies' },
  ],
  support: [
    { name: t('footer.help', 'Ajuda'), href: '/help' },
    { name: t('footer.contact', 'Contato'), href: '/contact' },
    { name: t('footer.support', 'Suporte'), href: '/support' },
  ],
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <NuxtLink to="/" class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span class="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span class="text-xl font-bold">Raffle App</span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              v-for="item in navigation"
              :key="item.href"
              :to="item.href"
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <Button
              v-if="!isAuthenticated"
              variant="ghost"
              @click="navigateTo('/login')"
            >
              {{ t('nav.login', 'Entrar') }}
            </Button>
            <Button
              v-if="!isAuthenticated"
              @click="navigateTo('/register')"
            >
              {{ t('nav.register', 'Cadastrar') }}
            </Button>
            <Button
              v-if="isAuthenticated"
              variant="ghost"
              @click="navigateTo(isAdmin ? '/admin' : '/user-panel')"
            >
              {{ t('nav.dashboard', 'Dashboard') }}
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t bg-muted/50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span class="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span class="text-xl font-bold">Raffle App</span>
            </div>
            <p class="text-sm text-muted-foreground">
              {{ t('footer.description', 'Plataforma de rifas segura e transparente') }}
            </p>
          </div>

          <!-- Company -->
          <div>
            <h3 class="text-sm font-semibold mb-4">
              {{ t('footer.company', 'Empresa') }}
            </h3>
            <ul class="space-y-2">
              <li v-for="link in footerLinks.company" :key="link.href">
                <NuxtLink
                  :to="link.href"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-sm font-semibold mb-4">
              {{ t('footer.legal', 'Legal') }}
            </h3>
            <ul class="space-y-2">
              <li v-for="link in footerLinks.legal" :key="link.href">
                <NuxtLink
                  :to="link.href"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold mb-4">
              {{ t('footer.support', 'Suporte') }}
            </h3>
            <ul class="space-y-2">
              <li v-for="link in footerLinks.support" :key="link.href">
                <NuxtLink
                  :to="link.href"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom -->
        <div class="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-muted-foreground">
            {{ t('footer.copyright', `© ${year} Raffle App. Todos os direitos reservados.`) }}
          </p>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/terms"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {{ t('footer.terms', 'Termos') }}
            </NuxtLink>
            <NuxtLink
              to="/privacy"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {{ t('footer.privacy', 'Privacidade') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
