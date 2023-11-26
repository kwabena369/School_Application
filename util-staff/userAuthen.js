






function requireAuth(req,res,next){
    const jwt = require("jsonwebtoken");
const adminToken  = req.cookies.UserToken;
 
if(!adminToken){
      res.redirect('/apply/teacher');
    return;
}
      try{
      let Goldenlock = jwt.verify(adminToken,"pickthecup");
      //  console.log(Goldenlock)
        req.auth_id = Goldenlock._id
         next()
       }catch (err) {
        res.status(400).send("the token expire");
      }
}

module.exports = requireAuth