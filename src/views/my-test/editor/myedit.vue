<template>
    <div style="padding: 0px 40px 0px 40px">

        <el-row>
            <el-col :span="20" :offset="2">
                <tinymce-editor ref="editor"
                                @change-title-notify="changeTitleNotify"
                                @input="consoleInput"
                                :disabled="disabled"
                                @onClick="onClick">
                </tinymce-editor>
            </el-col>
        </el-row>

        <el-row style="margin-top: 10px;margin-bottom: 10px;">
            <el-col :offset="2" :span="11" style="padding-right: 20px">
                <el-input v-model="input" placeholder="笔记标题"></el-input>
            </el-col>
            <el-col :span="9">
                <div style="display: flex;flex-direction: row;justify-content: flex-end">

                    <el-button @click="clear" icon="el-icon-edit" style="margin-right: 20px" type="primary"> 清空
                    </el-button>

                    <el-button type="success" icon="el-icon-edit" style="margin-right: 20px" @click="publish"> 发布
                    </el-button>

                    <!-- <el-button   @click="disabled"> 禁用 </el-button>-->
                    <el-dropdown @command="handleCommand" trigger="click">
                        <el-button type="info" icon="el-icon-edit">{{info}}<i
                                class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(info,index) in infoList" :key=index :command="index">{{info}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>

    </div>
</template>


<script lang="ts">
    import {Component, Ref, Vue} from 'vue-property-decorator';
    import TinymceEditor from "./tinymce-editor.vue";
    import {Article, saveArticle} from "@/api/articles";
    import {UserModule} from "@/store/modules/user";

    @Component({
        components: {TinymceEditor}
    })
    export default class Myedit extends Vue {
        @Ref('editor') editor!: TinymceEditor;
        // msg: string = '请输入内容';
        disabled: boolean = false;
        // 每周三
        // 每月15
        // 艾宾浩斯 1 2 4 7 15
        // // 0 全部类型 1 不推送 2 每两天推送 3 每周三推送 4 每月15 推送 5 艾宾浩斯推送 6 当天推送
        infoList = ["不推送", "每两天推送", "每周三推送", "每月15日推送", "艾宾浩斯曲线", "仅当天推送", "每天推送"];
        notify: number = 0;
        info: string = "提醒方式";
        input = '';


        onClick(e: any, editor: any) {
            console.log('Element clicked')
            console.log(e)
            console.log(editor)
        }

        public mounted(): void {

        }

        handleCommand(command) {
            this.notify = command
            this.info = this.infoList[command]
            this.$message('当前笔记按照' + this.infoList[command] + "推送给您");
        }

        publish() {
            let article = new Article();
            article.userName = UserModule.name
            article.content = (this.editor as any).myValue;
            // 和后端数据对应
            article.title = this.input;
            article.notify = this.notify;
            let ca = this.checkArticle(article);
            article.notify = this.notify + 1;
            article.id = (this.editor as any).id;
            if (!ca.res) {
                this.$message("未上传成功 " + ca.msg)
                return
            }
            saveArticle(article).then((res) => {
                console.log(res)
                this.$message("笔记上传成功");
            }, (err) => {

            })
        }

        clear() {
            var editor: any = (this.editor as any);
            editor.clear()
            //console.log((this.editor as any).id)
            editor.id = null;

        }

        // 打印输入的内容
        consoleInput(newInput: string) {
            console.log(newInput)
        }

        changeTitleNotify(param: any) {
            this.input = param.title;
            this.info = this.infoList[param.type]
        }

        // 检测发送的内容是否合规
        checkArticle(article: Article): any {
            if (article.content.toString().length < 20) {
                return {
                    res: false,
                    msg: "内容太短"
                }
            }
            if (article.notify == 0) {
                return {
                    res: false,
                    msg: "没有设置提醒"
                }
            }
            if (article.title == null || article.title == "") {
                return {
                    res: false,
                    msg: "没有填写标题"
                }
            }
            return {
                res: true
            }
        }
    }

</script>
