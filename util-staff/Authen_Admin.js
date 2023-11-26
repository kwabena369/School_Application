






function requireAuth(req,res,next){
         const jwt = require("jsonwebtoken");
    const adminToken  = req.cookies.adminToken;
     if(!adminToken){
           res.redirect('/admin/j');
         return;
     }
           try{
           let Goldenlock = jwt.verify(adminToken,"pickthecup");
            console.log(Goldenlock)
             req.auth_id = Goldenlock._id
              next()
            }catch (err) {
             res.redirect("/admin/l");
           }
     }

     module.exports = {
         adminAuth  :requireAuth
     }