<template>
	<div ref="container" class="group_list">
		<div ref="filter" class="filter clearfix">
			<div class="filter_items">
				<div class="name">
					归属平台：
				</div>
				<div class="content">
					<el-select :disabled="user.platId?true:false" v-model="filter.orgId" @change="" placeholder="请选择归属平台">
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
				<div class="content">
					<el-input :disabled="disableUnion" v-model="filter.name" placeholder="请输入公会名称"></el-input>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					公会ID：
				</div>
				<div class="content">
					<el-input v-model="filter.id" placeholder="请输入公会ID"></el-input>
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
					管理员：
				</div>
				<div class="content">
					<el-input v-model="filter.adminName" placeholder="请输入管理员名称"></el-input>
				</div>
			</div>

			<div class="opt_btn">
				<el-button @click="getUnionList(1)" type="primary">查询</el-button>
				<el-button @click="resetFilter">重置</el-button>
			</div>
		</div>
		<div ref="operate" class="operate">
			<el-button v-if="edit" @click="goAddUnion">添加</el-button>
		</div>
		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="groupList"
			    :height="tableHeight"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="">
		<!-- 	    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column> -->
			    <el-table-column
			      prop="id"
			      label="公会ID"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="公会名称"
			      width="120"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      width="120"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.createDate | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="parentName"
			      label="归属平台"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
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
			      label="承担税点"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="代发工资"
			      show-overflow-tooltip>
				   <template slot-scope="scope">{{ scope.row.autoPay | filterAutoPay}}</template>
			    </el-table-column>
			    <el-table-column
			      label="管理员账号"
			      width="120"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.majorAdmin && scope.row.majorAdmin.loginName}}</template>
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
	import newUnion from '@/modules/widget/new-union'
	import {Operate} from '@/config/operate'



	export default{
		data(){
			return {
				accountList:[],
				accountGroupList:[],
				tableHeight:200,
				platList:[],
				statusList:[{
					uuid:1,
					name:"已停用",
				},{
					uuid:0,
					name:"已启用",
				}],
				filter:{
					name:"",
					id:"",
					orgId:"",
					status:0,
					adminName:""
				},
				disablePlat:false,
				disableUnion:false,
				limit:10
			}
		},
		computed:{
			...mapGetters({
				user: 'userStore/user/user',
				total: 'groupStore/group/total',
				currentPage: 'groupStore/group/currentPage',
				// limit: 'groupStore/group/limit',
				groupList: 'groupStore/group/groupList',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			}
		},
		methods:{
			handleEdit(index,data){
				newUnion({
					user:this.user,
					union:data,
					callback:() => {
						this.getUnionList();
					}
				})
			},
			handleDelete(index,data){
				let msg = "确定要删除”"+data.name+"“吗？"
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.$store.dispatch('groupStore/group/deleteGroup',{uuid:data.uuid}).then(() => {
		          		this.getPlatList();
					})
		        }).catch(() => {
		                   
		        });
			},
			goAddUnion(){
				newUnion({
					user:this.user,
					callback:() => {
						this.getUnionList(1);
					}
				})
			},
			resetFilter(){
				this.filter = {
					name:"",
					id:"",
					orgId:"",
					status:0,
				}
				this.setDefaultOrg();
				this.getUnionList(1);
			},
			handleSizeChange(limit){
				this.limit = limit;
				this.getUnionList(1,limit);
			},
			handleCurrentChange(page){
				this.getUnionList(page);
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
		    getUnionList(currentPage,limit){//获取账号列表
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	const orgId = this.user.orgId;
		    	const parentId = this.user.orgId;
		    	const filter = this.filter;
				this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,filter,currentPage,limit}).then(() => {
				})
		    },
		    getPlatList(){
		    	const orgId = this.user.orgId;
				this.$store.dispatch('platStore/platform/getPlatFormList',{orgId,currentPage:1,limit:50}).then((resp) => {
					this.platList = resp.list
				})
		    },
			setDefaultOrg(){
		    	if(this.user){
		    		this.filter.orgId = this.user.platId;
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
				this.getUnionList();
	    	})
	    },
		created(){
			this.getPlatList();
		}
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.group_list{
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
  	}
</style>
