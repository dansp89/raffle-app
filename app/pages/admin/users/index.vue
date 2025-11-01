<!--
  @fileoverview Página administrativa para gerenciar usuários
  @module pages/admin/users/index
  @author Raffle System
-->
<script setup lang="ts">
import type { User } from '~/types/raffle'
import { Ban, CheckCircle, Edit, Eye, MoreHorizontal, Plus, Shield, Trash2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { getUserBalance, mockUsers } from '~/data/mocks/users'
import { Currency, UserRole, UserStatus } from '~/types/raffle'
import { generateId } from '~/utils/nanoid'

const { t } = useI18n()

/**
 * Meta tags
 */
useHead({
  title: () => t('admin.users', 'Gerenciar Usuários'),
})

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

/**
 * Estados
 */
const users = ref<User[]>([...mockUsers])
const searchQuery = ref('')
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedUser = ref<User | null>(null)

/**
 * Formulário de criação
 */
const form = ref({
  name: '',
  email: '',
  role: UserRole.CLIENT,
  status: UserStatus.ACTIVE,
  bio: '',
})

/**
 * Usuários filtrados
 */
const filteredUsers = computed(() => {
  if (!searchQuery.value)
    return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    u.name.toLowerCase().includes(query)
    || u.email.toLowerCase().includes(query)
    || u.role.toLowerCase().includes(query),
  )
})

/**
 * Formata valor monetário
 */
function formatBalance(user: User, currency: Currency): string {
  const amount = getUserBalance(user, currency)
  if (currency === Currency.BRL) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
  }
  return `${amount.toFixed(2)} ${currency}`
}

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

/**
 * Variante do badge por status
 */
function getStatusVariant(status: UserStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<UserStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [UserStatus.ACTIVE]: 'default',
    [UserStatus.BLOCKED]: 'destructive',
    [UserStatus.SUSPENDED]: 'secondary',
    [UserStatus.PENDING]: 'outline',
  }
  return variants[status] || 'secondary'
}

/**
 * Abre diálogo de criação
 */
function openCreateDialog() {
  form.value = {
    name: '',
    email: '',
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    bio: '',
  }
  selectedUser.value = null
  showCreateDialog.value = true
}

/**
 * Abre diálogo de exclusão
 */
function openDeleteDialog(user: User) {
  selectedUser.value = user
  showDeleteDialog.value = true
}

/**
 * Cria novo usuário
 */
function handleCreate() {
  if (!form.value.name || !form.value.email) {
    toast.error('Preencha todos os campos obrigatórios')
    return
  }

  const newUser: User = {
    id: generateId(),
    name: form.value.name,
    email: form.value.email,
    avatarUrl: null,
    walletAddresses: [],
    balances: [
      { currency: Currency.SOL, amount: 0, updatedAt: new Date() },
      { currency: Currency.USDT, amount: 0, updatedAt: new Date() },
      { currency: Currency.BRL, amount: 0, updatedAt: new Date() },
    ],
    role: form.value.role,
    status: form.value.status,
    isAdmin: form.value.role === UserRole.ADMIN || form.value.role === UserRole.FINANCIAL,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.value.push(newUser)
  toast.success('Usuário criado com sucesso!')
  showCreateDialog.value = false
}

/**
 * Deleta usuário
 */
function handleDelete() {
  if (!selectedUser.value)
    return

  users.value = users.value.filter(u => u.id !== selectedUser.value!.id)
  toast.success('Usuário excluído com sucesso!')
  showDeleteDialog.value = false
  selectedUser.value = null
}

/**
 * Alterna status do usuário (bloquear/ativar)
 */
function toggleUserStatus(user: User) {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE
    users.value[index]!.status = newStatus
    users.value[index]!.updatedAt = new Date()
    toast.success(`Usuário ${newStatus === UserStatus.ACTIVE ? 'ativado' : 'bloqueado'} com sucesso!`)
  }
}

/**
 * Altera role do usuário
 */
function changeUserRole(user: User, newRole: UserRole) {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    users.value[index]!.role = newRole
    users.value[index]!.isAdmin = newRole === UserRole.ADMIN || newRole === UserRole.FINANCIAL
    users.value[index]!.updatedAt = new Date()
    toast.success(`Role alterada para ${getRoleLabel(newRole)}`)
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ t('admin.users', 'Gerenciar Usuários') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('admin.usersDescription', 'Gerencie todos os usuários do sistema') }}
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="mr-2 h-4 w-4" />
        {{ t('admin.createUser', 'Criar Usuário') }}
      </Button>
    </div>

    <!-- Tabela de Usuários -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-4">
          <Input
            v-model="searchQuery"
            type="search"
            :placeholder="t('common.search', 'Buscar...')"
            class="max-w-sm"
          />
          <div class="ml-auto text-sm text-muted-foreground">
            {{ filteredUsers.length }} {{ t('admin.usersFound', 'usuários encontrados') }}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('admin.userName', 'Nome') }}</TableHead>
              <TableHead>{{ t('admin.userEmail', 'Email') }}</TableHead>
              <TableHead>{{ t('admin.userRole', 'Role') }}</TableHead>
              <TableHead>{{ t('admin.userStatus', 'Status') }}</TableHead>
              <TableHead>{{ t('admin.userBalances', 'Saldos') }}</TableHead>
              <TableHead>{{ t('admin.userWallets', 'Carteiras') }}</TableHead>
              <TableHead class="text-right">
                {{ t('admin.actions', 'Ações') }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in filteredUsers" :key="user.id">
              <TableCell class="font-medium">
                {{ user.name }}
              </TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {{ getRoleLabel(user.role) }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(user.status)">
                  {{ getStatusLabel(user.status) }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex flex-col gap-1 text-xs">
                  <span>SOL: {{ formatBalance(user, Currency.SOL) }}</span>
                  <span>USDT: {{ formatBalance(user, Currency.USDT) }}</span>
                  <span>BRL: {{ formatBalance(user, Currency.BRL) }}</span>
                </div>
              </TableCell>
              <TableCell>
                {{ user.walletAddresses.length }}
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{{ t('admin.actions', 'Ações') }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem as-child>
                      <NuxtLink :to="`/admin/user/profile/${user.id}`">
                        <Eye class="mr-2 h-4 w-4" />
                        {{ t('admin.view', 'Ver Detalhes') }}
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem as-child>
                      <NuxtLink :to="`/admin/user/profile/${user.id}`">
                        <Edit class="mr-2 h-4 w-4" />
                        {{ t('admin.editUser', 'Editar Usuário') }}
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{{ t('admin.changeRole', 'Alterar Role') }}</DropdownMenuLabel>
                    <DropdownMenuItem @click="changeUserRole(user, UserRole.ADMIN)">
                      <Shield class="mr-2 h-4 w-4" />
                      {{ getRoleLabel(UserRole.ADMIN) }}
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="changeUserRole(user, UserRole.FINANCIAL)">
                      <Shield class="mr-2 h-4 w-4" />
                      {{ getRoleLabel(UserRole.FINANCIAL) }}
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="changeUserRole(user, UserRole.SUPPORT)">
                      <Shield class="mr-2 h-4 w-4" />
                      {{ getRoleLabel(UserRole.SUPPORT) }}
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="changeUserRole(user, UserRole.CLIENT)">
                      <Shield class="mr-2 h-4 w-4" />
                      {{ getRoleLabel(UserRole.CLIENT) }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      v-if="user.status === UserStatus.ACTIVE"
                      @click="toggleUserStatus(user)"
                    >
                      <Ban class="mr-2 h-4 w-4" />
                      {{ t('admin.block', 'Bloquear') }}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-else
                      @click="toggleUserStatus(user)"
                    >
                      <CheckCircle class="mr-2 h-4 w-4" />
                      {{ t('admin.activate', 'Ativar') }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      class="text-destructive"
                      @click="openDeleteDialog(user)"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      {{ t('admin.delete', 'Excluir') }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Dialog de Criar Usuário -->
    <Dialog :open="showCreateDialog" @update:open="showCreateDialog = $event">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{{ t('admin.createUser', 'Criar Novo Usuário') }}</DialogTitle>
          <DialogDescription>
            {{ t('admin.createUserDescription', 'Preencha os dados para criar um novo usuário') }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="create-name">{{ t('admin.userName', 'Nome') }} *</Label>
            <Input
              id="create-name"
              v-model="form.name"
              :placeholder="t('admin.enterName', 'Digite o nome')"
            />
          </div>
          <div class="space-y-2">
            <Label for="create-email">{{ t('admin.userEmail', 'Email') }} *</Label>
            <Input
              id="create-email"
              v-model="form.email"
              type="email"
              :placeholder="t('admin.enterEmail', 'Digite o email')"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="create-role">{{ t('admin.userRole', 'Role') }}</Label>
              <Select v-model="form.role">
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
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
            </div>
            <div class="space-y-2">
              <Label for="create-status">{{ t('admin.userStatus', 'Status') }}</Label>
              <Select v-model="form.status">
                <SelectTrigger id="create-status">
                  <SelectValue />
                </SelectTrigger>
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
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateDialog = false">
            {{ t('common.cancel', 'Cancelar') }}
          </Button>
          <Button @click="handleCreate">
            {{ t('admin.create', 'Criar') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Dialog de Excluir Usuário -->
    <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('admin.deleteUser', 'Excluir Usuário') }}</DialogTitle>
          <DialogDescription>
            {{ t('admin.deleteUserConfirm', 'Tem certeza que deseja excluir o usuário') }} <strong>{{ selectedUser?.name }}</strong>?
            {{ t('admin.deleteUserWarning', 'Esta ação não pode ser desfeita.') }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showDeleteDialog = false">
            {{ t('common.cancel', 'Cancelar') }}
          </Button>
          <Button variant="destructive" @click="handleDelete">
            {{ t('admin.delete', 'Excluir') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
</style>
