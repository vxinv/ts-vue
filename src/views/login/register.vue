<template>
    <div class="register-container">
        <el-form class="register-form"
                 label-position="left"
                 label-width="60px"
                 :model="registerForm">
            <el-form-item label="名称">
                <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <!--<el-button style="margin-left: 30px" type="primary" @click="registerUserName">验证用户名</el-button>-->

            <el-form-item label="密码">
                <el-input v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="registerForm.email"></el-input>
            </el-form-item>

            <el-button style="margin-left: 30px" type="primary" @click="getMailCode">获取验证码</el-button>

            <el-form-item label="验证码">
                <el-input v-model="registerForm.code"></el-input>
            </el-form-item>

            <el-button
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handleRegister">注册
            </el-button>
        </el-form>

    </div>

</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {getCode, registerAll, registerUserName} from "@/api/users";

    @Component({})
    export default class register extends Vue {

        onSubmit() {
            console.log('submit!');
        }

        registerForm = {
            username: '',
            password: '',
            email: '',
            code: ''
        }

        clickUserName = false;
        private userNameCanUser: boolean = false;

        registerUserName() {
            if (this.registerForm.username === "") {
                this.$message("未正确填写用户名")
                return
            }
            registerUserName(this.registerForm).then(
                res => {
                    //this.clickUserName = true;
                    //this.$message('用户名可以使用');
                },
                err => {
                    this.$message('用户名不可以使用');
                    //console.log(err)
                }
            )
        }

        getMailCode() {

            if (this.registerForm.email === "") {
                this.$message("未正确填写邮箱")
                return
            }
            this.registerUserName()

            getCode(this.registerForm).then(
                res => {
                    this.$message('验证码已发送');
                },
                err => {

                }
            )
        }

        handleRegister() {
            if (!this.checkRegisterForm(this.registerForm)) {
                return
            }
            registerAll(this.registerForm).then(
                res => {
                    this.$message('注册成功');
                    this.$router.replace({
                        path: "login"
                    });
                },
                err => {
                    console.log(err)
                }
            )
        }

        checkRegisterForm(param: any): boolean {
            var ok = true
            if (param.username == null || param.username == "") {
                ok = false
                this.$message("未填写用户名")
            }
            if (param.password == null || param.password == "") {
                ok = false
                this.$message("未填写密码")
            }
            if (param.email == null || param.email == "") {
                ok = false
                this.$message("未填写邮箱")
            }
            if (param.code == null || param.code == "") {
                ok = false
                this.$message("未填验证码")
            }
            return ok;
        }
    }
</script>


<style lang="scss">

    .register-container {
        position: relative;
        height: 100%;
        width: 100%;

        .register-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;

            .el-tag {
                margin-right: 10px;
            }

            .svg-container {
                padding: 6px 5px 6px 15px;
                color: $darkGray;
                vertical-align: middle;
                width: 30px;
                display: inline-block;
            }

            .el-form-item {
                display: inline-block;
                font-size: large;

                .el-input {
                    margin-right: 20px;
                    display: inline-block;

                    .input {
                        display: inline-block;
                        background: #97a8be;
                    }
                }
            }
        }
    }

    .register-container::before {
        background-image: url("../../../public/images/bg.jpg");
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        filter: alpha(opacity=80);
        -moz-opacity: 0.8;
        -khtml-opacity: 0.8;
        opacity: 0.8;
        content: "";
        display: block;
        z-index: -1;
        height: 100%;
        width: 100%;
        position: absolute;
        //一定要设置position:absolute,这样才能设置z-index，让背景处于内容的下一层
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
</style>
