<template>
    <div class="activityIndex">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="活动名称" class="search-form-item">
                        <el-input type="text" v-model="searchForm.title" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="活动地址" class="search-form-item">
                        <el-input type="text" v-model="searchForm.address" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="主办方" class="search-form-item">
                        <el-input type="text" v-model="searchForm.sponsor" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="活动时间" class="search-form-item">
                        <el-date-picker
                            v-model="dateRange"
                            type="datetimerange"
                            :range-separator="$t('date.tip')"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :start-placeholder="$t('date.start')"
                            :end-placeholder="$t('date.end')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="店铺" prop="shopId">
                        <el-select
                                filterable
                                v-model="searchForm.shopId"
                                placeholder="请选择店铺"
                                style="width: 100%"
                        >
                            <el-option
                                    v-for="item in shopList"
                                    :key="item.shopId"
                                    :label="item.shopName"
                                    :value="item.shopId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">{{ $t('product.reset') }}</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <div class="main-container">
            <!-- 操作栏 -->
            <div class="operation-bar">
                <div class="default-btn primary-btn" @click.stop="addOrUpdateHandle()">新增</div>
<!--                <div :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">-->
<!--                    批量删除-->
<!--                </div>-->
            </div>

            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="activityTable" v-loading="tableLoading" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%"
                          @selection-change="selectionChange">
<!--                    <el-table-column type="selection" width="55">-->
<!--                    </el-table-column>-->
                    <el-table-column prop="title" label="活动logo" min-width="120">
                        <template slot-scope="scope">
                            <img :src="resourcesUrl + scope.row.logo" width="100px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="活动标题" min-width="110">
                    </el-table-column>
                    <el-table-column prop="sponsor" label="主办方" min-width="100">
                    </el-table-column>
                    <el-table-column prop="address" label="活动地址" min-width="260">
                    </el-table-column>
                    <el-table-column prop="isRelease" label="是否发布" min-width="100" align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.isRelease"
                               active-color="#13ce66"
                               inactive-color="#999"
                               :active-value="1"
                               :inactive-value="0"
                               disabled
                               @click.native="isReleaseChange(scope.row)"
                                />
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="活动类型" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="startTime" label="活动开始时间" min-width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="endTime" label="活动结束时间" min-width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="personCount" label="活动人数" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="totalCount" label="报名人数" min-width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="signCount" label="签到人数" min-width="100" align="center">
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column fixed="right" align="center" :label="$t('publics.operating')" width="150">
                        <template slot-scope="scope">
                            <div class="text-btn-con">
                                <div class="default-btn text-btn" @click.stop="addOrUpdateHandle(scope.row.id)">
                                    {{ $t('coupon.edit') }}
                                </div>
                                <div class="default-btn text-btn" @click.stop="deleteHandle(scope.row.id)">
                                    {{ $t('coupon.delete') }}
                                </div>
                            </div>
                        </template>
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
        </div>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './add-or-update'

export default {
    name: 'activityIndex',
    components: {AddOrUpdate},
    data () {
        return {
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            searchForm: {

            },
            dataList: [],
            dataListSelections: [],
            addOrUpdateVisible: false,
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            dateRange: [],
            shopList: [],
            tableLoading:false
        }
    },
    created () {
        this.getShopList();
        this.getDataList()
    },
    methods: {
        // 活动状态改变
        isReleaseChange (activity) {
            let isRelease = ''
            if(activity.isRelease == 1){
                isRelease = 0
            }else{
                isRelease = 1
            }
            this.$http({
                url: this.$http.adornUrl('/admin/activity/updateActivityIsRelease'),
                method: 'get',
                params: this.$http.adornParams({
                  id:activity.id,
                  isRelease:isRelease
                })
            }).then(({data}) => {
                // this.page.currentPage = 1
                // this.page.pageSize = 10
                this.getDataList(this.page)
            })
        },
        // 获取所有营业店铺
        getShopList() {
            this.$http({
                url: this.$http.adornUrl("/platform/shopDetail/getAllShop"),
                method: "get",
                params: this.$http.adornParams(),
            }).then(({ data }) => {
                this.shopList = data;
            });
        },
        // 获取数据列表
        getDataList (page, newData = false) {
            this.tableLoading = true;
            if (newData || !this.theData) {
                this.theData = JSON.parse(JSON.stringify(this.searchForm))
            }
            this.theData.startTime = this.dateRange === null ? null : this.dateRange[0], // 开始时间
            this.theData.endTime = this.dateRange === null ? null : this.dateRange[1], // 结束时间
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/admin/activity/page'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: page == null ? this.page.currentPage : page.currentPage,
                            size: page == null ? this.page.pageSize : page.pageSize
                        },
                        this.theData
                    )
                )
            }).then(({data}) => {
                this.dataList = data.records
                this.page.total = data.total
                this.dataListLoading = false
            }).finally(()=>{
                this.tableLoading = false;
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
        // 条件查询
        searchChange (newData = false) {
            this.page.currentPage = 1
            this.getDataList(this.page, newData)
        },
        // 刷新回调用
        refreshChange () {
            this.page.currentPage = 1
            this.getDataList(this.page)
        },
        /**
         * 重置表单
         * @param {String} formName 表单名称
         */
        resetSearchForm (formName) {
            this.$refs[formName].resetFields()
            this.searchForm = {}
        },
        // 多选变化
        selectionChange (val) {
            this.dataListSelections = val
            this.selectAll = val.length === this.dataList.length
        },
        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        deleteHandle (id) {
            var activityIds = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            if (!id && !this.dataListSelections.length) {
                return
            }
            this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('coupon.confirm'),
                cancelButtonText: this.$i18n.t('coupon.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/admin/activity'),
                    method: 'delete',
                    data: this.$http.adornData(activityIds, false)
                }).then(({data}) => {
                    this.$message({
                        message: this.$i18n.t('publics.operation'),
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.refreshChange()
                        }
                    })
                })
            }).catch(() => {
            })
        }
    }
}
</script>

<style lang="scss">
.activityIndex {

    .el-switch.is-disabled .el-switch__core,
    .el-switch.is-disabled .el-switch__label {
        cursor: pointer;
    }
}
</style>
