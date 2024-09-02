<template>
    <div class="roomsIndex">
        <div class="main-container">
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="待取餐" name="0">
                </el-tab-pane>
                <el-tab-pane label="已取餐" name="1">
                </el-tab-pane>
            </el-tabs>
            <div class="table-con sys-user-table" v-loading="dataListLoading">
                <el-row :gutter="15" style="margin: 15px;">
                    <el-col :span="18">
                        <el-row :gutter="15" >
                            <el-col :span="4" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 10px;" @click.native="showProdItem(item.orderNumber)">
                                <el-card :body-style="{ padding: '0px' }" shadow="hover" style="text-align: center;cursor: pointer;">
                                    <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                                    <div style="padding: 7px;">
                                        <span style="font-size: 16px;font-weight: bold;">{{item.pickupCode}}</span>
                                    </div>
                                    <div style="font-size: 12px;font-weight: bold;">
                                        下单时间：
                                        <time>{{item.createTime}}</time>
                                    </div>
                                    <div>
                                        <el-button type="text" class="button" @click="confirmPickup(item.id)">确认取餐</el-button>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="6">
                        <el-table v-if="tableData.length > 0" :data="tableData" style="width: 99%" :v-loading="tableLoading">
                            <el-table-column label="商品信息" min-width="250">
                                <template slot-scope="scope">
                                    <prod-pic
                                        height="60"
                                        width="60"
                                        :pic="scope.row.pic"
                                        style="display: inline-block"
                                    />
                                    <span style="margin-left: 10px">{{
                                            scope.row.prodName
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="prodCount"
                                label="数量"
                                min-width="80"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="productTotalAmount"
                                label="小计 (元)"
                                align="right"
                                min-width="100"
                                :formatter="rounding">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import ProdPic from "@/components/prod-pic";
export default {
    name: 'roomsIndex',
    components: {ProdPic},
    data () {
        return {
            dataList: [],
            dataListLoading: false,
            tableData:[],
            tableLoading: false,
            activeName: "0"
        }
    },
    created () {
        this.getDataList()
    },
    methods: {
        getDataList () {
            this.$http({
                url: this.$http.adornUrl('/multishop/pickup/list'),
                method: 'get',
                params: {status: this.activeName}
            }).then(({data}) => {
                this.dataList = data
                this.dataListLoading = false
                if(data.length > 0) {
                    this.showProdItem(data[0].orderNumber);
                }
            })
        },
        confirmPickup (id) {
            this.$confirm('确定进行[确认取餐]操作吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/multishop/rooms/picking'),
                    method: 'get',
                    params: {id: id}
                }).then(({data}) => {
                    this.$message({
                        message: this.$i18n.t('publics.operation'),
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList()
                        }
                    })
                })
            }).catch(() => {
            })
        },
        // 格式化金额
        rounding(row, column) {
            return parseFloat(row[column.property]).toFixed(2);
        },
        showProdItem(orderNumber) {
            this.tableLoading = true;
            this.tableData = []
            this.$http({
                url: this.$http.adornUrl('/multishop/rooms/queryProdItemList'),
                method: 'get',
                params: {orderNumber: orderNumber}
            }).then(({data}) => {
                this.tableLoading = false;
                this.tableData = data;
            })
        },
        // 选择tab栏
        handleClick(tab, event) {
            this.getDataList();
        },
    }
}
</script>

<style scoped lang="scss">
.roomsIndex {

    .operation-bar {
        margin: 15px 0 0 25px;
    }

    .el-button--primary {
        background-color: #8558fa;
        border-color: #8558fa;
    }
}
</style>
