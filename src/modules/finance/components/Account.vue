<template>
	<div ref="container" class="account_list">
		<div ref="filter" class="filter clearfix">
			<div class="filter_items">
				<div class="name">
					平台名称：
				</div>
				<div class="content">
					<el-select :disabled="user.platId?true:false" :clearable="true" v-model="filter.platId" @change="changePlat" placeholder="请选择平台">
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
					公会名称：
				</div>
        <div class="content" @click="goSelectUnion" style="cursor: pointer">
					<!--<el-select   v-model="filter.unionId" @change="changeUnion" placeholder="请选择公会" filterable :filter-method="filterUnion">-->
					    <!--<el-option-->
							<!--v-for="item in unionList"-->
							<!--:key="item.uuid"-->
							<!--:label="item.name"-->
							<!--:value="item.uuid"-->
							<!---->
							<!--&gt;-->
					    <!--</el-option>-->
					<!--</el-select>-->
          <el-input :value="filter.unionName" readonly="" placeholder="请选择公会" ></el-input>
          <i v-if="filter.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					日期：
				</div>
				<div class="content">
					<el-date-picker
				      v-model="filter.date"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					昵称：
				</div>
				<div class="content">
					<el-input :clearable="true" v-model="filter.nickname" placeholder="请输入昵称"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					直播ID：
				</div>
				<div class="content">
					<el-input :clearable="true" v-model="filter.thirdId" placeholder="请输入直播ID"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					账单状态：
				</div>
				<div class="content">
					<el-select :clearable="true" v-model="filter.status" @change="" placeholder="请选择状态">
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
				<el-button @click="getAccountList(1)" type="primary">查询</el-button>
				<el-button @click="resetFilter">重置</el-button>
			</div>
		</div>
		<div ref="operate" class="operate">
			<el-button v-if="edit" @click="batchCalculate">批量入账</el-button>
			<el-button v-if="batchDelete" @click="goBatchDelete">批量删除</el-button>
			<div v-if="(!user.unionId && (!user.managerOrgs || user.managerOrgs.length == 0) ) && edit" class="opt_right" style="float:right;">
				<el-button @click="goAutoCalculate">自动入账</el-button>
				<el-button @click="goImportFlow">账单导入</el-button>
			</div>
		</div>
		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="accountList"
			    :height="tableHeight"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @sort-change="sortChange"
			    @selection-change="handleSelectionChange">
			    <el-table-column
			      type="selection"
			      v-if="edit"
			      width="55">
			    </el-table-column>
			    <el-table-column
			      label="日期"
			      width="120"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.day | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="trackNum"
			      label="账单号"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column>
<!-- 			    <el-table-column
			      label="平台"
			      show-overflow-tooltip>
				   <template slot-scope="scope">{{ scope.row.creator.platName }}</template>
			    </el-table-column> -->
			    
			    <el-table-column
			      label="公会"
			      show-overflow-tooltip>
				   <template slot-scope="scope">{{ scope.row.creator.unionName }}</template>
			    </el-table-column>
			    <el-table-column
			      label="昵称"
			      show-overflow-tooltip>
				   <template slot-scope="scope">{{ scope.row.creator.nickname }}</template>
			    </el-table-column>
			    <el-table-column
			    	width="120"
			      label="平台用户ID"
			      show-overflow-tooltip>
				   <template slot-scope="scope">{{ scope.row.creator.thirdId }}</template>
			    </el-table-column>
			   	<el-table-column
			      prop="showHour"
			      label="直播时长"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      width="120"
			      prop="todayFansCount"
			      label="今日粉丝量"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      width="120"
			      prop="yesterdayFansCount"
			      label="昨日粉丝量"
			      show-overflow-tooltip>
			    </el-table-column>
			    

<!-- 			    <el-table-column
			      label="真实姓名"
			      show-overflow-tooltip>
				   <template slot-scope="scope">{{ scope.row.creator.identityName }}</template>
			    </el-table-column> -->
			    <el-table-column
			      prop="shareNum"
			      label="入账金额/元"
			      width="120"
			      sortable="custom"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.shareNum | filterMoney}}</template>

			    </el-table-column>
			    <el-table-column
			      label="账单状态"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.status == 0?"待入账":"已入账" }}</template>
			    </el-table-column>
	<!-- 		    <el-table-column
			      prop="month_money"
			      label="本月已入账/元"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column> -->
	<!-- 		    <el-table-column
			      prop="average_money"
			      label="平均入账/元"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column> -->
			    <el-table-column v-if="edit" label="操作" width="180" fixed="right">
			      <template slot-scope="scope">
			      	<template v-if="scope.row.creator.unionId && scope.row.creator.status == 0 && scope.row.status != 1">
			      		<el-button
				          size="mini"
				          @click="handleEdit(scope.$index, scope.row)">入账</el-button>
			      	</template>
			      	<template v-else-if="scope.row.status == 1">
			      		<el-tooltip class="item" effect="dark" content="" placement="bottom">
			      			<el-button size="mini" disabled>已入账</el-button>
					    </el-tooltip>
			      	</template>
			      	<template v-else>
			      		<el-tooltip class="item" effect="dark" content="分配公会并且已启用才可入账" placement="bottom">
			      			<el-button size="mini" disabled>入账</el-button>
					    </el-tooltip>
			      	</template>
			        

			        <el-button
			        	v-if="isSuperAdmin"
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			</div>
			<div ref="analyze" class="count_analyze">
				<div class="items">
					<div class="top">
						今日导入账单金额/元
					</div>
					<div class="bottom">
						{{analyze && analyze.todayShareNum || 0}}
					</div>
				</div>
				<div class="items">
					<div class="top">
						今日导入账单数
					</div>
					<div class="bottom">
						{{analyze && analyze.todayShareCount || 0}}
					</div>
				</div>
				<div class="items">
					<div class="top">
						今日已入账金额/元
					</div>
					<div class="bottom">
						{{analyze && analyze.todayDoneShareNum || 0}}
					</div>
				</div>
				<div class="items">
					<div class="top">
						今日待入账金额/元
					</div>
					<div class="bottom">
						{{analyze && analyze.todayWaitShareNum || 0}}
					</div>
				</div>
				<div class="items">
					<div class="top">
						今日待入账账单数
					</div>
					<div class="bottom">
						{{analyze && analyze.todayWaitShareCount || 0}}
					</div>
				</div>
				<div class="items">
					<div class="top">
						历史待入账账单数
					</div>
					<div class="bottom">
						{{analyze && analyze.shareCount || 0}}
					</div>
				</div>
				<div class="items">
					<div class="top">
						入账阀值/元
					</div>
					<div class="bottom">
						{{analyze && analyze.maxEntry || 0}}
					</div>
				</div>
			</div>

			<div ref="page" class="page">
				<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage"
			      :page-sizes="[10,20, 50,100]"
			      :page-size="limit"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>


	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	import ImportFlow from '@/modules/widget/import-flow';
	import {Operate} from '@/config/operate'
  import selectUnion from '@/modules/widget/select-union-v2'


	export default{
		data(){
			return {
				platList:[],
				unionList:[],
				tableHeight:200,
				orgType:[{
					uuid:"SYSTEM",
					name:"系统",
				},{
					uuid:"PLAT",
					name:"平台",
				},{
					uuid:"UNION",
					name:"公会",
				}],
				statusList:[{
					uuid:1,
					name:"已入账",
				},{
					uuid:0,
					name:"待入账",
				}],
				filter:{
					orgId:"",
					platId:"",
					unionId:"",
          unionName:"",
					date:"",
					nickname:"",
					thirdId:"",
					status:0
				},
				multipleSelection:[],
				limit:10,
				sorters:[],
        parentId:""

			}
		},
		computed: {
			...mapGetters({
				accountList: 'financeStore/account/accountList',
				analyze: 'financeStore/account/analyze',
				total: 'financeStore/account/total',
				currentPage: 'financeStore/account/currentPage',
				// limit: 'financeStore/account/limit',
				user: 'userStore/user/user',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			},
			batchDelete(){
				var result = false;
				if(this.edit && (!this.user.unionId && (!this.user.managerOrgs || this.user.managerOrgs.length == 0))){
					result = true;
				}
				return result;
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
			sortChange(data){
				console.log(data);
				if(data.prop){
					let column = data.prop;
					if(column == 'shareNum'){
						column = 'share_num';
					}


					let direction = data.order == 'ascending'?'asc':'desc';
					let sorters = {
						column:column,
						direction:direction
					}
					this.sorters.push(sorters);
				}else{
					this.sorters = [];
				}
				
				this.getAccountList();

			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    goAutoCalculate(){
		    	let msg = "确定要自动入账吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.$store.dispatch('financeStore/account/autoCalculate').then(() => {
		          		this.getAccountList();
					})
		        }).catch(() => {
		                   
		        });
		    },
			handleDelete(index,data){
				let msg = "确定要删除吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	let list = [];
		        	list.push(data.uuid);
		          	this.$store.dispatch('financeStore/account/deleteAccount',{list}).then(() => {
		          		this.getAccountList();
					})
		        }).catch(() => {
		                   
		        });
			},
			batchCalculate(){
	    		let account = this.multipleSelection;
	    		if(account.length > 0){
	    			let msg = "确定要批量入账吗？"
					this.$confirm(msg, '提示', {
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消',
			          	type: 'warning'
			        }).then(() => {
			        	let list = [];
			        	for(var items of account){
			        		list.push(items.uuid);
			        	}
			        	this.$store.dispatch('financeStore/account/calculateAccount',{list}).then(() => {
			          		this.getAccountList();
						})
			        }).catch(() => {
			                   
			        });
	    			
	    		}
	    	},
	    	goBatchDelete(){
	    		let account = this.multipleSelection;
	    		if(account.length > 0){
	    			let msg = "确定要批量删除这些数据吗？"
					this.$confirm(msg, '提示', {
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消',
			          	type: 'warning'
			        }).then(() => {
			        	let list = [];
			        	for(var items of account){
			        		list.push(items.uuid);
			        	}
			        	this.$store.dispatch('financeStore/account/deleteAccount',{list}).then(() => {
			          		this.getAccountList();
						})
			        }).catch(() => {
			                   
			        });
	    			
	    		}
	    	},
			handleEdit(index,data){
				let msg = "确定要入账吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	let list = [];
		        	list.push(data.uuid);
		          	this.$store.dispatch('financeStore/account/calculateAccount',{list}).then(() => {
		          		this.getAccountList();
					})
		        }).catch(() => {
		                   
		        });
			},
			goImportFlow(){
				let param = localStorage.getItem('requestParam');
				if(param){
					param = JSON.parse(param);
				}
				ImportFlow({
					token:param.token,
					plat:param.plat,
					orgId:this.user.orgId,
					user:this.user,
					callback:() => {
						
					}
				})
			},
			handleSizeChange(limit){
				this.limit = limit;
				this.getAccountList(1,limit);
			},
			handleCurrentChange(page){
				this.getAccountList(page);
			},
			setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var filter = this.$refs.filter.offsetHeight;
		    	var operate = this.$refs.operate.offsetHeight;
		    	var page = this.$refs.page.offsetHeight;
		    	var analyze = this.$refs.analyze.offsetHeight;
		    	var tableHeight = container - filter - operate - analyze - page -24;
		    	console.log(tableHeight);
		    	this.tableHeight = tableHeight;
		    },
		    resetFilter(){
		    	this.filter ={
					orgId:"",
					platId:"",
					unionId:"",
            unionName:"",
					date:"",
					nickname:"",
					thirdId:"",
					status:0
				}
				this.setDefaultOrg();
				this.getAccountList(1);
				this.getUnionList();

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
		    changeUnion(uuid){
		    	if(uuid){
		    		this.filter.orgId = uuid;
		    	}else{
		    		if(this.filter.platId){
		    			this.filter.orgId = this.filter.platId;
		    		}
		    	}
		    },
		    getAccountList(currentPage,limit){//获取账号列表
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	let filter = this.filter;
		    	let sorters = this.sorters;

		    	console.log(this.filter)

				this.$store.dispatch('financeStore/account/getAccountList',{currentPage,limit,filter,sorters}).then(() => {

				})



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
				this.getAccountList();
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
  	.account_list{
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
			  		/deep/ .el-input.is-disabled .el-input__inner{
			  			height: 30px !important;
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
  		.count_analyze{
  			display: flex;
  			flex-direction: row;
  			color: #606266;
  			padding: 10px;
  			.items{
  				flex:1;
  				.top,.bottom{
  					text-align: left;
  				}
  				.bottom{
  					margin-top: 6px;
  				}
  			}
  		}
  		.page{
  			padding: 10px 0;
  		}
  	}
</style>
