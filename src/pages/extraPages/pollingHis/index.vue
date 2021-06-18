<template>
  <div class="lookForMonth_wrapper">
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
        <div class="dateEdit" :style="{color:item.abnormalNum>0?'#FF0000':''}">
          {{ item.label}}
          <i class="el-icon-edit-outline" v-if="item.color !== 'ash' && index >= 7"></i>
        </div>
        <div class="dateEdit"  :style="{color:item.abnormalNum>0?'#FF0000':''}">{{item.polling?item.polling:''}}</div>
      </div>
    </div>
   <div class="tabs">
      <RadioList :typeList='typeList' :active="active" @changeData='changeData'></RadioList>
   </div>
    <Card
      :cardList="cardList"
      @toDetail="toDetail"
      v-if="cardList.length > 0"
    ></Card>
    <div class="empty-text" v-else>暂无记录</div>
  </div>
</template>

<script>
import RadioList from '../../../components/radioButton.vue'
import Card from '../../../components/card.vue'
import {getHistoryInspects} from '../../../api/api'
import data from '../../../api/mockData'
export default {
  components:{RadioList,Card},
  data() {
    return {
      data:data,
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
      time:'',//选中的日
      typeList:[{value:'异常',text:'异常'},{value:'',text:'全部'}],
      active:0,
      cardList:[],
      pollingList:[]
    };
  },
  onLoad(){
       // 获取当前日期数据
    this.getNow();
    // 获取当前月份一号的时间戳
    // let firstTime = +new Date(this.year,this.month-1,1,0,0,0)

    this.getData()
  },
  methods: {
    //获取当月数据
    getData(){
       const month=this.year + "-" + this.month
       let params={
         monthDate:month
       }
        getHistoryInspects(params).then((res)=>{
           this.pollingList=res.data.data.map((item)=>{
             return {
               polling:item.abnormalNum+'/'+item.totalNum,
               abnormalNum:item.abnormalNum
             }
           })
         this.getCalendarDate(); // 给calendarData添加当月数据
      })
    },
    toDetail(val){
      console.log(val)
    },
    //更换异常全部
    changeData(item,index){
      this.active=index
     this.getTime(this.time,item.value)
    },
    //点击日期事件
    getTime(val,deviceStatus="异常") {  
    const time = this.year + "-" + this.month + "-" + val;
    this.time=val
      let params={
        day:time,
        pageNum:1,
        pageSize:99999,
        deviceId:'',
        deviceStatus:deviceStatus
      }
      data['polling'].getRecord(params).then((res)=>{
        this.cardList=res
      })
     
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
        this.calendarData.push({ label: (i + 1 ),polling:this.pollingList[i].polling,abnormalNum:this.pollingList[i].abnormalNum},);
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
      this.cardList=[]
      this.getData()// 给calendarData添加当月数据
    },
    // 将日期调下
    dateDown() {
      this.month++;
      if (this.month > 12) {
        this.year++;
        this.month = 1;
      }
       this.cardList=[]
      this.getData()// 给calendarData添加当月数据
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
    justify-content: flex-start;
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
    // margin-bottom: 10px;
  }
}
.tabs{
  margin-top: 20px;
}
.empty-text{
  text-align: center;
}
</style>
