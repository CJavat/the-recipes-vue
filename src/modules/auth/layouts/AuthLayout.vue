<template>
  <nav class="w-full absolute top-0 flex justify-between items-center py-5">
    <div></div>
    <ChangeTheme class="pr-5" />
  </nav>

  <main class="bg-sky-50 dark:bg-sky-950 w-screen min-h-screen flex justify-center items-center">
    <RouterView />
  </main>
</template>

<script lang="ts" setup>
import ChangeTheme from '../../common/components/ChangeTheme.vue'
</script>
