<template>
	<div ref="container" class="actor_assign">
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
				<div class="content"  @click="goSelectUnion" style="cursor: pointer">
					<!--<el-select v-model="filter.unionId" @change="" placeholder="请选择公会" filterable :filter-method="filterUnion">-->
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
					经纪人：
				</div>
				<div class="content">
					<el-select v-model="filter.brokerId" @change="" placeholder="请选择经纪人">
					    <el-option
							v-for="item in agentList"
							:key="item.uuid"
							:label="item.nickname"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
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
<!-- 			<div class="filter_items">
				<div class="name">
					分配：
				</div>
				<div class="content">
					<el-select v-model="filter.distributeStatus" @change="" placeholder="请选择是否分配">
					    <el-option
							v-for="item in assignList"
							:key="item.uuid"
							:label="item.name"
							:value="item.uuid"
							>
					    </el-option>
					</el-select>
				</div>
			</div> -->


			<div class="filter_items">
				<div class="name">
					ID：
				</div>
				<div class="content">
					<el-input v-model="filter.id" placeholder="请输入ID"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					昵称：
				</div>
				<div class="content">
					<el-input v-model="filter.nickname" placeholder="请输入昵称"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					平台用户ID：
				</div>
				<div class="content">
					<el-input v-model="filter.thirdId" placeholder="请输入直播平台ID"></el-input>
				</div>
			</div>
			<div class="opt_btn">
				<el-button @click="goFilter" type="primary">查询</el-button>
				<el-button @click="resetFilter">重置</el-button>
			</div>
		</div>
		<div ref="operate" class="operate">
			<el-button v-if="isSuperAdmin" @click="batchDelete" type="danger">删除</el-button>
		</div>

		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="actorList"
			    :height="tableHeight"
			    stripe
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="handleSelectionChange">
			    <el-table-column
			    	type="selection"
			    	v-if="edit"
			    	fixed="left"
			    	width="55">
			    </el-table-column>
			    <el-table-column
			    	prop="id"
			    	label="ID">
			    </el-table-column>
			    <el-table-column
			    	width="150"
			      prop="nickname"
			      label="昵称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			    	width="120"
			      prop="thirdId"
			      label="平台用户ID"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="结算方式"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.autoPay | filterAutoPay }}</template>
			    </el-table-column>
			    <el-table-column
			    	width="130"
			      label="待遇（比/底/税）"
			      show-overflow-tooltip>
			      <template slot-scope="scope">
			      	<template v-if="scope.row.shareType == 0">{{scope.row.shareRatio}}</template>
			      	<template v-else>阶梯</template>
			      	/{{scope.row.payFloor}}/{{scope.row.taxRatio}}
			  	  </template>
			    </el-table-column>

			    <el-table-column
			    	width="160"
			      label="保底政策（日/月/总）"
			      show-overflow-tooltip>
			      <template slot-scope="scope">
			      	{{scope.row.validDayHour}}/{{scope.row.validDay}}/{{scope.row.validHour}}
			  	  </template>
			    </el-table-column>

			    <el-table-column
			    	width="120"
			      prop="mobile"
			      label="联系方式"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="unionName"
			      label="公会"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="经纪人"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.broker && scope.row.broker.nickname }}</template>
			    </el-table-column>



			    <el-table-column
			      label="入驻时间"
			      width="122">
			      <template slot-scope="scope">{{ scope.row.createDate | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
<!-- 			    <el-table-column
			      prop="platName"
			      label="平台"
			      show-overflow-tooltip>
			    </el-table-column>
			    
			    <el-table-column
			      prop="identityName"
			      label="真实姓名"
			      show-overflow-tooltip>
			    </el-table-column> -->
			    
			    
			    <el-table-column
			      prop="status"
			      label="状态"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.status | actorStatus }}</template>
			    </el-table-column>

			    <el-table-column v-if="edit" label="操作" width="180" fixed="right">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			        	v-if="isSuperAdmin"
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
	import NewActor from '@/modules/widget/new-actor'
	import {Operate} from '@/config/operate'
  import selectUnion from '@/modules/widget/select-union-v2'


	export default{
		data(){
			return {
				statusList:[{
					name:"全部",
					uuid:''
				},{
					name:"待编辑",
					uuid:-1
				},{
					name:"已启用",
					uuid:0
				},{
					name:"已停用",
					uuid:1
				}],
				assignList:[{
					name:"全部",
					uuid:''
				},{
					name:"未分配",
					uuid:0
				},{
					name:"已分配",
					uuid:1
				}],
				multipleSelection:[],
				tableHeight:250,

				agentList:[],
				platList:[],
				unionList:[],
				actorList:[],
				total:0,
				currentPage:1,
				limit:10,
				filter:{
					platId:"",
          unionId:"",
          unionName:"",
					status:'',
					distributeStatus:'',
					brokerId:"",//经纪人id
					thirdId:"",//第三方id
					orgId:"",//平台／工会id
					id:"",
					nickname:""
				},
        parentId:""
      }
		},
		computed: {
			...mapGetters({
				user: 'userStore/user/user',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			},
			isSuperAdmin(){//超级管理员
				var result = false;
				if(this.user  && this.user.userType == 'SUPER_ADMIN'){
					result = true;
				}
				return result;
			}
	    },

	    methods:{
		    resetFilter(){
		    	this.filter = {
					platId:"",
					unionId:"",
            unionName:"",
					status:'',
					distributeStatus:'',
					brokerId:"",//经纪人id
					thirdId:"",//第三方id
					orgId:"",//平台／工会id
					id:"",
					nickname:""
				}
				this.setDefaultOrg();
				this.getActorList(1);
	    		this.getUnionList();

		    },
	    	goFilter(){
	    		// console.log(this.filter)
	    		this.getActorList();
	    	},
	    	batchDelete(){
	    		let actors = this.multipleSelection;
	    		if(actors.length > 0){
	    			let msg = "确定要删除这"+actors.length+"条数据吗？"
					this.$confirm(msg, '提示', {
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消',
			          	type: 'warning'
			        }).then(() => {
			        	let list = [];
			        	for(var items of actors){
			        		list.push(items.uuid);
			        	}
			          	this.$store.dispatch('actorStore/actor/deleteActor',{list:list}).then(() => {
			          		this.getActorList(1);
						})
			        }).catch(() => {
			                   
			        });
	    		}
	    	},
	    	handleDelete(index,data){
	    		let msg = "确定要删除账号”"+data.nickname+"“吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	let list = [];
		        	list.push(data.uuid);
		          	this.$store.dispatch('actorStore/actor/deleteActor',{list:list}).then(() => {
		          		this.getActorList(1);
					})
		        }).catch(() => {
		                   
		        });
	    	},
	    	handleEdit(index,data){
	    		const user_id = data.uuid;
	    		this.$store.dispatch('userStore/user/getUserDetail',{user_id}).then((resp) => {
	    			let actor = JSON.parse(JSON.stringify(resp.user));
	    			if(actor.broker){
	    				actor.brokerName = actor.broker.nickname;
	    			}

	    			NewActor({
		    			actor:actor,
		    			user:this.user,
		    			callback:() => {
		    				this.getActorList(this.currentPage);
		    			}
		    		})
	    		})
	    	},
	    	handleSelectionChange(val) {
		        this.multipleSelection = val;
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
		    handleSizeChange(limit){
		    	this.limit = limit;
				this.getActorList(1,limit);
			},
			handleCurrentChange(page){
				this.getActorList(page);
			},
		    getActorList(currentPage,limit){
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	let filter = this.filter;
		    	this.$store.dispatch('actorStore/actor/getActorList',{currentPage,limit,filter}).then((resp) => {
		    		this.currentPage = currentPage;
					this.limit = limit;
				    this.actorList = resp.list;
				    this.total = resp.count;
		    	})
		    },
		    changePlat(uuid){
		    	if(uuid){
		    		this.filter.orgId = uuid;
		    	}else{
		    		this.filter.orgId = "";
		    	}
		    	this.filter.unionId = "";
		    	// this.getUnionList(uuid);
          this.parentId = uuid;
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
		    getAgentList(){
		    	this.$store.dispatch('agentStore/agent/getAgentList',{currentPage:1,limit:50}).then((resp) => {
		    		let list = resp.list;
		    		var temp = {
		    			nickname:"无",
		    			uuid:""
		    		}
		    		list.unshift(temp)
		    		this.agentList = list;
				})
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
	    		this.getActorList();
	    	})
	    },
	    created(){
	    	this.getPlatList();
	    	this.getUnionList();
	    	this.getAgentList();
	    },
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.actor_assign{
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
