<template>
  <div class="status-tabs-container">
    <div class="status-nav clearfix">
      <ul class="nav-list clearfix">
        <div v-for="(item,index) in statusArr" :key="index" class="log-item">
          <li
            :class="['nav-item', currentId === item.id ? 'selected' : '']"
            @click="selectNav(item)"
          >
            {{item.label}}
          </li>
        </div>
        <div class="export-btn default-btn text-btn">
          <slot name="export"></slot>
        </div>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    statusArr: {
      default: [],
      type: Array // 状态数组
    },
    defaultId: {
      default: 0,
      type: Number // 默认选中的
    }
  },
  data () {
    return {
      currentId: '' // 当前选择的状态key
    }
  },
  mounted () {
    if (!this.statusArr || this.statusArr.length === 0) {
      return
    }
    if (!this.defaultId && this.defaultId !== 0) {
      // 状态数组不为空，而没有传入默认选中key时，设置第一个key为当前选择的key
      this.defaultId = this.statusArr[0].id
    }
    this.currentId = this.defaultId
  },
  methods: {
    selectNav (item) {
      if (item.id !== this.currentId) {
        this.currentId = item.id
        // 向父组件发送状态切换回调,回调参数为选择的key
        this.$emit('statusChange', item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.status-nav {
  position: relative;
  display: block;
  width: 100%;
  margin-bottom: 15px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .nav-item {
    float: left;
    height: 40px;
    line-height: 40px;
    background: #f8f8f9;
    border: 1px solid #ddd;
    padding: 0 20px;
    margin: 0 -1px -1px 0;
    cursor: pointer;
  }

  .selected {
    background: #fff;
    border-bottom: 1px solid #fff;
  }
}
.export-btn {
  float: right;
}
</style>
