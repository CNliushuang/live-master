<template>
    <fbui-modal class="select-stage-modal" :title="title" @destroy="destroy" @submit="submit">
        <div class="select-stage-body">
          <div class="search_wrapper">
            <el-input
              placeholder="请输入关键字搜索"
              prefix-icon="el-icon-search"
              v-model="key">
            </el-input>
          </div>
            <ul class="stage-list" @scroll="loadMore">
                <template v-if="unionList && unionList.length">
                    <li v-for="item in unionList" class="al" :class="{'active':isActive(item.uuid)}" @click="selectUnion(item)">{{ item.name }}</li>
                </template>
                <template v-else>
                    <li>暂无可选数据</li>
                </template>
    		    </ul>
        </div>
    </fbui-modal>
</template>

<script>
import FbuiModal from '@/modules/widget/common/Modal'


export default{
	components: {
      FbuiModal,
  },
	data(){
		return {
      title:'选择公会',
      callback: null,
      unionList: [],
      key:"",
      select:[],
      locked:false,

      count:0,
      limit:30,
		}
	},
  watch:{
	  'key'(){
	    this.$nextTick(() => {
	      this.getUnionList(0)
      })
    }
  },
	methods: {
      changeKey(key){
          this.stage = this.lists.filter(item =>{
              return item.name.indexOf(key) !== -1
          })
      },
      getUnionList(start){
          this.locked = true;
          setTimeout(() => {
            this.locked = false;
          },5000)
          start = start || 0;
          // const orgId = this.user.orgId;
          // let parentId =  this.user.platId ||  this.user.orgId;
          $API.group.getGroupList({orgId:this.orgId,parentId:this.parentId,start,limit:this.limit,searchKey:this.key},resp => {
              this.count = resp.count;
              if(start == 0){
                this.unionList = resp.list;
              }else{
                this.unionList = this.unionList.concat(resp.list);
              }
              this.locked = false;
          })
      },
      selectUnion(item){
        var isExist = false,index=0;
        for(var items of this.select){
          if(items.uuid == item.uuid){
            isExist = true;
          }
        }
        if(isExist){
          this.select.splice(index,1)
        }else{
          if(this.multi){
            this.select.push(item);
          }else{
            this.select = [item];
            this.callback && this.callback(this.select);
            this.destroy();
          }
        }
      },
      isActive(uuid){
        var result = false;
        if(uuid){
          for(var items of this.select){
            if(items.uuid == uuid){
              result = true;
            }
          }
        }
        return result;
      },
      loadMore(e){
        if(e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight <= 0){
          if(this.unionList.length < this.count && !this.locked){
            this.lock = false;
            this.getUnionList(this.unionList.length);
          }
        }
      },
      destroy(){
          this.$el &&
          this.$el.parentNode &&
          this.$el.parentNode.removeChild(this.$el);
          this.$destroy();
      },
      submit(close){
          if(this.callback){
              this.callback(this.select);
          }
          close && close();
      }
    },
    created(){
        this.getUnionList();
    }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/config/config.less";
	.select-stage-modal{
        .select-stage-body{
          width:400px;
          height: 300px;
          display: flex;
          flex-direction: column;
        }
        .search_wrapper{
          height: 30px;
          flex-shrink: 0;
          margin-bottom: 10px;
        }
        .stage-list {
            overflow-y: auto;
            box-sizing: border-box;
            font-size: 12px;
            flex-grow: 1;
            li {
                height: 35px;
                line-height: 35px;
                padding-left: 10px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 40px;
                &:hover {
                    background: url(../images/check.svg) no-repeat 95% center;
                    background-color: #eaf5ff;
                    background-size:20px;
                };
                &.active {
                    background: url(../images/check.svg) no-repeat 95% center;
                    background-color: #eaf5ff;
                    background-size:20px;
                }
            }
        }
    } 
</style>
