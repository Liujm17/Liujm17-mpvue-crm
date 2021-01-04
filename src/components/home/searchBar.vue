<template>
  <div class="search">
    <div class="search-bar" @click="onSearchBarClick">
      <van-icon class="search" name="search" size="16px" color="#858c96" />
      <input
        class="search-bar-wrapper"
        type="text"
        :focus="focus"
        :disabled="disabled"
        :maxlength="limit"
        :placeholder="hotSearch.length === 0 ? '搜索' : hotSearch"
        v-model="searchWord"
        @input="onChange"
        confirm-type="search"
        @confirm="onConfirm"
        placeholder-style="color:#ADB4BE"
      />
      <!-- 小程序中confirm-type='search'会让右下角大按钮变成搜索两字，send会是发送，绑定显示特定键盘用@confirm -->
      <van-icon
        class="close"
        name="close"
        size="16px"
        color="#858c96"
        @click="onClearClick"
        v-if="searchWord.length > 0"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    focus: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 50,
    },
    hotSearch: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchWord: "",
      count: 0,
    };
  },
  methods: {
    onSearchBarClick() {
      this.$emit("onSearchBarClick");
    },
    onClearClick() {
      this.searchWord = "";
      this.$emit("onClearClick");
    },
    onChange(e) {
      const { value } = e.mp.detail;
      this.$emit("onChange", value);
    },
    onConfirm(e) {
      const { value } = e.mp.detail;
      this.$emit("onConfirm", value);
    },
    setValue(v) {
      this.searchWord = v;
    },
    getValue() {
      return this.searchWord;
    },
  },
  watch: {
    searchWord() {},
  },
};
</script>
<style lang="scss" scoped>
.search {
  padding: 15px 15.5px;
  .search-bar {
    display: flex;
    height: 40px;
    align-items: center;
    background: #f5f7f9;
    border-radius: 40px;
    box-sizing: border-box;
    .search-bar-wrapper {
      flex: 1;
    }
    .search,
    .close {
      display: flex;
      align-items: center;
      padding: 12px 15px;
    }
  }
}
</style>
