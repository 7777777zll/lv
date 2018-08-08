<template>
	<div class="about_no_data">
		<div class="table_null">
			<img src="../assets/noData.png">
			<p class="text">暂无数据</p>
		</div>
	</div>
</template>
<script type="text/javascript">
    export default {
        data () {
            return {
        	}
        },
    }
</script>
<style lang="scss">
	.about_no_data{
	    height: 400px;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}
	.table_null{
		width:165px;
		text-align:center;
		img{
			width:100%;
		}
		.text{
			font-size:17px;
			color:#666;
			margin-top:15px;
		}
	}
</style>