<template>
    <div class="mod-service-notifyTemplate">
        <div class="main-container">
            <div class="operation-bar">
                <div
                    v-if="isAuth('platform:notifyTemplate:save')"
                    class="default-btn primary-btn"
                    @click="addOrUpdateHandle()"
                >{{ $t('crud.addTitle') }}
                </div>
            </div>
            <div class="table-con notice-table">
                <el-table
                    ref="customizeNotifyTable"
                    :data="dataList"
                    header-cell-class-name="table-header"
                    row-class-name="table-row-low"
                    style="width: 100%">
                    <el-table-column
                        :label="$t('formData.serialNumber')"
                        type="index"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.notifyConten')"
                        prop="message"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.canUseNotice')"
                        prop="templateTypes"
                    >
                        <template slot-scope="scope">
                            <span v-if="scope.row.sub " size="small">{{ $t('shop.officialAccount') }}</span>
                            <span v-if="scope.row.sms " size="small">{{ $t('sysManagement.shortMessage') }}</span>
                            <span v-if="scope.row.app " size="small">{{ $t('platform.stationMsg') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.tagList')"
                        prop="templateCode"
                    >
                    </el-table-column>
                    <el-table-column
                        :label="$t('sys.creationTime')"
                        prop="createTime"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('publics.operating')"
                        fixed="right"
                        width="320">
                        <template slot-scope="scope">
                            <div class="text-btn-con">
                                <div
                                    v-if="isAuth('platform:notifyTemplate:update')"
                                    class="default-btn text-btn"
                                    @click="addOrUpdateHandle(scope.row.templateId)"
                                >{{ $t('crud.updateBtn') }}
                                </div>
                                <div
                                    v-if="isAuth('platform:notifyTemplate:update')"
                                    class="default-btn text-btn"
                                    @click="sendTagMsg(scope.row.templateId)"
                                >{{ $t('platform.sendMsg') }}
                                </div>
                                <div
                                    class="default-btn text-btn"
                                    @click="deleteHandle(scope.row.templateId)"
                                >{{ $t('crud.delBtn') }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                v-if="dataList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"></el-pagination>
        </div>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    </div>
</template>
<script>
import AddOrUpdate from './notifyTemplate-add-or-update'

export default {
    data () {
        return {
            dataList: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            searchForm: {}, // 搜索
            dataListLoading: false,
            addOrUpdateVisible: false
        }
    },
    components: {
        AddOrUpdate
    },
    created () {
        this.getDataList()
    },
    mounted () {
    },
    methods: {
        getDataList (page) {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/platform/sendTagNotify/page'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: page == null ? this.page.currentPage : page.currentPage,
                            size: page == null ? this.page.pageSize : page.pageSize,
                            sendType: 0
                        },
                        this.searchForm
                    )
                )
            }).then(({data}) => {
                this.dataList = data.records
                this.page.total = data.total
                this.dataListLoading = false
            })
        },
        // 新增 / 修改
        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        deleteHandle (id) {
            var tip = this.$i18n.t('remindPop.makeSure') + '[' + this.$i18n.t('remindPop.delete')
            tip = tip + ']' + this.$i18n.t('remindPop.operation') + '?'
            this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
                confirmButtonText: this.$i18n.t('remindPop.confirm'),
                cancelButtonText: this.$i18n.t('remindPop.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/sendTagNotify/' + id),
                    method: 'delete',
                    data: this.$http.adornData({})
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
        },
        sendTagMsg (id) {
            // `确定进行[${row.status === 0 ? '启用' : '禁用'}]操作?`
            var tip = this.$i18n.t('sys.pushTagMsg')
            this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
                confirmButtonText: this.$i18n.t('remindPop.confirm'),
                cancelButtonText: this.$i18n.t('remindPop.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/user/userTag/sendMsg/' + id),
                    method: 'delete',
                    data: this.$http.adornData({})
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
        },
        /**
         * 刷新回调
         */
        refreshChange () {
            this.getDataList(this.page)
        },
        searchChange (params) {
            this.searchForm = params
            this.getDataList(this.page)
        },
        handleSizeChange (val) {
            this.page.pageSize = val
            this.getDataList()
        },
        handleCurrentChange (val) {
            this.page.currentPage = val
            this.getDataList()
        }
    }
}
</script>
<style lang="scss" scoped>
.mod-service-notifyTemplate {

}
</style>
