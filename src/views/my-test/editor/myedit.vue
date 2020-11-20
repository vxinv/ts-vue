<template>
    <div style="padding: 0px 40px 0px 40px">

        <el-row>
            <el-col :span="20" :offset="2">
                <tinymce-editor ref="editor"
                                @input="consoleInput"
                                :disabled="disabled"
                                @onClick="onClick">
                </tinymce-editor>
            </el-col>
        </el-row>

        <el-row style="margin-top: 10px;margin-bottom: 10px;">
            <el-col :span="13" :offset="2" style="padding-right: 20px">
                <el-input v-model="input" placeholder="笔记标题"></el-input>
            </el-col>
            <el-col :span="7">
                <div style="display: flex;flex-direction: row;justify-content: flex-end">

                    <el-button type="success" icon="el-icon-edit" style="margin-right: 20px" @click="publish"> 发布
                    </el-button>

                    <!-- <el-button   @click="disabled"> 禁用 </el-button>-->
                    <el-dropdown @command="handleCommand">
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
        msg: string = '请输入内容';
        disabled: boolean = false;
        infoList = ["不推送","每天推送", "每周推送", "每月发送", "艾宾浩斯曲线", "仅当天推送"];
        notify: number;
        info: string = "提醒";
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
            article.notify = this.notify;
            article.title = this.input;
            let ca = this.checkArticle(article);
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

        // 打印输入的内容
        consoleInput(newInput: string) {
            console.log(newInput)
        }

        // 检测发送的内容是否合规
        checkArticle(article: Article): any {
            if (article.content.toString().length < 100) {
                return {
                    res: false,
                    msg: "内容太短"
                }
            }
            if (article.notify == null || article.notify == -1) {
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
