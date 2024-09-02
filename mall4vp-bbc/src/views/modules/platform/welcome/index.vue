<template>
    <div class="welcomeIndex">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="标题名称" class="search-form-item">
                        <el-input type="text" v-model="searchForm.guideTitle" placeholder="请输入关键字"></el-input>
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
                <div :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
                    批量删除
                </div>
            </div>

            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="guideTable" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%"
                          @selection-change="selectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <!-- 用户名 -->
                    <el-table-column prop="guidePic" label="启动页缩略图" min-width="150">
                        <template slot-scope="scope">
                            <img :src="resourcesUrl + scope.row.guidePic" width="100px">
                        </template>
                    </el-table-column>
                    <!-- 用户昵称 -->
                    <el-table-column prop="guideTitle" label="启动页标题" min-width="120">
                    </el-table-column>
                    <!-- 邮箱 -->
                    <el-table-column prop="guideUrl" label="启动页链接" min-width="300">
                    </el-table-column>
                    <!-- 创建时间 -->
                    <el-table-column prop="createTime" :label="$t('sys.creationTime')" min-width="180">
                    </el-table-column>
                    <!-- 状态 -->
                    <el-table-column prop="delFlag" :label="$t('product.status')" min-width="100">
                        <template slot-scope="scope">
<!--                            <div v-if="scope.row.delFlag === 1">{{ $t('publics.disable') }}</div>-->
<!--                            <div v-if="scope.row.delFlag === 0">{{ $t('publics.normal') }}</div>-->
                            <el-switch v-model="scope.row.delFlag"  :active-value="0" @change="onDelFlagChange($event,scope.row)"
                                       :inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </template>
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

        <!-- 启动页, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './add-or-update'

export default {
    name: 'welcomeIndex',
    components: {AddOrUpdate},
    data () {
        return {
            searchForm: {
                guideTitle: '',
                type: 1
            },
            dataList: [],
            dataListSelections: [],
            addOrUpdateVisible: false,
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL
        }
    },
    created () {
        this.getDataList()
    },
    methods: {
        onDelFlagChange(e, row) {
            this.$http({
            url: this.$http.adornUrl(`/admin/guide`),
            method: 'put',
            data: this.$http.adornData({
              'id': row.id,
              'delFlag': e
            })
          }).then(({data}) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.page)
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        },
        // 获取数据列表
        getDataList (page, newData = false) {
            if (newData || !this.theData) {
                this.theData = JSON.parse(JSON.stringify(this.searchForm))
            }
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/admin/guide/page'),
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
            console.log(1111)
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        deleteHandle (id) {
            var guideIds = id ? [id] : this.dataListSelections.map(item => {
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
                    url: this.$http.adornUrl('/admin/guide'),
                    method: 'delete',
                    data: this.$http.adornData(guideIds, false)
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
.welcomeIndex {

}
</style>
