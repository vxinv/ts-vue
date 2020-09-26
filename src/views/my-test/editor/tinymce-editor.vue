<template>
    <div class="tinymce-editor">
        <editor v-model="myValue"
                :init="init"
                :disabled="disabled"
                @onClick="onClick">
        </editor>
    </div>
</template>
<script lang="ts">

    import {Vue, Component, Prop, Watch, Emit} from 'vue-property-decorator';
    import tinymce from 'tinymce/tinymce';
    import Editor from '@tinymce/tinymce-vue';
    import 'tinymce/themes/silver';
    import 'tinymce/icons/default/icons.min.js'
    import 'tinymce/plugins/image'// 插入上传图片插件
    import 'tinymce/plugins/media'// 插入视频插件
    import 'tinymce/plugins/table'// 插入表格插件
    import 'tinymce/plugins/lists'// 列表插件
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/fullscreen'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/charmap'
    import 'tinymce/plugins/searchreplace'
    import 'tinymce/plugins/insertdatetime'
    import { PropType } from "vue"



    // 编辑器插件plugins
    // 更多插件参考：https://www.tiny.cloud/docs/plugins/
    // 字数统计插件
    @Component(
        {
            components: { Editor }
        }
    )
    export default  class  TinymceEditor extends Vue {

        @Prop({default: ''})
        value: string;
        // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
        // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
        @Prop({default: ''})
        baseUrl: string;

        @Prop({default: false})
        disabled: boolean;

        @Prop({
            type: Array, //表示是一个string类型的数组
            default(){
                return ["link image media table lists fullscreen code charmap insertdatetime searchreplace"]
            }})
        readonly  plugins!: string[];

        @Prop({
            type: Array,
            default() {
                return ["undo redo | fullscreen code charmap insertdatetime searchreplace | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |"]
            }})
        readonly toolbar: string[];

        myValue = this.value;

        init = {
            language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
            language: 'zh_CN',
            skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
            content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
            //skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`,
            //content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`,
            height: 300,
            plugins: this.plugins,
            toolbar: this.toolbar,
            branding: false,
            menubar: false,
            // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
            // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
            images_upload_handler: (blobInfo: any, success: any, failure: any) => {
                const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                success(img)
            }
        }

        mounted() {
            tinymce.init({})
        }

        onClick(event: MessageEvent) {
            this.$emit('onClick', event, tinymce)
        }


        @Watch('myValue')
        private watchReverseMessgae(newValue: string) {
            //console.log(newValue)
        }

    }
</script>
<style lang="css">
    .tinymce-editor{
        margin-right: 30px;
    }
</style>
