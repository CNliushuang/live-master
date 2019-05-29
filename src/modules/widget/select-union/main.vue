<template>
    <fbui-modal class="select-stage-modal" :title="title" @destroy="destroy" @submit="submit">
        <div class="select-stage-body">
        	<!-- <search @search="changeKey" placeholder="搜索阶段"></search> -->
            <ul class="stage-list">
                <template v-if="unionList && unionList.length">
                    <li v-for="item in unionList" class="al" :class="{'active':isActive(item.uuid)}" @click="selectUnion(item)">{{ item.name }}</li>
                </template>
                <template v-else>
                    <li>暂无可选数据</li>
                </template>
    		</ul>
        </div>
        <!-- <v-button slot="footer" slot-scope="props" @click.native="submit(props.close)" :type="'blue'">确定</v-button> -->
    </fbui-modal>
</template>

<script>
import FbuiModal from '@/modules/widget/common/Modal'
// import VButton from '@/modules/widget/common/Button'
// import Search from '@/modules/widget/common/Search';


export default{
	components: {
        FbuiModal,
        // VButton,
        // Search,
    },
	data(){
		return {
            title:'选择公会',
            callback: null,
            unionList: [],
            stage_id: '',
            select_stage:null,
            key:"",
            select:[]
		}
	},
	methods: {
        changeKey(key){
            this.stage = this.lists.filter(item =>{
                return item.name.indexOf(key) !== -1
            })
        },
        getUnionList(){
            const orgId = this.user.orgId;
            let parentId =  this.user.platId ||  this.user.orgId;
            $API.group.getGroupList({orgId,parentId,start:0,limit:50},resp => {
                this.unionList = resp.list;
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
            this.select.push(item);
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
        .select-stage-body{width:400px;}
        .stage-list {
            height: 210px;
            overflow-y: auto;
            box-sizing: border-box;
            font-size: 12px;
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
