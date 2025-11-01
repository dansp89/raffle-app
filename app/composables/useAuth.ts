/**
 * @fileoverview Composable para gerenciar autenticação e usuário atual
 * @module composables/useAuth
 * @author Raffle System
 */

import type { Ref } from 'vue'
import type { User } from '~/types/raffle'
import { computed, ref } from 'vue'
import { mockCurrentUser, mockUsers } from '~/data/mocks/users'
import { UserRole } from '~/types/raffle'

/**
 * Estado reativo do usuário atual
 * @type {Ref<User | null>}
 */
const currentUser: Ref<User | null> = ref(mockCurrentUser)

/**
 * Composable para gerenciar autenticação e usuário
 * @returns {object} Objeto com estado e métodos de autenticação
 */
export function useAuth() {
  /**
   * Obtém o usuário atual
   * @returns {Ref<User | null>} Usuário atual
   */
  const user = computed(() => currentUser.value)

  /**
   * Verifica se o usuário está autenticado
   * @returns {Ref<boolean>} True se autenticado
   */
  const isAuthenticated = computed(() => currentUser.value !== null)

  /**
   * Verifica se o usuário é administrador
   * @returns {Ref<boolean>} True se é admin
   */
  const isAdmin = computed(() => currentUser.value?.role === UserRole.ADMIN || currentUser.value?.isAdmin || false)

  /**
   * Role do usuário atual
   * @returns {Ref<UserRole | null>} Role do usuário
   */
  const role = computed(() => currentUser.value?.role || null)

  /**
   * Verifica se o usuário tem uma role específica
   * @param {UserRole} userRole - Role a verificar
   * @returns {Ref<boolean>} True se tem a role
   */
  const hasRole = (userRole: UserRole): Ref<boolean> => {
    return computed(() => currentUser.value?.role === userRole || false)
  }

  /**
   * Verifica se o usuário tem uma das roles especificadas
   * @param {UserRole[]} roles - Roles a verificar
   * @returns {Ref<boolean>} True se tem alguma das roles
   */
  const hasAnyRole = (roles: UserRole[]): Ref<boolean> => {
    return computed(() => roles.includes(currentUser.value?.role) || false)
  }

  /**
   * Define o usuário atual
   * @param {User | null} user - Usuário a ser definido
   */
  function setUser(user: User | null): void {
    currentUser.value = user
  }

  /**
   * Alterna entre usuário comum e admin (mock para desenvolvimento)
   * @param {boolean} asAdmin - Se deve usar usuário admin
   */
  function switchUser(asAdmin: boolean): void {
    if (asAdmin) {
      const admin = mockUsers.find(u => u.isAdmin)
      currentUser.value = admin || mockUsers[0]
    }
    else {
      const regular = mockUsers.find(u => !u.isAdmin)
      currentUser.value = regular || mockUsers[1]
    }
  }

  /**
   * Faz logout do usuário
   */
  function logout(): void {
    currentUser.value = null
    // Em produção, limparia tokens, cookies, etc.
  }

  return {
    user,
    currentUser,
    isAuthenticated,
    isAdmin,
    role,
    hasRole,
    hasAnyRole,
    setUser,
    switchUser,
    logout,
  }
}
