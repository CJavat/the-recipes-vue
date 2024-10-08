<template>
  <div class="flex items-center justify-between bg-sky-50 dark:bg-sky-950 py-3 sm:px-6">
    <div class="flex flex-1 justify-between">
      <button
        v-if="currentPage !== 1"
        @click="previousPage"
        class="border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
      >
        Anterior
      </button>
      <div v-else></div>

      <button
        v-if="finalPage !== currentPage"
        @click="nextPage"
        class="border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  route: string
  currentPage: number
  finalPage: number
  limit: number
}

const router = useRouter()
const props = defineProps<Props>()
const currentPage = ref<number>(props.currentPage)

const nextPage = () => {
  currentPage.value++
  updatePage()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  updatePage()
}

const updatePage = () => {
  const offset = (currentPage.value - 1) * props.limit

  router.push({
    path: props.route,
    query: { limit: props.limit, offset: offset }
  })
}
</script>
