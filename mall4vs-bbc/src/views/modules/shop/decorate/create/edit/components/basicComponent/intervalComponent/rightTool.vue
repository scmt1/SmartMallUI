<template>
    <div class="interval-container">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.axinterval.highly`)}}</div>
            <div class="right-select">
                <el-slider :min="5" :max="1000" v-model="interConfigForm.height" show-input @change="interChange"></el-slider>
            </div>
        </div>
        <div class="config-items">
            <div class="title" style="width: 60px">{{$t(`pcdecorate.axinterval.background`)}}</div>
            <div 
                class="right-select" 
                style="display: flex; align-items: center;justify-content: space-around;margin-left: 10px">
                <el-color-picker
                    v-model="interConfigForm.bgColor"
                    color-format="rgba"
                    :show-alpha="true"
                    @change="handleChangeColor">
                </el-color-picker>
                <span class="resets" @click="handleReset">{{$t(`pcdecorate.axinterval.reset`)}}</span>
                <span class="color-show">{{interConfigForm.bgColor}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    currentRef: { // 当前组件的ref
      type: String,
      default: () => ''
    },
    currentItem: { // 点击组件回显右边配置的信息
      type: Object,
      default: () => {}
    },
    editItem: { // 已配置好的信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      interConfigForm: {
        height: 20,
        bgColor: 'rgba(244, 244, 244, 1)'
      }
    }
  },
  methods: {
        // 选择背景颜色
    handleChangeColor () {
      this.$emit('handleChangeColor', this.interConfigForm.bgColor)
    },
        // 重置
    handleReset () {
      this.interConfigForm.bgColor = 'rgba(244, 244, 244, 1)'
    },
        // 验证信息
    handleValidate () {
      let status = true
      let message = ''
      if (this.editItem.height < 5) {
        status = false
        message = this.$i18n.t('pcdecorate.axinterval.warning1')
      } else {
        status = true
      }
      return {
        status: status,
        message: message
      }
    },
        // 提交信息
    handleSubmitMessage () {
      return this.interConfigForm
    },
        // 空白高度
    interChange (val) {
      this.interConfigForm.height = Math.floor(val)
    }
  },
  watch: {
    interConfigForm: {
      handler (newVal, oldVal) {
        let obj = {
          type: 'auxiliary_interval',
          ref: this.currentRef,
          config: newVal
        }
        this.$emit('handleUpdateMessage', obj)
      },
      deep: true
    },
    currentItem: { // 监听组件的回显
      handler (newVal, oldVal) {
        if (newVal.currentConfigType === 'auxiliary_interval') {
          if (JSON.stringify(newVal.config) != '{}') { // 如果当前不能为空
            let obj = {...newVal.config}
            this.interConfigForm = obj
          } else {
            this.interConfigForm = {
              height: 20,
              bgColor: 'rgba(244, 244, 244, 1)'
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.interval-container {
    .config-items {
        margin-bottom: 25px;
        display: flex;
        position: relative;
        .title {
            width: 70px;
            display: flex;
            font-size: 13px;
            align-items: center;
        }
        .right-select {
            width: calc(100% - 70px);
            .resets {
                cursor: pointer;
                width: 50px;
                text-align: center;
                color: rgba(21, 91, 212, 1);
            }
            .color-show {
                width: 175px;
                white-space: nowrap;
            }
        }
    }
}
</style>
<style lang="scss">
.interval-container {
    .el-color-picker {
        height: 32px;
        .el-color-picker__trigger {
            width: 110px;
            height: 32px;
        }
    }
}
</style>