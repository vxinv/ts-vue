<template>
    <el-image v-bind:src="imageSrc"/>

</template>

<script lang="ts">
    import {Vue} from "vue-property-decorator";

    //动态地绑定一个或多个 attribute，或一个组件 prop 到表达式。
    export default class TestVbind extends Vue{
        key:string ="src"
        imageSrc:string = 'https://upload.jianshu.io/users/upload_avatars/2064445/32cee8f83ebc?imageMogr2/auto-orient/strip|imageView2/1/w/96/h/96/format/webp'
        name:string = "testVbind"
    }
</script>

<style scoped>

</style>