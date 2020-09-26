
<template>
    <div>
        <tinymce-editor ref="editor"
                        v-model="msg"
                        @input="consoleInput"
                        :disabled="disabled"
                        @onClick="onClick">
        </tinymce-editor>
        <button @click="clear">清空内容</button>
        <button @click="disabled = true">禁用</button>
    </div>
</template>


<script lang="ts">
    import {Vue, Component, Prop, Watch, Ref} from 'vue-property-decorator';
    import TinymceEditor from "./tinymce-editor.vue";
    import RefComponent from "@/components/manager/RefComponent.vue";
    import Str = echarts.EChartOption.Tooltip.Position.Str;

    @Component({
        components: {TinymceEditor}
    })
    export default class Myedit extends Vue{

        @Ref('editor') readonly  RefC!: TinymceEditor;

        msg:string = 'Welcome to Use Tinymce Editor'

        disabled:boolean =  false

        onClick (e:any, editor:any) {
            console.log('Element clicked')
            console.log(e)
            console.log(editor)
        }
        // 清空内容
        clear () {
            console.log(this.RefC)
        }
        // 打印输入的内容
        consoleInput(newInput: string){
            console.log(newInput)
        }
    }

</script>
