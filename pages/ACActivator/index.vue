<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <h1 class="text-h2 pt-16">使用 AC Activator 激活您的 Windows 副本。</h1>
        <h2 class="text-h5 pt-8">使用崭新的，基于 WinUI 3 的 KMS GUI 工具，简易地激活您的 Windows 副本。</h2>
      </v-col>
      <v-col cols="12" md="6">
        <v-img
        contain
        max-height="400"
        class="pt-16"
        src="/ACActivator/ac-activator.png"
        style="border-radius: 5px"
        :elevation="3"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col></v-col>
      <v-col md="6" cols="12">
      <v-btn rounded outlined class="mt-8 mb-8" block x-large href="https://github.com/sereinmono/ACActivator"><v-icon>mdi-github</v-icon><span style="width: 10px"/>前往 Github 项目页</v-btn>
      <v-btn rounded outlined class="mt-8 mb-8" block x-large href="https://github.com/sereinmono/ACActivator/releases/"><v-icon>mdi-download</v-icon><span style="width: 10px"/>前往 Github 下载最新版本</v-btn>
      <v-btn rounded outlined class="mt-8 mb-8" block x-large href="https://gitee.com/pymansu/acactivator/releases"><v-icon>mdi-git</v-icon><span style="width: 10px"/>前往 Gitee 下载最新版本</v-btn>
      </v-col>
      <v-col />
    </v-row>
    </v-container>
  <!--TODO: 完成首页的设计。-->
</template>

<script>
export default {
  name: 'IndexPage',
}
</script>
