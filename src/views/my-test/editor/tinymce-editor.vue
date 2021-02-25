<template>
    <editor :disabled="disabled"
            :init="init"
            :key="tinymceFlag"
            @onClick="onClick"
            ref="myEditor"
            v-model="myValue">
    </editor>
</template>
<script lang="ts">

    import {Component, Emit, Prop, Ref, Vue, Watch} from 'vue-property-decorator';
    import tinymce, {Editor as MyEdit, UploadResult} from 'tinymce';
    import Editor from '@tinymce/tinymce-vue';
    import 'tinymce/themes/silver';
    import 'tinymce/icons/default/icons.min.js'
    import 'tinymce/plugins/image' // 插入上传图片插件
    import 'tinymce/plugins/media' // 插入视频插件
    import 'tinymce/plugins/table' // 插入表格插件
    import 'tinymce/plugins/lists' // 列表插件
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/fullscreen'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/charmap'
    import 'tinymce/plugins/searchreplace'
    import 'tinymce/plugins/insertdatetime'
    import 'tinymce/plugins/codesample'
    import 'tinymce/plugins/upfile'
    import 'tinymce/plugins/link'


    import {geneToken, genUpToken} from "@/utils/qiniuToken";

    import {token} from "morgan";
    import {guid} from "@/utils/random";
    import axios from "axios";
    import {GetArticle, getArticleList, uploadFile} from "@/api/articles";
    import * as qiniu from "qiniu-js";
    import {UploadProgress} from "qiniu-js/src/upload/index";
    import {CustomError} from "qiniu-js/src/utils";
    import {UploadCompleteData} from "qiniu-js/src/api";


    // 编辑器插件plugins
    // 更多插件参考：https://www.tiny.cloud/docs/plugins/
    // 字数统计插件
    @Component(
        {
            components: {Editor}
        }
    )
    export default class TinymceEditor extends Vue {

        @Prop({default: ''}) value: string;
        // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
        // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
        @Prop({default: ''}) baseUrl: string;

        @Prop({default: false}) disabled: boolean;

        @Prop({
            type: Array, //表示是一个string类型的数组
            default() {
                return ["image media table lists fullscreen code  link charmap insertdatetime searchreplace codesample"]
            }
        }) readonly plugins!: string[];

        @Prop({
            type: Array,
            default() {
                return ["undo redo | fullscreen code codesample charmap insertdatetime searchreplace | formatselect alignleft aligncenter alignright alignjustify | link | numlist bullist | image media upfile table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent |"]
            }
        }) readonly toolbar: string[];

        public myValue: string = "<p><span style=\"font-size: 14pt; font-family: 'book antiqua', palatino, serif;\">请书写您的笔记</span></p>";

        public tinymceFlag: number = 0;

        @Ref("myEditor") myEdit: MyEdit;

        public id: string = "";

        init = {
            language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
            language: 'zh_CN',
            skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
            content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
            //skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`,
            //content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`,
            height: document.documentElement.clientHeight - 60,
            plugins: this.plugins,
            toolbar: this.toolbar,
            paste_data_images: true,
            menubar: false,
            branding: false,
            codesample_languages: [
                {text: 'HTML/XML', value: 'markup'},
                {text: 'JavaScript', value: 'javascript'},
                {text: 'CSS', value: 'css'},
                {text: 'Java', value: 'java'},
                {text: 'C++', value: 'cpp'},
            ],
            paste_preprocess: (plugin: any, args: any) => {

                console.log("==========>" + args)
            },
            images_upload_handler: (blobInfo, success, failure) => {
                console.log(blobInfo)
                let formdata = new FormData();
                //console.log(blobInfo)
                formdata.append("file", blobInfo.blob());
                formdata.append("key", "lixin" + guid() + ".png");
                formdata.append("token", geneToken()); //上传凭证
                //console.log(blobInfo.blob());
                let data = this.uploadImage(formdata, success);
                console.log(data)
            },

            file_picker_callback: function (callback, value, meta) {
                console.log(meta)
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute("accept", "image/*, video/*, audio/*");

                input.onchange = function () {
                    var file = this.files[0];
                    var reader = new FileReader();
                    reader.onload = function () {
                        uploadFile(file)
                        console.log(file.name)
                        callback('myimage.jpg', {title: 'My alt text'});
                    }
                    reader.readAsDataURL(file);
                }
                input.click();
                /* call the callback and populate the Title field with the file name */
            },
            init_instance_callback: (editor) => {
                this.myEdit = editor;
                editor.on('paste', () => {
                    setTimeout(
                        () => {
                            this.myEdit.uploadImages((success: UploadResult[]) => {

                            })
                        }, 10
                    )
                })
            },
        }

        uploadImage(form: FormData, success: Function): any {
            axios
                .post('http://upload.qiniup.com/', form)
                .then((res) => {
                    success('http://cdn.wqsci.com/' + res.data.key);
                    return res.data
                })
                .catch(
                    error => {
                        error.response
                        return error
                    }
                )
        }

        uploadFile(param: any) {
            let that = this;
            // file就是当前添加的文件
            const _file = param.file as File
            console.log(param)
            const putExtra = {
                    fname: _file.name,
                    params: {},
                    mimeType: _file.type
                },
                //       fname: string，文件原文件名
                // params: object，用来放置自定义变量
                // mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                config = {
                    useCdnDomain: true,
                    region: qiniu.region.z0
                }
            let next = (next: UploadProgress) => {
                //that.percentageNum = Number(next.total.percent.toFixed(0))
            };
            let error = (error: CustomError) => {
                console.log(error)
            }
            let complete = (complete: UploadCompleteData) => {
                that.$message('上传成功')
                setTimeout(() => {
                    // that.percentageNum = 0
                }, 1000)
            }
            let observable = qiniu.upload(_file, _file.name, this.created(), putExtra, config);

            observable.subscribe(next, null, complete);

        }

        created() {
            let token;
            let policy: any = {};
            let bucketName = 'myone';
            let AK = "qEjtRsk220SrirJdrxY6UxBpFW-sbRaLOGzscjT1";
            let SK = "CTLSJV4Hwe8Xq6gJaUzotYWe5qBv8qly3tWlnxnA";
            let deadline = Math.round(new Date().getTime() / 1000) + 3600;
            policy.scope = "myone";
            policy.deadline = deadline;
            return token = genUpToken(AK, SK, policy);

        }


        public clear() {
            this.myValue = "";
        };

        mounted() {
            console.log("tinymce.init(this.init)")
            tinymce.init(this.init)
        }

        onClick(event: MessageEvent) {
            this.$emit('onClick', event, tinymce)
        }

        @Watch('myValue')
        private watchReverseMessgae(newValue: string) {
            //console.log(newValue)
        }

        @Emit("change-title-notify")
        changeTitle(title: string, type: number) {
            return {
                title: title,
                type: type - 1
            }
        }

        activated() {
            this.tinymceFlag++;
            if (this.$route.query.id != null) {
                this.id = this.$route.query.id as string;
                let getArticle = new GetArticle();
                getArticle.articleId = Number(this.$route.query.id as string);
                getArticleList(getArticle).then(
                    res => {
                        this.myValue = res.data.list[0].content;
                        this.changeTitle(res.data.list[0].title, res.data.list[0].notify)
                    },
                    err => {
                        console.log(err)
                    }
                )
            }

        }

    }
</script>
<style lang="css">
    /*.tinymce-editor {
        margin-right: 30px;
    }*/
</style>
