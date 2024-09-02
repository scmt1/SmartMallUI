<template>
  <div class="shop-transcity-add-or-update">
    <el-dialog :modal="false" :title="this.$i18n.t('shop.chooseDeliveryArea')" :close-on-click-modal="false" :visible.sync="visible"
    >
      <!-- <el-form
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="80px"
        style="height:400px"
      >
        <el-scrollbar style="height:100%">
          <el-form-item size="mini" :label="$t('product.deliveryArea')">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="areaId"
              :default-expanded-keys="banArr"
              ref="menuListTree"
              show-checkbox
              v-if="visible"
            ></el-tree>
          </el-form-item>
        </el-scrollbar>
      </el-form> -->
      <main class="content-box">
        <el-scrollbar style="height:100%;">
          <!-- 区域 -->
          <div v-for="region in menuList" :key="region.areaId" class="addr-region">
            <div class="region-name">
              <el-checkbox v-model="region.checked" :disabled="region.disabled" :indeterminate="region.indeterminate" @change="checked=>regionChange(checked, region)">{{ region.areaName }}</el-checkbox>
            </div>
            <div class="province-box">
              <!-- 省 -->
              <div v-for="provinceItem in region.areas" :key="provinceItem.areaId" class="province-item">
                <el-checkbox v-model="provinceItem.checked" :disabled="provinceItem.disabled" :indeterminate="provinceItem.indeterminate" @change="checked=>provinceChange(checked, provinceItem , region)" />
                <span style="cursor: pointer;" @click="handleProvinceClick(provinceItem)">
                  <span class="check-label">{{ provinceItem.areaName }}</span>
                  <span v-show="provinceItem.show" class="area-count">({{ provinceItem.areaCount }})</span>
                  <i class="el-icon-arrow-down" />
                </span>
                <!-- 市 -->
                <div v-if="provinceItem.show" class="city-box bor-style">
                  <div v-for="(cityItem,cityIndex) in provinceItem.areas" :key="cityItem.areaId" class="city-item">
                    <span ref="cityRef">
                      <el-checkbox v-model="cityItem.checked" :disabled="cityItem.disabled" :indeterminate="cityItem.indeterminate" @change="checked=>cityChange(checked, cityItem , provinceItem,region)" />
                      <span style="cursor: pointer;" @click="handleCityClick(provinceItem.areas,cityItem,$event)">
                        <span class="check-label" :data-inx="cityIndex">{{ cityItem.areaName }}</span>
                        <span v-show="provinceItem.show" :data-inx="cityIndex" class="area-count">({{ cityItem.areaCount }})</span>
                        <i class="el-icon-arrow-down" :data-inx="cityIndex" />
                      </span>
                    </span>
                    <!-- 区 -->
                    <div v-show="cityItem.show" ref="areaBoxRef" :style="areaStyle" class="area-box bor-style">
                      <div v-for="areaItem in cityItem.areas" :key="areaItem.areaId">
                        <el-checkbox v-model="areaItem.checked" :disabled="areaItem.disabled" @change="checked=>areaChange(checked, cityItem ,provinceItem,region)">{{ areaItem.areaName }}</el-checkbox>
                      </div>
                      <!-- 区小角标 -->
                      <span :style="areaMarkStyle" class="area-mark" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="height:20px;" />
        </el-scrollbar>
      </main>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" @click="visible = false">{{ $t("table.cancel") }}</el-button> -->
        <el-checkbox v-model="checkedAllState" :indeterminate="checkedAllIndeterminate" @change="checkedAll">全选</el-checkbox>
        <span>
          <span class="area-num">已选择{{ checkedAreaNum }}个区域</span>
          <el-button size="small" type="primary" @click="dataFormSubmit()">提交</el-button>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 0,
      visible: false,
      menuList: [],
      banArr: [],
      rowIndex: 0,
      menuListTreeProps: {
        label: 'areaName',
        areas: 'areas'
      },
      dataForm: {
        transfeeId: 0
      },
      // 全选状态
      checkedAllState: false,
      // 全选按钮不确定状态
      checkedAllIndeterminate: false,
      // 所选区数量
      checkedAreaNum: 0,
      // 区盒定位样式
      areaStyle: {
        top: '20px',
        left: '20px'
      },
      // 角标样式
      areaMarkStyle: {
        top: '20px',
        left: '20px'
      }
    }
  },
  watch: {
    visible: function (val) {
      if (!val) {
        console.log(val)
        this.banArr = []
      }
    }
  },
  methods: {
    init (rowIndex, cityList, allSelectCityList, type, banArr) {
      this.type = type
      this.rowIndex = rowIndex
      this.checkedAreaNum = cityList.length || 0
      if (this.menuList.length === 0) {
        // 获取所有省和市
        this.$http({
          // url: this.$http.adornUrl('/admin/area/listAreaOfEnable'),
          url: this.$http.adornUrl('/admin/area/areaList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          console.log(data)
          this.menuList = data
        }).then(() => {
          this.visible = true
          this.disabledNodes(cityList, allSelectCityList, banArr)
          // this.$nextTick(() => {
          //   this.$refs['dataForm'].resetFields()
          //   this.$refs.menuListTree.setCheckedNodes(cityList)
          //   if (cityList.length) {
          //     this.banArr = banArr
          //   } else {
          //     banArr = []
          //     this.banArr = banArr
          //   }
          //   this.$refs.menuListTree.setCurrentKey(banArr)
          // })
        })
      } else {
        this.visible = true
        this.disabledNodes(cityList, allSelectCityList, banArr)
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        //   this.$refs.menuListTree.setCheckedNodes(cityList)
        //   if (cityList.length) {
        //     this.banArr = banArr
        //   } else {
        //     banArr = []
        //     this.banArr = banArr
        //   }
        //   this.$refs.menuListTree.setCurrentKey(banArr)
        // })
      }
    },
    markClick (e) {
      // 点击当前弹窗外的部分关闭展开的列表
      if (e.target.className === 'el-dialog__wrapper') {
        this.handleCheckChange(this.menuList, { show: false })
      }
    },
    // 全选
    checkedAll (checked) {
      this.checkedAllIndeterminate = false
      this.handleCheckChange(this.menuList, { checked, indeterminate: false })
      this.getAreaCheckedList()
    },
    // 区域复选框
    regionChange (checked, region) {
      region.indeterminate = false
      this.handleCheckChange(region.areas, { checked, indeterminate: false })
      this.getAreaCheckedList()
      this.checkedAllJudge() // 放最后
    },
    // 省复选框
    provinceChange (checked, province, region) {
      province.indeterminate = false
      this.handleCheckChange(province.areas, { checked, indeterminate: false })
      this.indeterJudge(region)
      this.getAreaCheckedList()
      this.checkedAllJudge() // 放最后
    },
    // 市复选框
    cityChange (checked, city, province, region) {
      city.indeterminate = false
      this.handleCheckChange(city.areas, { checked })
      this.indeterJudge(province)
      this.indeterJudge(region)
      this.getAreaCheckedList()
      this.checkedAllJudge() // 放最后
    },
    // 区复选框
    areaChange (checked, city, province, region) {
      this.indeterJudge(city)
      this.indeterJudge(province)
      this.indeterJudge(region)
      this.getAreaCheckedList()
      this.checkedAllJudge() // 放最后
    },
    // 检测是否全选
    checkedAllJudge () {
      let checkedNum = 0
      const len = this.menuList.length
      let hasIndeterminate = false
      this.menuList.forEach(region => {
        region.checked && checkedNum++
        region.indeterminate && (hasIndeterminate = true)
      })
      // 是否为全选状态
      this.checkedAllState = checkedNum === len
      // 是否为不确定的状态
      this.checkedAllIndeterminate = !(checkedNum === len || checkedNum === 0) || hasIndeterminate
    },
    // 检测其孩子列表是否全选
    indeterJudge (parent) {
      // 选中的个数
      let tCount = 0
      let hasIndeterminate = false
      const len = parent.areas.length
      parent.areas.forEach(item => {
        item.checked && tCount++
        item.indeterminate && (hasIndeterminate = true)
      })
      // 是否选择状态
      parent.checked = tCount === len
      // 是否为不确定的状态
      parent.indeterminate = !(tCount === len || tCount === 0) || hasIndeterminate
    },
    handleCheckChange (list, status) {
      const { checked, show, indeterminate } = status
      list.forEach(item => {
        show !== undefined && (item.show = show)
        indeterminate !== undefined && (item.indeterminate = indeterminate)
        if (checked !== undefined && !item.disabled) {
          item.checked = checked
        }
        if (item.areas && item.areas.length > 0) {
          this.handleCheckChange(item.areas, { checked, show, indeterminate })
        }
      })
    },
    // 获取被选中的区列表
    getAreaCheckedList () {
      const resultList = []
      this.menuList.forEach(region => {
        region.areas.forEach(province => {
          province.areas.forEach(city => {
            city.areas.forEach(area => {
              if (area.checked) {
                resultList.push(area)
              }
            })
          })
        })
      })
      this.checkedAreaNum = resultList.length
      return resultList
    },
    // 处理省点击
    handleProvinceClick (province) {
      const flag = province.show
      this.handleCheckChange(this.menuList, { show: false })
      province.show = !flag
    },
    handleCityClick (cityList, curCity, e) {
      this.handleAreaBoxShow(e)
      const flag = curCity.show
      cityList.forEach(item => {
        item.show = false
      })
      curCity.show = !flag
    },
    // 处理区地址盒子显示
    handleAreaBoxShow (e) {
      // 当前点击的节点
      const nodeName = e.target.nodeName.toLowerCase()
      // 市列表索引
      const index = e.target.dataset.inx
      // 区单体所占宽度
      const offsetLeft = this.$refs.cityRef[index].offsetWidth

      // 显示区列表的左偏移值
      if (nodeName === 'span') {
        this.areaStyle.left = e.clientX - e.offsetX + offsetLeft + 14 + 'px'
        this.areaMarkStyle.left = e.clientX - e.offsetX + offsetLeft + 9 + 'px'
      } else if (nodeName === 'i') {
        this.areaStyle.left = e.clientX - e.offsetX + e.target.offsetWidth + 'px'
        this.areaMarkStyle.left = e.clientX - e.offsetX + e.target.offsetWidth + 9 + 'px'
      }
      this.$nextTick(() => {
        // 加setTimeout防止有时获取到的高度为0
        setTimeout(() => {
          // 显示区列表盒子的高度
          const areaBoxH = this.$refs.areaBoxRef[index].offsetHeight
          // 14为角标的高度
          this.areaStyle.top = e.clientY - e.offsetY - areaBoxH / 2 + 14 + 'px'
          // 角标
          this.areaMarkStyle.top = e.clientY - e.offsetY + 8 + 'px'
        })
      })
    },
    disabledNodes (cityList, allSelectCityList, banArr) {
      let newBanArr = []
      newBanArr = newBanArr.concat(banArr)
      if (newBanArr.length > 0) {
        for (var i = 0; i < newBanArr.length; i++) {
          if (cityList.length > 0) {
            cityList.forEach(item => {
              if (newBanArr[i] === item.areaId) {
                newBanArr.splice(i, 1)
              }
            })
          }
        }
      }

      for (let i = 0; i < this.menuList.length; i++) {
        let disabledNumOne = 0
        // 状态
        this.$set(this.menuList[i], 'disabled', false)
        this.$set(this.menuList[i], 'checked', false)
        this.$set(this.menuList[i], 'indeterminate', false)

        // 获取所有的省
        const childrenOne = this.menuList[i].areas
        for (let j = 0; j < childrenOne.length; j++) {
          // 省下区的个数
          let provinceAreaCount = 0
          // debugger
          let disabledNumTwo = 0
          // 状态
          this.$set(this.menuList[i].areas[j], 'disabled', false)
          this.$set(this.menuList[i].areas[j], 'show', false)
          this.$set(this.menuList[i].areas[j], 'checked', false)
          this.$set(this.menuList[i].areas[j], 'indeterminate', false)
          // 获取当前省下的所有的市
          const childrenTwo = this.menuList[i].areas[j].areas
          for (let k = 0; k < childrenTwo.length; k++) {
            // 市下区的个数
            let cityAreaCount = 0
            // 状态
            this.$set(this.menuList[i].areas[j].areas[k], 'disabled', false)
            this.$set(this.menuList[i].areas[j].areas[k], 'show', false)
            this.$set(this.menuList[i].areas[j].areas[k], 'checked', false)
            this.$set(this.menuList[i].areas[j].areas[k], 'indeterminate', false)
            if (this.menuList[i].areas[j].areas[k].areas && this.menuList[i].areas[j].areas[k].areas.length > 0) {
              let disableChildCity = 0

              // 获取当前市下的所有的区
              const childArea = this.menuList[i].areas[j].areas[k].areas
              for (let l = 0; l < childArea.length; l++) {
                provinceAreaCount++
                cityAreaCount++
                // 状态
                this.$set(this.menuList[i].areas[j].areas[k].areas[l], 'disabled', false)
                const result = cityList.find(cityI => childArea[l].areaId === cityI.areaId)
                if (result) {
                  this.$set(this.menuList[i].areas[j].areas[k].areas[l], 'checked', true)
                } else {
                  this.$set(this.menuList[i].areas[j].areas[k].areas[l], 'checked', false)
                }
                const banCity = newBanArr.findIndex((item) => item === childArea[l].areaId) > -1
                if (banCity) {
                  this.menuList[i].areas[j].areas[k].areas[l].disabled = true
                  disableChildCity++
                }
              }
              if (disableChildCity === this.menuList[i].areas[j].areas[k].areas.length) {
                this.menuList[i].areas[j].areas[k].disabled = true
                disabledNumTwo++
              }
            }
            // 检测市下的区是否全选
            this.indeterJudge(this.menuList[i].areas[j].areas[k])
            // 区个数
            this.menuList[i].areas[j].areas[k].areaCount = cityAreaCount
          }

          if (disabledNumTwo === this.menuList[i].areas[j].areas.length) {
            this.menuList[i].areas[j].disabled = true
            disabledNumOne++
          }
          // 检测省下的市是否全选
          this.indeterJudge(this.menuList[i].areas[j])
          // 区个数
          this.menuList[i].areas[j].areaCount = provinceAreaCount
        }
        if (disabledNumOne === this.menuList[i].areas.length) {
          this.menuList[i].disabled = true
        }
        // 检测区域下的省是否全选
        this.indeterJudge(this.menuList[i])
      }
      // 判断是否全选
      this.checkedAllJudge()
    },
    // 表单提交
    dataFormSubmit () {
      const checdNodes = this.getAreaCheckedList()
      // this.$emit('refreshDataList', this.rowIndex, this.$refs.menuListTree.getCheckedNodes(true), this.type)
      this.$emit('refreshDataList', this.rowIndex, checdNodes, this.type)
      this.visible = false
      this.handleCheckChange(this.menuList, { checked: false, show: false })
      // 重置全选按钮状态
      this.checkedAllState = false
      // 全选按钮不确定状态
      this.checkedAllIndeterminate = false
    }
  }
}
</script>

<style  lang="scss" scoped>
.content-box{
  height: 500px;

  .check-label{
    padding-left: 8px;
    padding-right: 6px;
    cursor: pointer;
  }

  .addr-region{
    display: flex;
    line-height: 32px;
    margin-bottom: 20px;

    .region-name{
      width: 100px;
    }
    .province-box{
      flex: 1;
      display: flex;
      flex-wrap: wrap;

      .province-item{
        width: 33%;
        position: relative;

        .area-count{
          color: #155bd4;
          padding-right: 6px;
        }

        .bor-style{
          border: 1px solid #eee;
          background-color: #fff;
          border-radius: 2px;
          box-shadow: 0px 0px 3px #ccc;
        }

        .city-box{
          min-width: 70%;
          max-height: calc(32px * 10 + 6px);
          overflow-y: auto;
          overflow-x: hidden;
          padding:3px 12px;
          position: absolute;
          left: -13px;
          z-index: 9;

          .city-item{
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .area-box{
              max-height: calc(32px * 8 + 8px);
              overflow-y: auto;
              overflow-x: hidden;
              padding: 3px 20px;
              line-height: 32px;
              position: fixed;
              background-color: #fff;
              z-index: 999;
            }

            .area-mark{
              // border-left: 1px solid #fff;
              // border-top: 1px solid #fff;
              // border-color: #fff;
              background-color: #fff;
              box-shadow: 1px 1px 3px 0 #ccc;
              display: block;
              width: 10px;
              height: 10px;
              position: fixed;
              transform: rotate(135deg);
            }

          }
        }
      }
    }
  }
}
.dialog-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .area-num{
    margin-right: 12px;
  }
}
</style>
<style scoped>
.shop-transcity-add-or-update /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color:#fff;
}
.shop-transcity-add-or-update /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
  background-color:#155bd4;
}
</style>
<style lang="scss">
.shop-transcity-add-or-update {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
