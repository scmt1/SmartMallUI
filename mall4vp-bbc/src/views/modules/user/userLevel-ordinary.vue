<template>
  <div class="distribution-level-set1 bottom-redius">
    <div class="main-container">
      <div class="operation-bar">
        <div class="default-btn primary-btn" :class="{'disabled-btn': this.maxNeedGrowth === 1000000000}" @click.stop="addRow()">
          {{ $t("user.addLevel") }}
          <el-tooltip effect="light">
            <div slot="content" style="max-width:500px">{{$t("user.addLevelTip")}}</div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div
          class="default-btn"
          @click="updateUserLevel"
          v-if="isUpdateData"
        >{{$t('user.updateUserData')}}</div>
        <el-tag class="operation-tag" type="warning" v-if="isUpdateData">{{$t('user.updateSoon')}}</el-tag>
      </div>
      <!-- <el-checkbox v-model="dataForm.levelSetConditionsSwitch.boundCustomers">绑定客户数</el-checkbox>
      <el-checkbox v-model="dataForm.levelSetConditionsSwitch.invitedVeeker">邀请分销员数</el-checkbox>-->
      <div class="table-con">
        <el-table
          :data="dataForm.userLevels"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          class="level-table"
        >
          <el-table-column prop="level" fixed :label="$t('distribution.grade')" width="100">
            <template slot-scope="scope">
              <span class="table-cell-text">{{scope.row.level}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="levelName" fixed :label="$t('user.levelName')">
            <template slot-scope="scope">
              <span class="table-cell-text">{{scope.row.levelName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="img" fixed :label="$t('user.bgImg')">
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="resourcesUrl + scope.row.img" width="140" height="60" v-if="scope.row.img" />
                <span style="line-height: 60px" v-if="!scope.row.img">{{$t('prodList.noPictures')}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="presScore" fixed :label="$t('user.bonusPoints')">
            <template slot-scope="scope">
                <span class="table-cell-text">{{scope.row.presScore}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="needGrowth" :label="$t('user.growthRange')">
            <template slot-scope="scope">
              <div>
                <span>{{scope.row.needGrowth}}</span>
                <span v-if="scope.$index < dataForm.userLevels.length-1">~</span>
                <span
                  v-if="scope.$index < dataForm.userLevels.length-1"
                >{{dataForm.userLevels[scope.$index+1].needGrowth-1}}</span>
                <span v-if="scope.$index === dataForm.userLevels.length-1">~ ∞</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="prodId" label="赠送优惠券" align="center" min-width="80px" fit>
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.couponList" :key="index">
                <span
                  v-if="index < 1"
                >{{item.couponName}} {{scope.row.couponList.length>1?'等优惠券':''}}</span>
              </div>
            </template>
          </el-table-column>-->
          <el-table-column
            prop="discountRange"
            :label="$t('user.memberDiscount')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.discount==10">{{$t('chat.none')}}</span>
              <span v-else>
                <!-- {{scope.row.term}}
                {{scope.row.termType === 1?'天':scope.row.termType === 2?'周':scope.row.termType === 3?'月':scope.row.termType === 4?'季度':'年'}}内-->
                {{scope.row.discountRange === 1? $t('user.selfShop') : $t('user.platform')}}
                {{scope.row.discountType === 1? $t('user.someProducts') : $t('user.allProducts')}}
                {{scope.row.discount}}{{$t('coupon.off')}}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" :label="$t('crud.menu')" width="150">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  @click="addOrUpdateHandle(scope.$index)"
                  class="text-btn default-btn"
                >{{scope.$index+1 > maxLength ? $t('sysManagement.save') : $t('coupon.edit')}}</div>
                <div
                  @click="deleteRow(scope.$index)"
                  class="text-btn default-btn"
                  v-if="scope.$index === dataForm.userLevels.length -1 && scope.$index !== 0"
                >{{$t('user.remove')}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 商品选择弹窗-->
    <!-- <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      @refreshSelectProds="selectDistributionProds"
    ></prods-select>-->
    <!-- 优惠券选择弹窗-->
    <coupon-select
      v-if="couponSelectVisible"
      ref="couponSelect"
      @refreshSelectCouponList="selectDistributionCoupon"
    ></coupon-select>
    <user-level-update
      v-if="userLevelUpdateVisible"
      ref="userLevelUpdate"
      @refreshUserLevelUpdate="selectDistributionDiscount"
    ></user-level-update>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getData"></add-or-update>
  </div>
</template>

<script>
// import ProdsSelect from '@/components/prods-select'
import CouponSelect from '@/components/coupon-select'
import AddOrUpdate from './userLevel-add-or-update'
export default {
  components: {
    // ProdsSelect,
    CouponSelect,
    AddOrUpdate
  },
  created () {
    this.getData()
  },
  data () {
    return {
      index: 0,
      prodsSelectVisible: false,
      couponSelectVisible: false,
      userLevelUpdateVisible: false,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataForm: {
        parentId: null,
        id: null,
        levelType: 0,
        userLevels: []
      },
      maxLength: 0,
      maxNeedGrowth: 0,
      isUpdateData: false,
      userLevel: [
        {
          id: null,
          level: 0,
          levelName: '',
          levelType: 0,
          needGrowth: 0,
          term: 1,
          termType: 3,
          img: '',
          discount: 10,
          discountRange: 0,
          discountType: 0,
          presScore: 0,
          rateScore: 1,
          isFreeFee: 0,
          couponList: [],
          userRightsIds: [],
          categorys: null
        }
      ]
    }
  },
  methods: {
    // 获取数据
    getData () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userLevel/list'),
        method: 'get',
        params: this.$http.adornParams({
          userLevelType: 0
        })
      }).then(({ data }) => {
        this.dataForm.userLevels = data
        this.maxLength = data.length
        this.dataForm.userLevels.forEach(item => {
          if (item.status === -1) {
            this.isUpdateData = true
          }
          this.maxNeedGrowth = item.needGrowth
        })
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    },
    // 新增 / 修改
    addOrUpdateHandle (index) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(this.dataForm.userLevels, index)
      })
    },
    // 删除列
    deleteRow (index) {
      // var bool = true
      // for (var i = 0; i < this.dataForm.userLevels.length; i++) {
      //   if (i === index && bool) {
      //     this.dataForm.userLevels.splice(index, 1)
      //     bool = false
      //     i--
      //   } else if (i < index) {
      //   } else {
      //     this.dataForm.userLevels[i].level = i + 1
      //   }
      // }

      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        // if (this.dataForm.userLevels.length === 2) {
        //   this.errorMsg('最后一个会员等级不能删除')
        // }
        this.dataForm.id = this.dataForm.userLevels[index].id
        // 删除列并更新数据
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/userLevel`),
            method: 'delete',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.isUpdateData = false
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500
            })
            this.getData()
          }).catch(() => { })
        } else {
          this.getData()
        }
      }).catch(() => { })
    },
    // 增加列
    addRow: function () {
      if (this.maxNeedGrowth >= 1000000000) {
        return
      }
      if (this.dataForm.userLevels.length >= 50) {
        this.$message({
          message: this.$i18n.t('user.atMost'),
          type: 'warning'
        })
        return
      }
      if (this.dataForm.userLevels.length > this.maxLength) {
        this.$message({
          message: this.$i18n.t('user.saveFirst'),
          type: 'warning'
        })
        return
      }
      var needGrowth = 0
      if (this.dataForm.userLevels.length > 0) {
        needGrowth = this.dataForm.id = this.dataForm.userLevels[this.maxLength - 1].needGrowth === 1000000000 ? 1000000000 : this.dataForm.userLevels[this.maxLength - 1].needGrowth + 1
      }
      var level = JSON.parse(JSON.stringify(this.userLevel[0]))
      level.levelId = null
      level.level = this.dataForm.userLevels.length + 1
      // if (level.conditionData.commodity) {
      //   level.conditionData.commodity = []
      // }
      let levelNum = parseInt(this.dataForm.userLevels.length) + 1
      level.levelName = this.$i18n.t('user.membershipLevel') + levelNum
      this.dataForm.userLevels.push(level)
      this.dataForm.userLevels[this.maxLength].needGrowth = needGrowth
      this.addOrUpdateHandle(this.dataForm.userLevels.length - 1)
    },
    updateUserLevel () {
      this.$http({
        url: this.$http.adornUrl('/user/userLevel/updateUserLevel'),
        method: 'put',
        data: this.$http.adornData({
          levelType: 0
        })
      }).then(({ data }) => {
        location.reload()
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.distribution-level-set1 {
  .operation-bar {
    margin-top: 5px;
    .operation-tag {
      margin-left: 20px;
    }
  }
}
</style>
