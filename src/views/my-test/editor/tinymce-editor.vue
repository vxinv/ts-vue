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
    import {geneToken} from "@/utils/qiniuToken";

    import {token} from "morgan";
    import {guid} from "@/utils/random";
    import axios from "axios";
    import {GetArticle, getArticleList} from "@/api/articles";


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
                return ["image media table lists fullscreen code charmap insertdatetime searchreplace codesample "]
            }
        }) readonly plugins!: string[];
=
        // backcolor  | bold italic underline strikethrough
        @Prop({
            type: Array,
            default() {
                return ["undo redo | fullscreen code codesample charmap insertdatetime searchreplace | formatselect alignleft aligncenter alignright alignjustify | numlist bullist | image media table | fontselect fontsizeselect forecolor bold underline| indent outdent | removeformat |"]
            }
        })
        readonly toolbar: string[];

        public myValue: string = "<p><span style=\"font-family: 'book antiqua', palatino, serif;\">1 一级标题</span></p>\n" +
            "<p><span style=\"font-family: 'book antiqua', palatino, serif; font-size: 16pt;\">1 二级标题</span></p>\n" +
            "<p style=\"padding-left: 40px;\"><span style=\"font-family: 'book antiqua', palatino, serif; font-size: 14pt;\">记录的模版</span><span style=\"font-family: 'book antiqua', palatino, serif; font-size: 14pt;\">&nbsp;</span></p>\n" +
            "<p style=\"padding-left: 40px;\">&nbsp;</p>";

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
            font_formats: 'Book Antiqua=book antiqua,palatino;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva',
            fontsize_formats: '14pt 16pt 18pt 20pt',
            allow_script_urls: true,
            plugins: this.plugins,
            toolbar: this.toolbar,
            paste_data_images: true,
            menubar: false,
            branding: false,
            //theme:'silver',
            codesample_languages: [
               /* {text: 'HTML/XML', value: 'markup'},*/
                {text: 'JavaScript', value: 'javascript'},
               /* {text: 'CSS', value: 'css'},*/
                {text: 'Java', value: 'java'},
                {text: 'C++', value: 'cpp'},
            ],
            insertdatetime_formats: ["%Y-%m-%d %H:%M"],
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



            init_instance_callback: (editor) => {
                /*if (_this.value) {
                    editor.setContent(_this.value)
                }
                _this.hasInit = true
                editor.on('NodeChange Change KeyUp SetContent', () => {
                    this.hasChange = true
                    // const val = editor.getContent().replace(/<p><img\s?src="data.*?<\/p>/g, '')
                    this.$emit('input', editor.getContent())
                })*/
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
            /*formats:{
                bold: { selector: 'pre', styles: {'color':'red','font-family': 'terminal, monaco; font-size: 14pt;'} }
            },*/
            // 设置默认字体
            setup: function(editor) {
                editor.on('init', function(e) {
                    this.getBody().style.fontSize = '18pt';
                    //this.getBody().style.color = '#040404';
                    this.getBody().style.fontFamily = 'book antiqua;';
                    this.getBody().style.backgroundColor='#fffbf0';
                });
            }

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
