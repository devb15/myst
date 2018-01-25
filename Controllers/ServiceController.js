module.exports = {

    postService:function(req,res,next){

        console.log(req.file);
        res.send(req.body);
        
    }



}