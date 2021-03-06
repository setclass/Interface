$("body").on("click", ".edit", function () {
    let obj = JSON.parse($(this).attr("info"));
    $("#upImg").attr("src", obj.img);
    $(".layui-input").val(obj.name);

    layui.use(['layer', 'rate','table'], function () {
        rate = layui.rate
        ins1 = rate.render({
            elem: '#grade', //绑定元素
            value: obj.grade,
            text: true,
            setText: function (value) {
                var arrs = {
                    '1': '1分'
                    , '2': '2分'
                    , '3': '3分'
                    , '4': '4分',
                      '5': '5分'
                };
                this.span.text(arrs[value] || (value + "分"));
            },
            choose: function (value) {
                Tvalue = value;
            }
        });

        layer = layui.layer;
        layer.open({
            area: ['400px', '500px'],
            type: 1,
            content: $("#set")
            , btn: ['提交', '关闭'],
            yes: function (index, layero) {
                $("body").on("click", ".layui-layer-btn0", function () {
                    let addCont = {
                        _id:obj._id,
                        img: $("#upImg").attr("src"),
                        name: $(".layui-input").val(),
                        grade: Tvalue
                    }
                    $.ajax({
                        url: "http://127.0.0.1:3000/users/editor",
                        type: "put",
                        data: addCont,
                        datatype: "json",
                        success: function (res) {
                            if (res.code == 1) {
                                alert("编辑成功");
                                table = layui.table;
                                layer.closeAll()
                                tableIns.reload({
                                    where: { //设定异步数据接口的额外参数，任意设
                                    }
                                    ,page: {
                                    }
                                });
                                // table.reload('idTest', {
                                //     url: 'http://127.0.0.1:3000/users/obtain'
                                //     ,where: {} //设定异步数据接口的额外参数
                                //     //,height: 300
                                //   });
                                // table.reload('idTest', {
                                //     url: 'http://127.0.0.1:3000/users/editor'
                                //     , where: {} //设定异步数据接口的额外参数
                                //     //,height: 300
                                //    , cols: [[ //表头
                                //         , {
                                //             field: 'img', title: '封面', width: 130, templet: function (d) {
                                //                 return `<img src=${d.img}>`
                                //             }
                                //         }
                                //         , { field: 'name', title: '名称', width: 80 }
                                //         , { field: 'grade', title: '评分', width: 80 }
                                //         , {
                                //             field: 'wealth', title: '操作', width: 134, templet: function (d) {
                                //                 return `
                                //                 <button type="button" class="layui-btn layui-btn-normal edit" style="width:40px;height:40px;padding:0px;line-height: 0px;" info=${JSON.stringify(d)}>编辑</button>
                                //                         <button type="button" class="layui-btn"  style="width:40px;height:40px;padding:0px 5px;line-height: 0px;">删除</button>`
                                //             }
                                //         }
                                //     ]]
                                // });
                                
                            } else {
                                alert("编辑失败");
                            }
                        }
                    })
                })
            }
        })


    })
})
$("body").on("click", ".del", function () {
let obj=JSON.parse($(this).attr("_id"));
let _id=obj._id;
layer.confirm('是否删除该学生?', {
    icon: 3,
    title: '提示'
}, function (index) {
    //do something
    console.log(index);
    layer.close(index);
    $.ajax({
        url: "http://127.0.0.1:3000/users/dele",
        data: {
            _id: _id
        },
        type: "delete",
        dataType: "json",
        success: function (res) {
            if (res.code == 1) {
                layer.closeAll()
                tableIns.reload({
                    where: { //设定异步数据接口的额外参数，任意设
                    }
                    ,page: {
                    }
                });
            } else {
                layer.msg("删除失败！")
            }
        }
    })
});

})