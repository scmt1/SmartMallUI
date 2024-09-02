<template>
  <el-dialog
    :title="$t('shop.shopType')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      :label-width="this.$i18n.t('language') === 'language' ? '160px' : '100px'"
      style="width:500px;"
    >
<!--      <el-form-item :label="$t('prodList.shopName')" prop="shopName" style="width:500px;">-->
<!--        <el-input v-model="dataForm.shopName" disabled></el-input>-->
<!--      </el-form-item>-->
<!--      <br />-->
<!--      <el-form-item :label="$t('shop.shopAccount')" prop="mobile" style="width:580px;">-->
<!--        <el-row style="width:100%">-->
<!--          <el-col :span="20">-->
<!--            <el-input-->
<!--              v-model="dataForm.mobile"-->
<!--              maxlength="50"-->
<!--              show-word-limit-->
<!--              :placeholder="$t('shop.addShopErrorTip3')"-->
<!--              :disabled="true"-->
<!--            ></el-input>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-form-item>-->
<!--      <br />-->
      <!-- 店铺类型 -->
      <el-form-item :label="$t('shop.shopType')" prop="type" size="mini" style="width:500px;">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="0">{{$t('shop.generalStore')}}</el-radio>
          <el-radio :label="1">{{$t('shop.preferredStores')}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('remindPop.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import ImgsUpload from '@/components/imgs-upload'
export default {
  data () {
    return {
      visible: false,
      editMobile: false,
      dataForm: {
        shopIds: 0,
        mobile: '',
        type: 0
      },
      dataRule: {
      }
    }
  },
  components: {
    ImgsUpload
  },
  methods: {
    init (ids) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.dataForm.resetFields()
        this.dataForm.type = 0
      })
      this.dataForm.shopIds = ids
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/shop/shopAuditing/updateShopType'),
            method: 'put',
            data: this.$http.adornData({
              shopIds: this.dataForm.shopIds,
              type: this.dataForm.type
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    },
    message (msg) {
      this.$message({
        message: msg,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

