






function requireAuth(req,res,next){
    const jwt = require("jsonwebtoken");
const adminToken  = req.cookies.Applicant_ID;
 
if(!adminToken){
      //   for them to return
       return;
}
      try{
      let Goldenlock = jwt.verify(adminToken,"pickthecup");
      //  console.log(Goldenlock)
        req.auth_id = Goldenlock._id
         next()
       }catch (err) {
        res.status(400).send("the token expire");
       res.redirect('/apply/l');
      }
}

module.exports = requireAuth