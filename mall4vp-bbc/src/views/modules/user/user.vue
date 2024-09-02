<template>
  <div class="mod-user">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="nickName" :label="$t('users.name') + ':'">
            <el-input v-model="searchForm.nickName" type="text" clearable  :placeholder="$t('users.name')"></el-input>
          </el-form-item>
          <el-form-item prop="userMobile" :label="$t('publics.mobilePhone') + ':'">
            <el-input v-model="searchForm.userMobile" type="text" clearable maxlength="11" :placeholder="$t('publics.mobilePhone')"></el-input>
          </el-form-item>
          <el-form-item prop="levelType" :label="$t('user.memberType') + ':'">
            <el-cascader
                ref="memberCascader"
                v-model="memberLevelVal"
                :options="levelTypes"
                :props="{ checkStrictly: true }"
                clearable
                @change="handleMemberTypeChange"
              />
          </el-form-item>
          <el-form-item prop="status" :label="$t('publics.status') + ':'">
            <el-select v-model="searchForm.status" clearable  :placeholder="$t('publics.status')">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <p/>
          <p>
            <el-form-item :label="$t('user.registrationTime')+':'">
              <el-date-picker
                size="small"
                v-model="createDateRange"
                type="datetimerange"
                :range-separator="$t('date.tip')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :start-placeholder="$t('text.startTime')"
                :end-placeholder="$t('date.end')"
                @change="createTimeChange"
              ></el-date-picker>
            </el-form-item>
          </p>
          <el-form-item :label="$t('user.customerLabel') + ':'" prop="dynamicTags">
            <!-- <el-button style="width: 50px;margin-left: 20px"></el-button> -->
            <div class="default-btn TagS" @click="clearAllTags"
            >{{$t('seckill.unlimited')}}</div>
            <el-tag
              v-for="tag in dynamicTags"
              class="TagS"
              :key="tag.userTagId"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{tag.tagName}}</el-tag>
            <div class="default-btn button-new-tag" @click="selectUserTags()">{{$t('platform.add')}}</div>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div
            v-if="isAuth('user:userLevel:updateGrowth')"
            class="primary-btn default-btn"
            :class="{'disabled-btn': dataListSelections.length <= 0}"
            @click="updateGrowth()"
          >{{$t('user.updateGrowth')}}</div>
          <div
            class="primary-btn default-btn"
            @click="updateTags()"
            :class="{'disabled-btn': dataListSelections.length <= 0}"
          >{{$t('user.tagging')}}</div>
          <div
            v-if="isAuth('user:userLevel:updateScore')"
            class="primary-btn default-btn"
            @click="updateScore()"
            :class="{'disabled-btn': dataListSelections.length <= 0}"
          >{{$t('user.updateScore')}}</div>
          <div
            v-if="isAuth('platform:coupon:sendUserCoupon')"
            class="primary-btn default-btn"
            @click="updateCoupon()"
            :class="{'disabled-btn': dataListSelections.length <= 0}"
          >{{$t('user.sendCoupons')}}</div>
          <div
            v-if="isAuth('platform:user:updateBalance')"
            class="primary-btn default-btn"
            @click="updateBalance(null,1)"
            :class="{'disabled-btn': dataListSelections.length <= 0}"
          >{{$t('user.modifyBalance')}}</div>
          <div
            v-if="isAuth('platform:user:import')"
            class="primary-btn default-btn"
            @click="importUser()"
            :disabled="importDisabled"
          >{{$t('user.userImport')}}</div>
          <div
            class="primary-btn default-btn"
            @click="exportUser()"
            :disabled="exportDisabled"
          >{{$t('user.export')}}</div>
      </div>
      <div class="table-con">
          <div v-if="dataList.length === 0" class="empty-text">{{$t('user.noData')}}</div>
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
            @selection-change="selectionChange"
          >
            <el-table-column
              fixed
              type="selection"
              width="60">
            </el-table-column>
            <el-table-column
              fixed
              :label="$t('users.name')"
              prop="nickName"
              align="left"
              width="120"
            />
            <el-table-column
              fixed
              prop="pic"
              :label="$t('publics.profilePicture')"
            >
              <template slot-scope="scope">
                <div class="table-cell-image">
                  <img src="~@/assets/img/userImg.jpg" v-if="!scope.row.pic" width="130px" />
                  <img :src="scope.row.pic" v-else />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="userMobile"
              width="120"
              :label="$t('publics.mobilePhone')"
            >
              <template slot-scope="scope">
                {{ scope.row.userMobile ? scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "暂无" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="levelName"
              width="120"
              :label="$t('user.membershipLevel')"
            />
            <el-table-column
              prop="levelType"
              width="120"
              :label="$t('user.memberType')"
            >
              <template slot-scope="scope">
                <span>{{[$t('user.ordinaryMember'),$t('user.paidMembership')][scope.row.levelType]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="growth"
              width="120"
              :label="$t('user.growth')"
            />
            <el-table-column
              prop="score"
              width="120"
              :label="$t('user.userScore')"
            />
            <el-table-column
              prop="sumScore"
              width="120"
              :label="$t('user.cumulativeScore')"
            />
            <el-table-column
              prop="status"
              width="120"
              :label="$t('publics.status')"
            >
              <template slot-scope="scope">
                <span>{{[$t('publics.disable'),$t('publics.normal')][scope.row.status]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              prop="userRegtime"
              :label="$t('user.registrationTime')"
            />
            <el-table-column
              width="150"
              prop="reConsTime"
              :label="$t('user.lastConsumptionTime')"
            />
            <el-table-column
              width="120"
              prop="consAmount"
              :label="$t('user.consumptionAmount')"
            />
            <el-table-column
              width="120"
              prop="actualAmount"
              :label="$t('user.actuallypaid')"
            />
            <el-table-column
              width="120"
              prop="consTimes"
              :label="$t('user.consumptionTimes')"
            />
            <el-table-column
              width="120"
              prop="averDiscount"
              :label="$t('user.averageDiscount')"
            />
            <el-table-column
              width="120"
              prop="rechargeAmount"
              :label="$t('user.rechargeAmount')"
            />
            <el-table-column
              width="120"
              prop="rechargeTimes"
              :label="$t('user.rechargeTimes')"
            />
            <el-table-column
              width="120"
              prop="afterSaleAmount"
              :label="$t('home.refundAmount')"
            />
            <el-table-column
              width="120"
              prop="afterSaleTimes"
              :label="$t('user.refundTimes')"
            />
            <el-table-column
              width="120"
              prop="currentBalance"
              :label="$t('user.currentBalance')"
            />
            <el-table-column
              width="120"
              prop="sumBalance"
              :label="$t('user.cumulativeBalances')"
            />
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('crud.menu')"
              width="230"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                    class="text-btn default-btn"
                    v-if="isAuth('plateform:user:update')"
                    @click.stop="addOrUpdateHandle(scope.row.userId)"
                  >{{$t('coupon.edit')}}</div>
                  <div
                    class="default-btn text-btn"
                    v-if="isAuth('platform:user:updateBalance')"
                    @click.stop="updateBalance(scope.row.userId, 0, scope.row.currentBalance)"
                  >{{$t('user.modifyBalance')}}</div>
                </div>
              </template>
            </el-table-column>

            <div slot="empty">
              &nbsp;
            </div>
          </el-table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <update-growth v-if="updateGrowthVisible" ref="updateGrowth" @refreshDataList="refreshChange"></update-growth>
    <update-score v-if="updateScoreVisible" ref="updateScore" @refreshDataList="refreshChange"></update-score>
    <update-tags v-if="updateTagsVisible" ref="updateTags" @refreshDataList="refreshChange"></update-tags>
    <update-balance v-if="updateBalanceVisible" ref="updateBalance" @refreshDataList="refreshChange"></update-balance>
    <update-coupon v-if="updateCouponVisible" ref="updateCoupon" :getWay="1" @refreshDataList="refreshChange"></update-coupon>
    <import-user v-if="importUserVisible" ref="importUser" @refreshDataList="refreshChange"></import-user>

    <tags-select
      v-if="tagsSelectVisible"
      :limit="5"
      ref="tagsSelect"
      @refreshTagsArr="refreshTagsSelect"
    ></tags-select>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import UpdateGrowth from './update-user-growth'
import UpdateScore from './update-user-score'
import UpdateTags from './update-user-tags'
import UpdateBalance from './update-user-balance'
import UpdateCoupon from './update-user-copon'
import ImportUser from './excel-user-import'
import TagsSelect from '@/components/tags-select'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      dataListLoading: false,
      exportDisabled: false,
      importDisabled: false,
      tagsSelectVisible: false,
      updateBalanceVisible: false,
      updateCouponVisible: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      updateGrowthVisible: false,
      updateScoreVisible: false,
      updateTagsVisible: false,
      importUserVisible: false,
      createDateRange: [], // 注册时间范围
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dynamicTags: [],
      dynamicTagsAll: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        userTag: [],
        nickName: '',
        userMobile: '',
        levelType: '',
        // 会员等级
        level: '',
        status: null,
        userRegStartTime: null, // 注册起始时间
        userRegEndTime: null // 注册结束时间
      },
      levelTypes: [
        {
          label: this.$i18n.t('user.ordinaryMember'),
          value: 0,
          children: []
        }, {
          label: this.$i18n.t('user.paidMembership'),
          value: 1,
          children: []
        }
      ],
      memberLevelVal: '',
      status: [
        {
          label: this.$i18n.t('publics.disable'),
          value: 0
        }, {
          label: this.$i18n.t('publics.normal'),
          value: 1
        }
      ]
    }
  },
  components: {
    AddOrUpdate,
    UpdateGrowth,
    UpdateScore,
    UpdateTags,
    TagsSelect,
    UpdateCoupon,
    ImportUser,
    UpdateBalance
  },
  mounted () {
    this.getMemberLevelList()
    this.getDataList(this.page)
  },
  methods: {
    /**
     * 切换付费会员等级
     */
    handleMemberTypeChange (val) {
      this.searchForm.levelType = val[0]
      this.searchForm.level = val[1] || ''
      this.$refs.memberCascader.dropDownVisible = false
    },
    /**
     * 获取会员等级列表
     */
    getMemberLevelList () {
      for (let index = 0; index < 2; index++) {
        this.$http({
          url: this.$http.adornUrl('/user/userLevel/list'),
          method: 'get',
          params: this.$http.adornParams({
            userLevelType: index
          })
        }).then(({ data }) => {
          const children = []
          data.forEach(el => {
            children.push({
              value: el.level,
              label: el.levelName
            })
          })
          this.levelTypes[index].children = children
        })
      }
    },
    // 获取数据列表  /admin/user/page
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/user/userPage'),
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
      }).then(({ data }) => {
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
    // 条件查询 JSON.stringify(arr)
    searchChange (newData = false) {
      var arr = ''
      this.dynamicTags.forEach(item => {
        if (item.userTagId === this.dynamicTags[this.dynamicTags.length - 1].userTagId) {
          arr = arr + item.userTagId
          return
        }
        arr = arr + item.userTagId + ','
      })
      this.searchForm.tagIds = arr
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.clearAllTags()
      this.searchForm.userRegStartTime = null
      this.searchForm.userRegEndTime = null
      this.memberLevelVal = null
      this.createDateRange = []
    },
    createTimeChange () {
      if (!this.createDateRange || this.createDateRange.length === 0) {
        this.searchForm.userRegStartTime = null
        this.searchForm.userRegEndTime = null
      } else {
        this.searchForm.userRegStartTime = this.createDateRange[0]
        this.searchForm.userRegEndTime = this.createDateRange[1]
      }
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 修改成长值
    updateGrowth (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateGrowthVisible = true
      this.$nextTick(() => {
        this.$refs.updateGrowth.init(ids)
      })
    },
    // 修改成长值
    updateScore (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateScoreVisible = true
      this.$nextTick(() => {
        this.$refs.updateScore.init(ids)
      })
    },
    updateTags (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateTagsVisible = true
      this.$nextTick(() => {
        this.$refs.updateTags.init(ids)
      })
    },
    // type 1 批次充值 0修改余额
    updateBalance (id, type, balance) {
      if (this.dataListSelections.length <= 0 && type) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateBalanceVisible = true
      this.$nextTick(() => {
        this.$refs.updateBalance.init(ids, type, balance)
      })
    },
    updateCoupon (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateCouponVisible = true
      this.$nextTick(() => {
        this.$refs.updateCoupon.init(ids)
      })
    },
    // 移除标签单个选项 updateCoupon
    handleClose (tag) {
      this.dynamicTagsAll.splice(this.dynamicTags.indexOf(tag), 1)
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 选择客户标签
    selectUserTags () {
      this.tagsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.tagsSelect.init(this.dynamicTagsAll)
      })
    },
    // 清除所有标签
    clearAllTags () {
      this.dynamicTags = []
    },
    // 选择到的标签tagId
    refreshTagsSelect (data, allData) {
      this.clearAllTags()
      this.dynamicTags = data
      this.dynamicTagsAll = allData
      this.searchForm.userTag = data
    },
    searchReset () {
      this.clearAllTags()
    },
    //  选择指定列进行排序
    changeTableSort (column) {
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order
      this.searchForm.fieldName = fieldName
      this.searchForm.sortingType = sortingType
      this.$set(this.page, this.page)
      this.getDataList(this.page)
    },
    /**
     * 导入用户
     */
    importUser () {
      this.importUserVisible = true
      this.$nextTick(() => {
        this.$refs.importUser.init()
      })
    },
    /**
     * 导出单品
     */
    exportUser () {
      this.exportDisabled = true
      const loading = this.$loading({
        lock: true,
        target: '.table-con',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/admin/user/exportUser'),
        method: 'get',
        params: this.$http.adornParams(this.searchForm),
        responseType: 'blob' // 解决文件下载乱码问题
      }).then(({ data }) => {
        loading.close()
        this.exportDisabled = false
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('user.userInformationForm')
        const elink = document.createElement('a')
        if ('download' in elink) { // 非IE下载
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((e) => {
        loading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-user {
  .tips .text {
    color: #FF0000;
  }
 ::v-deep .el-table__fixed{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }
 ::v-deep .el-table__fixed-right{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }

}
 .TagS {
   margin-right: 10px !important;
 }

.table-con {
  position: relative;
}

 .empty-text {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  color: #909399;
 }
  ::v-deep .export-load {
    top: -50% !important;
  }


</style>

