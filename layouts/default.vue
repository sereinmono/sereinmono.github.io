<template>
  <v-app light>
    <v-app-bar :clipped-left="clipped" fixed app hide-on-scroll elevate-on-scroll>
      <v-toolbar-title v-text="title" />
        <img
          alt="Sereinmono's Blog"
          :src="logoSrc"
          height="42"
          @click="$router.push('/')"
        >
      <v-spacer />
      <v-tabs right :color="tabColor" optional >
        <v-tab href="/">Blog</v-tab>
        <v-tab href="/ACActivator/">AC Activator</v-tab>
      </v-tabs>
      <v-btn icon href="https://github.com/sereinmono">
          <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-btn icon @click="changeTheme">
          <v-icon v-if="!$vuetify.theme.dark">mdi-brightness-7</v-icon>
          <v-icon v-else>mdi-brightness-4</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <SereinFooter :logoSrc="logoSrc" />
  </v-app>
</template>

<script>
import SereinFooter from "~/components/SereinFooter.vue";
export default {
    name: "DefaultLayout",
    components: { SereinFooter },
    data() {
        return {
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: "mdi-apps",
                    title: "Welcome",
                    to: "/",
                },
                {
                    icon: "mdi-chart-bubble",
                    title: "Inspire",
                    to: "/inspire",
                },
            ],
            logoSrc: "/serein-logo/serein-logo.png",
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: "",
            tabColor: "black"
        };
    },
    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            if (this.tabColor === "black") {
                this.tabColor = "white";
                this.logoSrc = "/serein-logo/serein-logo-dark.png"

            }
            else {
                this.tabColor = "black";
                this.logoSrc = "/serein-logo/serein-logo.png"
            }
        },
    }
}
</script>
