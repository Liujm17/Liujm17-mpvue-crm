<template>
  <div class="home-book">
    <div class="home-book-header">为你推荐</div>
    <div class="home-book-content">
      <div v-for="item in books" :key="item.id" class="home-book-content-all">
        <div class="home-book-content-book">
          <imageView height="100%" :src="item.src"></imageView>
        </div>
        <div class="home-book-content-text">{{ item.text }}</div>
      </div>
    </div>
    <div class="home-book-footer">换一批</div>
  </div>
</template>
<script>
import imageView from "../base/imageView";
export default {
  components: { imageView },
  data() {
    return {
      books: [
        {
          id: 1,
          src:
            "https://www.youbaobao.xyz/book/res/img//EarthSciences/978-981-10-3713-9_CoverFigure.jpg",
          text: "vue3.0版本beta基础组件",
        },
        {
          id: 2,
          src:
            "https://www.youbaobao.xyz/book/res/img//EarthSciences/978-981-10-3713-9_CoverFigure.jpg",
          text: "vue3.0版本beta基础组件",
        },
        {
          id: 3,
          src:
            "https://www.youbaobao.xyz/book/res/img//EarthSciences/978-981-10-3713-9_CoverFigure.jpg",
          text: "vue3.0版本beta基础组件",
        },
      ],
    };
  },
  computed: {
    specialDatas() {
      const { data, row, col } = this;
      if (data && data.length > 0) {
        const number = row * col;
        const newData = [];
        let _row = 0;
        while (_row < row) {
          newData.push(data.slice(_row * col, _row * col + col));
          _row++;
        }
        return newData;
      }
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
      default: 2,
    },
    col: {
      type: Number,
      default: 2,
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
    display: flex;
    padding: 0 12px;
    margin-top: 10.5px;
    .home-book-content-all {
        flex: 0 0 100/3%;
        margin-left: 4px;
      width: 101px;
      .home-book-content-book {
        height: 147px;
        width: 101px;
      }
      .home-book-content-text {
        height: 35.5px;
        width: 101px;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #212731;
      }
    }
  }
  .home-book-footer {
    margin-left: 20px; 
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
