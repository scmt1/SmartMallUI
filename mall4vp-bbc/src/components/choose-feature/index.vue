<template>
  <div class="choose-goods">
    <!-- <evue-table  :data="list" :option="option" @currentRowChange="currentRowChange"></evue-table> -->
    <el-table :data="list" style="width: 100%"
     highlight-current-row
     @current-change="handleCurrentChange">
       <el-table-column
        prop="name"
        :label="$i18n.t('shopFeature.chooseFeature.pageTitle')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="$i18n.t('shopFeature.chooseFeature.createTime')">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
</template>
<script>
  import index from './index.js'

  export default index
</script>
