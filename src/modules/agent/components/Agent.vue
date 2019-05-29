<template>
	<div ref="container" class="agent_list">
		<div ref="filter" class="filter clearfix">
			<div class="filter_items">
				<div class="name">
					平台：
				</div>
				<div class="content">
					<el-select :disabled="user.platId?true:false" v-model="filter.platId" @change="changePlat" placeholder="请选择平台">
					    <el-option
							v-for="item in platList"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					公会：
				</div>
        <div class="content" @click="goSelectUnion" style="cursor: pointer">
          <!--<el-select v-model="filter.unionId" @change="changeUnion" placeholder="请选择公会"  filterable :filter-method="filterUnion">-->
					    <!--<el-option-->
							<!--v-for="item in unionList"-->
							<!--:key="item.uuid"-->
							<!--:label="item.name"-->
							<!--:value="item.uuid"-->
							<!--&gt;-->
					    <!--</el-option>-->
					<!--</el-select>-->
          <el-input :value="filter.unionName" readonly="" placeholder="请选择公会" ></el-input>
          <i v-if="filter.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					经纪人名称：
				</div>
				<div class="content">
					<el-input v-model="filter.nickname" placeholder="请输入经纪人名称"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					经纪人ID：
				</div>
				<div class="content">
					<el-input v-model="filter.id" placeholder="请输入经纪人ID"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					状态：
				</div>
				<div class="content">
					<el-select v-model="filter.status" @change="" placeholder="请选择状态">
					    <el-option
							v-for="item in statusList"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div>

			<div class="opt_btn">
				<el-button @click="goFilter" type="primary">查询</el-button>
				<el-button @click="resetFilter" type="primary">重置</el-button>
			</div>
		</div>
		<div ref="operate" class="operate">
			<el-button v-if="edit" @click="goAddAgent">添加</el-button>
		</div>
		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="agentList"
			    :height="tableHeight"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="">
<!-- 			    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column> -->
			    <el-table-column
			      prop="id"
			      label="经纪人ID">
			    </el-table-column>
			    <el-table-column
			      prop="nickname"
			      label="经纪人名称"
			      width="120">
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      width="120">
				    <template slot-scope="scope">{{ scope.row.createDate | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="platName"
			      label="平台名称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="unionName"
			      label="公会名称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="status"
			      label="状态"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.status == 0?"已启用":"已停用" }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="shareRatio"
			      label="分成比例"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="taxRatio"
			      label="个税"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="actorsCount"
			      label="主播数量"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column v-if="edit" label="操作" width="180" fixed="right">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>


			  </el-table>
			</div>
			<div ref="page" class="page">
				<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[10,20, 30, 40, 50]"
			      :page-size="limit"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>


	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	import newAgent from '@/modules/widget/new-agent'
	import {Operate} from '@/config/operate'
  import selectUnion from '@/modules/widget/select-union-v2'


	export default{
		data(){
			return {
				accountGroupList:[],
				tableHeight:200,
				platList:[],
				unionList:[],
				statusList:[{
					uuid:1,
					name:"已停用",
				},{
					uuid:0,
					name:"已启用",
				}],
				filter:{
					nickname:"",
					id:"",
					platId:"",
					unionId:"",
          unionName:"",
					status:0,
				},
				limit:10,
        parentId:""
			}
		},
		computed: {
			...mapGetters({
				agentList: 'agentStore/agent/agentList',
				total: 'agentStore/agent/total',
				currentPage: 'agentStore/agent/currentPage',
				// limit: 'agentStore/agent/limit',
				user: 'userStore/user/user',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			}
	    },
		methods:{
			resetFilter(){
				this.filter = {
					nickname:"",
					id:"",
					platId:"",
					unionId:"",
          unionName:"",
					status:0,
				};
				this.setDefaultOrg();
				this.getAgentList(1);
	    		this.getUnionList();
			},
			handleEdit(index,data){
				newAgent({
					user:this.user,
					agent:data,
					callback:() => {
						this.getAgentList(1);
					}
				})
			},
			handleDelete(index,data){
				console.log(data)
				let msg = "确定要删除”"+data.nickname+"“吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.$store.dispatch('agentStore/agent/deleteAgent',{uuid:data.uuid}).then(() => {
		          		this.getAgentList();
					})
		        }).catch(() => {
		                   
		        });
			},
			handleSizeChange(limit){
				this.limit = limit;
				this.getAgentList(1,limit);
			},
			handleCurrentChange(page){
				this.getAgentList(page);
			},
			goAddAgent(){
				newAgent({
					user:this.user,
					callback:() => {
						this.getAgentList(1);
					}
				})
			},
			setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var filter = this.$refs.filter.offsetHeight;
		    	var operate = this.$refs.operate.offsetHeight;
		    	var page = this.$refs.page.offsetHeight;
		    	var tableHeight = container - filter - operate -page -24;
		    	console.log(tableHeight);
		    	this.tableHeight = tableHeight;
		    },
		    goFilter(){
		    	this.getAgentList(1);
		    },
		    getAgentList(currentPage,limit){//获取账号列表
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	let filter = this.filter;
				this.$store.dispatch('agentStore/agent/getAgentList',{currentPage,limit,filter}).then(() => {

				})
		    },
		    changePlat(uuid){
                if(uuid){
                    this.filter.platId = uuid;
                }else{
                    this.filter.platId = "";
                }
                this.filter.unionId = "";
                this.filter.unionName = "";
                // this.getUnionList(uuid);
                this.parentId = uuid;
            },
            changeUnion(uuid){
                if(uuid){
                    this.filter.unionId = uuid;
                }
                var union = null;
                for(var items of this.unionList){
                    if(items.uuid == uuid){
                        union = items;
                    }
                }
                if(union){
                    this.filter.unionName = union.name;
                    // this.filter.autoPay = union.autoPay;
                }
            },
		    getPlatList(){
		    	const orgId = this.user.orgId;
		    	this.$store.dispatch('platStore/platform/getPlatFormList',{orgId,currentPage:1,limit:50}).then((resp) => {
		    		this.platList = resp.list;
				})
		    },
		    filterUnion(key){
		    	this.filter.unionId = '';
		    	let orgId = this.user.orgId;
		    	let parentId = this.user.orgId;
			    this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50,searchKey:key}).then((resp) => {
			    		this.unionList = resp.list;
					})
		    },
		    getUnionList(parentId){
		    	let orgId = this.user.orgId;
		    	parentId = parentId ||  this.user.orgId;
		    	this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50}).then((resp) => {
		    		this.unionList = resp.list;
				})
		    },
        goSelectUnion(){
          selectUnion({
            user:this.user,
            orgId:this.user.orgId,
            parentId:this.parentId ||  this.user.orgId,
            callback:(list) => {
              if(list.length){
                this.filter.unionId = list[0].uuid;
                this.filter.unionName = list[0].name;
              }else{
                this.filter.unionId = '';
                this.filter.unionName = '';
              }
            }
          })
        },
        clearSelectUnion(){
          this.filter.unionId = '';
          this.filter.unionName = '';
        },
			setDefaultOrg(){
		    	if(this.user){
		    		this.filter.platId = this.user.platId;
		    		this.filter.unionId = this.user.unionId;
		    		if(!this.user.unionId && this.user.managerOrgs && this.user.managerOrgs.length > 0){
		    			this.filter.unionId = this.user.managerOrgs[0].uuid;
		    		}
		    	}
		    }
	    },
	    watch:{
	    	user(){
	    		this.setDefaultOrg();
	    	}
	    },
		mounted(){
	    	setTimeout(() => {
	    		this.setHeight();
	    		this.setDefaultOrg();
				this.getAgentList();
	    	})
	    },
		created(){
			this.getPlatList();
	    	this.getUnionList();
		}
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.agent_list{
  		padding-left: 20px;
  		position: absolute;
  		left: 0;
  		top: 0;
  		right: 0;
  		bottom: 0;
  		overflow: auto;
  		.filter{
  			.filter_items{
  				float: left;
  				margin-right: 20px;
  				margin-bottom: 10px;
  				.name{
  					min-width: 60px;
  					height: 30px;
  					line-height: 30px;
  					float: left;
  				}
  				.content{
  					float: left;
            position: relative;
            .el-icon-error{
              position: absolute;
              right: 11px;
              top: 10px;
              font-size: 12px;
              color: #c0c4cb;
              display: none;
            }
            &:hover{
              .el-icon-error{
                display: block !important;
              }
            }
  					/deep/ .el-select{
			  			width: 150px;
			  		}
			  		/deep/ .el-input{
			  			width: 150px;
			  		}
  				}
  			}
  			.opt_btn{
  				float: left;
  			}
  		}
  		.operate{
  			padding: 10px 0;
  			/deep/ .el-button{
  				float: left;
  				margin-right: 10px;
  			}
  		}
  		.page{
  			padding: 10px 0;
  		}
  	}
</style>
