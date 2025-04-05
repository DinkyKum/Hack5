const express= require('express');
const profileRouter=express.Router();
const {validateEditData}= require('../utils/validation')
const {companyAuth, traderAuth} =  require('../middlewares/auth');
const TransportCompany = require('../models/transportCompany');
const jwt=require('jsonwebtoken');
const Trader= require('../models/trader');
const Admin = require('../models/admin');


profileRouter.get('/profile', async (req, res) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({ message: "User not logged in" });
      }
  
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      const { _id, role } = decodedData;
  
      let user;
  
      if (role === 'company') {
        user = await TransportCompany.findById(_id).select('-password');
      } else if (role === 'admin') {
        user = await Admin.findById(_id).select('-password');
      } else if (role === 'trader') {
        user = await Trader.findById(_id).select('-password');
      } else {
        return res.status(400).json({ message: "Invalid role in token" });
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ ...user.toObject(), role });

    } catch (err) {
      console.error("Error in /me route:", err);
      res.status(500).json({ message: "Something went wrong", error: err.message });
    }
  });

profileRouter.get('/companyProfile',companyAuth, async(req, res)=>{
    try{
        const company= await req.company;
        res.send(company);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})
profileRouter.get('/traderProfile',traderAuth, async(req, res)=>{
    try{
        const trader= await req.trader;
        res.send(trader);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.put('/profile/companyEdit',companyAuth, async(req, res)=>{
   try { 
    validateEditData(req);
    const loggedInCompany= req.company;

    Object.keys(req.body).forEach((k)=>
        loggedInCompany[k]=req.body[k]
    )

    await loggedInCompany.save();

    res.send("Company deatils Updated Succesfully" + loggedInCompany);
}
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})
profileRouter.put('/profile/traderEdit', traderAuth, async (req, res) => {
    try {
      validateEditData(req);
  
      const loggedInTrader = req.trader;
  
      // Update only the fields present in req.body
      Object.keys(req.body).forEach((key) => {
        loggedInTrader[key] = req.body[key];
      });
  
      await loggedInTrader.save();
  
      res.send("Trader details updated successfully: " + JSON.stringify(loggedInTrader));
    } catch (err) {
      res.status(400).send("There is some error: " + err.message);
    }
  });
  

//While calling it in frontend make sure to call logout just after this!
profileRouter.delete('/profile/delete', companyAuth, async(req, res)=>{
    try{
        console.log(req.company);
        const companyId= req.company._id;
        console.log(companyId);

        const deletedCompany = await TransportCompany.findByIdAndDelete(companyId);
        if(!deletedCompany) throw new Error("Company Not Found");

        res.cookie("token", null, {expires: new Date(Date.now())});

        res.send(deletedCompany + "deleted Succesfully and User logged Out");
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

module.exports=profileRouter;