<template>
  <v-hover v-slot="{ hover }">
      <v-row  class="pt-16" @click="$router.push(href)">
        <v-col md="6" sm="12" cols="12">
          <v-card :elevation="hover ? 6 : 3">
            <v-img
            max-height="300"
            :src="image"
            style="border-radius: 5px"
            contained
            ></v-img>
          </v-card>
        </v-col>
        <v-col md="5" sm="12" cols="12">
          <p class="text-h6 font-weight-light pt-8"> {{ date }} </p>
          <h1 class="text-h2 pt-4">{{ title }}</h1>
          <h2 class="text-h5 pt-8">{{ overview }}</h2>
        </v-col>
        <v-spacer />
        
      </v-row>
  </v-hover>
</template>

<script>

export default {
  name: 'PinnedArticleCard',
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
    date: {
      type: String,
      default: ""
    },
  },
}
</script>