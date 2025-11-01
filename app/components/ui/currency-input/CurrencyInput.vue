<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import currency from 'currency.js'
import { cn } from '@/lib/utils'
import type { Currency } from '~/types/raffle'

interface Props {
  modelValue?: number | string
  currency?: Currency
  class?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  currency: 'USD' as Currency,
  placeholder: '0.00',
  disabled: false,
  required: false,
  min: 0,
  max: undefined,
  id: undefined,
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const inputRef = ref<HTMLInputElement>()
const displayValue = ref<string>('')

/**
 * Obtém o código ISO da moeda para formatação
 */
const currencyCode = computed(() => {
  // Para criptomoedas, usa formato USD como padrão
  const cryptoCurrencies = ['SOL']
  return cryptoCurrencies.includes(props.currency) ? 'USD' : props.currency
})

/**
 * Obtém o símbolo da moeda para exibição
 */
const currencySymbol = computed(() => {
  const symbols: Record<string, string> = {
    USD: '$',
    BRL: 'R$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    CAD: 'C$',
    AUD: 'A$',
    NZD: 'NZ$',
    CHF: 'CHF',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    RUB: '₽',
    TRY: '₺',
    ZAR: 'R',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    HKD: 'HK$',
    SGD: 'S$',
    THB: '฿',
    MYR: 'RM',
    PHP: '₱',
    VND: '₫',
    IDR: 'Rp',
    NGN: '₦',
    EGP: 'E£',
    AED: 'AED',
    SAR: 'SAR',
    ILS: '₪',
    // Criptomoedas
    SOL: 'SOL',
  }
  return symbols[props.currency] || props.currency
})

/**
 * Formata o valor para exibição (formato americano)
 */
function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value

  if (numValue === 0)
    return ''

  try {
    // Formata no padrão americano: 1,234.56
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(numValue)
  }
  catch (error) {
    // Fallback para formatação simples
    return currency(numValue, { symbol: '', decimal: '.', separator: ',' }).format()
  }
}

/**
 * Parse do valor digitado para número
 */
function parseValue(value: string): number {
  // Remove tudo exceto dígitos e ponto decimal (remove vírgulas que são separadores de milhares)
  const cleaned = value.replace(/[^\d.]/g, '').replace(/,/g, '')

  // Garante apenas um ponto decimal
  const parts = cleaned.split('.')
  let result = parts[0] || '0'
  if (parts.length > 1) {
    result += `.${parts[1].slice(0, 2)}` // Máximo 2 casas decimais
  }

  const numValue = parseFloat(result) || 0

  // Aplica limites
  if (props.min !== undefined && numValue < props.min)
    return props.min
  if (props.max !== undefined && numValue > props.max)
    return props.max

  return numValue
}

/**
 * Atualiza o valor exibido baseado no modelValue
 */
function updateDisplayValue() {
  if (modelValue.value === undefined || modelValue.value === null || modelValue.value === '') {
    displayValue.value = ''
    return
  }

  const numValue = typeof modelValue.value === 'string' ? parseFloat(modelValue.value) : modelValue.value

  if (numValue === 0) {
    displayValue.value = ''
    return
  }

  displayValue.value = formatCurrency(numValue)
}

/**
 * Handler para input - formata enquanto digita
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let inputValue = target.value

  // Remove símbolo da moeda se presente
  if (currencySymbol.value && inputValue.startsWith(currencySymbol.value)) {
    inputValue = inputValue.replace(currencySymbol.value, '').trim()
  }

  // Se vazio, limpa tudo
  if (!inputValue || inputValue.trim() === '') {
    displayValue.value = ''
    modelValue.value = 0
    return
  }

  // Parse o valor
  const numValue = parseValue(inputValue)

  // Salva posição do cursor antes da formatação
  const cursorPosition = target.selectionStart || 0
  const valueBefore = target.value
  const selectionLength = (target.selectionEnd || 0) - cursorPosition

  // Atualiza valor numérico
  modelValue.value = numValue

  // Atualiza display formatado
  const formatted = formatCurrency(numValue)
  displayValue.value = formatted

  // Calcula nova posição do cursor
  nextTick(() => {
    if (inputRef.value) {
      // Tenta manter o cursor na posição relativa correta
      const diff = formatted.length - valueBefore.length
      const newPosition = Math.min(cursorPosition + diff, formatted.length)
      inputRef.value.setSelectionRange(newPosition, newPosition + selectionLength)
    }
  })
}

/**
 * Handler para blur - formata completamente
 */
function handleBlur() {
  updateDisplayValue()
}

/**
 * Handler para focus - remove formatação para edição fácil
 */
function handleFocus() {
  if (modelValue.value && modelValue.value > 0) {
    // Mostra valor numérico puro para facilitar edição
    const numValue = typeof modelValue.value === 'string' ? parseFloat(modelValue.value) : modelValue.value
    displayValue.value = numValue.toString()
  }
}

// Watch modelValue externo
watch(() => props.modelValue, () => {
  updateDisplayValue()
}, { immediate: true })

onMounted(() => {
  updateDisplayValue()
})
</script>

<template>
  <div class="relative">
    <!-- Símbolo da moeda (prefixo) -->
    <span
      v-if="currencySymbol && displayValue"
      class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm"
    >
      {{ currencySymbol }}
    </span>

    <!-- Input -->
    <input
      :id="id"
      ref="inputRef"
      v-model="displayValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        currencySymbol && displayValue && 'pl-8', // Padding para símbolo
        props.class,
      )"
      inputmode="decimal"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    >
  </div>
</template>

