<template>
  <el-dialog title="设置显示字段" :close-on-click-modal="false" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="基础信息">
        <!-- 交易信息 -->
        <el-checkbox-group v-model="columnData">
          <el-checkbox label="会员昵称" name="columnName" :checked="true" disabled></el-checkbox>
          <el-checkbox label="会员头像" name="columnName" :checked="true" disabled></el-checkbox>
          <el-checkbox label="用户名称" name="columnName"></el-checkbox>
          <el-checkbox label="联系电话" name="columnName" :checked="true" disabled></el-checkbox>
          <el-checkbox label="会员等级" name="columnName"></el-checkbox>
          <el-checkbox label="会员类型" name="columnName"></el-checkbox>
          <el-checkbox label="状态" name="columnName"></el-checkbox>
          <el-checkbox label="注册时间" name="columnName"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="交易信息">
        <el-checkbox-group v-model="columnData">
          <!-- 交易信息 -->
          <el-checkbox label="最近消费时间" name="columnName"></el-checkbox>
          <el-checkbox label="消费金额" name="columnName"></el-checkbox>
          <el-checkbox label="实付金额" name="columnName"></el-checkbox>
          <el-checkbox label="消费次数" name="columnName"></el-checkbox>
          <el-checkbox label="平均折扣" name="columnName"></el-checkbox>
          <el-checkbox label="充值金额" name="columnName"></el-checkbox>
          <el-checkbox label="充值次数" name="columnName"></el-checkbox>
          <el-checkbox label="退款金额" name="columnName"></el-checkbox>
          <el-checkbox label="退款次数" name="columnName"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="账户资产">
        <el-checkbox-group v-model="columnData">
          <!-- 账户资产 -->
          <el-checkbox label="当前积分" name="columnName"></el-checkbox>
          <el-checkbox label="累计积分" name="columnName"></el-checkbox>
          <el-checkbox label="当前余额" name="columnName"></el-checkbox>
          <el-checkbox label="累计余额" name="columnName"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <el-button class="default-btn primary-btn" @click="selectedSubmit()">{{$t('remindPop.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        userId: 0,
        nickName: '',
        pic: '',
        status: 1
      },
      columnData: [], // 字段多选
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.userId = id || 0
      // console.log('aa', id, this.dataForm)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    selectedSubmit () {
      this.$emit('refreshTableList', this.columnData)
      this.visible = false
    }
  }
}
</script>
