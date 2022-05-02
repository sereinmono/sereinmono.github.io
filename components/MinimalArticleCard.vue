<template>

     <v-hover v-slot="{ hover }">
      <v-card :elevation="hover ? 6 : 3" class="mt-4" :href="href">
        <v-card-title>{{ date + ' ' + title }}</v-card-title>
        <v-card-subtitle>{{ overview }}</v-card-subtitle>
      </v-card>
    </v-hover>

</template>

<script>

export default {
  name: 'CommonArticleCard',
  props: {
    title: {
      type: String,
      default: "Lorem Ipsum"
    },
    href: {
      type: String,
      default: "/"
    },
    overview: {
      type: String,
      default: "山高月小，水落石出。"
    },
    date: {
      type: String,
      default: ""
    },
  },
}
</script>