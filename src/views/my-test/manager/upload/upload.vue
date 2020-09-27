<template>

    <el-upload
            class="upload-demo"
            ref="upload"
            action
            :http-request="uploadFile"
            :on-success="handleSuccess"
            :on-error="handleErrors"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :headers="headers"
            drag>

        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

</template>
<script lang='ts'>
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class upload extends Vue {

        @Prop({ default: '' }) private command!: string
        @Prop({default: 30, type: Number})
        age!: number;
        headers = {
            // 'Content-Type': 'multipart/form-data',//请求头
            // "Access-Control-Allow-Origin": "*"
        }

        fileList = [{
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
            {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
            }]

        submitUpload() {
            (this.$refs.upload as any).submit();
        }



        handleRemove(file: any, fileList: any) {
            console.log(file, fileList);
        }

        handlePreview(file: any) {
            console.log(file);
        }

        // 上传成功
        handleSuccess(response: any, file: File, fileList: File[]) {
            this.$message.success({ message: '上传成功', duration: 0 })
        }
        // 上传失败
        handleErrors(err: any, file: File, fileList: File[]) {
            this.$message.error('上传失败')
        }

       /* // 上传前
       //:before-upload="beforeUpload"
        beforeUpload(file: File) {
            const isXls = file.type === 'application/vnd.ms-excel'
            if (!isXls) {
                this.$message.error('请选择正确的文件！')
            }
            return isXls
        }*/

        uploadFile(param: any) {
            // file就是当前添加的文件
            const _file = param.file
            console.log(param)
            // FormData 对象
            const form = new FormData()
            // 文件对象,key是后台接受的参数名称
            form.append('file', _file)
            /*switch (this.command) {
                case 'importDeviceByExcel':
                    //this.handleImportDeviceByExcel(form)
                    break
                case 'batchChangeGroupAndLocation':
                    // this.handleBatchChangeGroupAndLocation(form)
                    break
                default:
                    break
            }*/
        }

    }
</script>

<style scoped lang="less">

</style>
