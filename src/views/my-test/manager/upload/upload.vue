<template>

    <el-row style="margin-top: 20px">
        <el-col :offset="1" :span="8">
            <div class="grid-content bg-purple"></div>
            <el-upload
                    :file-list="fileList"
                    :headers="headers"
                    :http-request="uploadFile"
                    :on-error="handleErrors"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    action
                    class="upload-demo"
                    drag
                    multiple
                    ref="upload">

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

            </el-upload>

        </el-col>

        <el-col :span='8'>
            <el-progress :percentage="percentageNum" type="circle"></el-progress>
        </el-col>
        <a href='http://www.w3school.com.cn'>HELLO</a>
    </el-row>


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

        fileList = []
        percentageNum: number = 0


        handleRemove(file: any, fileList: any) {
            console.log(file, fileList);
        }

        handlePreview(file: any) {
            console.log(file);
        }

        // 上传成功
        handleSuccess(response: any, file: File, fileList: File[]) {
            this.$message.success({message: '上传成功', duration: 4, showClose: true})
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
                that.percentageNum = Number(next.total.percent.toFixed(0))
            };
            let error = (error: CustomError) => {
                console.log(error)
            }
            let complete = (complete: UploadCompleteData) => {
                that.$message('上传成功')
                setTimeout(() => {
                    that.percentageNum = 0
                }, 1000)
            }
            let observable = qiniu.upload(_file, _file.name, this.token, putExtra, config);

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
            token = genUpToken(AK, SK, policy);
            this.token = token;
        }

    }
</script>

<style scoped lang="less">

</style>
