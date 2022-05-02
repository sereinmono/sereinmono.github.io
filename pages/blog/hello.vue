<template>
  <v-row>
    <v-col lg="8" cols="12">
      <div class="pt-16"></div>
      <div class="pt-16"></div>
      <div class="pt-16"></div>
      <div v-html="md" />
    </v-col>
    <v-col lg="4" cols="0" />
  </v-row>
</template>

<script>
import md from '../../content/blog/hello.md'
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