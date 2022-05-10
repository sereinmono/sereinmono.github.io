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
              title: "AC Activator 开发记录（三）",
              overview: "我们来实现这个应用的心脏——实现激活程序，并构建一个可供用户的『黑箱』。",
              href: "/blog/building_ac_activator_3",
              date: "2022.05.10"
            },
            {
              title: "AC Activator 开发记录（二）",
              overview: "实现设置页面。",
              href: "/blog/building_ac_activator_2",
              date: "2022.05.06"
            },
            {
              title: "AC Activator 开发记录（一）",
              overview: "如何构建一个引人入胜、易于使用的现代化界面。",
              href: "/blog/building_ac_activator",
              date: "2022.05.04"
            },
            {
              title: "我的刷机往事",
              overview: "讲讲我和刷机的那些事儿。",
              href: "/blog/something_about_phone_flashing",
              date: "2021.08.11"
            },

          ]
        };
    },
}
</script>