<template>
  <div class="app-container-10 container-f0f2f5 app-main feature-list-container">
    <div class="feature-list-content container-fff app-container-15 app-ele-border-radius-0">
      <!-- <div class="default-btn primary-btn" @click="goCreatePage">{{$t('shopFeature.list.newMicroPage')}}</div> -->
      <div class="default-btn primary-btn" v-if="isAuth('shop:shopRenovation:savePC')" @click="newPageSelect">{{$t('shopFeature.list.newMicroPage')}}</div>
      <div class="default-btn primary-btn" @click="getMiniPageList">{{$t('shopFeature.template.refresh')}}</div>
      <!--微页面列表-->
      <div class="content-box table-con">
        <el-table
          :data="miniPageList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            prop="name"
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
            align="center"
            prop="createTime"
            :label="$i18n.t('shopFeature.list.createTime')"
          >
          </el-table-column>
          <el-table-column
            align="center"
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
                <div class="default-btn text-btn" v-if="isAuth('shop:shopRenovation:updatePC')" @click="handleEdit(scope.row)">{{$t('shopFeature.list.modify')}}</div>
                <div class="default-btn text-btn" v-if="isAuth('shop:shopRenovation:deletePC')" @click="handleDelete(scope.row)">{{$t('shopFeature.list.delete')}}</div>
                <div class="default-btn text-btn update-home-page" v-if="isAuth('shop:shopRenovation:updateHomePC')" @click="handleSetHomePage(scope.row.renovationId)">{{ scope.row.homeStatus!=1 ? $t('shopFeature.list.setHomePage'): $t('shopFeature.list.cancelHomePage')}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="perProps.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="perProps.pageSize"
          :total="perProps.total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <template-select v-if="isShowtemplateSelect" @selectTemplate="goCreatePage" ref="templateSelect" />
  </div>
</template>

<script>
  import List from './index'

  export default List
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>