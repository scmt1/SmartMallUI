<template>
  <!-- <div>
    <el-tabs class="tabs" v-model="activeName">
      <el-tab-pane :label="this.$i18n.t('webInfoConfig.platformSideConfiguration')" name="webConfigBs">
        <webConfigBs v-if="activeName === 'webConfigBs'"></webConfigBs>
      </el-tab-pane>
      <el-tab-pane :label="this.$i18n.t('webInfoConfig.merchantSideConfiguration')" name="webConfigShop">
        <webConfigShop v-if="activeName === 'webConfigShop'"></webConfigShop>
      </el-tab-pane>
      <el-tab-pane :label="this.$i18n.t('webInfoConfig.pcConfiguration')" name="webConfigPc">
        <webConfigPc v-if="activeName === 'webConfigPc'"></webConfigPc>
      </el-tab-pane>
      <el-tab-pane :label="this.$i18n.t('webInfoConfig.h5Configuration')" name="webConfigUni">
        <webConfigUni v-if="activeName === 'webConfigUni'"></webConfigUni>
      </el-tab-pane>
      <el-tab-pane :label="this.$i18n.t('webInfoConfig.stationConfiguration')" name="webConfigStation">
        <webConfigStation v-if="activeName === 'webConfigStation'"></webConfigStation>
      </el-tab-pane>
    </el-tabs>
  </div> -->
  <div class="app-container">
    <div class="main-content">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane :label="$t('webInfoConfig.platformSideConfiguration')" name="webConfigBs">
          <!-- <webConfigBs v-if="activeName === 'webConfigBs'" /> -->
          <add-or-update paramKey='PLATFROM_WEBSITE_CONFIG' remark='平台端网站配置' v-if="activeName === 'webConfigBs'"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('webInfoConfig.merchantSideConfiguration')" name="webConfigShop">
          <!-- <webConfigShop v-if="activeName === 'webConfigShop'" /> -->
          <add-or-update paramKey='MULTISHOP_WEBSITE_CONFIG' remark='商家端网站配置' v-if="activeName === 'webConfigShop'"/>
        </el-tab-pane>
        <el-tab-pane :label="this.$i18n.t('webInfoConfig.pcConfiguration')" name="webConfigPc">
          <!-- <webConfigPc v-if="activeName === 'webConfigPc'" /> -->
          <add-or-update paramKey='PC_WEBSITE_CONFIG' remark='PC端网站配置' v-if="activeName === 'webConfigPc'"/>
        </el-tab-pane>
        <el-tab-pane :label="this.$i18n.t('webInfoConfig.h5Configuration')" name="webConfigUni">
          <!-- <webConfigUni v-if="activeName === 'webConfigUni'" /> -->
          <add-or-update paramKey='H5_WEBSITE_CONFIG' remark='H5端网站配置' v-if="activeName === 'webConfigUni'"/>
        </el-tab-pane>
        <el-tab-pane :label="this.$i18n.t('webInfoConfig.stationConfiguration')" name="webConfigStation">
          <!-- <webConfigStation v-if="activeName === 'webConfigStation'" /> -->
          <add-or-update paramKey='STATION_WEBSITE_CONFIG' remark='门店端网站配置' v-if="activeName === 'webConfigStation'"/>
        </el-tab-pane>
        <el-tab-pane :label="$t('webInfoConfig.cashierSideConfiguration')" name="webConfigCashier">
          <add-or-update paramKey='CASHIER_WEBSITE_CONFIG' remark='收银台网站配置' v-if="activeName === 'webConfigCashier'"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import webConfigBs from './webConfig-bs'
// import webConfigShop from './webConfig-shop'
// import webConfigPc from './webConfig-pc'
// import webConfigUni from './webConfig-uni'
// import webConfigStation from './webConfig-station'
import AddOrUpdate from './webConfig-add-or-update'

export default {
  data () {
    return {
      showTab: true,
      activeName: 'webConfigBs'
    }
  },
  components: {
    // webConfigBs,
    // webConfigPc,
    // webConfigUni,
    // webConfigShop,
    // webConfigStation
    AddOrUpdate
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
  div{
    /* margin-bottom: 150px; */
  }
</style>
