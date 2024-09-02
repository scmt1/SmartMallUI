<template>
  <div class="app-container-10 container-f0f2f5 app-main feature-list-container">
    <div class="feature-list-content container-fff app-container-15 app-ele-border-radius-0">
      <div v-if="isAuth('shop:shopRenovation:saveMove')" class="default-btn primary-btn" @click="newPageSelect">{{$t('shopFeature.list.newMicroPage')}}</div>
      <div class="default-btn primary-btn" @click="getMiniPagesList">{{$t('shopFeature.template.refresh')}}</div>
      <!--微页面列表-->
      <div class="table-con content-box">
        <el-table
          :data="miniPageList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          :row-style="{ height:'70px'}"
          style="width: 100%">
          <el-table-column
            prop="name"
            align="left"
            :label="$i18n.t('shopFeature.list.pageName')"
            >
            <template slot-scope="scope">
            <div>
              {{scope.row.name}}
              <el-tag v-if="scope.row.homeStatus===1" effect="dark" size="mini" style="margin-left: 10px;">{{$t('shopFeature.list.shopHomePage')}}</el-tag>
            </div>
          </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="createTime"
            :label="$i18n.t('shopFeature.list.createTime')"
          >
          </el-table-column>
          <el-table-column
            align="left"
            prop="updateTime"
            :label="$i18n.t('shopFeature.list.updateTime')"
          >
          </el-table-column>
          <el-table-column
            align="center"
            :label="$i18n.t('shopFeature.list.oper')">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn" @click="handleSelect(scope.row)">{{$t('shopFeature.list.view')}}</div>
                <div class="default-btn text-btn" v-if="isAuth('shop:shopRenovation:updateMove')" @click="handleEdit(scope.row)" size="small">{{$t('shopFeature.list.edit')}}</div>
                <div class="default-btn text-btn" v-if="isAuth('shop:shopRenovation:deleteMove')" @click="handleDelete(scope.row)" size="small">{{$t('shopFeature.list.delete')}}</div>
                <div class="default-btn text-btn update-home-page" v-if="isAuth('shop:shopRenovation:updateHomeMove')" @click="handleSetHomePage(scope.row.renovationId)" size="small">{{ scope.row.homeStatus!=1 ? $t('shopFeature.list.setHomePage'): $t('shopFeature.list.cancelHomePage')}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <template-select v-if="isShowtemplateSelect" @selectTemplate="goCreatePage" ref="templateSelect" />
  </div>
</template>

<script>
  import List from './list'

  export default List
</script>
<style scoped>
.table-con {
  padding-bottom: 30px;
}
.text-btn-con {
  display: flex;
  justify-content: center;
}
</style>
