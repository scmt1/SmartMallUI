<template>
  <el-dialog :title="this.$i18n.t('groups.GroupActivityInfo')"
             width="40%"
             :close-on-click-modal="false"
             :visible.sync="dialogTableVisible">
    <div class="mod-groupActivity-info">
      <el-form :model="dataForm" ref="dataForm" label-width="auto" size="small" class="form-box">
        <el-form-item :label="this.$i18n.t('groups.eventName')">
          <span class="table-cell-text line-clamp-one">{{ dataForm.activityName }}</span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('group.actStartTime')">
          <span class="table-cell-text line-clamp-one">{{ dataForm.startTime }}</span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('groups.eventEndTime')">
          <span class="table-cell-text line-clamp-one">{{ dataForm.endTime }}</span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('group.groupNum')">
          <span class="table-cell-text line-clamp-one">
            {{ dataForm.groupNumber }}
            <template slot="append">{{ $t("groups.people") }}</template>
          </span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('groups.groupValidityPeriod')">
          <span class="table-cell-text line-clamp-one">
            {{ dataForm.groupValidTime }}
            <template slot="append">{{ $t("groups.minute") }}</template>
          </span>
          <el-tooltip class="item" effect="dark" :content="this.$i18n.t('groups.tip4')" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('groups.limitPurchase')">
          <span class="table-cell-text line-clamp-one" v-if="dataForm.hasMaxNum === 0">{{ $t('station.close') }}</span>
          <span class="table-cell-text line-clamp-one" v-if="dataForm.hasMaxNum === 1">{{ $t('groups.turnOn') }}</span>
        </el-form-item>
        <el-form-item v-if="dataForm.hasMaxNum" :label="this.$i18n.t('product.maxNum')">
          <span class="table-cell-text line-clamp-one">
            {{ dataForm.maxNum }}
            <template slot="append">{{ $t("groups.memberPeople") }}</template>
          </span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('groups.simulation')">
          <div>
            <span class="table-cell-text line-clamp-one" v-if="dataForm.hasRobot === 0">{{ $t('station.close') }}</span>
            <span class="table-cell-text line-clamp-one" v-if="dataForm.hasRobot === 1">{{ $t('groups.turnOn') }}</span>
          </div>
        </el-form-item>
        <!-- 团长优惠 已废弃 -->
        <!-- <el-form-item :label="this.$i18n.t('groups.groupLeaderOffer')">
          <span class="table-cell-text line-clamp-one" v-if="dataForm.hasLeaderPrice === 0">{{ $t('station.close') }}</span>
          <span class="table-cell-text line-clamp-one" v-if="dataForm.hasLeaderPrice === 1">{{ $t('groups.turnOn') }}</span>
        </el-form-item> -->
        <el-form-item :label="this.$i18n.t('groups.groupMode')">
          <span class="table-cell-text line-clamp-one" v-if="dataForm.hasGroupTip === 0">{{ $t('station.close') }}</span>
          <span class="table-cell-text line-clamp-one" v-if="dataForm.hasGroupTip === 1">{{ $t('groups.turnOn') }}</span>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('groups.activityWarmUp')">
          <span class="table-cell-text line-clamp-one" v-if="dataForm.isPreheat === 0">{{ $t('station.close') }}</span>
          <span class="table-cell-text line-clamp-one" v-if="dataForm.isPreheat === 1">{{ $t('groups.turnOn') }}</span>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'GroupActivityInfo',
  data () {
    return {
      dataForm: {
        groupActivityId: null,
        shopId: null,
        activityName: null,
        status: null,
        startTime: null,
        endTime: null,
        groupValidTime: null,
        groupNumber: null,
        hasMaxNum: 0,
        maxNum: null,
        hasRobot: 0,
        hasLeaderPrice: 0,
        isPreheat: 0,
        hasGroupTip: 0,
        groupOrderCount: null,
        groupNumberCount: null,
        createTime: null,
        updateTime: null,
        groupProds: [],
        validEndTime: []
      },
      dialogTableVisible: false
    }
  },
  components: {
  },
  methods: {
    init (groupActivityId) {
      this.dialogTableVisible = true
      this.$nextTick(() => {
        if (groupActivityId) {
          this.$http({
            url: this.$http.adornUrl('/group/activity/info/' + groupActivityId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
</style>
