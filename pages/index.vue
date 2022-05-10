<template>
  <v-container>
    <PinnedArticleCard 
    :title="pinned.title" 
    :overview="pinned.overview" 
    :image="pinned.image" 
    :href="pinned.href"
    :date="pinned.date"/>
    <v-row>
       <v-col v-for="(article, i) in articleList" :key="i" sm="12" md="6" class="mt-16">
           <CommonArticleCard 
            :title="article.title" 
            :overview="article.overview" 
            :href="article.href" 
            :image="article.image" 
            :date="article.date"
           />
       </v-col>
    </v-row>
    <v-row>
        <v-col></v-col>
        <v-col md="6" cols="12">
        <v-btn rounded outlined class="mt-16 mb-16" block x-large href="/blog">更多文章</v-btn>
        </v-col>
        <v-col />
    </v-row>
  </v-container>
  <!--TODO: 完成首页的设计。-->
</template>

<script>
import PinnedArticleCard from "~/components/PinnedArticleCard.vue"
import CommonArticleCard from "~/components/CommonArticleCard.vue";

export default {
    name: "IndexPage",
    components: { PinnedArticleCard, CommonArticleCard },
    data() {
        return {
            pinned: {
              title: "AC Activator 开发记录（三）",
              overview: "我们来实现这个应用的心脏——实现激活程序，并构建一个可供用户的『黑箱』。",
              href: "/blog/building_ac_activator_3",
              date: "2022.05.10",
              image: "/blog/title_image/building-ac-activator.png"
            },
            articleList: [
              {
              title: "AC Activator 开发记录（一）",
              overview: "如何构建一个引人入胜、易于使用的现代化界面。",
              href: "/blog/building_ac_activator",
              date: "2022.05.04",
              image: "/blog/title_image/building-ac-activator.png"
              },
              {
                title: "AC Activator 开发记录（二）",
                overview: "实现设置页面。",
                href: "/blog/building_ac_activator_2",
                date: "2022.05.06",
                image: "/blog/title_image/building-ac-activator.png"
              },
            ],
        };
    },
}
</script>
