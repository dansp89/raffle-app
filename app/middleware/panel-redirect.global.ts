/**
 * @fileoverview Middleware para redirecionar rotas antigas /panel/* para /user-panel/*
 * @module middleware/panel-redirect
 * @author Raffle System
 */

export default defineNuxtRouteMiddleware((to, _from) => {
  // Redireciona rotas /panel/* para /user-panel/*
  if (to.path.startsWith('/panel')) {
    const newPath = to.path.replace('/panel', '/user-panel')
    return navigateTo(newPath)
  }
})
