<template>
  <nav
    class="sticky w-full top-0 right-0 bg-sky-50 dark:bg-sky-950 border-b border-b-sky-200 dark:border-b-sky-900 z-50"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="relative inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            type="button"
            class="relative inline-flex items-center justify-center rounded-md p-2 text-black dark:text-white focus:outline-none focus:text-blue-950 dark:focus:text-sky-50 ring-1 focus:ring-sky-950 dark:focus:ring-sky-50"
            aria-controls="mobile-menu-button"
            id="recipe-menu"
            :attr.aria-expanded="isExpanded"
            @click="toggleNavMenu($event)"
          >
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>

            <svg
              class="hidden h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex items-center justify-center sm:items-stretch sm:justify-start">
          <RouterLink :to="{ name: 'home' }" class="flex flex-shrink-0 items-center mx-5 md:mx-0">
            <img
              class="h-8 w-auto rounded-md"
              src="/android-chrome-512x512.png"
              alt="The Recipes Logo"
            />
          </RouterLink>

          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                v-for="(item, index) in recipesRoutes"
                exact-active-class="bg-sky-500 text-white"
                class="rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white hover:bg-sky-700 hover:text-white"
                :key="index"
                :aria-current="isCurrentPage(item.name) ? 'page' : null"
                :to="{ name: item.name }"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="relative flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Search Component -->
          <Search />

          <!-- Sun/Moon Theme  -->
          <ChangeTheme class="hidden sm:block" />

          <!-- Profile dropdown -->
          <div class="relative">
            <button
              type="button"
              class="h-8 w-8 relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded="false"
              :aria-haspopup="isExpandedProfile"
              @click="toggleNavMenu($event, 'user-menu-button')"
            >
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" :src="imageUser?.src" :alt="imageUser?.alt" />
            </button>

            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
              id="user-menu"
              :class="[
                'bg-sky-50 dark:bg-sky-950 text-black dark:text-white absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-500 ease-in-out',
                {
                  'opacity-0 max-h-0 overflow-hidden': !isExpandedProfile,
                  'opacity-100 max-h-screen': isExpandedProfile
                }
              ]"
            >
              <RouterLink
                active-class="bg-sky-500 text-white"
                class="block px-4 py-2 text-sm hover:bg-sky-200 dark:hover:bg-sky-900"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-0"
                @click="toggleNavMenu($event, 'user-menu-button')"
                v-for="(item, index) in accountRoutes"
                :key="index"
                :to="{ name: item.name }"
              >
                {{ item.label }}
              </RouterLink>
              <button
                class="block px-4 py-2 text-sm font-bold text-red-500 hover:bg-sky-200 dark:hover:bg-sky-900 w-full text-left"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-2"
                @click="OnLogout"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div
      :class="[
        'sm:hidden transition-all duration-500 ease-in-out',
        {
          'opacity-0 max-h-0 overflow-hidden': !isExpanded,
          'opacity-100 max-h-screen': isExpanded
        }
      ]"
      id="mobile-menu"
    >
      <div class="space-y-1 px-2 pb-3 pt-2">
        <RouterLink
          class="block rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white hover:bg-sky-700 hover:text-white"
          exact-active-class="bg-sky-500 text-white"
          aria-current="page"
          v-for="(item, index) in recipesRoutes"
          :key="index"
          :to="{ name: item.name }"
          @click="toggleNavMenu($event)"
        >
          {{ item.label }}
        </RouterLink>
      </div>
      <!-- Sun/Moon Theme  -->
      <ChangeTheme class="block my-2 px-3" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

import ChangeTheme from '@/modules/common/components/ChangeTheme.vue'
import Search from './Search.vue'

import type { ImageUser } from '../interfaces'

export interface Routes {
  label: string
  name: string
}

const props = defineProps<{ imageUser: ImageUser }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isExpanded = ref<boolean>(false)
const isExpandedProfile = ref<boolean>(false)

const recipesRoutes: Routes[] = [
  { label: 'Inicio', name: 'home' },
  { label: 'Recetas', name: 'recipes' },
  { label: 'Categorias', name: 'categories' },
  { label: 'Recetas Favoritas', name: 'favorites' }
]

const accountRoutes: Routes[] = [
  { label: 'Mi Cuenta', name: 'my-account' },
  { label: 'Mis Recetas', name: 'my-recipes' },
  { label: 'Configuraciones', name: 'settings' }
]

const isCurrentPage = (path: string) => {
  return route.path === path
}

const toggleNavMenu = (event: Event, nameButton?: string): void => {
  event.stopPropagation()
  if (nameButton === 'user-menu-button') {
    isExpandedProfile.value = !isExpandedProfile.value
    return
  }

  isExpanded.value = !isExpanded.value
}

const OnLogout = (): void => {
  authStore.logout()
  router.replace('/auth')
}

const onDocumentClick = (event: MouseEvent) => {
  const targetElement = event.target as HTMLElement

  // Si el clic no fue dentro del menú o del botón, cierra el menú
  if (targetElement.id !== 'user-menu-button' && !targetElement.closest('#user-menu')) {
    isExpandedProfile.value = false
  }

  if (targetElement.id !== 'mobile-menu-button' && !targetElement.closest('#mobile-menu')) {
    isExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>
