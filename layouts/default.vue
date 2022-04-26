<template>
  <v-app light>
    <v-app-bar :clipped-left="clipped" fixed app hide-on-scroll elevate-on-scroll>
      <v-toolbar-title v-text="title" />
        <img
          alt="Sereinmono's Blog"
          src="/serein-logo.png"
          height="42"
          @click="$router.push('/')"
        >
      <v-spacer />
      <v-tabs right :color="tabColor" optional >
        <v-tab href="/">Blog</v-tab>
        <v-tab href="/ACActivator/">AC Activator</v-tab>
        <v-tab href="/Focdows/">Focdows</v-tab>
      </v-tabs>
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
    <SereinFooter />
  </v-app>
</template>

<script>
import SereinFooter from "~/components/SereinFooter.vue";
export default {
    name: "DefaultLayout",
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
            }
            else {
                this.tabColor = "black";
            }
        },
    },
    components: { SereinFooter }
}
</script>
