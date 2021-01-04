<template>
  <div>
    <searchBar
      @onSearchBarClick="onSearchBarClick"
      :hot-search="'搜索'"
      :focus="true"
      @onClearClick="onClear"
      @onConfirm="keyBoardSearch"
      @onChange="inputValue"
    ></searchBar>
    <!-- 热门搜索 -->
    <tagGroup
      :hotSearchs="hotSearchsTest"
      @changeSearch="changeSearch"
      @showBookDetail="showBookDetail"
      title="热门搜索"
      changBtn="换一批"
    ></tagGroup>
    <!-- 历史搜索 -->
    <!-- <tagGroup
      :hotSearchs="hotSearchsTest1"
      @changeSearch="changeSearch"
      @showBookDetail="showBookDetail"
      title="历史搜索"
      changBtn="清空"
    ></tagGroup> -->
    <SearchList :data="searchList" />
  </div>
</template>
<script>
import SearchList from "../../components/searchs/SearchList";
import searchBar from "../../components/home/searchBar";
import tagGroup from "../../components/searchs/tagGroup";
import { hotSearch, search } from "../../api/api";
export default {
  components: { searchBar, tagGroup, SearchList },
  data() {
    return {
      hotSearchs: [],
      searchList: [],
      keyword: "",
    };
  },
  computed: {
    hotSearchsTest() {
      const _hotSearchs = [];
      this.hotSearchs.forEach((res) => {
        _hotSearchs.push(res.title);
      });
      const _hotSearchsSimple = _hotSearchs.slice(0, 3);
      return _hotSearchsSimple;
    },
  },
  mounted() {
    this.hotSearch();
  },
  methods: {
    search(keywords) {
      var params = {
        keyword: keywords,
      };
      search(params).then((res) => {
        console.log(res);
        this.searchList = res.data.data.book;
      });
    },

    hotSearch() {
      hotSearch().then((res) => {
        this.hotSearchs = res.data.data;
      });
    },
    showBookDetail(item, index) {
      console.log(item, index);
    },
    changeSearch() {
      this.$nextTick(this.hotSearch());
    },
    //点击搜索按钮触发的事件
    keyBoardSearch(data) {
      if (this.keyword.length == 0) {
        this.searchList = [];
      } else {
        this.search(data);
      }
    },
    //清楚搜索词
    onClear() {
      this.keyword = "";
      this.searchList = [];
    },
    // 输入搜索词就有回应
    inputValue(data) {
      this.keyword = data;
      if (this.keyword.length == 0) {
        this.searchList = [];
      } else {
        this.search(data);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
