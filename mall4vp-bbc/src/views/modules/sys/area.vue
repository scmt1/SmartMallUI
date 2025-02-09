<template>
  <div class="mod-sys-area">
    <div class="search-bar">
      <el-input v-model="areaName"
                class="area-search-input"
                size="small"
                :placeholder="$t('sys.regionalKeyword')">
      </el-input>
      <div class="default-btn primary-btn area-add-btn" @click="addOrUpdateHandle()">{{$t('sysManagement.add')}}</div>
    </div>

    <el-tree :data="data"
             node-key="areaId"
             :filter-node-method="filterNode"
             ref="tree2"
             :props="props"
             :expand-on-click-node="false">

      <span class="custom-tree-node"
            slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <div>
          <div class="default-btn text-btn" @click="() => update(node, data)">{{$t('coupon.edit')}}</div>
          <div class="default-btn text-btn" @click="() => remove(node, data)">{{$t('coupon.delete')}}</div>
        </div>
      </span>
    </el-tree>

    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './area-add-or-update'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      addOrUpdateVisible: false,
      areaName: '',
      dataForm: {},
      data: [],
      params: {
        areaName: null
      },
      props: {
        id: 'areaId',
        label: 'areaName',
        children: 'children'
      }
    }
  },
  created () {
    this.getDataList(this.page)
  },
  mounted () {
  },
  components: {
    AddOrUpdate
  },
  watch: {
    areaName (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    getDataList (page, params) {
      this.$http({
        url: this.$http.adornUrl('/admin/area/list'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, params))
      }).then(({ data }) => {
        let treeData = treeDataTranslate(data, 'areaId', 'parentId')
        this.data = treeData
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
    deleteHandle (areaId) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/area/' + areaId),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      }).catch(() => { })
    },
    update (node, data) {
      this.addOrUpdateHandle(data.areaId)
    },

    remove (node, data) {
      this.deleteHandle(data.areaId)
    },

    filterNode (value, data) {
      if (!value) return true
      return data.areaName.indexOf(value) !== -1
    }
  }

}
</script>

<style lang="scss" scoped>
.mod-sys-area {
  .search-bar {
    background: transparent;
    margin-bottom: 15px;
    padding: 0;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .area-search-input {
    width: 30%;
  }
  .area-add-btn {
    float: right;
  }
}
</style>
