<template>
    <div class="parking-container">停车管理</div>
</template>

<script>
export default {
    data() {
        return {};
    },
    mounted() {},
    methods: {
        // 添加车辆
        carAdd() {
            this.$http({
                url: this.$http.adornUrl("/carshop/CarAdd"),
                method: "POST",
                data: this.$http.adornData({}),
            }).then(({ data }) => {});
        },
        // 修改车辆
        carUpdate() {
            this.$http({
                url: this.$http.adornUrl("/carshop/CarUpdate"),
                method: "POST",
                data: this.$http.adornData({}),
            }).then(({ data }) => {});
        },
        // 删除车辆
        carDelete() {
            this.$http({
                url: this.$http.adornUrl("/carshop/CarDelete"),
                method: "POST",
                data: this.$http.adornData({}),
            }).then(({ data }) => {});
        },
        // 查询车辆列表
        carGetList() {
            this.$http({
                url: this.$http.adornUrl("/carshop/CarGetList"),
                method: "GET",
                data: this.$http.adornData({}),
            }).then(({ data }) => {});
        },
        // 查询单个车辆
        carGetItem() {
            this.$http({
                url: this.$http.adornUrl("/carshop/CarGetItem"),
                method: "GET",
                data: this.$http.adornData({}),
            }).then(({ data }) => {});
        },
    },
};
</script>

<style lang="scss" scoped>
.parking-container {
}
</style>
