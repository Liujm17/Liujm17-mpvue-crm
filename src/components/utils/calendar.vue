<template>
  <div class="lookForMonth_wrapper">
    <div class="header">
      <div class="header-item" @click="cancel">取消</div>
      <div class="header-cander-title">日期选择</div>
      <div class="header-item" @click="submit">确定</div>
    </div>
    <!-- 年月日选择器 -->
    <div class="lookForMonth_top">
      <div class="selectDate">
        <van-button type="default" size="small" @click="dateUp">上个月</van-button>
        <div>{{ year }} 年 {{ month }} 月</div>
        <van-button type="default" size="small" @click="dateDown">下个月</van-button>
      </div>
    </div>
    <div class="calendar" :style="calendarStyle" v-if="showDay">
      <div
        v-for="(item, index) in calendarData"
        class="calendar_item"
        :key="index"
        :class="{
          ash: item.color === 'ash',
          date:item.color !== 'ash',
        }"
        @click=" item.color !== 'ash' ? getTime(item.label) : ''"
      >
        <p class="dateEdit">
          {{ item.label
          }}
          <i
            class="el-icon-edit-outline"
            v-if="item.color !== 'ash' && index >= 7"
          ></i>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Calendar",
  props: {
    showDay: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      calendarData: [
        // { label: "日" },
        // { label: "一" },
        // { label: "二" },
        // { label: "三" },
        // { label: "四" },
        // { label: "五" },
        // { label: "六" },
      ], //日历循环渲染数据
      year: 0, //当前日期年
      month: 0, //当前日期月数
      date: 0, //当前日期号数
      nowDate: 0,
      day: -1, //当前星期几
    };
  },
  filters: {},
  onReady() {},
  onReady() {
    // 获取当前日期数据
    this.getNow().then(() => {
      this.getCalendarDate();
    });
    // 获取当前月份一号的时间戳
    // let firstTime = +new Date(this.year,this.month-1,1,0,0,0)
    // 给calendarData添加当月数据
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    submit() {
      let time = "";
      if (this.showDay) {
        if (this.nowDate == 0) {
          wx.showToast({
            title: "请选择日期",
            icon: "none",
            duration: 2000,
            mask: true,
          });
        } else {
          time = this.year + "-" + this.month + "-" + this.nowDate;
          this.$emit("submit", time);
        }
      } else {
        time = this.year + "-" + this.month;
        this.$emit("submit", time);
      }
    },
    //点击日期后马上出发的事件
    getTime(val) {
      this.nowDate = val;
      const time = this.year + "-" + this.month + "-" + val;
      this.$emit("getTime", time);
    },
    // 获取当前时间
    getNow() {
      return new Promise((resolve, reject) => {
        let now = new Date();
        this.year = +now.getFullYear();
        this.month = +now.getMonth() + 1;
        this.date = +now.getDate();
        this.day = +now.getDay();
        resolve();
      });
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
      //注释的为星期
      this.calendarData = [
        // { label: "日" },
        // { label: "一" },
        // { label: "二" },
        // { label: "三" },
        // { label: "四" },
        // { label: "五" },
        // { label: "六" },
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
.header {
  width: 100%;
  height: 40px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  .header-item {
    padding: 0 10px;
    color: #1989fa;
  }
  .header-cander-title {
    font-weight: 300;
  }
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
  margin-top: 10px;
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
