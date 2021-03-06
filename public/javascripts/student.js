$("#addBtn").click(function(){
    let obj={
        name:$("#name").val(),
        password:$("#password").val()
    }
    $.ajax({
        url:"http://127.0.0.1:3000/users/student",
        type:"get",
        data:obj,
        datatype:"json",
        success:function(res){
           console.log(res.code)
           if(res.code==1){
               alert("登录成功");
           }else{
            alert("账号或密码错误，请重新输入");
           }
        }
        
    })
});
$("#registerBtn").click(function(){
    let obj={
        name:$("#name").val(),
        password:$("#password").val()
    };
    $.ajax({
        url:"http://127.0.0.1:3000/users/addStudent",
        type:"post",
        data:obj,
        datatype:"json",
        success:function(res){
           console.log(res.code)
           if(res.code==1){
               alert("注册成功");
           }else{
            alert("注册失败");
           }
        }
        
    });
});


