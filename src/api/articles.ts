import {getData, postData} from "@/utils/request";
import {IArticleData} from "./types";
import {genUpToken} from "@/utils/qiniuToken";
import axios from "axios";

export const defaultArticleData: IArticleData = {
  id: 0,
  status: "",
  timestamp: "",
  author: ""
};

export const getArticles = (params: any) => getData("/articles", params);

export const getArticle = (id: number, params: any) => getData(`/articles/${id}`, params);

export class Article {
  author: string;
  content: string;
}

export const saveArticle = (params: Article) => postData("/saveArticle", params);

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

