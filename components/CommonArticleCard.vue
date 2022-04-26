<template>
  <v-hover v-slot="{ hover }">
    
   
    <div>
      <v-card :elevation="hover ? 6 : 0">
      <v-img
      max-height="200"
      :src="image"
      style="border-radius: 5px"
      class="pt-4"
      ></v-img>

    </v-card>
    <h1 class="text-h3 pt-8 font-weight-light">{{ title }}</h1>
    <h2 class="text-h5 pt-4 pb-4">{{ overview }}</h2>
     
    </div>
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
    image: {
      type: String,
      default: ""
    },
  },
}
</script>
