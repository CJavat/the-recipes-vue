<template>
  <h1>Search View</h1>
</template>

<script lang="ts" setup>
//TODO: Terminar de implementar
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

//? Así se obtiene el query
console.log(route.query)
</script>
