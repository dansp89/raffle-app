<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'
import { h, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { getUserById } from '~/data/mocks/users'
import { UserRole, UserStatus } from '~/types/raffle'

interface Props {
  userId?: string
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  userId: undefined,
  isAdmin: false,
})

const open = ref(false)
const dateValue = ref()
const placeholder = ref()

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Indonesia', value: 'id' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const accountFormSchema = toTypedSchema(z.object({
  name: z
    .string({
      required_error: 'Required.',
    })
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  dob: z.string().datetime().optional().refine(date => date !== undefined, 'Please select a valid date.'),
  language: z.string().min(1, 'Please select a language.'),
  role: props.isAdmin ? z.nativeEnum(UserRole) : z.nativeEnum(UserRole).optional(),
  status: props.isAdmin ? z.nativeEnum(UserStatus) : z.nativeEnum(UserStatus).optional(),
}))

const { handleSubmit, setValues } = useForm({
  validationSchema: accountFormSchema,
  initialValues: {
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
  },
})

/**
 * Carrega dados do usuário quando userId é fornecido
 */
onMounted(() => {
  if (props.userId) {
    const user = getUserById(props.userId)
    if (user) {
      setValues({
        name: user.name,
        language: 'pt',
        role: user.role,
        status: user.status,
      })
    }
  }
})

/**
 * Traduz role para português
 */
function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.FINANCIAL]: 'Financeiro',
    [UserRole.SUPPORT]: 'Suporte',
    [UserRole.CLIENT]: 'Cliente',
  }
  return labels[role] || role
}

/**
 * Traduz status para português
 */
function getStatusLabel(status: UserStatus): string {
  const labels: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: 'Ativo',
    [UserStatus.BLOCKED]: 'Bloqueado',
    [UserStatus.SUSPENDED]: 'Suspenso',
    [UserStatus.PENDING]: 'Pendente',
  }
  return labels[status] || status
}

// https://github.com/logaretm/vee-validate/issues/3521
// https://github.com/logaretm/vee-validate/discussions/3571
async function onSubmit(values: any) {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Account
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ isAdmin ? 'Edite as configurações da conta do usuário.' : 'Update your account settings. Set your preferred language and timezone.' }}
    </p>
  </div>
  <Separator />
  <Form v-slot="{ setFieldValue }" :validation-schema="accountFormSchema" class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your name" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is the name that will be displayed on your profile and in emails.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-if="isAdmin" v-slot="{ componentField }" name="role">
      <FormItem>
        <FormLabel>Role</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma role" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem :value="UserRole.ADMIN">
              {{ getRoleLabel(UserRole.ADMIN) }}
            </SelectItem>
            <SelectItem :value="UserRole.FINANCIAL">
              {{ getRoleLabel(UserRole.FINANCIAL) }}
            </SelectItem>
            <SelectItem :value="UserRole.SUPPORT">
              {{ getRoleLabel(UserRole.SUPPORT) }}
            </SelectItem>
            <SelectItem :value="UserRole.CLIENT">
              {{ getRoleLabel(UserRole.CLIENT) }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Role do usuário no sistema.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-if="isAdmin" v-slot="{ componentField }" name="status">
      <FormItem>
        <FormLabel>Status</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem :value="UserStatus.ACTIVE">
              {{ getStatusLabel(UserStatus.ACTIVE) }}
            </SelectItem>
            <SelectItem :value="UserStatus.PENDING">
              {{ getStatusLabel(UserStatus.PENDING) }}
            </SelectItem>
            <SelectItem :value="UserStatus.BLOCKED">
              {{ getStatusLabel(UserStatus.BLOCKED) }}
            </SelectItem>
            <SelectItem :value="UserStatus.SUSPENDED">
              {{ getStatusLabel(UserStatus.SUSPENDED) }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Status da conta do usuário.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ field, value }" name="dob">
      <FormItem class="flex flex-col">
        <FormLabel>Date of birth</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline" :class="cn(
                  'w-[240px] justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                )"
              >
                <Icon name="i-radix-icons-calendar" class="mr-2 h-4 w-4 opacity-50" />
                <span>{{ value ? df.format(toDate(dateValue, getLocalTimeZone())) : "Pick a date" }}</span>
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="p-0">
            <Calendar
              v-model:placeholder="placeholder"
              v-model="dateValue"
              calendar-label="Date of birth"
              initial-focus
              :min-value="new CalendarDate(1900, 1, 1)"
              :max-value="today(getLocalTimeZone())"
              @update:model-value="(v: any) => {
                if (v) {
                  dateValue = v
                  setFieldValue('dob', toDate(v).toISOString())
                }
                else {
                  dateValue = undefined
                  setFieldValue('dob', undefined)
                }
              }"
            />
          </PopoverContent>
        </Popover>
        <FormDescription>
          Your date of birth is used to calculate your age.
        </FormDescription>
        <FormMessage />
      </FormItem>
      <input type="hidden" v-bind="field">
    </FormField>

    <FormField v-slot="{ value }" name="language">
      <FormItem class="flex flex-col">
        <FormLabel>Language</FormLabel>

        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline" role="combobox" :aria-expanded="open" :class="cn(
                  'w-[200px] justify-between',
                  !value && 'text-muted-foreground',
                )"
              >
                {{ value ? languages.find(
                  (language) => language.value === value,
                )?.label : 'Select language...' }}

                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command>
              <CommandInput type="search" placeholder="Search language..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="language in languages" :key="language.value" :value="language.label"
                    @select="() => {
                      setFieldValue('language', language.value)
                      open = false
                    }"
                  >
                    <Check
                      :class="cn(
                        'mr-2 h-4 w-4',
                        value === language.value ? 'opacity-100' : 'opacity-0',
                      )"
                    />
                    {{ language.label }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <FormDescription>
          This is the language that will be used in the dashboard.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start">
      <Button type="submit">
        Update account
      </Button>
    </div>
  </Form>
</template>
