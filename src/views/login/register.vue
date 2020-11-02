<template>
    <div class="register-container">
        <el-form class="register-form"
                 label-position="left"
                 label-width="70px"
                 :model="registerForm">
            <el-form-item label="名称">
                <el-input v-model="registerForm.username"> </el-input>
            </el-form-item>
            <el-button style="margin-left: 30px" type="primary" @click="registerUserName">验证用户名</el-button>

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
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {Route} from "vue-router";
    import {Form as ElForm, Input} from "element-ui";
    import {UserModule} from "@/store/modules/user";
    import {isValidUsername} from "@/utils/validate";
    import {Dictionary} from 'vue-router/types/router';
    import {getCode, registerAll, registerUserName} from "@/api/users";

    @Component({})
    export default class register extends Vue {

        onSubmit() {
            console.log('submit!');
        }

        registerForm = {
            username: '',
            password: '',
            email:'',
            code:''
        }

        registerUserName(){
            registerUserName(this.registerForm).then(
                res =>{
                    console.log(res)
                },
                err => {
                    console.log(err)
                }
            )
        }

        getMailCode(){
            getCode(this.registerForm).then(
                res =>{
                    console.log(res)
                },
                err => {
                    console.log(err)
                }
            )
        }


        handleRegister(){
            registerAll(this.registerForm).then(
                res =>{
                    console.log(res)
                },
                err => {
                    console.log(err)
                }
            )
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

            .el-tag{
                margin-right: 10px;
            }
            .svg-container {
                padding: 6px 5px 6px 15px;
                color: $darkGray;
                vertical-align: middle;
                width: 30px;
                display: inline-block;
            }

            .el-form-item{
                 display: inline-block;
                font-size: large;
                .el-input{
                    margin-right: 20px;
                    display: inline-block;
                    .input{
                        display: inline-block;
                        background: #97a8be;
                    }
                }
            }
        }
    }

    .register-container::before {
        background-image: url("../../../public/images/register.jpg");
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
