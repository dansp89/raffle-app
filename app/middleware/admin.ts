/* eslint-disable unused-imports/no-unused-vars */
/**
 * @fileoverview Middleware para proteger rotas administrativas
 * @module middleware/admin
 * @author Raffle System
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // Em desenvolvimento, permite acesso sem verificação
  // Em produção, descomente a verificação abaixo
  // const { isAuthenticated, hasRole } = useAuth()
  // 
  // // Verifica se está autenticado
  // if (!isAuthenticated.value) {
  //   return navigateTo('/login')
  // }
  //
  // // Verifica se tem role de admin ou financial
  // if (!hasRole(UserRole.ADMIN).value && !hasRole(UserRole.FINANCIAL).value) {
  //   // Redireciona para o painel do usuário se não tiver permissão
  //   return navigateTo('/user-panel')
  // }
})
