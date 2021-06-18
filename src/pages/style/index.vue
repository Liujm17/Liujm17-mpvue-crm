<template>
  <div class="lookForMonth_wrapper">
    <div @click="testR">测试</div>
    <Picker :show="show" click="date"></Picker>
    <!-- 年月日选择器 -->
    <div class="lookForMonth_top">
      <div class="selectDate">
        <van-button type="default" size="small" @click="dateUp"
          >上个月</van-button
        >
        <div>{{ year }} 年 {{ month }} 月</div>
        <van-button type="default" size="small" @click="dateDown"
          >上个月</van-button
        >
      </div>
    </div>
    <div class="calendar" :style="calendarStyle">
      <div
        v-for="(item, index) in calendarData"
        class="calendar_item"
        :key="index"
        :class="{
          ash: item.color === 'ash',
          date: index > 6 && item.color !== 'ash',
        }"
        @click="index > 6 && item.color !== 'ash' ? getTime(item.label) : ''"
      >
        <p class="dateEdit">
          {{ item.label
          }}<i
            class="el-icon-edit-outline"
            v-if="item.color !== 'ash' && index >= 7"
          ></i>
        </p>
      </div>
    </div>

    

    <!-- 步骤条 -->
    <van-steps
      :steps="steps"
      @change="change"
      active-color="#38f"
      direction="vertical"
    />

    <!-- 年月选择器 -->
    <van-picker show-toolbar title="标题" :columns="columns" />

    <!-- 右滑删除 -->
    <van-swipe-cell :right-width="65">
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
      </van-cell-group>
      <div slot="right">删除</div>
    </van-swipe-cell>

    <!-- 折叠面板 -->
    <van-collapse v-model="activeNames" @change="onChange">
      <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
      <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
      <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
    </van-collapse>
  </div>
</template>
<script>
import Picker from '../../components/utils/picker'
export default {
  name: "lookForMonth",
  components:{Picker},
  data: () => {
    return {
      show:false,
      activeNames: ["2"],
      active:0,
      typeList:[{value:'',text:'全部'},{value:0,text:'耗材'},{value:1,text:'配件'},{value:2,text:'备用品'}],
      mockData: [
        {
          assigneeType: null,
          content: "所有人",
          counterSign: null,
          flowId: 1,
          nodeId: 161967569584634,
          prevId: null,
          title: "发起人",
          type: "start",
          userId: null,
          userName: null,
        },
        {
          assigneeType: null,
          content: "所有人",
          counterSign: null,
          flowId: 1,
          nodeId: 161967569584634,
          prevId: null,
          title: "发起人",
          type: "start",
          userId: null,
          userName: null,
        },
        {
          assigneeType: "user",
          content: "飞先生,刘家明",
          counterSign: false,
          flowId: 1,
          nodeId: 16196756958469,
          prevId: 161967569584634,
          title: "刘家明审批",
          type: "approver",
          userId: null,
          userName: null,
        },
        {
          assigneeType: "user",
          content: "周浩然",
          counterSign: false,
          flowId: 1,
          nodeId: 162123146450075,
          prevId: 16196756958469,
          title: "抄送人",
          type: "copy",
          userId: null,
          userName: null,
        },
        {
          assigneeType: "optional",
          content: "发起人自选",
          counterSign: false,
          flowId: 3,
          nodeId: 162123812846453,
          prevId: 162123350968569,
          title: "审批人",
          type: "approver",
          userId: null,
          userName: null,
        },
      ],
      columns: [
        // 第一列
        {
          values: Array.from({ length: 10 }, (v, k) => k + 2015),
          defaultIndex: 2,
        },
        // 第二列
        {
          values: Array.from({ length: 12 }, (v, k) => k + 1),
          defaultIndex: 1,
        },
      ],
      calendarData: [
        { label: "日" },
        { label: "一" },
        { label: "二" },
        { label: "三" },
        { label: "四" },
        { label: "五" },
        { label: "六" },
      ], //日历循环渲染数据
      year: 0, //当前日期年
      month: 0, //当前日期月数
      date: 0, //当前日期号数
      day: -1, //当前星期几
      steps: [
      ],
    };
  },
  filters: {},
  mounted() {},
  onShow() {
    this.steps = this.mockData.map((item) => {
      return {
        text:
          item.type == "start"
            ? "开始"
            : item.type == "approver"
            ? "审批"
            : "抄送",
        desc: item.content == '发起人自选'?'*自选(点击此处)':item.content,
          inactiveIcon: item.content == '发起人自选'?'star-o':'like-o',
        activeIcon: 'like-o',
        fontColor:item.content == '发起人自选'?'#00BFFF':'',
      };
    });
    // 获取当前日期数据
    this.getNow();
    // 获取当前月份一号的时间戳
    // let firstTime = +new Date(this.year,this.month-1,1,0,0,0)
    this.getCalendarDate(); // 给calendarData添加当月数据
  },
  methods: {
    testR(){
     this.show=true
    },
    changeData(item,index){
      console.log(item,index)
    },
    onChange(e) {
      this.activeNames = e.mp.detail;
    },
    change(val) {
      console.log(val);
    },
    getTime(val) {
      const time = this.year + "-" + this.month + "-" + val;
      this.$emit("getTime", time);
    },
    // 获取当前时间
    getNow() {
      let now = new Date();
      this.year = +now.getFullYear();
      this.month = +now.getMonth() + 1;
      this.date = +now.getDate();
      this.day = +now.getDay();
    },
    // 获取每个月的天数
    monthDay(month) {
      if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31;
      } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
      } else if (month === 2) {
        //  判断当年是否为闰年
        if (
          (this.year % 4 === 0 && this.year % 100 !== 0) ||
          this.year % 400 === 0
        ) {
          return 29;
        } else {
          return 28;
        }
      }
    },
    // 给calendarData添加当月数据
    getCalendarDate() {
      // 获取当前月份一号星期几
      let firstDay = new Date(
        this.year + "-" + this.month + "-" + "01"
      ).getDay();
      this.calendarData = [
        { label: "日" },
        { label: "一" },
        { label: "二" },
        { label: "三" },
        { label: "四" },
        { label: "五" },
        { label: "六" },
      ];
      let num = parseInt(firstDay);
      let nowDays = this.monthDay(this.month);
      let lastMonth = this.month - 1 > 0 ? this.month - 1 : 12;
      let lastDays = this.monthDay(lastMonth);
      //   循环添加上一个月数据
      for (let i = 0; i < num; i++) {
        this.calendarData.push({ label: lastDays - num + i + 1, color: "ash" });
      }
      // 循环添加当月数据
      for (let i = 0; i < nowDays; i++) {
        this.calendarData.push({ label: i + 1 });
      }
      // 循环添加下一个月数据
      if (this.calendarData.length % 7 !== 0) {
        let surplusDay = 7 - (this.calendarData.length % 7);
        for (let i = 0; i < surplusDay; i++) {
          this.calendarData.push({ label: i + 1, color: "ash" });
        }
      }
      this.loading = false;
    },
    // 将日期调上
    dateUp() {
      this.month--;
      if (this.month <= 0) {
        this.year--;
        this.month = 12;
      }
      this.getCalendarDate(); // 给calendarData添加当月数据
    },
    // 将日期调下
    dateDown() {
      this.month++;
      if (this.month > 12) {
        this.year++;
        this.month = 1;
      }
      this.getCalendarDate(); // 给calendarData添加当月数据
    },
  },
};
</script>
<style lang="scss" scoped>
.lookForMonth_wrapper {
  width: 100%;
  margin: auto;
}
.lookForMonth_top {
  overflow: hidden;
  .selectTeacher {
    float: left;
  }
  .selectDate {
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .upDownSelect {
      display: flex;
      flex-direction: column;
      margin-top: -2px;
      margin-left: 5px;
      .upDownSelect_item {
        width: 0;
        height: 0;
        border: 7px solid transparent;
        cursor: pointer;
      }
      .upDownSelect_item:nth-child(1) {
        border-bottom: 7px solid #666;
        margin-bottom: 5px;
        &:hover {
          border-bottom: 7px solid skyblue;
        }
      }
      .upDownSelect_item:nth-child(2) {
        border-top: 7px solid #666;
        &:hover {
          border-top: 7px solid skyblue;
        }
      }
    }
  }
}
/* 日历表样式=======================================↓ */
.calendar {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
  .calendar_item {
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.date:hover {
      background: #eee;
    }
    .status {
      margin-top: 10px;
      &.textBlue {
        color: blue;
      }
      &.textRed {
        color: brown;
      }
    }
    .el-icon-edit-outline {
      cursor: pointer;
      margin-left: 7px;
    }
  }
  .ash {
    color: gainsboro;
  }
  .dateEdit {
    margin-bottom: 10px;
  }
}
</style>
