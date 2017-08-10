'use strict';
let express =require('express');
let orm=require('orm');
let bodyparser=require("body-parser");
let app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(orm.express("sqlite:public/CodingGirlsClub.db",{
    define:function (db,models,next) {
        models.Position=db.define("POSITIONS",{
            id:{type:'number'},
            title:{type:'text'},
            company:{type:'text'},
            description:{type:'text'},
            applyMethod:{type:'text'},
            expiryDate:{type:'text'},
            category:{type:'text'},
            jobType:{type:'text'},
            tags:{type:'text'},
            city:{type:'text'},
            country:{type:'text'},
            condition:{type:'text'},
            owner:{type:'number'},
            publishTime:{type:'text'},
            invalidTime:{type:'text'}
        });
        models.User=db.define("USERS",{
            id:{type:'number'},
            usrName:{type:'text'},
            usrPassword:{type:'text'},
            usrEmail:{type:'text'},
            usrCompanyName:{type:'text'},
            usrCompanyAddress:{type:'text'},
            usrCompanyProfession:{type:'text'}
        });
        next();
    }
}));
//此处写API
app.get("/",function(req,res){
    req.models.User.find(null,function(err,user){
        res.json(user);
    })
})
//5.POST  注册一个新用户(接收一个用户JSON对像)

app.post("/users",function (req,res) {
    var newRecord={};
    var countx=0;
    req.models.User.count(null,function(err,edcount){
        countx=edcount;
        console.log(edcount);
        newRecord.id=countx+1;
        newRecord.usrPassword=req.body.signConfirmPassword;
        req.models.User.create(newRecord,function(err,re){
            if(err)  return res.status(500).json({error:err});
            console.log("ok");
        })

    })


})
//6. PUT 修改一个用户的用户信息(接受一个用户JSON对象)
app.put("/users/:emailID",function (req,res) {


    req.models.User.find({usrEmail:req.params.emailID},function (err,user) {
        if(err) return res.status(500).json({error:err.message})

        user[0].usrpassword=req.body.detailPassword;
        user[0].CompanyName=req.body.detailCompanyName;
        user[0].usrCompanyAddress=req.body.detailCompanyAddress;
        user[0].usrCompanyProfession=req.body.detailCompanyProfession;

        user[0].save(function (err) {
            if(err) return res.status(500).json({error:err.message})
            res.json({message:"用户更新成功"})

        })
    })
})


var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});