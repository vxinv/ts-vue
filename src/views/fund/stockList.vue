<template xmlns="">
    <!--    需要用:开头 -->
    <div class="com-container">

        <el-dialog
                title="交易下单"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>

            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="4">
                    <el-button>证券</el-button>
                </el-col>
                <el-col :span="16">
                    <el-input v-model="name" placeholder="证券"></el-input>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="4">
                    <el-button>价格</el-button>
                </el-col>
                <el-col :span="16">
                    <el-input v-model="price" placeholder="价格"></el-input>
                </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-bottom: 20px">
                <el-col :span="4">
                    <el-button>数量</el-button>
                </el-col>
                <el-col :span="16">
                    <el-input v-model="volume" placeholder="数量"></el-input>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button>合计</el-button>
                </el-col>
                <el-col :span="16">
                    <el-input v-model="getTotal" placeholder="合计"></el-input>
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="tradeOk">确 定</el-button>
                </span>
        </el-dialog>
        <div class="com-center">

            <el-table
                    :data="tableData"
                    height="calc(100vh)"
                    border
                    highlight-current-row
                    ref="myTable"
                    :stripe=true
                    style="width: 100%;height: 100%"
            >
                <el-table-column
                        align="center"
                        label="股票名称"
                        prop="name"
                        width="150">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="股票代码"
                        prop="stockCode"
                        width="150">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="总/可用"
                        prop="total_available"
                        width="150">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="当前价格/成本价格"
                        prop="price_cose"
                        width="150">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="收益涨幅"
                        prop="rate"
                        width="150">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="收益"
                        prop="profit"
                        width="150">
                </el-table-column>


                <el-table-column
                        align="center"
                        label="当天涨幅"
                        prop="zzl"
                        width="150">
                </el-table-column>

                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">

                        <el-button
                                size="mini"
                                type="danger"
                                style="margin-right: 20px"
                                @click="handleBuy(scope.$index, scope.row)">买入
                        </el-button>

                        <el-button
                                size="mini"
                                type="info"
                                @click="handleSell(scope.$index, scope.row)">卖出
                        </el-button>

                    </template>
                </el-table-column>


                <infinite-loading
                        :key=this.key
                        ref="infiniteLoading"
                        spinner='waveDots'
                        @infinite="infiniteHandler"
                        force-use-infinite-wrapper=".el-table__body-wrapper"
                        slot="append">
                </infinite-loading>
            </el-table>

        </div>
    </div>

</template>
<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import InfiniteLoading from 'vue-infinite-loading';
    import {getStockList, makeDeal} from "@/api/fund";
    import el from "element-ui/src/locale/lang/el";

    @Component({components: {InfiniteLoading}})
    export default class tableList extends Vue {
        tableData = [];
        key: number = 0;
        height: string = '';
        type: number = 0;
        curr_row: any;
        timer: any;
        centerDialogVisible: boolean = false;
        price: number = 0;
        trade_type: string = '';
        name: string = '';
        volume: number = 0;
        total: number = 0;

        param: {};

        create() {
            this.height = (document.documentElement.clientHeight * 0.8).toString()
        }

        /**
         * 获取笔记
         */
        stockList() {
            getStockList({}).then(
                res => {
                    this.tableData = res.data;
                    return
                },
                err => {

                }
            )
        }

        activated() {
            this.key++;
        }


        handleBuy(index: any, row: any) {
            this.centerDialogVisible = true;
            this.curr_row = row;
            this.name = "买入 : " + row.name;
            this.price = row.price;
            this.volume = 200;
            this.trade_type = "B";
            this.total = this.getTotal
        }

        handleSell(index: any, row: any) {
            this.centerDialogVisible = true;
            this.curr_row = row;
            this.trade_type = "S";
            this.name = "卖出 : " + row.name;
            this.price = row.price;
            this.volume = 200;
            this.total = this.getTotal

        }

        tradeOk() {
            //int amount, double price, String stockCode,String type
            this.param = {
                amount: this.volume,
                price: this.price,
                stockCode: this.curr_row.stockCode,
                type: this.trade_type,
            };
            this.$notify({
                title: '下单提示',
                message: "下单 : " + this.trade_type +"证券 : "  + this.curr_row.name + "\n"
                    + "数量 : "+ this.volume + "价格 " + this.price,
                duration: 200000
            });
            makeDeal(this.param)
                .then(res => {
                    this.centerDialogVisible = false;
                    if (res.code == 200){
                        this.$message("下单成功");
                    }else {
                        this.$message("下单失败");
                    }
                }, err => {
                    this.centerDialogVisible = false;
                    this.$message("下单失败");
                })
        }


        get getTotal() {
            return this.price * this.volume;
        }

        beforeDestroy() {
            clearInterval(this.timer);
        }

        mounted() {
            this.timer = setInterval(this.stockList, 3000);
        }

        infiniteHandler($state) {
            setTimeout(() => {
                this.stockList()
                $state.loaded();
            }, 2000);
        }
    }
</script>

<style lang="less" scoped>
    .com-center {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }

    .btn_mimi {
        margin-right: 20px;
    }

    .com-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding-left: 5%;
        padding-right: 5%;
        padding-bottom: 50px;
    }

    .center-fill {
        display: flex;
        width: 100%; /*必须,沾满宽度防止浮动 */
        justify-content: center;
        align-items: center;
    }
</style>
