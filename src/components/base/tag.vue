<template>
  <div class="tag-text" @click="onClick">
    <div class="tag-text-content">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
  },
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>
<style lang="scss" scoped>
//显示省略号的话得文字div指定width，如果是100那就max-width，然后文字div不能margin，让上层来margin；...是在盒子外显示的
.tag-text {
  display: flex;
  line-height: 28px;
   margin: 8px 16px 8px 16px;
  .tag-text-content {
    font-size: 14px;
    padding: 0 17px;
    background: #f7f7f9;
    border-radius: 32px;
    flex: 0 0 auto;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
}
</style>
