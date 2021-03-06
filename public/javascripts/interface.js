layui.use(['element', 'layer', 'form', 'laydate', 'upload'], function () {
    var element = layui.element;
    var layer = layui.layer;
    var form = layui.form;
    var laydate = layui.laydate;
    var upload = layui.upload;




    // 刚进入页面渲染学生列表 
    renderStudent()

    // 点击添加
    $("#addBtn").click(function () {
        layer.open({
            type: 1, //提示信息
            content: $("#studentHandelBox"), //这里content是一个普通的String
            title: "添加学生",
            skin: "layui-layer-molv",
            area: '500px',
            offset: '30px',
            btn: ["提交", "关闭"],
            yes: function () {
                let addStudentObj = {
                    name: $("#nameInput").val(),
                    bornDate: $("#bornDateInput").val(),
                    pro: $("#proInput").val(),
                    phone: $("#phoneInput").val(),
                    address: $("#addressInput").val(),
                }
                if ($("input[name = 'sex']")[0].checked) {
                    addStudentObj.sex = $($("input[name = 'sex']")[0]).val()
                } else {
                    addStudentObj.sex = $($("input[name = 'sex']")[1]).val()
                }
                addStudentObj.imgUrl = $("#handleImg").attr("src")
                $.ajax({
                    url: "http://127.0.0.1:9527/student/addStudent",
                    data: addStudentObj,
                    type: "post",
                    dataType: "json",
                    success: function (res) {
                        if (res.code == 1) {
                            layer.msg('添加成功！', {
                                icon: 1,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                //do something
                                layer.closeAll(); //疯狂模式，关闭所有层
                                renderStudent()
                            });

                        }
                    }
                })

            },
            btn2: function () {
                console.log("关闭");
            },
            shade: 0.3,
            anim: 3,
            maxmin: true
        });
        form.render();

        $.ajax({
            url: "http://127.0.0.1:9527/class/getClass",
            data: {
                page: 1,
                limit: 1000
            },
            type: "get",
            dataType: "json",
            success: function (res) {
                let list = res.data
                console.log(list);
                for (let q = 0; q < list.length; q++) {
                    let option = $(`
                        <option value=${list[q].name}>${list[q].name}</option>
                    `)
                    $("#classesInput").append(option)
                }
                form.render(); //更新全部
            }
        })

        //执行一个laydate实例       //日期input实例化
        laydate.render({
            elem: '#bornDateInput' //指定元素
        });


        //执行实例          上传按钮的实例化
        var uploadInst = upload.render({
            elem: '#uploadBtn' //绑定元素
            , url: 'http://127.0.0.1:9527/upload' //上传接口
            , done: function (res) {
                //上传完毕回调
                console.log(res);
                let imgUrl = res.url
                $("#handleImg").attr("src", "http://127.0.0.1:9527/upload/" + imgUrl)
            }
            , error: function () {
                //请求异常回调
            }
        });

        // layer.open({
        //     type: 4,
        //     content: ['提示的内容', '#testBtn'] //数组第二项即吸附元素选择器或者DOM
        // });

    })

    //点击删除
    $("#myTbody").on("click", ".del-btn", function () {
        let _id = $(this).attr("_id")
        layer.confirm('是否删除该学生?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            console.log(index);
            layer.close(index);
            $.ajax({
                url: "http://127.0.0.1:9527/student/delStudent",
                data: {
                    _id: _id
                },
                type: "delete",
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.closeAll()
                        renderStudent()
                    } else {
                        layer.msg("删除失败！")
                    }
                }
            })
        });
    })

    // 点击编辑
    $("#myTbody").on("click", ".edit-btn", function () {
        let studentInfo = JSON.parse($(this).attr("studentinfo"))
        console.log(studentInfo);
        $("#nameInput").val(studentInfo.name)
        $("#bornDateInput").val(studentInfo.bornDate)
        $("#proInput").val(studentInfo.pro)
        $("#phoneInput").val(studentInfo.phone)
        $("#addressInput").val(studentInfo.address)
        if (studentInfo.sex == "男") {
            $("input[name = 'sex']")[0].checked = true
        } else {
            $("input[name = 'sex']")[1].checked = true
        }


        layer.open({
            type: 1, //提示信息
            content: $("#studentHandelBox"), //这里content是一个普通的String
            title: "编辑学生",
            skin: "layui-layer-molv",
            area: '500px',
            btn: ["提交", "关闭"],
            yes: function () {
                let editStudentObj = {
                    name: $("#nameInput").val(),
                    bornDate: $("#bornDateInput").val(),
                    pro: $("#proInput").val(),
                    phone: $("#phoneInput").val(),
                    address: $("#addressInput").val(),
                    _id: studentInfo._id
                }
                if ($("input[name = 'sex']")[0].checked) {
                    editStudentObj.sex = $($("input[name = 'sex']")[0]).val()
                } else {
                    editStudentObj.sex = $($("input[name = 'sex']")[1]).val()
                }
                $.ajax({
                    url: "http://127.0.0.1:9527/student/updateStudent",
                    data: editStudentObj,
                    type: "put",
                    dataType: "json",
                    success: function (res) {
                        if (res.code == 1) {
                            layer.msg('更新成功！', {
                                icon: 1,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                //do something
                                layer.closeAll(); //疯狂模式，关闭所有层
                                renderStudent()
                            });
                        } else {
                            layer.msg("更新失败！")
                        }
                    }
                })
            },
            btn2: function () {
                console.log("关闭");
            },
            shade: 0.3,
            anim: 3,
            maxmin: true
        });
        form.render();
        //执行一个laydate实例
        laydate.render({
            elem: '#bornDateInput' //指定元素
        });
    })

    // 点击搜索
    $("#searchBtn").click(function () {
        let data = {
            type: $("#typeSel").val(),
            value: $("#searchValueInput").val()
        }
        $.ajax({
            url: "http://127.0.0.1:9527/student/searchStudent",
            data: data,
            dataType: "json",
            type: "get",
            success: function (res) {
                console.log(res);
            }
        })
    })


    // 拉取学生数据渲染到页面上
    function renderStudent() {
        $.ajax({
            url: "http://127.0.0.1:9527/student/getStudent",
            type: "get",
            data: {},
            dataType: "json",
            success: function (res) {
                console.log(res);
                $("#myTbody").html("")
                if (res.code == 1) {
                    for (let q = 0; q < res.data.length; q++) {
                        let tr = $(`
                            <tr>
                                <td>
                                    <img src=${res.data[q].imgUrl} />
                                </td>
                                <td>${res.data[q].name}</td>
                                <td>${res.data[q].sex}</td>
                                <td>${res.data[q].bornDate}</td>
                                <td>${res.data[q].pro}</td>
                                <td>${res.data[q].phone}</td>
                                <td>${res.data[q].address}</td>
                                <td>
                                    <button type="button" class="layui-btn layui-btn-sm edit-btn" studentInfo=${JSON.stringify(res.data[q])}>编辑</button>
                                    <button type="button"
                                        class="layui-btn layui-btn-sm layui-btn-danger del-btn" _id=${res.data[q]._id}>删除</button>
                                </td>
                            </tr>
                        `)
                        $("#myTbody").append(tr)
                    }
                }

            }
        })
    }
});