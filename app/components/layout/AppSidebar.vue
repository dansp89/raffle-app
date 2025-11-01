<script setup lang="ts">
/**
 * @fileoverview Componente de sidebar com menus dinâmicos baseados no papel do usuário
 * @module components/layout/AppSidebar
 * @author Raffle System
 */

import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'
import { useAuth } from '~/composables/useAuth'
import { getNavMenu, getNavMenuBottom } from '~/constants/menus'

/**
 * Resolve qual componente usar para cada item do menu
 * @param {NavLink | NavGroup | NavSectionTitle} item - Item do menu
 * @returns {any} Componente resolvido
 */
function resolveNavItemComponent(item: NavLink | NavGroup | NavSectionTitle): any {
  if ('children' in item)
    return resolveComponent('LayoutSidebarNavGroup')

  return resolveComponent('LayoutSidebarNavLink')
}

/**
 * Rota atual
 */
const route = useRoute()

/**
 * Autenticação e usuário atual
 */
const { user: currentUser, isAdmin } = useAuth()

/**
 * Detecta se estamos em uma rota administrativa
 */
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

/**
 * Detecta se estamos em uma rota do painel do usuário
 */
const isPanelRoute = computed(() => {
  return route.path.startsWith('/user-panel')
})

/**
 * Determina qual menu mostrar baseado na rota atual
 * - /admin/* → sempre menu admin
 * - /user-panel/* → sempre menu de usuário cliente
 * - outras rotas → baseado no papel do usuário
 */
const shouldShowAdminMenu = computed(() => {
  if (isAdminRoute.value) {
    return true // Força menu admin em rotas /admin/*
  }
  if (isPanelRoute.value) {
    return false // Força menu usuário em rotas /user-panel/*
  }
  return isAdmin.value // Caso contrário, usa o papel do usuário
})

/**
 * Menus dinâmicos baseados na rota atual e papel do usuário
 */
const menu = computed(() => getNavMenu(shouldShowAdminMenu.value, false))
const menuBottom = computed(() => getNavMenuBottom(shouldShowAdminMenu.value, false))

/**
 * Dados do usuário para exibição
 */
const user = computed(() => ({
  name: currentUser.value?.name || 'Usuário',
  email: currentUser.value?.email || 'usuario@example.com',
  avatar: currentUser.value?.avatarUrl || '/avatars/avatartion.png',
}))

/**
 * Configurações da sidebar
 */
const { sidebar } = useAppSettings()
</script>

<template>
  <Sidebar :collapsible="sidebar?.collapsible" :side="sidebar?.side" :variant="sidebar?.variant">
    <SidebarHeader>
      <div class="px-4 py-3">
        <h2 class="text-lg font-semibold">
          Raffle App
        </h2>
        <p class="text-xs text-muted-foreground">
          {{ isAdminRoute ? 'Administração' : isPanelRoute ? 'Meu Painel' : shouldShowAdminMenu ? 'Administração' : 'Usuário' }}
        </p>
      </div>
      <Search />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="(nav, indexGroup) in menu" :key="indexGroup">
        <SidebarGroupLabel v-if="nav.heading">
          {{ nav.heading }}
        </SidebarGroupLabel>
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in nav.items" :key="index" :item="item" />
      </SidebarGroup>
      <SidebarGroup class="mt-auto">
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in menuBottom" :key="index" :item="item" size="sm" />
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <LayoutSidebarNavFooter :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<style scoped>

</style>
