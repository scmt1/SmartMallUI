<template>
  <el-dialog
    :title="!dataForm.areaId ? $t('sysManagement.add') : $t('sysManagement.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item :label="$t('sys.areaName')" prop="areaName">
        <el-input v-model="dataForm.areaName" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sys.superiorAreaL')" prop="parentId">
        <el-cascader
          expand-trigger="hover"
          :options="areaList"
          :props="categoryTreeProps"
          change-on-select
          filterable
          v-model="selectedOptions"
          @change="handleChange"
          size="small"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('coupon.cancel')}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t('coupon.confirm')}}</div>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        areaId: '',
        areaName: null,
        parentId: null,
        level: null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      dataRule: {
        areaName: [
          { required: true, message: this.$i18n.t('sysManagement.areaTips'), trigger: 'blur' }
        ]
      },
      isSubmit: false,
      areaList: [],
      categoryTreeProps: {
        value: 'areaId',
        label: 'areaName'
      },
      selectedOptions: [],
      selectedOptions1: []
    }
  },
  methods: {
    init (areaId) {
      this.dataForm.areaId = areaId || 0
      this.visible = true
      this.isSubmit = false
      this.selectedOptions = []
      this.selectedOptions1 = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.areaId) {
          this.$http({
            url: this.$http.adornUrl('/admin/area/info/' + this.dataForm.areaId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm = data
            this.selectedOptions1.push(this.dataForm.parentId)
            this.selectedOptions = this.dataForm.parentId
            this.categoryTreeProps.areaId = this.dataForm.areaId
            this.categoryTreeProps.areaName = this.dataForm.areaName
          })
        }

        this.$http({
          url: this.$http.adornUrl('/admin/area/list'),
          method: 'get',
          params: this.$http.adornParams({
            // maxGrade: 2
          })
        }).then(({ data }) => {
          this.areaList = treeDataTranslate(data, 'areaId', 'parentId')
          this.areaList.forEach(item => {
            item.children.forEach(area => {
              area.children = null
            })
          })
        })
      })
    },
    // 表单数据提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.parentId) {
            this.dataForm.parentId = 0
            this.dataForm.level = 1
          } else {
            console.log(this.selectedOptions)
            if (this.selectedOptions instanceof Array) {
              this.dataForm.level = this.selectedOptions.length + 1
            }
            console.log('2', this.dataForm.level)
          }
          if (this.isSubmit) {
            return false
          }
          this.isSubmit = true
          this.$http({
            url: this.$http.adornUrl('/admin/area'),
            method: this.dataForm.areaId ? 'put' : 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList', this.page)
              }
            })
          }).catch((e) => {
            this.isSubmit = false
          })
        }
      })
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
      this.dataForm.level = val.length
    }
  }
}
</script>
