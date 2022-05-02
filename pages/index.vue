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
                title: "我的刷机往事",
                overview: "讲讲我和刷机的那些事儿。",
                href: "/blog/something_about_phone_flashing",
                image: "/blog/title_image/something-about-phone-flashing.jpg",
                date: "2021.08.11"
            },
            articleList: [
            ],
        };
    },
}
</script>
