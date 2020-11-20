<template>
    <div class="login-container">
        <el-form
                ref="loginForm"
                :model="loginForm"
                class="login-form"
                autocomplete="on"
                label-position="left"
                label-width="60px"
        >
            <el-form-item label="用户">
                <el-input
                        ref="username"
                        v-model="loginForm.userName"
                        name="username"
                        type="text"
                        autocomplete="on"
                        placeholder="username"
                />
            </el-form-item>

            <el-form-item label="密码">
                <el-input
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.passWord"
                        :type="passwordType"
                        placeholder="password"
                        name="password"
                        autocomplete="on"
                        @keyup.enter.native="handleLogin"
                />
            </el-form-item>

            <div>
                <el-button
                        :loading="loading"
                        type="primary"
                        style="width:100%; margin-bottom:30px;"
                        @click.native.prevent="handleLogin"
                >登录
                </el-button>
            </div>

            <div>
                <el-button
                        :loading="loading"
                        type="primary"
                        style="width:100%; margin-bottom:30px;"
                        @click.native.prevent="handleRegister"
                >注册
                </el-button>
            </div>

        </el-form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {Route} from "vue-router";
    import {Form as ElForm, Input} from "element-ui";
    import {UserModule} from "@/store/modules/user";
    import {Dictionary} from 'vue-router/types/router';
    import {login} from "@/api/users";

    @Component({
        name: "Login",
    })
    export default class extends Vue {

        private loginForm = {
            userName: "",
            passWord: "",
        };
        private passwordType = "password";
        private loading = false;
        private showDialog = false;
        private redirect?: string;
        private otherQuery: Dictionary<string> = {};

        @Watch("$route", {immediate: true})
        private onRouteChange(route: Route) {
            // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
            // See https://github.com/vuejs/vue-router/pull/2050 for details
            const query = route.query as Dictionary<string>;
            if (query) {
                this.redirect = query.redirect;
                this.otherQuery = this.getOtherQuery(query);
            }
        }

        mounted() {
            if (UserModule.token == "out") {
                return
            }
            // 初始化完毕 无需再次vuex 直接登录
            //UserModule.Login(this.loginForm);
            this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
            });
        }

        private showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                (this.$refs.password as Input).focus();
            });
        }

        private handleLogin() {
            (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
                if (valid) {
                    this.loading = true;
                    await login(this.loginForm).then(
                        res => {
                            if (res == undefined) {
                                this.loading = false;
                                throw  new Error()
                            }
                        }, err => {
                            throw  new Error()
                        })
                    await UserModule.Login(this.loginForm);
                    this.$router.push({
                        path: this.redirect || "/",
                        query: this.otherQuery,
                    });
                    setTimeout(() => {
                        this.loading = false;
                    }, 0.5 * 10);
                } else {
                    return false;
                }
            });
        }

        private handleRegister() {
            this.$router.replace({
                path: "register",
                query: this.otherQuery,
            });
        }


        private getOtherQuery(query: Dictionary<string>) {
            return Object.keys(query).reduce(
                (acc, cur) => {
                    if (cur !== "redirect") {
                        acc[cur] = query[cur];
                    }
                    return acc;
                },
                {} as Dictionary<string>
            );
        }
    }
</script>



<style lang="scss" scoped>
    .login-container {
        position: relative;
        height: 100%;
        width: 100%;
        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $darkGray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $lightGray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $darkGray;
            cursor: pointer;
            user-select: none;
        }
    }

    .login-container::before {
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
