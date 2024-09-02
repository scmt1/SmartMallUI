<template>
  <div class="container">
    <div class="basicInfo-container">
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="auto" label-position="right">
        <span class="title">{{$t("product.basicInformation") }}</span>
        <el-divider/>
        <el-form-item :label="$t('takeStock.createTime')" prop="createTime">
          <el-date-picker v-model="dataForm.createTime" type="datetime" :placeholder="this.$i18n.t('admin.seleData')"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('takeStock.regionName')" prop="stockRegionName">
          <el-input style="width: 30%" size="small" type="text" show-word-limit maxlength="20" v-model="dataForm.stockRegionName" :placeholder="$t('takeStock.regionName')"/>
          <el-tooltip class="item" effect="dark" :content="$t('takeStock.regionNameTip')" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('publics.remark')" prop="remark">
          <el-input style="width: 30%" type="textarea" size="small" show-word-limit maxlength="200" :autosize="{ minRows: 2, maxRows: 5 }"
                    :placeholder="$t('product.content')" v-model="dataForm.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="foot-btn">
      <div class="default-btn primary-btn" v-if="isAuth('multishop:takeStock:save')" @click="confirmSave(1)">{{$t('takeStock.editInventory')}}</div>
      <div class="default-btn" @click="confirmSave(2)">{{$t("resource.cancel")}}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { validNoEmptySpace } from '@/utils/validate'
export default {
  components: {},
  data () {
    let validateStockRegionName = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    let validateRemark = (rule, value, callback) => {
      if (validNoEmptySpace(value)) {
        callback(new Error(this.$i18n.t('shopProcess.inputAllSpace')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        createTime: moment().add('days').startOf('days').format('LL'), // 盘点开始时间
        stockRegionName: '', // 盘点区域名称
        remark: '' // 备注
      },
      dataRule: {
        createTime: [
          {
            type: 'string',
            required: true,
            message: this.$i18n.t('takeStock.createTimeNotNull'),
            trigger: 'change'
          }
        ],
        stockRegionName: [
          { validator: validateStockRegionName, trigger: 'blur' }
        ],
        remark: [
          { validator: validateRemark, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {},
  methods: {
    confirmSave (status) {
      if (status === 1) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/stock/takeStock'),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({ data }) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500
              })
              this.$router.push({
                path: 'stock-edit-take-stock',
                query: {
                  takeStockId: data
                }
              })
            })
          }
        })
      } else if (status === 2) {
        this.$router.push({
          path: 'stock-takeStock',
          query: {}
        })
      }
    }
  }
}
</script>
<style lang="scss">
.container {
  .basicInfo-container {
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
    }
  }
  /* 脚部按钮 */
  .foot-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    background: #fff;
    // border-top: 1px solid #ddd;
    box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
    z-index: 1999;
  }
}
</style>
<style scoped>
>>> .el-input__count {
  bottom: -40px;
}
</style>
