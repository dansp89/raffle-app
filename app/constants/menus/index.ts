/**
 * @fileoverview Menus de navegação - Arquivo principal de exportação
 * @module constants/menus/index
 * @author Raffle System
 */

import type { NavMenu, NavMenuItems } from '~/types/nav'
import { adminMenu, adminMenuBottom } from './admin'
import { userMenu, userMenuBottom } from './user'

export { adminMenu, adminMenuBottom } from './admin'
export { navMenu, navMenuBottom } from './default'
// Re-exportar todos os menus
export { userMenu, userMenuBottom } from './user'

/**
 * Obtém o menu de navegação apropriado baseado no papel do usuário
 * @param {boolean} isAdmin - Se o usuário é administrador
 * @param {boolean} showBoth - Se deve mostrar ambos os menus (modo desenvolvimento)
 * @returns {NavMenu[]} Menu de navegação apropriado
 */
export function getNavMenu(isAdmin: boolean, showBoth: boolean = false): NavMenu[] {
  if (showBoth) {
    // Em desenvolvimento, retorna ambos os menus combinados
    return [
      ...adminMenu.map(menu => ({
        ...menu,
        heading: `🔧 ${menu.heading} (Admin)`,
      })),
      ...userMenu.map(menu => ({
        ...menu,
        heading: `👤 ${menu.heading} (Usuário)`,
      })),
    ]
  }
  return isAdmin ? adminMenu : userMenu
}

/**
 * Obtém o menu inferior apropriado baseado no papel do usuário
 * @param {boolean} isAdmin - Se o usuário é administrador
 * @param {boolean} showBoth - Se deve mostrar ambos os menus (modo desenvolvimento)
 * @returns {NavMenuItems} Menu inferior apropriado
 */
export function getNavMenuBottom(isAdmin: boolean, showBoth: boolean = false): NavMenuItems {
  if (showBoth) {
    // Em desenvolvimento, retorna ambos os menus combinados
    return [
      ...adminMenuBottom.map((item) => {
        if ('title' in item) {
          return {
            ...item,
            title: `🔧 ${item.title} (Admin)`,
          }
        }
        return item
      }),
      ...userMenuBottom.map((item) => {
        if ('title' in item) {
          return {
            ...item,
            title: `👤 ${item.title} (Usuário)`,
          }
        }
        return item
      }),
    ]
  }
  return isAdmin ? adminMenuBottom : userMenuBottom
}
