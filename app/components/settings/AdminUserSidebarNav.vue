<!--
  @fileoverview Sidebar de navegação para edição de usuário pelo admin
  @module components/settings/AdminUserSidebarNav
  @author Raffle System
-->
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  userId?: string
}

const props = withDefaults(defineProps<Props>(), {
  userId: '',
})

const route = useRoute()

const sidebarNavItems = computed(() => {
  const userId = props.userId || ''
  if (!userId || userId === 'undefined') {
    return []
  }
  return [
    {
      title: 'Profile',
      href: `/admin/user/profile/${userId}`,
    },
    {
      title: 'Account',
      href: `/admin/user/account/${userId}`,
    },
    {
      title: 'Appearance',
      href: `/admin/user/appearance/${userId}`,
    },
    {
      title: 'Notifications',
      href: `/admin/user/notifications/${userId}`,
    },
    {
      title: 'Display',
      href: `/admin/user/display/${userId}`,
    },
  ]
})
</script>

<template>
  <nav class="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
    <Button
      v-for="item in sidebarNavItems"
      :key="item.title"
      variant="ghost"
      :class="cn(
        'w-full text-left justify-start items-start',
        route.path === item.href && 'bg-muted hover:bg-muted',
      )"
      as-child
    >
      <NuxtLink
        :to="item.href"
      >
        {{ item.title }}
      </NuxtLink>
    </Button>
  </nav>
</template>

