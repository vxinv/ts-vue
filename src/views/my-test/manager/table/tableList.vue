<template>
    <!--    需要用:开头 -->
    <div class="com-container">
        <div class="com-center">
            <el-row>
                <el-col :span="4">
                    <div style="margin-right: 10px">
                        <el-select placeholder="我的笔记" slot="prepend" v-model="select_scope">
                            <el-option label="我的笔记" value=1></el-option>
                            <el-option label="全部笔记" value=0></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-select v-model="select_time" slot="prepend" placeholder="时间正序">
                            <el-option label="时间正序" value=1></el-option>
                            <el-option label="时间逆序" value=-1></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-select placeholder="提醒方式" slot="prepend" v-model="notify_type">
                            <el-option :label=info :value=index v-for="(info,index) in infoList"></el-option>
                        </el-select>
                    </div>
                </el-col>

                <el-col :span="7">
                    <div>
                        <el-input
                                placeholder="搜索标题"
                                prefix-icon="el-icon-search"
                                v-model="title_key">
                            <!--<el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>-->
                        </el-input>
                    </div>
                </el-col>
                <el-col :offset="1" :span="3">
                    <el-button @click="sousuo" icon="el-icon-search" type="primary">搜索</el-button>
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
                        label="用户"
                        prop="userName"
                        width="150">
                </el-table-column>
                <el-table-column
                        align="left"
                        label="标题"
                        prop="title"
                        width="650">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                style="margin-right: 14px"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>

                        <el-button
                                size="mini"
                                type="danger"
                                style="margin-right: 20px"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>

                        <el-dropdown @command="handleCommand" trigger="click">
                            <el-button
                                    size="mini"
                                    type="info"
                                    @click="handleNotify(scope.$index, scope.row)"
                            >提醒
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(info,index) in infoList" :key=index :command="index">{{info}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>


                <infinite-loading
                        :key=this.key
                        ref="infiniteLoading"
                        spinner='waveDots'
                        @infinite="infiniteHandler"
                        force-use-infinite-wrapper=".el-table__body-wrapper"
                        slot="append">
                </infinite-loading>
            </el-table>

        </div>
    </div>

</template>
<script lang='ts'>
    import {Component, Ref, Vue} from 'vue-property-decorator';
    import InfiniteLoading from 'vue-infinite-loading';
    import {changeNoify, deleteArticle, GetArticle, getArticleList} from "@/api/articles";
    import {UserModule} from "@/store/modules/user";

    @Component({components: {InfiniteLoading}})
    export default class tableList extends Vue {
        tableData = [];
        key: number = 0;
        title_key: string = '';
        select_scope: string = "我的笔记";
        select_time: string = "时间正序";
        notify_type: string = "全部类型";
        height: string = '';
        pageNo = 1;
        type: number = 0;
        curr_row: any;
        pageSize = 10;
        canGet: boolean = true;
        @Ref("infiniteLoading") loading: InfiniteLoading;
        infoList = ["不推送", "每两天推送", "每周三推送", "每月15日推送", "艾宾浩斯曲线", "仅当天推送", "每天推送"];

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
        ArticleList() {
            if (!this.canGet) {
                return
            }
            let getArticle = new GetArticle();
            getArticle.pageNo = this.pageNo;
            getArticle.pageSize = this.pageSize;
            // 查询范围
            if (this.select_scope === "我的笔记") {
                getArticle.userName = UserModule.name;
            } else {
                getArticle.userName = "";
            }
            // 时间排序
            if (this.select_time === "时间正序") {
                getArticle.timeOrder = 1;
            } else {
                getArticle.timeOrder = Number(this.select_time);
            }
            // 提醒类型
            if (this.notify_type === "全部类型") {
                getArticle.notifyType = 0;
            } else {
                getArticle.notifyType = Number(this.notify_type);
            }

            getArticle.keyWord = '%' + this.title_key + '%';

            getArticleList(getArticle).then(
                res => {
                    if (res.data.hasNextPage || res.data.pageNum == 1) {
                        this.canGet = res.data.hasNextPage;
                        this.tableData.push(...res.data.list)
                        this.pageNo++;
                    }
                    return
                },
                err => {

                }
            )
        }

        activated() {
            this.key++;
        }

        handleEdit(index: any, row: any) {
            this.$router.replace({
                path: "/edit",
                query: row,
            });
        }

        handleCommand(command) {
            /* this.notify = command
             this.info = this.infoList[command]*/
            this.type = command + 1;
            if (this.type == 0) {
                return
            }
            changeNoify(Number(this.curr_row.id), this.type).then(
                res => {
                    this.$message('当前笔记按照' + this.infoList[command] + "推送给您");
                },
                err => {
                    this.$message('修改失败');
                }
            )

        }

        handleDelete(index: any, row: any) {
            deleteArticle(Number(row.id)).then(
                res => {
                    delete this.tableData[Number(index)]
                    this.$message('删除成功');
                },
                err => {
                    this.$message('删除失败');
                }
            )
        }

        handleNotify(index: any, row: any) {
            this.curr_row = row;
        }


        sousuo() {
            this.pageNo = 1;
            this.canGet = true;
            this.tableData = [];
        }

        infiniteHandler($state) {
            setTimeout(() => {
                this.ArticleList()
                $state.loaded();
            }, 1000);
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

    .btn_mimi {
        margin-right: 20px;
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
