/**
 * @fileoverview Menu de navegação para usuários comuns
 * @module constants/menus/user
 * @author Raffle System
 */

import type { NavMenu, NavMenuItems } from '~/types/nav'

/**
 * Menu de navegação para usuários comuns
 * @type {NavMenu[]}
 */
export const userMenu: NavMenu[] = [
  {
    heading: 'Geral',
    items: [
      {
        title: 'Início',
        icon: 'i-lucide-home',
        link: '/',
      },
      {
        title: 'Rifas',
        icon: 'i-lucide-ticket',
        link: '/raffles',
      },
      {
        title: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        link: '/user-panel',
      },
    ],
  },
  {
    heading: 'Minha Conta',
    items: [
      {
        title: 'Meus Tickets',
        icon: 'i-lucide-ticket-percent',
        link: '/user-panel/my-tickets',
      },
      {
        title: 'Transações',
        icon: 'i-lucide-wallet',
        link: '/user-panel/transactions',
      },
      {
        title: 'Carteira',
        icon: 'i-lucide-credit-card',
        link: '/user-panel/wallet',
      },
    ],
  },
  {
    heading: 'Configurações',
    items: [
      {
        title: 'Perfil',
        icon: 'i-lucide-user',
        link: '/settings/profile',
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
          {
            title: 'Notificações',
            icon: 'i-lucide-circle',
            link: '/settings/notifications',
          },
        ],
      },
    ],
  },
]

/**
 * Menu de navegação inferior para usuários comuns
 * @type {NavMenuItems}
 */
export const userMenuBottom: NavMenuItems = [
  {
    title: 'Ajuda & Suporte',
    icon: 'i-lucide-circle-help',
    link: '/help',
    external: true,
    target: '_blank',
  },
  {
    title: 'Termos de Uso',
    icon: 'i-lucide-file-text',
    link: '/terms',
    external: true,
    target: '_blank',
  },
  {
    title: 'Política de Privacidade',
    icon: 'i-lucide-shield',
    link: '/privacy',
    external: true,
    target: '_blank',
  },
]
