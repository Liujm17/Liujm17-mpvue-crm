<template>
  <div class="home-book">
    <div class="home-book-header">为你推荐</div>
    <div class="home-book-content">
      <div
        v-for="(item, index) in bookdata"
        :key="index"
        class="home-book-content-all"
      >
        <div class="home-book-content-book" @click='onBookClick(data,index)'>
         <ImageView :src="item.cover"/>
        </div>
        <div class="home-book-content-text">{{ item.title }}</div>
      </div>
    </div>
    <div class="home-book-footer" @click="onMoreClick">换一批</div>
  </div>
</template>
<script>
import ImageView from "../base/imageView";
export default {
  components: { ImageView },
  data() {
    return {};
  },
  computed: {
    bookdata() {
      const { data, row, col } = this;
      if (data && data.length > 0) {
        const number = row * col;
        const newData = [];
        let _row = 0;
        while (_row < row) {
          newData.push(data.slice(_row * col, _row * col + col));
          _row++;
        }
        return newData[0];
      }
    },
  },
  methods: {
    onBookClick(data,index){
      this.$emit('onBookClick',data,index)
    },
    onMoreClick() {
      this.$emit('onMoreClick')
    },
  },
  created() {},
  props: {
    title: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: [],
    },
    btnText: {
      type: String,
      default: "",
    },
    row: {
      type: Number,
      default: 1,
    },
    col: {
      type: Number,
      default: 1,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
    showBg: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.home-book {
  .home-book-header {
    padding: 13px 0 0 20.5px;
    font-family: PingFangSC-Medium;
    font-size: 21px;
    color: #212933;
  }
  .home-book-content {
    width: 335px;
    height: 192px;
    display: flex;
    margin: 12.5px 20px 0 20px;
    .home-book-content-all {
      flex:1;
      text-align: center;
      .home-book-content-text {
        line-height: 16.5px;
        max-height: 33px;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #212731;
        overflow: hidden;
      }
    }
  }
  .home-book-footer {
    margin: 20px;
    width: 335px;
    height: 41px;
    border: 2px solid #edeeee;
    border-radius: 22px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #3696ef;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.home-book-content > div:nth-child(n + 2) {
  padding-left: 16px;
}
</style>
