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
                        prop="publishTime"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="姓名"
                        prop="userName"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="标题"
                        prop="title"
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
    import {getArticleList, GetArticle} from "@/api/articles";
    import {UserModule} from "@/store/modules/user";

    @Component({components: {InfiniteLoading}})
    export default class tableList extends Vue {
        tableData = [];
        input2: string = '';
        select_scope: string = '';
        select_time:string='';
        height: string = '';
        pageNo = 1;
        pageSize = 10;
        canGet:boolean = true;

        create() {
            this.height = (document.documentElement.clientHeight * 0.8).toString()
        }

       /* mounted(){
            this.ArticleList()
        }
*/
        /**
         * 获取笔记
         */
        ArticleList(){
            if (!this.canGet){
                return
            }
            let getArticle = new GetArticle();
            getArticle.pageNo = this.pageNo;
            getArticle.pageSize = this.pageSize;
            getArticle.userName = UserModule.name;
            getArticle.timeOrder = 1;
            getArticleList(getArticle).then(
                res=>{
                    if (res.data.hasNextPage){
                        this.canGet = res.data.hasNextPage;
                        this.tableData.push(...res.data.list)
                        this.pageNo++;
                    }
                    return
                },
                err=>{

                }
            )
        }

        sousuo(){
            alert(this.input2)
        }

        infiniteHandler($state) {
            console.log("触发")
            setTimeout(() => {
                this.ArticleList()
                $state.loaded();
            }, 2000);
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
