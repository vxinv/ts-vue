
<template>
    <div>
        <tinymce-editor ref="editor"
                        v-model="msg"
                        @input="consoleInput"
                        :disabled="disabled"
                        @onClick="onClick">
        </tinymce-editor>
        <button @click="publish">发布</button>

        <button @click="disabled = true">禁用</button>
    </div>
</template>


<script lang="ts">
    import {Component, Ref, Vue} from 'vue-property-decorator';
    import TinymceEditor from "./tinymce-editor.vue";
    import {Article, saveArticle} from "@/api/articles";

    @Component({
        components: {TinymceEditor}
    })
    export default class Myedit extends Vue{

        @Ref('editor') editor!: TinymceEditor;

        msg: string = '请输入内容'

        disabled:boolean =  false

        onClick(e: any, editor: any) {
            console.log('Element clicked')
            console.log(e)
            console.log(editor)
        }

        // 清空内容
        clear() {
            console.log(this.msg)
        }

        publish() {
            let article = new Article();
            article.author = 'lixin'
            article.content = (this.editor as any).myValue;
            saveArticle(article)
        }

        // 打印输入的内容
        consoleInput(newInput: string) {
            console.log(newInput)
        }
    }

</script>
