<template>
  <v-container>
    <h1 class="text-h2 pt-8 pb-8">过往文章</h1>
    <MinimalArticleCard v-for="(article, i) in articles" :key="i" :title="article.title" :overview="article.overview" :href="article.href" :date="article.date" />
  </v-container>
</template>

<script>
import MinimalArticleCard from "~/components/MinimalArticleCard.vue";

export default {
    name: "IndexPage",
    components: { MinimalArticleCard },
    data() {
        return {
          articles: [
            {
              title: "我的刷机往事",
              overview: "讲讲我和刷机的那些事儿。",
              href: "/blog/something_about_phone_flashing",
              date: "2021.08.11"
            }
          ]
        };
    },
}
</script>