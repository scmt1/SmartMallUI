<template>
    <div class="mod-service-notifyTemplate">
        <!-- 搜索相关区域 -->
        <div class="search-bar">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small" ref="searchForm">
                <div class="input-row">
                    <el-form-item label="消息类型" prop="sendType">
                        <el-select v-model="searchForm.sendType" size="small" clearable placeholder="选择消息类型">
                            <el-option
                                v-for="item in sendTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发送类型" prop="msgType">
                        <el-select
                            v-model="searchForm.msgType"
                            size="small"
                            clearable
                            placeholder="选择发送类型"
                        >
                            <el-option
                                v-for="item in msgTypes"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="handleCurrentChange(1)">{{ $t('product.search') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">{{ $t('product.reset') }}</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="main-container">
            <div class="operation-bar">
                <div class="default-btn primary-btn"
                     v-if="isAuth('platform:notifyTemplate:save')"
                     @click="addOrUpdateHandle()"
                >{{ $t('crud.addTitle') }}
                </div>
            </div>
            <div class="table-con prod-table">
                <el-table
                    ref="notifyTemplateTable"
                    :data="dataList"
                    header-cell-class-name="table-header"
                    row-class-name="table-row-low"
                    style="width: 100%">
                    <el-table-column
                        :label="$t('brand.serialNumber')"
                        type="index"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.msgTemplate')"
                        prop="templateId"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.msgType')"
                        prop="sendType"
                        width="200">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sendType === 0">{{ $t('platform.customisedMsg') }}</span>
                            <span v-else-if="scope.row.sendType === 1">{{ $t('platform.orderPay') }}</span>
                            <span v-else-if="scope.row.sendType === 2">{{ $t('platform.paySuccNotify') }}</span>
                            <span v-else-if="scope.row.sendType === 3">{{ $t('platform.merAgreeReturn') }}</span>
                            <span v-else-if="scope.row.sendType === 4">{{ $t('order.refusedRefund') }}</span>
                            <span v-else-if="scope.row.sendType === 5">{{ $t('platform.wriOffRem') }}</span>
                            <span v-else-if="scope.row.sendType === 6">{{ $t('platform.shipRem') }}</span>
                            <span v-else-if="scope.row.sendType === 7">{{ $t('platform.groupFailRem') }}</span>
                            <span v-else-if="scope.row.sendType === 8">{{ $t('platform.groupSuccRem') }}</span>
                            <span v-else-if="scope.row.sendType === 9">{{ $t('platform.startGroupRem') }}</span>
                            <span v-else-if="scope.row.sendType === 10">{{ $t('platform.memUpRem') }}</span>
                            <span v-else-if="scope.row.sendType === 11">{{ $t('platform.timeoutRem') }}</span>
                            <span v-else-if="scope.row.sendType === 12">{{ $t('platform.register') }}</span>
                            <span v-else-if="scope.row.sendType === 13">{{ $t('platform.login') }}</span>
                            <span v-else-if="scope.row.sendType === 14">{{ $t('platform.updatePassword') }}</span>
                            <span v-else-if="scope.row.sendType === 15">{{ $t('platform.vaild') }}</span>
                            <span v-else-if="scope.row.sendType === 16">{{ $t('platform.orderBalanceRefundSuccess') }}</span>
                            <span v-else-if="scope.row.sendType === 17">提货卡到期提醒</span>
                            <span v-else-if="scope.row.sendType === 18">购买优惠券到期提醒</span>
                            <span v-else-if="scope.row.sendType === 102">{{ $t('platform.confirmReceRem') }}</span>
                            <span v-else-if="scope.row.sendType === 103">{{ $t('platform.buyerRefundRem') }}</span>
                            <span v-else-if="scope.row.sendType === 104">{{ $t('platform.buyerReturnRem') }}</span>
                            <span v-else-if="scope.row.sendType === 105">{{ $t('platform.buyerPaySuccessRem') }}</span>
                            <span v-else-if="scope.row.sendType === 106">{{ $t('platform.productRemovalReminder') }}</span>
                            <span v-else-if="scope.row.sendType === 107">{{ $t('platform.commodityAuditResultReminder') }}</span>
                            <span v-else-if="scope.row.sendType === 108">{{ $t('platform.ReminderPurchased') }}</span>
                            <span v-else-if="scope.row.sendType === 109">{{ $t('platform.reminderToNeReceived') }}</span>
                            <span v-else-if="scope.row.sendType === 110">{{ $t('platform.ReminderMarketingActivityOffShelf') }}</span>
                            <span v-else-if="scope.row.sendType === 111">{{ $t('platform.ActivityAuditResultReminder') }}</span>
                            <span v-else-if="scope.row.sendType === 99">自定义短信</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        :label="$t('platform.notifyConten')"
                        prop="message"
                        width="500">
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.canUseNotice')"
                        prop="templateTypes"
                        width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sub ">{{ $t('shop.officialAccount') + ' ' }}</span>
                            <span v-if="scope.row.sms ">{{ $t('sysManagement.shortMessage') + ' ' }}</span>
                            <span v-if="scope.row.app ">{{ $t('platform.applet') + ' ' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.smsTemplateCode')"
                        prop="templateCode"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        :label="$t('platform.sendType')"
                        prop="msgType">
                        <template slot-scope="scope">
                            <span v-if="scope.row.msgType === 2">{{ $t('platform.seller') }}</span>
                            <span v-else size="small">{{ $t('platform.buyer') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('publics.operating')"
                        fixed="right"
                        width="100">
                        <template slot-scope="scope">
                            <div
                                v-if="isAuth('platform:notifyTemplate:update')"
                                class="default-btn text-btn"
                                @click="addOrUpdateHandle(scope.row.templateId)"
                            >{{ $t('crud.updateBtn') }}
                            </div>
                        </template>
                    </el-table-column>

                </el-table>
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
            searchForm: {
                sendType: null,
                msgType: null
            }, // 搜索
            dataListLoading: false,
            addOrUpdateVisible: false,
            sendTypes: [{
                value: 0,
                label: this.$i18n.t('platform.customisedMsg')
            }, {
                value: 1,
                label: this.$i18n.t('platform.orderPay')
            }, {
                value: 2,
                label: this.$i18n.t('platform.paySuccNotify')
            }, {
                value: 3,
                label: this.$i18n.t('platform.merAgreeReturn')
            }, {
                value: 4,
                label: this.$i18n.t('order.refusedRefund')
            }, {
                value: 5,
                label: this.$i18n.t('platform.wriOffRem')
            }, {
                value: 6,
                label: this.$i18n.t('platform.shipRem')
            }, {
                value: 7,
                label: this.$i18n.t('platform.groupFailRem')
            }, {
                value: 8,
                label: this.$i18n.t('platform.groupSuccRem')
            }, {
                value: 9,
                label: this.$i18n.t('platform.startGroupRem')
            }, {
                value: 10,
                label: this.$i18n.t('platform.memUpRem')
            }, {
                value: 11,
                label: this.$i18n.t('platform.timeoutRem')
            }, {
                value: 12,
                label: this.$i18n.t('platform.register')
            }, {
                value: 13,
                label: this.$i18n.t('platform.login')
            }, {
                value: 14,
                label: this.$i18n.t('platform.updatePassword')
            }, {
                value: 15,
                label: this.$i18n.t('platform.vaild')
            }, {
                value: 16,
                label: this.$i18n.t('platform.orderBalanceRefundSuccess')
            }, {
                value: 17,
                label: "提货卡到期提醒"
            }, {
                value: 18,
                label: "购买优惠券到期提醒"
            }, {
                value: 99,
                label: '自定义短信'
            }, {
                value: 102,
                label: this.$i18n.t('platform.confirmReceRem')
            }, {
                value: 103,
                label: this.$i18n.t('platform.buyerRefundRem')
            }, {
                value: 104,
                label: this.$i18n.t('platform.buyerReturnRem')
            }, {
                value: 105,
                label: this.$i18n.t('platform.buyerPaySuccessRem')
            }, {
                value: 106,
                label: this.$i18n.t('platform.productRemovalReminder')
            }, {
                value: 107,
                label: this.$i18n.t('platform.commodityAuditResultReminder')
            }, {
                value: 108,
                label: this.$i18n.t('platform.ReminderPurchased')
            }, {
                value: 109,
                label: this.$i18n.t('platform.reminderToNeReceived')
            }, {
                value: 110,
                label: this.$i18n.t('platform.ReminderMarketingActivityOffShelf')
            }, {
                value: 111,
                label: this.$i18n.t('platform.ActivityAuditResultReminder')
            }],
            msgTypes: [{
                key: 1,
                name: this.$t('platform.buyer')
            }, {
                key: 2,
                name: this.$t('platform.seller')
            }]
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
                url: this.$http.adornUrl('/platform/notifyTemplate/page'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: page == null ? this.page.currentPage : page.currentPage,
                            size: page == null ? this.page.pageSize : page.pageSize
                        },
                        this.searchForm
                    )
                )
            }).then(({data}) => {
                if(data){
                    this.dataList = data.records
                    this.page.total = data.total
                }else{
                    this.dataList = []
                }
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
        deleteHandle (row) {
            // `确定进行[${row.status === 0 ? '启用' : '禁用'}]操作?`
            var tip = this.$i18n.t('remindPop.makeSure') + '[' + (row.status === 0 ? this.$i18n.t('brand.enAble') : this.$i18n.t('brand.disable'))
            tip = tip + ']' + this.$i18n.t('remindPop.operation') + '?'
            this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
                confirmButtonText: this.$i18n.t('remindPop.confirm'),
                cancelButtonText: this.$i18n.t('remindPop.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/notifyTemplate/' + row.templateId),
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
        },
        /**
         * 重置表单
         * @param {String} formName 表单名称
         */
        resetSearchForm (formName) {
            this.$refs[formName].resetFields()
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
