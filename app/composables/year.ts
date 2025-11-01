/**
 * @fileoverview Composable para obter o ano atual
 * @module composables/year
 * @author DanSP89 <daniel.adg1337@gmail.com>
 */
export function useYear(): number {
  /**
   * Obtém o ano atual
   * @returns {number} Ano atual
   */
  const year = computed(() => new Date().getFullYear())

  return year.value
}
