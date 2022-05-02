<template>

    <v-hover v-slot="{ hover }">
      
      <!--TODO: 添加日期显示。-->
      <div>
        <v-card :elevation="hover ? 6 : 3" style="border-radius: 5px">
        <v-img
        max-height="200"
        :src="image"
        
        class="pt-4"
        ></v-img>

      </v-card>
      <v-row>
        <!--
        <v-col cols="12" md="2" style="padding-top:45px">
          <p class="text-h6 font-weight-light"> {{ date }} </p>
          
        </v-col>
        -->
        <v-col>
          <h1 class="text-h3 pt-8 font-weight-light">{{ title }}</h1>
          <v-row>
            <v-col cols="12" md="3">
              <p class="text-h6 font-weight-light pt-4"> {{ date }} </p>
            </v-col>
            <v-col>
              <h2 class="text-h5 pt-4 pb-4">{{ overview }}</h2>
            </v-col>
            
          </v-row>
        </v-col>
        </v-row>
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
    date: {
      type: String,
      default: ""
    },
  },
}
</script>
