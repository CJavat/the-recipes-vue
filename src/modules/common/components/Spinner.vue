<template>
  <img src="../../../assets/spinner.svg" alt="loading..." :class="class" />
</template>

<script lang="ts" setup>
interface Props {
  class: string
}

defineProps<Props>()
</script>
