<template>
	<div ref="container" class="account_group">
		<div ref="operate" class="operate">
			<el-button v-if="edit" @click="goAddAccountGroup">添加</el-button>
		</div>
		<div class="account_group_list">
			<el-table
			    ref="multipleTable"
			    :data="accountGroup"
			    :height="tableHeight"
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="">
	<!-- 		    <el-table-column
			      type="selection"
			      width="55">
			    </el-table-column> -->
			    <el-table-column
			      prop="name"
			      label="组名称"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      width="120"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.createDate && scope.row.createDate | timesToDate('yyyy-MM-dd') || '-'}}</template>
			    </el-table-column>
			    <el-table-column
			      label="数据级别"
			      show-overflow-tooltip>
				    <template slot-scope="scope">{{ scope.row.orgType | filterOrgType }}</template>
			    </el-table-column>
			    <el-table-column
			      label="权限"
			      show-overflow-tooltip>
				  <template slot-scope="scope">
				  	{{ scope.row.configStatus == 0?"未配置":"已配置" }}
				  </template>
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      show-overflow-tooltip>
			      <template slot-scope="scope">
				  	{{ scope.row.status == 0?"已启用":"已停用" }}
				  </template>
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
	import newAccountGroup from '@/modules/widget/new-account-group'
	import {Operate} from '@/config/operate'
	
	export default{
		data(){
			return {
				groupList:[],
				tableHeight:250,
				limit:10
			}
		},
		computed: {
			...mapGetters({
				accountGroup: 'limitStore/limit/accountGroup',
				total: 'limitStore/limit/total',
				currentPage: 'limitStore/limit/currentPage',
				// limit: 'limitStore/limit/limit',
				user: 'userStore/user/user',
				authorities: 'limitStore/limit/authorities',
				nav: 'homeStore/home/nav',
				authorities_nav: 'userStore/user/authorities',
			}),
			edit(){
				let path = this.$route.path;
				return Operate(this.user,path,this.nav,this.authorities_nav);
			}
	    },
		methods:{
			goAddAccountGroup(){
				newAccountGroup({
					authorities:this.authorities,
					callback:() => {
						this.getAccountGroup(1);
					}
				})
			},
			handleEdit(index,data){
				const uuid = data.uuid;
				/*获取详情以后再进行修改*/
				this.$store.dispatch('limitStore/limit/getAccountGroupDetail',{uuid}).then((resp) => {
					newAccountGroup({
						authorityGroup:resp.authorityGroup,
						authorities:this.authorities,
						callback:() => {
							this.getAccountGroup(1);
						}
					})
				})
			},
			handleDelete(index,data){
				const uuid = data.uuid;
				const msg = "确定要删除该账号组吗？";
				this.$confirm(msg, '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.$store.dispatch('limitStore/limit/deleteAccountGroup',{uuid}).then((resp) => {
						this.getAccountGroup(1);
					})
		        }).catch(() => {
		        	
		        });
			},
			handleSizeChange(limit){
				this.getAccountGroup(1,limit);
			},
			handleCurrentChange(page){
				this.getAccountGroup(page);
			},
			setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var operate = this.$refs.operate.offsetHeight;
		    	var page = this.$refs.page.offsetHeight;
		    	var tableHeight = container - operate - page -24;
		    	console.log(tableHeight);
		    	this.tableHeight = tableHeight;
		    },
		    getAccountGroup(currentPage,limit){//获取管理组列表
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
				this.$store.dispatch('limitStore/limit/getAccountGroup',{currentPage,limit}).then(() => {

				})
		    },
		    getAuthoritiesList(){//获取系统默认管理权限列表
		    	this.$store.dispatch('limitStore/limit/getAuthoritiesList').then(() => {

				})
		    }
		},
		mounted(){
	    	setTimeout(() => {
	    		this.setHeight();
	    	})
	    },
		created(){
			this.getAccountGroup();
			this.getAuthoritiesList();
		}
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.account_group{
  		padding-left: 20px;
  		position: absolute;
  		left: 0;
  		top: 0;
  		right: 0;
  		bottom: 0;
  		overflow: auto;
  		.operate{
  			margin-bottom: 20px;
  		}
  	}
</style>
