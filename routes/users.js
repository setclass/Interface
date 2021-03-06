const e = require('express');
var express = require('express');
var router = express.Router();
let db = require("ykt-mongo");
/* GET users listing. */
// router.get('/student', function(req, res, next) {
//   res.send('respond with a resource');
// });
//登录接口
router.get("/student", function (req, res, next) {
  db.collection("login").find(req.query, function (data) {

    if (data.length > 0) {
      res.send({
        code: 1,
        msg: "登录成功！"
      })
    } else {
      res.send({
        code: 0,
        msg: "登录失败"
      })

    }
  })
});
//注册接口
router.post("/addStudent", function (req, res, next) {
  db.collection("login").insert(req.body, function (data) {
    if (data.result.ok == 1 && data.result.n == 1) {
      res.send({
        code: 1,
        msg: "注册成功"
      })
    } else {
      res.send({
        code: 0,
        msg: "注册失败"
      })
    }
  });
});
//上传文件
let multiparty = require("multiparty");
let path = require("path");
const { totalmem } = require('os');

router.post("/upload", function (req, res) {
  let form = new multiparty.Form({
    uploadDir: "./public/upload"  //指定保存上传文件的路径
  })
  form.parse(req, function (err, fields, files) {
    let key = Object.keys(files)[0] //获取上传信息中的key
    if (err) {
      res.send(err)
    } else {
      res.send({
        status: 1,
        url: path.basename(files[key][0].path)
      }) //根据key获取上传的文件名并返回
    }
  })
})


//添加接口
router.post("/content", function (req, res, next) {
  db.collection("move").insert(req.body, function (data) {
    if (data.result.ok == 1 && data.result.n == 1) {
      res.send({
        code: 1,
        msg: "添加成功"
      })
    } else {
      res.send({
        code: 0,
        msg: "添加失败"
      })
    }
  })
})
//获取数据
router.get("/obtain", function (req, res, next) {
  db.collection("move").findByPage(req.query.page, req.query.limit, {}, function (data) {
    console.log(data)
    res.send({
      code: 0,
      msg: "返回成功",
      count: data.total,
      data: data.rows,
      total: data.total,
      page:data.curpage
    });

  })
})
//编辑接口
router.put("/editor", function (req, res, next) {
  let updateObj = req.body;
  let _id = db.ObjectID(updateObj._id);
  delete updateObj._id;

  db.collection("move").update({ _id: _id }, updateObj, function (data) {

    if (data.result.n == 1 && data.result.nModified == 1 && data.result.ok == 1) {
      res.send({
        code: 1,
        mgs: "更新成功！"
      })
    } else {
      res.send({
        code: 0,
        mgs: "更新失败！"
      })
    }
  })
});
//删除接口
router.delete("/dele", function (req, res, next) {
  let _id = db.ObjectID(req.body._id)
  console.log(req.body)
  db.collection("move").remove({ _id: _id }, function (data) {
    // console.log(data);
    if (data.result.n == 1 && data.result.ok == 1) {
      res.send({
        code: 1,
        msg: "删除成功！"
      })
    } else {
      res.send({
        code: 0,
        msg: "删除失败！"
      })
    }
  })
})
module.exports = router;
