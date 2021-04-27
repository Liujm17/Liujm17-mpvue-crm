<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
      <van-tab title="用户">
        <van-radio-group v-model="radio1" @change="radioChange1">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in UserList"
            :key="index"
            @click="test"
          >
            <div class="name">{{ item.name }}</div>
            <div class="post">{{ item.dept }}-{{ item.post }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
      <!-- <van-tab title="部门">
        <van-radio-group v-model="radio2" @change="radioChange2">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in PostList"
            :key="index"
          >
            <div class="name">{{ item.name }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab> -->
    </van-tabs>
      <van-goods-action>
  <van-goods-action-button color="#be99ff" type="warning" text="取消"  @click="cancel"/>
  <van-goods-action-button color="#7232dd" type="info" text="确定"  @click="submit"/>
</van-goods-action>
  </div>
</template>
<script>
import { getUserOptions, getPostOptions } from "../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      radio1: "1",
      radio2: "59",
      UserList: [],
      PostList: [],
    };
  },
  components: {},
  mounted() {
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      let params = {
        pageNum: 1,
        pageSize: 999,
        status: 1,
        deptId: 1,
        name: this.value,
      };
      getUserOptions(params).then((res) => {
        this.UserList = res.data.data.list.map((item) => {
          return {
            name: item.name,
            post: item.post.name,
            dept: item.dept.name,
            id: item.id + "",
          };
        });
      });
      // let params2 = {
      //   name: this.value,
      // };
      // getPostOptions(params2).then((res) => {
      //   this.PostList = res.data.data.map((item) => {
      //     return {
      //       id: item.id + "",
      //       name: item.name,
      //     };
      //   });
      // });
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData();
    },
    //mpvue的更改选择
    radioChange1(val) {
      this.radio1 = val.mp.detail;
    },
      //mpvue的更改选择
    // radioChange2(val) {
    //   this.radio2 = val.mp.detail;
    // },
    cancel(){
     this.$emit('cancel')
    },
    submit(){
     var value={
       userName:this.UserList.filter((item)=>item.id==this.radio1)[0].name,
       id:this.radio1
     }

     this.$emit('submit',value)
    },
  },
};
</script>
<style lang="scss">
.select {
  font-size: 0.3rem;
  .name {
  }
  .post {
    color: #777;
  }
}
.van-radio {
  margin-top: 0.2rem !important;
  margin-left: 0.3rem !important;
  margin-bottom: 0.3rem !important;
}
</style>
