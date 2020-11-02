import {getData, postData} from "@/utils/request";

export const getUsers = (params: any) => getData("/users", params);

export const getUserInfo = (params: any) => postData("/users/info", params);

export const login = (params: any) => postData("/users/login", params);

export const logout = () => postData("/users/logout");

/**
 * 注册 用户名 密码 邮箱
 * @param params
 */
export const registerUserName = (params:any) => postData("/userRegister",params)

/**
 * 获取验证码
 * @param params
 */
export const getCode = (params:any) => postData("/getUserCode",params)


/**
 * 整体注册
 * @param params
 */
export const registerAll = (params:any) => postData("/allRegister",params)
