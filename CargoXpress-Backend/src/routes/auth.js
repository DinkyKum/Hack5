const express= require('express');
const authRouter= express.Router();
const {validateSignupData}=require('../utils/validation')
const bcrypt = require('bcrypt');
const TransportCompany= require('../models/transportCompany');
const Trader= require('../models/trader');

authRouter.post('/signup/:userType', async (req, res)=>{
    try{
    const {userType}=req.params;
      if(userType!="company" && userType!= "trader") throw new Error("Invalid User Type");

      let user=null;
        const {password}= req.body;
        const Hashpassword= await bcrypt.hash(password, 10)
    
        if(userType=="company"){
            const {name, emailId, registrationNumber}= req.body;
            validateSignupData(req);
            const company= new TransportCompany({
                name, emailId, password:Hashpassword, registrationNumber
            });
            user=company;
            await company.save();
        }
        
      else if(userType=="trader") {
        const {name, emailId, aadharNumber}= req.body;
        validateSignupData(req);
    
        const trader= new Trader({
            name, emailId, password:Hashpassword, aadharNumber
        });
        user=trader;
        await trader.save();
      }

      const token= await user.getJWT();
      res.cookie("token", token);
      res.json({message: `${userType} Added Successfully`, data:user})
     } 
  
     catch(err){
      res.status(400).send("There is an error" + err);
     }
  })

  authRouter.post('/login', async(req, res)=>{
    try{
        const {emailId, password}= req.body;

        let user= await TransportCompany.findOne({emailId: emailId});
          
        if(user==null){
            user= await Trader.findOne({emailId: emailId});
          }

          if(user==null){
            user= await Admin.findOne({emailId: emailId});
          }

          if(!user){
              throw new Error("Invalid Credentials")
          }

          const isPasswordValid= await user.validatePassword(password);

          if(isPasswordValid){
            const token= await user.getJWT();

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,  
                sameSite: "none",  
              });
              
            res.send(user);
        }
        else{
            throw new Error("Invalid Credentials")
        }
    }
    catch(err){
        res.status(400).send("There is some error" + err);
    }
})

authRouter.post('/logout', async(req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("LoggedOut Successfully");
})


module.exports= authRouter;