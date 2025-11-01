/**
 * @fileoverview Menu de navegação para administradores
 * @module constants/menus/admin
 * @author Raffle System
 */

import type { NavMenu, NavMenuItems } from '~/types/nav'

/**
 * Menu de navegação para administradores
 * @type {NavMenu[]}
 */
export const adminMenu: NavMenu[] = [
  {
    heading: 'Administração',
    items: [
      {
        title: 'Dashboard Admin',
        icon: 'i-lucide-layout-dashboard',
        link: '/admin',
      },
      {
        title: 'Gerenciar Rifas',
        icon: 'i-lucide-ticket',
        link: '/admin/raffles',
      },
      {
        title: 'Usuários',
        icon: 'i-lucide-users',
        link: '/admin/users',
      },
      {
        title: 'Transações',
        icon: 'i-lucide-wallet',
        link: '/admin/transactions',
      },
    ],
  },
  {
    heading: 'Usuário',
    items: [
      {
        title: 'Ver Rifas',
        icon: 'i-lucide-ticket',
        link: '/raffles',
      },
      {
        title: 'Meu Dashboard',
        icon: 'i-lucide-layout-dashboard',
        link: '/user-panel',
      },
      {
        title: 'Configurações',
        icon: 'i-lucide-settings',
        children: [
          {
            title: 'Perfil',
            icon: 'i-lucide-circle',
            link: '/settings/profile',
          },
          {
            title: 'Conta',
            icon: 'i-lucide-circle',
            link: '/settings/account',
          },
          {
            title: 'Aparência',
            icon: 'i-lucide-circle',
            link: '/settings/appearance',
          },
        ],
      },
    ],
  },
]

/**
 * Menu de navegação inferior para administradores
 * @type {NavMenuItems}
 */
export const adminMenuBottom: NavMenuItems = [
  {
    title: 'Ajuda & Suporte',
    icon: 'i-lucide-circle-help',
    link: '/help',
    external: true,
    target: '_blank',
  },
  {
    title: 'Documentação',
    icon: 'i-lucide-book',
    link: '/docs',
    external: true,
    target: '_blank',
  },
]
