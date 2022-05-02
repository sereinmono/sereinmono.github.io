<template>
  <v-footer>
    <v-col
      class="text-center"
      cols="12"
    >
      <v-img :src="logoSrc" :height="52" :contain="true"></v-img>
      <h6 class="pt-4 text-h6 font-weight-thin">S E R E I N M O N O</h6>
      <h6 class="text-h6 font-weight-thin"> - </h6>
      <p class="pb-4">Keep It Simple, Stupid.</p>
    </v-col>
  </v-footer>
</template>

<script>

export default {
  name: "SereinFooter",
  props: {
    logoSrc: {
      type: String,
      default: "serein-logo/serein-logo.png"
    }
  }
}
</script>
