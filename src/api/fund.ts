import {getData, postData} from "@/utils/fundRequest";

export const getStockList = (params: any) => getData("/trade/stockList", params);

export const makeDeal = (params: any) =>getData("/trade/makeDeal",params);