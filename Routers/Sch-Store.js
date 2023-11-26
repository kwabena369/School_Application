const express = require('express');
 const storeRouter =  express.Router();

 storeRouter.use(express.static("public"))

 storeRouter.get("/",(req,res)=>{
     res.render("Pages/store.ejs")
 })

  module.exports = storeRouter;