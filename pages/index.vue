<template>
  <v-container>
    <PinnedArticleCard :title="pinned.title" :overview="pinned.overview" :image="pinned.image" :href="pinned.href"></PinnedArticleCard>
    <v-row class="pt-16">
        <v-col sm="12" md="6">
            <CommonArticleCard title="在UI中的崭新的材料学与设计理念" overview="谈谈当下我们需要更多地带给用户以什么样的感受" image="/blog/title_image/inspire.jpeg" />
        </v-col>
        <v-col sm="12" md="6">
            <CommonArticleCard title="谈谈Windows 11" overview="令人难忘，令人难蚌" image="/Windows.jpeg" />
        </v-col>
        <v-col sm="12" md="6">
            <CommonArticleCard title="HTML基础论" image="/blog/title_image/inspire.jpeg" />
        </v-col>
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
                title: "照搬Material.io的「心路历程」",
                overview: "如何设计响应式网格和Material风格、构建颜色系统。",
                href: "/blog/inspire/",
                image: "/blog/title_image/inspire.jpeg",
                border_radius: 45
            },
        };
    },
}
</script>
