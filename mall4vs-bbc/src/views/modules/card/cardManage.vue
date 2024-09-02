<template>
    <div class="cardManage">
        <div class="main-container">
            <!-- 搜索栏 -->
            <div class="search-bar">
                <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                    <div class="input-row">
<!--                        <el-form-item label="批次号" class="search-form-item">-->
<!--                            <el-select filterable v-model="searchForm.batchNumber" placeholder="请选择" style="width: 100%">-->
<!--                                <el-option :label="item" :value="item" v-for="(item,index) in batchNumList" :key="index"></el-option>-->
<!--                            </el-select>-->
<!--                        </el-form-item>-->
                        <el-form-item label="名称" class="search-form-item">
                            <el-input type="text" v-model="searchForm.cardTitle" placeholder="请输入关键字"></el-input>
                        </el-form-item>
                        <el-form-item label="卡号" class="search-form-item">
                            <el-input type="text" v-model="searchForm.cardCode" placeholder="请输入卡号"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" class="search-form-item">
                            <el-select filterable v-model="searchForm.status" placeholder="请选择" style="width: 100%">
                                <el-option label="已失效" :value="-1"></el-option>
                                <el-option label="未制卡(券)" :value="0"></el-option>
                                <el-option label="未出售" :value="1"></el-option>
                                <el-option label="已出售" :value="2"></el-option>
                                <el-option label="已绑定" :value="3"></el-option>
                                <el-option label="已冻结" :value="4"></el-option>
                                <el-option label="已置换" :value="5"></el-option>
                                <el-option label="已核销" :value="6"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类型" class="search-form-item">
                            <el-select filterable v-model="searchForm.cardType" placeholder="请选择类型" style="width: 100%">
                                <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间" label-width="70px">
                            <el-date-picker
                                    v-model="launchDateRange"
                                    type="datetimerange"
                                    :range-separator="$t('time.tip')"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :start-placeholder="$t('time.start')"
                                    :end-placeholder="$t('time.end')"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                            <div class="default-btn" @click="resetSearchForm('searchForm')">重置</div>
<!--                            <div class="default-btn primary-btn" @click.stop="addOrUpdateHandle()">新增</div>-->
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="activityTable" @selection-change="handleSelectionChange" v-loading="tableLoading" :data="dataList" header-cell-class-name="table-header" row-class-name="table-row-low" style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
<!--                    <el-table-column prop="title" label="提货卡(券)图片" min-width="120">-->
<!--                        <template slot-scope="scope">-->
<!--                            <img v-if="scope.row.cardImg" :src="resourcesUrl + scope.row.cardImg" width="100px">-->
<!--                            <img v-else src="~@/assets/img/def.png" width="100px">-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column prop="cardTitle" label="卡名称" min-width="110">
                    </el-table-column>
<!--                    <el-table-column prop="batchNumber" label="批次号" min-width="100">-->
<!--                    </el-table-column>-->
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
                        </template>
                    </el-table-column>
                    <el-table-column prop="balance" label="卡金额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="remainingAmount" label="卡余额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="cardCode" label="卡号" min-width="120">
                    </el-table-column>
                    <el-table-column label="有效期" min-width="160">
                        <template slot-scope="scope" v-if="scope.row.userStartTime && scope.row.userEndTime">
                            {{ scope.row.userStartTime }} 到 {{ scope.row.userEndTime }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardType" label="卡类别" min-width="110">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark">{{cardTypeList.find(item => item.value == scope.row.cardType)
                                .title}}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column fixed="right" align="center" :label="$t('publics.operating')" width="150">
                        <template slot-scope="scope">
                            <div class="text-btn-con" style="display: inline-block;">
<!--                                <div class="default-btn text-btn" @click.stop="addOrUpdateHandle(scope.row.cardId)">-->
<!--                                    修改-->
<!--                                </div>-->
                                <div class="default-btn text-btn" v-if="scope.row.status === 0" @click.stop="deleteHandle(scope.row.cardId)">
                                    删除
                                </div>
                                <div class="default-btn text-btn" v-if="scope.row.status === 4" @click.stop="changeStatusHandle(scope.row.cardId, scope.row.batchStatus)">
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
        <card-use-list  v-if="cardUseVisible" ref="cardUseList"></card-use-list>
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
  export default {
    name: 'cardManage',
    components: {CardUseList, AddOrUpdate},
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
        cardTypeList: [],
        launchDateRange: null,
        batchNumList:[],
        btnType:"", // 1 出售 2 充值 3 冻结 4 已制卡
        balance:0,
        rechargeShow:false,
        cardId:0,
        cardIds:[],//卡ids
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.cardIds = val.map(item => item.cardId);
      },
      // 冻结
      freeze(){
        if(this.cardIds.length < 1){
          this.$message.warning("请先勾选提货卡(券)！");
          return
        }
        this.$confirm("确定执行 [冻结] 操作？", this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/card/freezeCardByCardIds'),
            method: 'post',
            data:  this.$http.adornData({
              cardIds: this.cardIds
            })
          }).then(({data}) => {
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
      /**
       * 消费金额最低要求检验
       */
      balanceChange () {
        let balance = this.balance
        this.balance = balance <= 0 ? 0.01 : balance
        this.balance = balance > 9999999999999 ? 9999999999999 : balance
      },
      // 获取类型
      getTypeData () {
        let type = 'card_type'
        this.$http({
          url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.cardTypeList = data
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
        this.getBatchNum();
        this.getDataList(this.page)
      },
      // 获取数据列表
      getDataList (page, newData = false) {
        this.tableLoading = true
        if (newData || !this.theData) {
          this.theData = JSON.parse(JSON.stringify(this.searchForm))
          this.theData.startTime = this.launchDateRange === null ? null : this.launchDateRange[0]
          this.theData.endTime = this.launchDateRange === null ? null : this.launchDateRange[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/admin/card/page'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize,
              },
              this.theData
            )
          )
        }).then(({data}) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
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
        this.$confirm("确定进行 [删除] 操作？", this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/card'),
            method: 'delete',
            data:  this.$http.adornData(id, false)
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
      changeStatusHandle(id, status) {
        this.$confirm("确定 [" + `${status == 4 ? '冻结该卡' : '解冻该卡'}` + "] 操作",
          this.$i18n.t('text.tips'), {
            confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
            cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
            type: 'warning'
          }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/card'),
            method: 'put',
            data:  this.$http.adornData({cardId: id, status: status})
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
      sellCard(id,status){
        if(status === 0){
          this.$message.warning("请先制卡(券)！");
          return
        }
        this.$http({
          url: this.$http.adornUrl('/admin/card'),
          method: 'put',
          data:  this.$http.adornData({cardId: id, status: 2,batchStatus: 2})
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
      rechargeCard(id){
        this.rechargeShow = true;
        this.cardId = id;
        this.balance = 0;
      },
      // 充值确定
      rechargeConfirm(){
        this.$http({
          url: this.$http.adornUrl('/admin/card'),
          method: 'put',
          data:  this.$http.adornData({cardId: this.cardId, balance: this.balance})
        }).then(({data}) => {
          this.rechargeShow = false;
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
      useHandle(cardCode) {
        this.cardUseVisible = true;
        this.$refs.cardUseList.initData(cardCode);
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
        this.searchForm = {}
      },
      // 获取批次号
      getBatchNum(){
        this.$http({
          url: this.$http.adornUrl('/admin/card/queryBatchNumList'),
          method: 'get',
          params:  this.$http.adornParams({})
        }).then(({data}) => {
          this.batchNumList = data;
        })
      },
      init(){
        this.getTypeData();
        this.getDataList();
        this.getBatchNum();
      }
    },
  }
</script>

<style scoped>

</style>
