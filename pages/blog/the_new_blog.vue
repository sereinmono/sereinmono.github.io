<template>
  <v-row>
    <v-col lg="8" cols="12">
      <div class="pt-16"></div>
      <div class="pt-16"></div>
      <div class="pt-16"></div>
      <div v-html="md">
      </div>
    </v-col>
    <v-col lg="4" cols="0" />
  </v-row>
</template>

<script>
import md from '../../content/the_new_blog.md'
export default {
  name: 'IndexPage',
  computed: {
    md() {
      return md
    }
  },
}
</script>

<!--
<style>
h1 {
  font-weight: 300;
  font-size: 3.75rem;
  padding-top: 16;
}
h2 {
  font-weight: 300;
  font-size: 3rem;
  padding-top: 16;
}
h3 {
  font-weight: 400;
  font-size: 2.125rem;
  padding-top: 16;
}
h4 {
  font-weight: 400;
  font-size: 1.5rem;
  padding-top: 16;
}
h5 {
  font-weight: 500;
  font-size: 1.25rem;
  padding-top: 16;
}
h6 {
  font-weight: 400;
  font-size: 1rem;
  padding-top: 16;
}
p {
  font-size: 1.25rem;
  font-weight: 300;
  padding-top: 16;
}
</style>
-->

<style>
  @import '@/assets/styles/markdown_style.css';
</style>