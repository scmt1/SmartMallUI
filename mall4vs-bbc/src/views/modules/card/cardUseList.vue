<template>
    <el-dialog class="cardUseList" title="提货卡使用明细" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 表格 -->
        <div class="table-con sys-user-table">
            <el-table ref="activityTable" v-loading="dataListLoading" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
                <el-table-column prop="cardTitle" label="卡名称" min-width="110">
                </el-table-column>
                <el-table-column prop="nickName" label="使用人" min-width="110">
                    <template slot-scope="scope">
                        <span v-if="scope.row.nickName">{{scope.row.nickName}}</span>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userMobile" label="使用人电话" min-width="110">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userMobile">{{scope.row.userMobile}}</span>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="shopName" label="使用店铺" min-width="110">
                </el-table-column>
                <el-table-column prop="useTime" label="使用时间" min-width="110">
                </el-table-column>
                <el-table-column prop="amount" label="使用金额" min-width="110">
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <el-pagination
            v-if="dataList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
        </el-pagination>
    </el-dialog>
</template>

<script>
export default {
    name: 'cardUseList',
    data() {
        return {
            visible: false,
            dataListLoading: false,
            dataList: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
        }
    },
    methods: {
        initData(cardCode) {
            this.visible = true;
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/admin/card/queryWriteOffCardList'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: this.page.currentPage,
                            size: this.page.pageSize
                        },
                        {
                          cardCode: cardCode
                        }
                    )
                )
            }).then(({data}) => {
                this.dataList = data.records
                this.page.total = data.total
                this.dataListLoading = false
            }).finally(() => {
                this.dataListLoading = false
            })
        },
        handleSizeChange (val) {
            this.page.pageSize = val
            this.getDataList(this.page)
        },
        handleCurrentChange (val) {
            this.page.currentPage = val
            this.getDataList(this.page)
        },
    }
}
</script>

<style scoped lang="scss">
.cardUseList {

}
</style>
