<template>
    <!--    需要用:开头 -->
    <div class="com-container">
        <div class="com-center">
            <el-row>
                <el-col :span="4">
                    <div style="margin-right: 10px">
                        <el-select v-model="select_scope" slot="prepend" placeholder="全部笔记">
                            <el-option label="全部笔记" value="1"></el-option>
                            <el-option label="我的笔记" value="2"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-select v-model="select_time" slot="prepend" placeholder="时间正序">
                            <el-option label="时间正序" value="1"></el-option>
                            <el-option label="时间逆序" value="2"></el-option>
                        </el-select>
                    </div>
                </el-col>

                <el-col :span="10" :offset="6">
                    <div>
                        <el-input
                                placeholder="请输入内容"
                                prefix-icon="el-icon-search"
                                v-model="input2">
                            <el-button slot="append"  icon="el-icon-search" @click="sousuo" > </el-button>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <el-table
                    :data="tableData"
                    height="calc(100vh)"
                    border
                    highlight-current-row
                    ref="myTable"
                    :stripe=true
                    style="width: 100%;height: 100%"
            >
                <el-table-column
                        align="center"
                        label="日期"
                        prop="date"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="姓名"
                        prop="name"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="省份"
                        prop="province"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="市区"
                        prop="city"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="地址">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-button
                                size="mini"
                                type="info"
                                @click="handleDelete(scope.$index, scope.row)">提醒
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="邮编"
                        prop="zip"
                        width="150">
                </el-table-column>

                <infinite-loading
                        @infinite="infiniteHandler"
                        force-use-infinite-wrapper=".el-table__body-wrapper"
                        slot="append">
                </infinite-loading>

            </el-table>

        </div>
    </div>

</template>
<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import InfiniteLoading from 'vue-infinite-loading';

    @Component({components: {InfiniteLoading}})
    export default class tableList extends Vue {
        tableData = [
            {
                date: '2016-05-07',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            },
            {
                date: '2016-05-03',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-02',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-04',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }, {
                date: '2016-05-01',
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }]
        input2: string = ''
        select_scope: string = ''
        select_time:string=''
        height: string = ''

        create() {
            this.height = (document.documentElement.clientHeight * 0.8).toString()
        }

        sousuo(){
            alert(this.input2)
        }

        infiniteHandler($state) {
            if (this.tableData.length > 20) {
                return
            }
            this.tableData.push({
                date: '2016-05-03' + Math.random(),
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            })
            $state.loaded();
        }
    }
</script>

<style lang="less" scoped>
    .com-center {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }

    .com-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 50px;
    }
</style>
