<template>
  <v-container>
      <div class="pt-16"></div>
      <div class="pt-16"></div>
      <div class="pt-16"></div>
      <p class="font-weight-thin text-h5">2022.05.04</p>
      <div v-html="md" />
  </v-container>
</template>

<script>
import md from '../../content/blog/building_ac_activator_2.md'
export default {
  name: 'IndexPage',
  computed: {
    md() {
      return md
    }
  },
}
</script>

<style>
  @import '@/assets/styles/markdown_style.css';
</style>