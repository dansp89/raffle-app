<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FieldArray, useForm } from 'vee-validate'
import { computed, h, onMounted, ref } from 'vue'
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

const verifiedEmails = ref(['m@example.com', 'm@google.com', 'm@support.com'])

const profileFormSchema = toTypedSchema(z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  bio: z.string().max(160, { message: 'Bio must not be longer than 160 characters.' }).min(4, { message: 'Bio must be at least 2 characters.' }),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      }),
    )
    .optional(),
  role: props.isAdmin ? z.nativeEnum(UserRole) : z.nativeEnum(UserRole).optional(),
  status: props.isAdmin ? z.nativeEnum(UserStatus) : z.nativeEnum(UserStatus).optional(),
}))

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {
    bio: 'I own a computer.',
    urls: [
      { value: 'https://shadcn.com' },
      { value: 'http://twitter.com/shadcn' },
    ],
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
        username: user.name,
        email: user.email,
        bio: '',
        urls: [],
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

const onSubmit = handleSubmit((values) => {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Profile
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ isAdmin ? 'Edite o perfil do usuário.' : 'This is how others will see you on the site.' }}
    </p>
  </div>
  <Separator />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>

        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select an email" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="email in verifiedEmails" :key="email" :value="email">
                {{ email }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription>
          You can manage verified email addresses in your email settings.
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

    <FormField v-slot="{ componentField }" name="bio">
      <FormItem>
        <FormLabel>Bio</FormLabel>
        <FormControl>
          <Textarea placeholder="Tell us a little bit about yourself" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          You can <span>@mention</span> other users and organizations to link to them.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div>
      <FieldArray v-slot="{ fields, push, remove }" name="urls">
        <div v-for="(field, index) in fields" :key="`urls-${field.key}`">
          <FormField v-slot="{ componentField }" :name="`urls[${index}].value`">
            <FormItem>
              <FormLabel :class="cn(index !== 0 && 'sr-only')">
                URLs
              </FormLabel>
              <FormDescription :class="cn(index !== 0 && 'sr-only')">
                Add links to your website, blog, or social media profiles.
              </FormDescription>
              <div class="relative flex items-center">
                <FormControl>
                  <Input type="url" v-bind="componentField" />
                </FormControl>
                <button type="button" class="absolute end-0 py-2 pe-3 text-muted-foreground" @click="remove(index)">
                  <Icon name="i-radix-icons-cross-1" class="w-3" />
                </button>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          class="mt-2 w-20 text-xs"
          @click="push({ value: '' })"
        >
          Add URL
        </Button>
      </FieldArray>
    </div>

    <div class="flex justify-start gap-2">
      <Button type="submit">
        Update profile
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="resetForm"
      >
        Reset form
      </Button>
    </div>
  </form>
</template>
