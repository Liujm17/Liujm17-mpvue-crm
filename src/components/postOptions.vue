<template>
  <div  class="user-bg">
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
      <van-tab title="岗位">
        <van-radio-group v-model="radio" @change="radioChange1">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in PostList"
            :key="index"
            @click="test"
          >
            <div class="name">{{ item.name }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
    <div class="bottom-bt">
      <!-- <div class="" style="width:50%">取消</div>
      <div class="" style="width:50%">确定</div> -->
      <!-- <van-button color="#be99ff" type="warning" @click="cancel">取消</van-button>
      <van-button color="#7232dd" type="info" @click="submit">确定</van-button> -->
      <!-- <van-goods-action>
        <van-goods-action-button
          type="warning"
          text="取消"
          @click="cancel"
        />
        <van-goods-action-button
          type="info"
          text="确定"
          @click="submit"
        />
      </van-goods-action> -->
    </div>
      <BottomButton :btList='btList'  @clickBt='clickBt'></BottomButton>
  </div>
</template>
<script>
import BottomButton from './bottomButton'
import { getPostOptions } from "../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      PostList: [],
      btList:[{name:'取消',click:'cancel'},{name:'确定',click:'submit',color:'blue'}]
    };
  },
  props:{
      radio:{
        type:String,
        default:'1'
      }
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
      let params = {
        pageNum: 1,
        pageSize: 999,
        status: 1,
        dictId: 2,
        name: this.value,
      };
      getPostOptions(params).then((res) => {
        this.PostList = res.data.data.map((item) => {
          return {
            name: item.dictText,
            id: item.dictValue + "",
          };
        });
      });
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData();
    },
    //mpvue的更改选择
    radioChange1(val) {
      this.radio = val.mp.detail;
    },
    //mpvue的更改选择
    // radioChange2(val) {
    //   this.radio2 = val.mp.detail;
    // },
    cancel() {
      this.$emit("cancel");
    },
    submit() {
      var value = {
        name: this.PostList.filter((item) => item.id == this.radio)[0].name,
        id: this.radio,
      };

      this.$emit("submit", value);
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
  bottom: 30px;
  left: 0;
  overflow: auto;
  padding-bottom: 60px;
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
