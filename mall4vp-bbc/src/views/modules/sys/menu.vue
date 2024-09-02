<template>
  <div class="mod-menu main-container">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <div
        v-if="isAuth('sys:menu:save')"
        class="default-btn primary-btn"
        @click="addOrUpdateHandle()"
      >
        {{ $t("sysManagement.add") }}
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-con sys-menu-table">
      <el-table :data="dataList"
                header-cell-class-name="table-header"
                style="width: 100%;"
                row-key="menuId">
        <el-table-column prop="name"
                        treeKey="menuId"
                        width="260"
                        :label="$t('publics.name')">
        </el-table-column>
        <el-table-column
                        :label="$t('sys.icon')">
          <template slot-scope="scope">
            <icon-svg  style="stroke: #8A979E !important;color: #8A979E" :name="scope.row.icon || ''"></icon-svg>
          </template>
        </el-table-column>
        <el-table-column prop="type"
                        :label="$t('sysManagement.type')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">{{$t('sys.catalog')}}</span>
            <span v-if="scope.row.type === 1">{{$t('sys.menu')}}</span>
            <span v-if="scope.row.type === 2">{{$t('sys.button')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hidden"
                        :label="$t('sys.isHidden')">
          <template slot-scope="scope">
            <span v-if="scope.row.hidden">{{$t('sys.yes')}}</span>
            <span v-else>{{$t('sys.no')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum"
                        :label="$t('hotSearch.seq')">
        </el-table-column>
        <el-table-column prop="url"
                        width="150"
                        :show-overflow-tooltip="true"
                        :label="$t('sys.menuUrl')">
        </el-table-column>
        <el-table-column prop="perms"
                        width="150"
                        :show-overflow-tooltip="true"
                        :label="$t('sys.authorization')">
        </el-table-column>
        <el-table-column fixed="right"
                        align="center"
                        width="150"
                        :label="$t('sys.operation')">
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div
                v-if="isAuth('sys:menu:update')"
                class="default-btn text-btn"
                @click="addOrUpdateHandle(scope.row.menuId)"
              >
                {{$t('sysManagement.modify')}}
              </div>
              <div
                v-if="isAuth('sys:menu:delete')"
                class="default-btn text-btn"
                @click="deleteHandle(scope.row)"
              >
                {{$t('coupon.delete')}}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/menu/table'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, 'menuId')
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (row) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/sys/menu/${row.menuId}`),
          method: 'delete',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (row.type === 1) {
            this.$router.go(0)
          }
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-menu.main-container {
  padding-top: 0;
}
</style>
