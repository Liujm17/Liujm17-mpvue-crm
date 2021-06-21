<template>
  <div class="bg">
    <div class="box-card" v-for="(item, index) in keysList" :key="index">
      <div class="title">{{ item.title }}</div>
      <div class="content">
        <div
          class="box"
          v-for="(item2, index2) in item.subs"
          :key="index2"
          :style="{ border: item2.id == selected[index].id ? '1px blue solid' : '' }"
          @click="changeSelect(item2.id,index,item2.title)"
        >
          <div class="box-text"> {{ item2.title }}</div>
        </div>
      </div>
    </div>
    <div>
      <van-button plain type="info" @click="submit">查询</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keysList: [
        {
          title: "按时间筛选",
          subs: [
            { title: "最近一小时", id: 1 },
            { title: "最近三小时", id: 2 },
            { title: "最近半天", id: 3 },
            { title: "最近一天", id: 4 },
            { title: "最近一周", id: 5 },
            { title: "最近一个月", id:6 },
            { title: "最近半年", id: 7 },
            { title: "最近一年", id: 8 },
          ],
        },
        // {
        //   title: "高级筛选",
        //   subs: [
        //     { title: "1111", id: 7 },
        //     { title: "2222", id: 8 },
        //     { title: "2222", id: 9 },
        //     { title: "2222", id: 10 },
        //     { title: "2222", id: 11 },
        //     { title: "2222", id: 12 },
        //   ],
        // },
      ],
      show: false,
      selected:[{id:1}],
      selectedValue:'最近一小时'
    };
  },
  components: {},
  onShow() {},
  computed: {},
  methods: {
    changeSelect(val,index,title) {
      this.selected[index].id=val
      this.selectedValue=title
    },
    submit(){
      this.$emit('submit',this.selectedValue)
    }
  },
};
</script>
<style lang="scss" scoped>
.bg {
  display: flex;

  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  .box-card {
    width: 90%;
    min-height: 2.5rem;
    border: 1px solid #96c2f1;
    background-color: #eff7ff;
    border-radius: 0.2rem;
    overflow: hidden;
    margin: 0.1rem 0;
    .title {
      width: 100%;
      height: 0.5rem;
      text-align: center;
      font-size: 15px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      margin-bottom: 10px;
      .box {
        height: 30px;
        width: 33%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        .box-text{
          font-size: 13px;
        }
      }
    }
  }
}
</style>
