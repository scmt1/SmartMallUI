<template>
    <div class="cardManage">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item prop="shopId" label="发放来源">
                        <el-select v-model="searchForm.shopId" filterable clearable
                                   placeholder="请选择发放来源">
                            <el-option label="运营平台" value="0"></el-option>
                            <el-option
                                    v-for="item in shopList"
                                    :key="item.shopId"
                                    :label="item.shopName"
                                    :value="item.shopId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次号" class="search-form-item">
                        <el-select filterable v-model="searchForm.batchNumber" clearable placeholder="请选择" style="width: 100%">
                            <el-option :label="item" :value="item" v-for="(item,index) in batchNumList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardTitle" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="卡号" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardCode" placeholder="请输入卡号"></el-input>
                    </el-form-item>
                    <el-form-item label="卡编号" class="search-form-item">
                        <el-input type="text" v-model="searchForm.cardNumber" placeholder="请输入卡编号"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" class="search-form-item">
                        <el-select filterable v-model="searchForm.status" clearable placeholder="请选择" style="width: 100%">
                            <el-option label="已失效" :value="-1"></el-option>
                            <el-option label="未制卡(券)" :value="0"></el-option>
                            <el-option label="未出售" :value="1"></el-option>
                            <el-option label="已出售" :value="2"></el-option>
                            <el-option label="已绑定" :value="3"></el-option>
                            <el-option label="已冻结" :value="4"></el-option>
                            <el-option label="已置换" :value="5"></el-option>
                            <el-option label="已核销" :value="6"></el-option>
                            <el-option label="已作废" :value="7"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" class="search-form-item">
                        <el-select filterable v-model="searchForm.cardType" clearable placeholder="请选择类型" style="width: 100%">
                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="buyCardType" label="团卡类型:">
                        <el-select v-model="searchForm.buyCardType" clearable filterable placeholder="请选择">
                            <el-option
                                    label="工会团卡(券)"
                                    value="0">
                            </el-option>
                            <el-option
                                    label="个人团卡"
                                    value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="购买单位" class="search-form-item">
                        <el-input type="text" v-model="searchForm.buyUnit" placeholder="请输入购买单位"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" label-width="70px">
                        <el-date-picker
                            v-model="launchDateRange"
                            type="datetimerange"
                            :range-separator="$t('coupon.to')"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :start-placeholder="$t('coupon.startTime')"
                            :end-placeholder="$t('coupon.endTime')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="出售时间" label-width="70px">
                        <el-date-picker
                            v-model="sellDateRange"
                            type="datetimerange"
                            :range-separator="$t('coupon.to')"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :start-placeholder="$t('coupon.startTime')"
                            :end-placeholder="$t('coupon.endTime')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">{{ $t('product.reset') }}</div>
                        <div class="default-btn primary-btn" v-if="isAuth('platform:card:addCard')" @click.stop="addOrUpdateHandle()">新增</div>
                        <div class="default-btn primary-btn" v-if="isAuth('platform:card:freezeCard')" @click.stop="freeze()">冻结</div>
                        <div class="default-btn primary-btn" @click.stop="downLoadImg()">导出图片</div>
                        <div class="default-btn primary-btn" @click.stop="downLoadExcel()">导出Excel</div>
                        <div class="default-btn primary-btn" @click.stop="downLoadCard()">导出记录</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="activityTable" @selection-change="handleSelectionChange"
                          @select="selectHandle"
                          @select-all="selectAll"
                          :row-key="getKey"
                          v-loading="tableLoading" :data="dataList" header-cell-class-name="table-header"
                          row-class-name="table-row-low" style="width: 100%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="title" label="提货卡(券)图片" min-width="120">
                        <template slot-scope="scope">
                            <img v-if="scope.row.cardImg" :src="resourcesUrl + scope.row.cardImg" width="100px">
                            <img v-else src="~@/assets/img/def.png" width="100px">
                        </template>
                    </el-table-column>
                    <el-table-column prop="shopName" label="发放来源" min-width="100">
                    </el-table-column>
                    <el-table-column prop="cardTitle" label="名称" min-width="150">
                    </el-table-column>
                    <el-table-column prop="batchNumber" label="批次号" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.batchNumber">{{scope.row.batchNumber}}</span>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardNumber" label="编号" min-width="100">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" min-width="100">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status === -1" type="info" effect="dark">已失效</el-tag>
                            <el-tag v-if="scope.row.status === 0" type="info" effect="dark">未制卡(券)</el-tag>
                            <el-tag v-if="scope.row.status === 1" type="" effect="dark">未出售</el-tag>
                            <el-tag v-if="scope.row.status === 2" type="danger" effect="dark">已出售</el-tag>
                            <el-tag v-if="scope.row.status === 3" type="success" effect="dark">已绑定</el-tag>
                            <el-tag v-if="scope.row.status === 4" type="warning" effect="dark">已冻结</el-tag>
                            <el-tag v-if="scope.row.status === 5" type="warning" effect="dark">已置换</el-tag>
                            <el-tag v-if="scope.row.status === 6" type="warning" effect="dark">已核销</el-tag>
                            <el-tag v-if="scope.row.status === 7" type="info" effect="dark">已作废</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="balance" label="卡金额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="remainingAmount" label="卡余额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="cardCode" label="卡号" min-width="130">
                    </el-table-column>
                    <el-table-column label="有效期" min-width="180">
                        <template slot-scope="scope" v-if="scope.row.userStartTime && scope.row.userEndTime">
                            {{ scope.row.userStartTime }} 到 {{ scope.row.userEndTime }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardType" label="卡类别" min-width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark">{{
                                    cardTypeList.find(item => item.value == scope.row.cardType)
                                        .title
                                }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyCardType" label="团卡(券)类型" min-width="90">
                        <template slot-scope="scope">
                            <span v-if="scope.row.buyCardType == 0">工会团卡(券)</span>
                            <span v-if="scope.row.buyCardType == 1">个人团卡</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sellTime" label="出售时间" min-width="150">
                        <template slot-scope="scope">
                          <span v-if="scope.row.sellTime">{{scope.row.sellTime}}</span>
                          <span v-else>暂无</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyUnit" label="购买单位" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.buyUnit">{{scope.row.buyUnit}}</span>
                            <span v-else>暂无</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyUnit" label="购买事由" width="150">
                      <template slot-scope="scope">
                        <span v-if="scope.row.buyReason">{{scope.row.buyReason}}</span>
                        <span v-else>暂无</span>
                      </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column fixed="right" align="center" :label="$t('publics.operating')" width="180">
                        <template slot-scope="scope">
                            <div class="text-btn-con" style="">
                                <div class="default-btn text-btn" v-if="isAuth('platform:card:editCard') && scope.row.shopId == 0" @click.stop="addOrUpdateHandle(scope.row.cardId)">
                                    {{ $t('coupon.edit') }}
                                </div>
                                <div class="default-btn text-btn" v-if="isAuth('platform:card:delCard') && scope.row.status === 0" @click.stop="deleteHandle(scope.row.cardId)">
                                    {{ $t('coupon.delete') }}
                                </div>
                                <!--                                <div class="default-btn text-btn" v-if="scope.row.status === 1" @click.stop="sellCard(scope.row.cardId,scope.row.status)">-->
                                <!--                                    出售-->
                                <!--                                </div>-->
                                <!--                                <div class="default-btn text-btn" v-if="scope.row.status === 0 || scope.row.status === 1" @click.stop="rechargeCard(scope.row.cardId)">-->
                                <!--                                    充值-->
                                <!--                                </div>-->
                                <!--                                <div class="default-btn text-btn" v-if="scope.row.status !== 4" @click.stop="changeStatusHandle(scope.row.cardId,4)">-->
                                <!--                                    冻结该卡-->
                                <!--                                </div>-->
                                <div class="default-btn text-btn" v-if="isAuth('platform:card:unfreezeCard') && scope.row.status === 4" @click.stop="unfreeze(scope.row.cardId)">
                                    解冻该卡
                                </div>
                                <div class="default-btn text-btn" @click.stop="useHandle(scope.row.cardCode)">
                                    使用明细
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
        <card-use-list v-show="cardUseVisible" ref="cardUseList"></card-use-list>
        <!--    充值    -->
        <el-dialog :visible.sync="rechargeShow" title="充值金额" :mask-closable="false" :draggable="false"
                   width="480px">
            <div style="display: flex;align-items: center;">
                <div style="width: 80px;">充值金额：</div>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="balance" size="small" placeholder="请输入充值金额" type="number" @change="balanceChange" min="0">
                        <template slot="append">{{ $t('coupon.yuan') }}</template>
                    </el-input>
                </div>
            </div>
            <div slot="footer">
                <div class="default-btn primary-btn" @click.stop="rechargeConfirm()">确定</div>
                <div class="default-btn" @click="(rechargeShow = false)">关闭</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import CardUseList from '@/views/modules/card/cardUseList'
import excelUpload from './excelUpload'
import fileDownload from 'js-file-download'
import {formatDate} from '@/utils/date-util'

export default {
    name: 'cardManage',
    components: {CardUseList, AddOrUpdate, excelUpload},
    data () {
        return {
            dataList: [],
            searchForm: {},
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            addOrUpdateVisible: false,
            tableLoading: false,
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            cardUseVisible: false,
            shopList: [],
            cardTypeList: [],
            launchDateRange: null,
            sellDateRange: null,
            batchNumList: [],
            tempUrl: '/excelTemplate/数据导入模板.xlsx',
            uploadUrl: process.env.VUE_APP_BASE_API + '/platform/card/importExcel',
            importShow: false,
            balance: 0,
            rechargeShow: false,
            cardId: 0,
            cardIds: [],//卡ids
            selectCards:[]
        }
    },
    methods: {
        getKey(row) {
            return row.cardId;
        },
        // 全选
        selectAll (e) {
            if (e.length > 0) {
                this.selectCards = this.selectCards.filter(value => this.dataList.map(val => val.cardId).indexOf(value.cardId) === -1)
                this.dataList.map(value => {
                    this.selectCards.push(value)
                })
            } else {
                this.selectCards = this.selectCards.filter(value => this.dataList.map(val => val.cardId).indexOf(value.cardId) === -1)
            }
        },
        // 手动勾选数据行的 Checkbox 时触发的事
        selectHandle (selection, row) {
            // 判断是否选中
            let selectionStatu = selection.map(element => element.cardId).indexOf(row.cardId) !== -1
            if (selectionStatu && selection.length > 0 && selection) {
              // 选中添加
              this.selectCards.push(row)
            } else {
              // 未选中删除
              this.selectCards = this.selectCards.filter(element => element.cardId !== row.cardId)
            }
        },
        handleSelectionChange (val) {

        },
        /**
         * 消费金额最低要求检验
         */
        balanceChange () {
            let balance = this.balance
            this.balance = balance <= 0 ? 0.01 : balance
            this.balance = balance > 9999999999999 ? 9999999999999 : balance
        },
        // 冻结
        freeze () {
            if (this.selectCards.length < 1) {
                this.$message.warning('请先勾选要冻结提货卡(券)！')
                return
            }
            this.cardIds = this.selectCards.map(item => item.cardId)
            this.$confirm('确定执行 [冻结] 操作？', this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('coupon.confirm'),
                cancelButtonText: this.$i18n.t('coupon.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/card/freezeCardByCardIds'),
                    method: 'post',
                    data: this.$http.adornData({
                        cardIds: this.cardIds,
                        shopId: 0
                    })
                }).then(({data}) => {
                    this.selectCards = []
                    this.refreshChange()
                    this.$message({
                        message: this.$i18n.t('publics.operation'),
                        type: 'success',
                        duration: 1500,
                    })
                })
            }).catch(() => {
            })
        },
        // 获取类型
        getTypeData () {
            let type = 'card_type'
            this.$http({
                url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.cardTypeList = data
            })
        },
        // 获取所有营业店铺
        getShopList () {
            this.$http({
                url: this.$http.adornUrl('/platform/shopDetail/getAllShop'),
                method: 'get',
                params: this.$http.adornParams(),
            }).then(({data}) => {
                this.shopList = data
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
        // 刷新回调用
        refreshChange () {
            this.page.currentPage = 1
            this.getBatchNum()
            this.getDataList(this.page)
        },
        // 获取数据列表
        getDataList (page, newData = false) {
            this.tableLoading = true
            if (newData || !this.theData) {
                this.theData = JSON.parse(JSON.stringify(this.searchForm))
                this.theData.startTime = this.launchDateRange === null ? null : this.launchDateRange[0]
                this.theData.endTime = this.launchDateRange === null ? null : this.launchDateRange[1]
                this.theData.sellStartTime = this.sellDateRange === null ? null : this.sellDateRange[0]
                this.theData.sellEndTime = this.sellDateRange === null ? null : this.sellDateRange[1]
            }
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/platform/card/page'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            current: page == null ? this.page.currentPage : page.currentPage,
                            size: page == null ? this.page.pageSize : page.pageSize,
                            // shopId: 0
                        },
                        this.theData
                    )
                )
            }).then(({data}) => {
                this.dataList = data.records
                this.page.total = data.total
                this.dataListLoading = false
                this.$nextTick(() => {
                    if (this.selectCards.length > 0) {
                        this.dataList.map(element => {
                            if (this.selectCards.map(item => item.cardId).indexOf(element.cardId) !== -1) {
                                this.$refs.activityTable.toggleRowSelection(element, true)
                            }
                        })
                    }
                })
            }).finally(() => {
                this.tableLoading = false
            })
        },
        addOrUpdateHandle (id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        deleteHandle (id) {
            if (!id) {
                return
            }
            this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('coupon.confirm'),
                cancelButtonText: this.$i18n.t('coupon.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/card'),
                    method: 'delete',
                    data: this.$http.adornData(id, false)
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
        changeStatusHandle (id, status) {
            this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${status == 4 ? '冻结该卡' : '解冻该卡'}${this.$i18n.t('sysManagement.operation')}`,
                this.$i18n.t('text.tips'), {
                    confirmButtonText: this.$i18n.t('coupon.confirm'),
                    cancelButtonText: this.$i18n.t('coupon.cancel'),
                    type: 'warning'
                }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/card/unfreezeCard'),
                    method: 'post',
                    data: this.$http.adornData({
                      cardId:cardId
                    })
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
        // 单卡出售
        sellCard (id, status) {
            if (status === 0) {
                this.$message.warning('请先制卡(券)！')
                return
            }
            this.$http({
                url: this.$http.adornUrl('/platform/card'),
                method: 'put',
                data: this.$http.adornData({cardId: id, status: 2})
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
        },
        // 单卡充值
        rechargeCard (id) {
            this.rechargeShow = true
            this.cardId = id
            this.balance = 0
        },
        // 充值确定
        rechargeConfirm () {
            this.$http({
                url: this.$http.adornUrl('/platform/card'),
                method: 'put',
                data: this.$http.adornData({cardId: this.cardId, balance: this.balance})
            }).then(({data}) => {
                this.rechargeShow = false
                this.$message({
                    message: this.$i18n.t('publics.operation'),
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                        this.refreshChange()
                    }
                })
            })
        },
        //解冻
        unfreeze(cardId){
            this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}'解冻该卡'${this.$i18n.t('sysManagement.operation')}`,
            this.$i18n.t('text.tips'), {
                confirmButtonText: this.$i18n.t('coupon.confirm'),
                cancelButtonText: this.$i18n.t('coupon.cancel'),
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/platform/card/unfreezeCard'),
                    method: 'post',
                    data: this.$http.adornData({cardId: cardId})
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
        useHandle (cardCode) {
            this.cardUseVisible = true
            this.$refs.cardUseList.initData(cardCode)
        },
        // 条件查询
        searchChange (newData = false) {
            this.page.currentPage = 1
            this.getDataList(this.page, newData)
        },
        /**
         * 重置表单
         * @param {String} formName 表单名称
         */
        resetSearchForm (formName) {
            this.$refs[formName].resetFields()
            this.launchDateRange = null
            this.sellDateRange = null
            this.searchForm = {}
        },
        // 获取批次号
        getBatchNum () {
            this.$http({
                url: this.$http.adornUrl('/platform/card/queryBatchNumList'),
                method: 'get',
                params: this.$http.adornParams({})
            }).then(({data}) => {
                if(data){
                    this.batchNumList = data.reverse();
                }
            })
        },
        init () {
            this.getTypeData()
            this.getShopList()
            this.getDataList()
            this.getBatchNum()
        },
        downLoadImg () {
            const loading = this.$loading({
                lock: true,
                target: '.cardManage',
                customClass: 'export-load',
                background: 'transparent',
                text: "数据导出中......"
            })

            this.$http({
                url: this.$http.adornUrl('/platform/card/downLoadCardImg'),
                method: 'GET',
                params: this.$http.adornParams(
                    Object.assign({
                        'startTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
                        'endTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
                    },this.searchForm)
                ),
                responseType: 'blob'
            }).then(res => {
                console.log(res.data)
                loading.close()

                 fileDownload(res.data, '图片导出_'+ formatDate(new Date(), "yyyy-MM-dd") +'.zip')

                this.$message({
                    message: "导出成功",
                    type: 'success',
                    duration: 1500,
                    onClose: () => {

                    }
                })
            }).catch((e) => {
                console.error(e)
                loading.close()
            })
        },
        downLoadExcel() {
            const loading = this.$loading({
                lock: true,
                target: '.cardManage',
                customClass: 'export-load',
                background: 'transparent',
                text: "数据导出中......"
            })

            this.$http({
                url: this.$http.adornUrl('/platform/card/downLoadCardData'),
                method: 'GET',
                params: this.$http.adornParams(
                    Object.assign({
                        'startTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
                        'endTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
                    },this.searchForm)
                ),
                responseType: 'blob'
            }).then(res => {
                console.log(res.data)
                loading.close()

                fileDownload(res.data, '提货卡导出_'+ formatDate(new Date(), "yyyy-MM-dd") +'.xlsx')

                this.$message({
                    message: "导出成功",
                    type: 'success',
                    duration: 1500,
                    onClose: () => {

                    }
                })
            }).catch((e) => {
                console.error(e)
                loading.close()
            })
        },
        //导出提货卡/券记录
        downLoadCard(){
            const loading = this.$loading({
                lock: true,
                target: '.cardManage',
                customClass: 'export-load',
                background: 'transparent',
                text: "数据导出中......"
            })

            this.$http({
                url: this.$http.adornUrl('/platform/card/downLoadCardRecord'),
                method: 'GET',
                params: this.$http.adornParams(
                    Object.assign({
                        'startTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
                        'endTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
                        'sellStartTime': this.sellDateRange === null ? null : this.sellDateRange[0], // 开始时间
                        'sellEndTime': this.sellDateRange === null ? null : this.sellDateRange[1], // 结束时间
                    },this.searchForm)
                ),
                responseType: 'blob'
            }).then(({data}) => {
                loading.close()
                let fileName = "提货卡/券记录数据.xlsx";
                let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
                const elink = document.createElement('a')
                if ('download' in elink) {
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else {
                    navigator.msSaveBlob(blob, fileName)
                }
                this.$message({
                    message: "导出成功",
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                    }
                })
          }).catch((e) => {
                loading.close()
          })
        }
    },
}
</script>

<style scoped>

</style>
