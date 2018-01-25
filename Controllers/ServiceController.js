var Service = require('./../models/Service');


module.exports = {

    postService:function(req,res,next){
        
        var ser = new Service();

        ser.name = req.body.name;
        ser.img_url = req.file.path;
        ser.body = req.body.body;
        ser.price = req.body.price;

        ser.save(function(err,data){
            console.log(req.file);
            res.send(data);
        });
       
    }



}