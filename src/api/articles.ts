import {getData, postData} from "@/utils/request";
import {IArticleData} from "./types";
import {geneToken, genUpToken} from "@/utils/qiniuToken";
import axios from "axios";
import * as qiniu from "qiniu-js";
import {UploadProgress} from "qiniu-js/src/upload/index";
import {CustomError} from "qiniu-js/src/utils";
import {UploadCompleteData} from "qiniu-js/src/api";

export const defaultArticleData: IArticleData = {
    id: 0,
    status: "",
    timestamp: "",
    author: ""
};

export const getArticles = (params: any) => getData("/articles", params);
export const getArticle = (id: number, params: any) => getData(`/articles/${id}`, params);

/**
 * 文章的bean
 */
export class Article {
    userName: string;
    content: string;
    title: string;
    notify: number;
    id: number;
}

/**
 * 获取笔记的bean
 * @param params
 */
export class GetArticle {
    userName: string;
    pageNo: number;
    pageSize: number;
    // 1 -1
    timeOrder: number;
    articleId: number;
    notifyType: number;
    keyWord: string;
}

export const saveArticle = (params: Article) => postData("/saveArticle", params);

export const getArticleList = (params:GetArticle) => postData("/getArticle",params);

export const deleteArticle = (id: number) => getData("/deleteArticle", {id: id})

export const changeNoify = (id: number, notifyType: number) => getData("/changeNotify", {
    id: id,
    notifyType: notifyType
})

export const uploadImageToQiniu = (data: FormData, token: string) => {

}

interface QiniuRes {
    hash: string;
    key: string;
}

export const uploadImage = (data: FormData) => {
    return axios
        .post('http://upload.qiniup.com/', data)
        .then((res) => {
            res.data
        })
        .catch(error => error.response)
}


export const generateToken = (): string => {
    let token;
    let policy: any = {};
    let bucketName = 'myone';
    let AK = "qEjtRsk220SrirJdrxY6UxBpFW-sbRaLOGzscjT1";
    let SK = "CTLSJV4Hwe8Xq6gJaUzotYWe5qBv8qly3tWlnxnA";
    let deadline = Math.round(new Date().getTime() / 1000) + 3600;
    policy.scope = "myone";
    policy.deadline = deadline;
    token = genUpToken(AK, SK, policy);
    return token;
}

export const testMocha = (param: any) => {
    console.log(param);
}

export const uploadString = (content: string, name: string) => {
    const putExtra = {
            fname: name,
            mimeType: "text/plain"
        },
        config = {
            useCdnDomain: true,
            region: qiniu.region.z0
        }
    let next = (next: UploadProgress) => {
        console.log(next.total.size)
    };
    let complete = (complete: UploadCompleteData) => {
        console.log("success")
    }
    let error = (error: CustomError) => {
        console.log(error)
    }
    var token = geneToken();
    console.log(token)
    let observable = qiniu.upload(new File([content], name), name, token, putExtra, config);
    observable.subscribe(null, error, complete);

}


export const uploadFile = (param: any) => {
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

