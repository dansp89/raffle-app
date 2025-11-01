<!--
  @fileoverview Página administrativa para editar aparência do usuário
  @module pages/admin/user/appearance/[id]
  @author Raffle System
-->
<script setup lang="ts">
import { computed } from 'vue'
import { getUserById } from '~/data/mocks/users'

const route = useRoute()

/**
 * ID do usuário da rota
 */
const userId = computed(() => route.params.id as string)

/**
 * Usuário selecionado
 */
const selectedUser = computed(() => {
  return getUserById(userId.value)
})

/**
 * Meta tags
 */
useHead({
  title: () => `Editar Aparência - ${selectedUser.value?.name || 'Usuário'}`,
})

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})
</script>

<template>
  <div class="pb-16 space-y-6">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">
        Editar Usuário: {{ selectedUser?.name || 'Carregando...' }}
      </h2>
      <p class="text-muted-foreground">
        Gerencie as configurações da conta do usuário.
      </p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col lg:flex-row space-y-6 lg:space-x-12 lg:space-y-0">
      <div class="w-full overflow-x-auto pb-2 lg:w-1/6 lg:pb-0">
        <SettingsAdminUserSidebarNav :user-id="userId.value" />
      </div>
      <div class="flex-1 lg:max-w-2xl">
        <div class="space-y-6">
          <SettingsAppearanceForm :user-id="userId.value" :is-admin="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

