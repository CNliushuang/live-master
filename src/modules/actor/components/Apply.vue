<template>
	<div ref="container" class="actor_assign">
		<div ref="filter" class="filter clearfix">
			<div class="filter_items">
				<div class="name">
					申请日期：
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
					申请平台：
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
			<div class="filter_items">
				<div class="name">
					真实姓名：
				</div>
				<div class="content">
					<el-input v-model="filter.identityName" placeholder="请输入真实姓名"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					联系电话：
				</div>
				<div class="content">
					<el-input v-model="filter.mobile" placeholder="请输入联系电话"></el-input>
				</div>
			</div>
			<div class="opt_btn">
				<el-button @click="goFilter" type="primary">查询</el-button>
				<el-button @click="resetFilter">重置</el-button>
			</div>
		</div>
		<!-- <div ref="operate" class="operate">
			<el-button @click="batchDistribute">分配</el-button>
		</div> -->

		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="actorList"
			    :height="tableHeight"
			    stripe
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="handleSelectionChange">
		<!-- 	    <el-table-column
			    	type="selection"
			    	fixed="left"
			    	width="55">
			    </el-table-column> -->
			    <el-table-column
			      label="申请时间"
			      width="122">
			      <template slot-scope="scope">{{ scope.row.createDate | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="platName"
			      label="申请平台"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="identityName"
			      label="真实姓名"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="mobile"
			      label="联系电话"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="wechat"
			      label="微信号"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="qq"
			      label="QQ号"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="summary"
			      label="接触渠道"
			      show-overflow-tooltip>
			    </el-table-column>

			    <el-table-column
			      label="状态"
			      show-overflow-tooltip>
			      <template slot-scope="scope">{{ scope.row.status == 0?'未审核':'已审核'}}</template>
			    </el-table-column>

			    <el-table-column
			      label="照片"
			      show-overflow-tooltip>
			      <template slot-scope="scope">
				      	<div class="img_box">
				      	<template v-for="items in scope.row.attachments">
				      		<img @click="viewImg(items.url)" :src="items.url" />
				      	</template>
				  		</div>
				  	</template>
			    </el-table-column>


			    <el-table-column v-if="edit" label="操作" width="200" fixed="right">
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          v-if="scope.row.status == 0"
			          @click="handleEdit(scope.$index, scope.row)">审核通过</el-button>
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
	import AssignActor from '@/modules/widget/assign-actor'
	import {Operate} from '@/config/operate'


	export default{
		data(){
			return {
				statusList:[{
					name:"全部",
					uuid:''
				},{
					name:"未审核",
					uuid:0
				},{
					name:"已审核",
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
					identityName:"",
					mobile:"",
					date:"",
					status:''
				}
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
			}
	    },

	    methods:{
		    resetFilter(){
		    	this.filter = {
					platId:"",
					identityName:"",
					mobile:"",
					date:"",
					status:''

				}
				this.setDefaultOrg();
				this.getApplyList(1);
		    },
		    viewImg(url){
		    	if(url){
		    		window.open(url);
		    	}	
		    },
	    	goFilter(){
	    		// console.log(this.filter)
	    		this.getApplyList();
	    	},
	    	batchDistribute(){
	    		let actors = this.multipleSelection;
	    		if(actors.length > 0){
	    			let list = [];
		        	for(var items of actors){
		        		list.push(items.uuid);
		        	}
		        	AssignActor({
	    				actor:{
	    					platId:"",
	    					platName:"",
	    					unionId:"",
	    					unionName:""
	    				},
	    				user:this.user,
	    				callback:(uuid) => {
	    					const orgId = uuid;
	    					this.$store.dispatch('actorStore/actor/assignActor',{orgId,list}).then((resp) => {
		          				this.getApplyList(1);
	    					})
	    				}
	    			})

	    		}
	    	},
	    	handleDelete(index,data){
	    		let msg = "确定要删除该申请吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	let list = [];
		        	list.push(data.uuid);
		          	this.$store.dispatch('actorStore/actor/deleteApply',{list:list}).then(() => {
		          		this.getApplyList(1);
					})
		        }).catch(() => {
		                   
		        });
	    	},
	    	handleEdit(index,data){
	    		const uuid = data.uuid;
	    		let msg = "确定审核通过吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	const status = 1;
		          	this.$store.dispatch('actorStore/actor/changeApplyStatus',{uuid,status}).then(() => {
		          		this.getApplyList(1);
					})
		        }).catch(() => {
		                   
		        });

	    	},
	    	handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var filter = this.$refs.filter.offsetHeight;
		    	var operate = this.$refs.operate && this.$refs.operate.offsetHeight || 0;
		    	var page = this.$refs.page.offsetHeight;
		    	var tableHeight = container - filter - operate -page -24;
		    	console.log(tableHeight);
		    	this.tableHeight = tableHeight;
		    },
		    handleSizeChange(limit){
		    	this.limit = limit;
				this.getApplyList(1,limit);
			},
			handleCurrentChange(page){
				this.getApplyList(page);
			},
		    getApplyList(currentPage,limit){
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	let filter = this.filter;
		    	this.$store.dispatch('actorStore/actor/getApplyList',{currentPage,limit,filter}).then((resp) => {
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
		    	this.getUnionList(uuid);
		    },
		    getPlatList(){
		    	const orgId = this.user.orgId;
		    	this.$store.dispatch('platStore/platform/getPlatFormList',{orgId,currentPage:1,limit:50}).then((resp) => {
		    		this.platList = resp.list;
				})
		    },
		    getUnionList(parentId){
		    	let orgId = this.user.orgId;
		    	parentId = parentId ||  this.user.orgId;
		    	this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50}).then((resp) => {
		    		this.unionList = resp.list;
				})
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
	    		this.getApplyList();
	    	})
	    },
	    created(){
	    	this.getPlatList();
	    	// this.getUnionList();
	    	// this.getAgentList();
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

  		.img_box{
  			img{
  				width:20px;
  				height:20px;
  				cursor:pointer;
  				margin-right:6px;
  				margin-top:10px;
  			}
  		}

  	}
</style>
