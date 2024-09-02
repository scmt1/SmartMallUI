<template>
  <div class="table">
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="提现状态">
          <el-select v-model="formInline.region" placeholder="提现状态">
            <el-option label="审核失败" value="shanghai" />
            <el-option label="审核中" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="serialNumber"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="remittance"
          label="提现时间"
          align="center"
        />
        <el-table-column
          prop="CUP"
          label="提现状态"
          align="center"
        />
        <el-table-column
          prop="alipay"
          label="操作"
          align="center"
        />
      </el-table>
    </div>
    <!-- 分页条 -->
    <!-- <pagination style="text-align: right" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize" @pagination="pagination" /> -->
          <el-pagination
        v-if="total > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
export default {
  // components: { Pagination },
  data () {
    return {
      time: '',
      activeName: 'second',
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10
      },
      formInline: {
        user: '',
        region: ''
      },
      payList: [
        {
          name: '银联',
          amount: 0.00,
          percent: 0.00
        },
        {
          name: '微信',
          amount: 0.10,
          percent: 0.10
        },
        {
          name: '支付宝',
          amount: 0.10,
          percent: 0.10
        },
        {
          name: '转账汇款',
          amount: 0.10,
          percent: 0.10
        },
        {
          name: '企业银联',
          amount: 0.10,
          percent: 0.10
        },
        {
          name: '余额',
          amount: 0.10,
          percent: 0.10
        }
      ],
      tableData: []
    }
  },

  mounted () {
  },

  methods: {
    handleClick (tab) {
      console.log(tab.name)
    },
    pagination (page) {
      this.params.pageNum = page.pageNum
      this.params.pageSize = page.pageSize
    },
    onSubmit () {

    }
  }
}
</script>

<style lang="scss" scoped>
  .table {
     margin-top: 30px;
     .list{
       padding: 20px 0;
     }
   }
</style>
