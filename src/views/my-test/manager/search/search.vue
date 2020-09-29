<template>
    <el-row>
        <el-col :offset="7" :span="10" class="search_input" style="margin-top: 50px">
            <el-input
                    placeholder="请输入内容"
                    v-model="input">
                <i class="el-input__icon el-icon-search" slot="prefix"></i>
            </el-input>
        </el-col>
    </el-row>
</template>
<script lang='ts'>
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class search extends Vue {

        @Prop({default: 30, type: Number})
        age!: number;

        input: string = "";

        created() {
        }

    }
</script>

<style lang="less" scoped>
    .search_input {
        background-color: #2dc26b;
    }
</style>
