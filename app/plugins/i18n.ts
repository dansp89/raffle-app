/* eslint-disable ts/ban-ts-comment */
/**
 * @fileoverview Plugin de internacionalização (i18n) para Vue
 * @module plugins/i18n
 * @author Raffle System
 */

import { createI18n } from 'vue-i18n'
// @ts-ignore - JSON imports
import enUS from '~/locales/en-US.json'
// @ts-ignore - JSON imports
import esMX from '~/locales/es-MX.json'
// @ts-ignore - JSON imports
import ptBR from '~/locales/pt-BR.json'

/**
 * Configuração do i18n com suporte a pt-BR, en-US e es-MX
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'pt-BR',
    fallbackLocale: 'pt-BR',
    messages: {
      'pt-BR': ptBR as any,
      'en-US': enUS as any,
      'es-MX': esMX as any,
    },
    globalInjection: true,
  })

  nuxtApp.vueApp.use(i18n)

  return {
    provide: {
      i18n,
    },
  }
})
