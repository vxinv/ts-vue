<template>
    <div class="Props">
        <h1>父组件</h1>
        <div>
            name:{{name}}<br/>
            age:{{age}}<br/>
            sex:{{sex}}<br/>
        </div>
        <hr/>
        <prop-component :age="age" :name="name" :color="color" ></prop-component>
    </div>
</template>

<script lang="ts">
    import {
        Component, Vue,
    } from 'vue-property-decorator';
    import PropComponent from '@/components/manager/PropsComponent.vue';

    @Component({
        components:{
            PropComponent
        }
    })
    export default  class PropsPage  extends Vue {
        private name: string = "张三";
        private age:number = 1;
        private sex:string = 'nan';
        private color = 'bai'
    }
</script>

<style scoped>
    .Props {
        width: 100px;
    }
</style>
