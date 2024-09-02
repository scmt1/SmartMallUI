<template>
  <!-- 属性组 -->
  <span class="caret-wrapper">
    <i :class="['sort-caret', 'ascending', isSort === 2 ? 'activeBottomSort' : '']" @click="changeSort(2)"></i>
    <i :class="['sort-caret', 'descending', isSort === 1 ? 'activeTopSort' : '']" @click="changeSort(1)"></i>
  </span>

</template>

<script>

export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    },
    isSort: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {

    }
  },

  methods: {
    changeSort(type) {
      this.$emit('changeSort', type, this.index, this.type)
    }

  }
}
</script>
<style scoped>
.activeBottomSort {
  border-bottom-color: #155BD4 !important;
}
.activeTopSort {
  border-top-color: #155BD4 !important;
}
</style>
