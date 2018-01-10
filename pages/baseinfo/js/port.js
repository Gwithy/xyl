
var PagePort = function(){
    return {
        defaultOption: {
            basePath:"",
            portGrid : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.portGrid = mini.get("portGrid");
            this.portGrid.setUrl(PageMain.defaultOption.httpUrl + "/port/getList")
            this.funSearch();
        },
        funSearch : function()
        {
        	var portForm = new mini.Form("portForm");
        	this.portGrid.load(portForm.getData());
        },
        funReset : function()
        {
        	var portForm = new mini.Form("portForm");
        	portForm.setData();
            mini.get("queryParamFlag").setValue("1");
            this.portGrid.load(portForm.getData());
        },
        funAdd : function()
        {
        	var paramData = {action: "add", row:{}, title:"新增数据"};
            this.funOpenInfo(paramData);
        },
        funModify : function()
        {
        	var row = this.portGrid.getSelected();
            if(row)
            {
            	var paramData = {action: "modify", row: row, title:"编辑数据"};
                this.funOpenInfo(paramData);
            }
            else
            {
            	PageMain.funShowMessageBox("请选择一条记录");
            }
        },
        funRendererPortType : function (e)
        {
            if (e.value == 1)
            {
                return "集装箱"
            }
            else if (e.value == 2)
            {
                return "其它"
            }
            return e.value;
        },
        funOperRenderer : function(e)
        {
            return '<a class="mini-button-icon mini-iconfont icon-detail" style="display: inline-block;  height:16px;padding:0 10px;" title="详情查看" href="javascript:PagePort.funDetail()"></a>';
        },
        funDetail : function()
        {
            var row = this.portGrid.getSelected();
            var paramData = {action: "oper", row:row, title:"查看详细"};
            this.funOpenInfo(paramData);
        },
        funOpenInfo : function(paramData)
        {
        	var me = this;
        	mini.open({
                url: PageMain.funGetRootPath() + "/pages/baseinfo/port_add.html",
                title: paramData.title,
                width: 650,
                height: 30 *  11 + 65,
                onload:function(){
                    var iframe=this.getIFrameEl();
                    iframe.contentWindow.PagePortAdd.funSetData(paramData);
                },
                ondestroy:function(action){
                	me.portGrid.reload();
                }
            })
        },
        funDelete : function()
        {
            var row = this.portGrid.getSelected();
            var me = this;
            if(row)
            {
                mini.confirm("确定要删除这条记录?", "提醒", function (action) {
                    if (action == "ok") 
                    {
                        $.ajax({
                            url : PageMain.defaultOption.httpUrl + "/port/del",
                            type: 'POST',
                            data: {"id": row.id},
                            dataType: 'json',
                            success: function (data)
                            {
                            	
                            	 if (data.success)
                                 {
                                     mini.alert("操作成功", "提醒", function(){
                                         if(data.success)
                                         {
                                        	 me.portGrid.reload();
                                         }
                                     });
                                 }
                                 else
                                 {
                                     PageMain.funShowMessageBox(data.msg);
                                 }
                            },
                            error: function ()
                            {
                                PageMain.funShowMessageBox("删除记录失败");
                            }
                        });
                    }
                })
            }
            else
            {
                mini.alert("请先选择要删除的记录");
            }
        }
    }
}();

$(function(){
	PagePort.init();
});