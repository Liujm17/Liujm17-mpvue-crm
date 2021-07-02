<template>
  <div  class="user-bg">
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
        <van-radio-group v-model="radio" @change="radioChange1">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in PostList"
            :key="index"
            @click="test"
          >
            <div class="name">{{ item.id}}</div>
          </van-radio>
        </van-radio-group>
      <BottomButton :btList='btList'  @clickBt='clickBt'></BottomButton>
  </div>
</template>
<script>
import BottomButton from '../../../components/bottomButton.vue'
import { getChangeList } from "../../../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      PostList: [],
      btList:[{name:'取消',click:'cancel'},{name:'确定',click:'submit',color:'blue'}],
      radio:''
    };
  },
  components: {BottomButton},
  onLoad() {
    this.getData();
  },
  methods: {
    clickBt(val){
     this[val]()
    },
    //获取数据
    getData() {
      let params ={
        type:3
      }
      getChangeList(params).then((res) => {
        this.PostList = res.data.data.map((item) => {
          return {
            id: item.id + "",
            batchNo: item.batchNo,
          };
        });
      });
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.radio = val.mp.detail;
      this.getData();
    },
    //mpvue的更改选择
    radioChange1(val) {
      this.radio = val.mp.detail;
    },
    //mpvue的更改选择
    radioChange2(val) {
      this.radio2 = val.mp.detail;
    },
    cancel() {
      this.$router.go(1)
    },
    submit() {
      if(this.radio){
      this.$router.push({
        path:'/pages/extraPages/changeOrderAdd/main',
        query:{
          id:parseInt(this.radio)
        }
      })
      }else{
        wx.showToast({
           title: "请选择一个可变更采购单",
            icon: "none",
           duration: 1000,
           mask: true,
    });
      }
    },
  },
};
</script>
<style lang="scss">
.van-radio {
  margin-top: 0.2rem !important;
  margin-left: 0.3rem !important;
  margin-bottom: 0.3rem !important;
}
</style>
<style lang="scss" scoped>
.select {
  font-size: 0.3rem;
  .post {
    color: #777;
  }
}
.user-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 2.5rem;
  left: 0;
  overflow: auto;
}
.bottom-bt {
  z-index: 1000;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
