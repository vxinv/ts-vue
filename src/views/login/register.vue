<template>
    <div class="register-container">
        <el-form class="register-form"
                 label-position="left"
                 label-width="70px"
                 :model="loginForm">
            <el-form-item label="名称">
                <el-input v-model="loginForm.username"> </el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="loginForm.email"></el-input>
            </el-form-item>

            <el-button style="margin-left: 30px" type="primary" @click="onSubmit">获取验证码</el-button>

            <el-form-item label="验证码">
                <el-input v-model="loginForm.code"></el-input>
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
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {Route} from "vue-router";
    import {Form as ElForm, Input} from "element-ui";
    import {UserModule} from "@/store/modules/user";
    import {isValidUsername} from "@/utils/validate";
    import {Dictionary} from 'vue-router/types/router';

    @Component({})
    export default class register extends Vue {
        onSubmit() {
            console.log('submit!');
        }
        loginForm = {
            username: '',
            password: '',
            email:'',
            code:''
        }
     }
</script>


<style lang="scss">

    .register-container {
        position: relative;
        height: 100%;
        width: 100%;
        // overflow: hidden;
        // background-color: $loginBg;
        // background-image: url("../../../public/images/ts-vue-login-banner01.jpeg");
        // background-size: cover;
        // background-position: center center;
        // background-repeat: no-repeat;
        // background-attachment: fixed;
        .register-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;

            .el-form-item{
                display: inline-block;
                .el-input{
                    margin-right: 20px;
                    .input{
                        background: #97a8be;
                    }
                }
            }
        }
    }

    .register-container::before {
        background-image: url("../../../public/images/ts-vue-login-banner01.jpeg");
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
