<template>

    <el-upload
            class="upload-demo"
            ref="upload"
            action="http://upload.qiniup.com/"
            :http-request="uploadFile"
            :on-success="handleSuccess"
            :on-error="handleErrors"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :headers="headers"
            drag>

        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

</template>
<script lang='ts'>
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {genUpToken} from "@/utils/qiniuToken";
    import * as qiniu from 'qiniu-js'
    import {UploadProgress} from "qiniu-js/src/upload/index";
    import {CustomError} from "qiniu-js/src/utils";
    import {UploadCompleteData} from "qiniu-js/src/api";

    @Component({})
    export default class upload extends Vue {

        @Prop({default: ''}) private command!: string
        //@Prop({default: 30, type: Number})
        token: string;
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

        actionPath = "https://upload.qiniup.com"
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
            const _file = param.file as File
            console.log(param)
            // FormData 对象
            // 因人而异，自行解决
            const putExtra = {
                    fname: _file.name,
                    params: {},
                    mimeType: null
                },
                //       fname: string，文件原文件名
                // params: object，用来放置自定义变量
                // mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                config = {
                    useCdnDomain: true,
                    region: qiniu.region.z0
                }
            console.log("upload==================>")
            let next = (next: UploadProgress) => {
                console.log(next)
            };
            let error = (error: CustomError) => {
                console.log(error)
            }
            let complete = (complete: UploadCompleteData) => {
                console.log(complete)
            }
            let observable = qiniu.upload(_file, _file.name, this.token, putExtra, config);

            observable.subscribe(next, null, complete);
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

        created() {
            let token;
            let policy: any = {};
            let bucketName = 'myone';
            let AK = "qEjtRsk220SrirJdrxY6UxBpFW-sbRaLOGzscjT1";
            let SK = "CTLSJV4Hwe8Xq6gJaUzotYWe5qBv8qly3tWlnxnA";
            let deadline = Math.round(new Date().getTime() / 1000) + 3600;
            policy.scope = "myone";
            policy.deadline = deadline;
            token = genUpToken(AK, SK, policy);
            this.token = token;

            console.log("token========>" + token)
        }

    }
</script>

<style scoped lang="less">

</style>
