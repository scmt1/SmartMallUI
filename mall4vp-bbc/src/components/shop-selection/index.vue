<template>
    <el-dialog
        title="店铺选择"
        top="100px"
        :append-to-body="visible"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="60%"
    >
        <el-form :inline="true" :model="dataForm" size="small" class="demo-form-inline">
            <el-form-item label="店铺名称">
                <el-input v-model="shopName" placeholder="请输入店铺名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <div class="default-btn primary-btn" @click="searchShop">{{ $t('coupon.query') }}</div>
                <div class="default-btn" @click="clean">{{ $t('product.reset') }}</div>
            </el-form-item>
        </el-form>
        <div class="Shops-select-body">
            <el-table
                ref="ShopTable"
                :data="dataList"
                header-cell-class-name="table-header"
                row-class-name="table-row"
                height="500"
                v-loading="dataListLoading"
                :row-key="getRowKeys"
                @selection-change="selectChangeHandle"
                @select="selectHandle"
                @select-all="selectAll"
                style="width: 100%"
            >
                <el-table-column v-if="isSingle" width="50" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-radio :label="scope.row.shopId" v-model="singleSelectShopId" @change.native="getSelectShopRow(scope.row)">&nbsp;
                            </el-radio>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!isSingle"
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50"></el-table-column>
                <el-table-column
                    min-width="200"
                    prop="shopName"
                    header-align="center"
                    align="center"
                    label="店铺名称"
                ></el-table-column>
                <el-table-column align="center" min-width="140" label="店铺logo">
                    <template slot-scope="scope">
                        <img v-if="scope.row.shopLogo" :src="scope.row.shopLogo.indexOf('http')===-1 && scope.row.shopLogo.indexOf('https')=== -1 ? resourcesUrl + scope.row.shopLogo :
            scope.row.shopLogo" width="100" height="100"/>
                        <img v-else src="~@/assets/img/def.png" width="100" height="100">
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </div>
        </div>
        <span slot="footer">
      <div class="default-btn" @click="visible = false">{{ $t('coupon.cancel') }}</div>
      <div class="default-btn primary-btn" @click="submitShops()">{{ $t('coupon.confirm') }}</div>
    </span>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            visible: false,
            dataForm: {},
            singleSelectShopId: 0,
            allData: [],
            selectShops: [],
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            shopName: null,
            categoryList: [],
            selectedCategory: [],
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL
        }
    },
    props: {
        isSingle: {
            default: false,
            type: Boolean
        },
        dataUrl: {
            default: '/platform/shopDetail/searchShops',
            type: String
        }
    },
    activated () {
        this.getDataList()
    },
    beforeDestroy () {
        this.$refs.ShopTable.clearSelection()
    },
    methods: {
        // 获取数据列表
        init (selectShops) {
            this.clean()
            this.pageIndex = 1
            this.singleSelectShopId = 0
            this.selectShops = selectShops
            this.visible = true
            this.dataListLoading = true
            this.dataListSelections = []
            if (this.selectShops) {
                this.selectShops.forEach(row => {
                    if (row.shopId) this.dataListSelections.push(row)
                })
            }
            this.getDataList()
        },
        getDataList () {
            this.$http({
                url: this.$http.adornUrl(this.dataUrl),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: this.pageIndex,
                            size: this.pageSize,
                            ShopName: this.shopName ? this.shopName : null,
                            keyword: this.shopName ? this.shopName : null,
                            status: 1,
                            ShopType: this.ShopType,
                            isActive: 1 // 过滤掉活动商品
                        }
                    )
                )
            }).then(({data}) => {
                this.dataList = data.records
                this.totalPage = data.total
                this.dataListLoading = false
                if (this.selectShops && this.selectShops.length) {
                    this.$nextTick(() => {
                        if (this.dataListSelections.length > 0) {
                            this.dataList.map(element => {
                                if (this.dataListSelections.map(item => item.shopId).indexOf(element.shopId) !== -1) {
                                    this.$refs.ShopTable.toggleRowSelection(element, true)
                                }
                            })
                        }
                    })
                }
            })
        },
        // 每页数
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 单选商品事件
        getSelectShopRow (row) {
            this.dataListSelections = [row]
        },
        // 全选
        selectAll (e) {
            if (e.length > 0) {
                this.dataListSelections = this.dataListSelections.filter(value => this.dataList.map(val => val.shopId).indexOf(value.shopId) === -1)
                this.dataList.map(value => {
                    this.dataListSelections.push(value)
                })
            } else {
                this.dataListSelections = this.dataListSelections.filter(value => this.dataList.map(val => val.shopId).indexOf(value.shopId) === -1)
            }
        },
        // 手动勾选数据行的 Checkbox 时触发的事
        selectHandle (selection, row) {
            // 判断是否选中
            let selectionStatu = selection.map(element => element.shopId).indexOf(row.shopId) !== -1
            if (selectionStatu && selection.length > 0 && selection) {
                // 选中添加
                this.dataListSelections.push(row)
            } else {
                // 未选中删除
                this.dataListSelections = this.dataListSelections.filter(element => element.shopId !== row.shopId)
            }
        },
        // 多选点击事件
        selectChangeHandle (selection) {

        },
        getRowKeys (row) {
            return row.shopId
        },
        /**
         * 根据条件搜索商品
         */
        searchShop () {
            this.pageIndex = 1
            this.getDataList()
        },
        /**
         * 清空搜索条件
         */
        clean () {
            this.shopName = ''
        },
        // 确定事件
        submitShops () {
            // 商品单选情况
            if (this.isSingle) {
                this.dataListSelections.length && this.$emit('refreshSelectShops', this.dataListSelections[0])
                // 商品多选情况
            } else {
                let Shops = []
                this.dataListSelections.forEach(item => {
                    let ShopIndex = Shops.findIndex((Shop) => Shop.shopId === item.shopId)
                    if (ShopIndex === -1) {
                        Shops.push(
                            {
                                shopId: item.shopId,
                                shopName: item.shopName,
                                shopLogo: item.shopLogo && item.shopLogo.includes('http') ? item.shopLogo : this.resourcesUrl + item.shopLogo,
                            }
                        )
                    }
                })
                this.$emit('refreshSelectShops', Shops)
            }
            this.dataListSelections = []
            this.visible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.pagination {
    margin-top: 15px;
}
</style>

