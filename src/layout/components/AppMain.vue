<template>
  <section class="app-main">
    <keep-alive>
      <router-view />
    </keep-alive>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AppMain"
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 50px);
  overflow: auto;
}
</style>