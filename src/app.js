const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const pubPath = path.join(__dirname,'../public')
console.log(pubPath);

app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static(pubPath))

app.use(session({
    secret:'19BCT024902360251',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect('mongodb://localhost:27017/smartPayDB',{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log('connected to db on 27017');
})
mongoose.set("useCreateIndex",true)

const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    wallet:Number
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User',userSchema)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/',(req,res)=>{
    res.render('login')
})

app.get('/home',(req,res)=>{
    if(req.isAuthenticated()){

        User.findOne({
            username: req.user.username
        },(err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.render('home',{
                    username: req.user.username,
                    money: result.wallet
                })
            }
        })

    }else{
        res.redirect('/')
    }
})

app.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/')
})

app.post('/login',(req,res)=>{

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/home')
            })
        }
    })

})

app.post('/register',(req,res)=>{
    
    User.register({username: req.body.username},req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect('/')
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/home')
            })

            User.updateOne({username:req.body.username},{wallet:0,email:req.body.email},(err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log('done with wallet');
                }
            })

        }
    })

})

app.post('/transfer',(req,res)=>{
    User.findOne({username:req.body.userId},(err,response)=>{
        if(err){
            console.log(err);
        }else{
            if(response){
                User.updateOne({username:req.body.userId},{wallet:(response.wallet+Number(req.body.amount))},(err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log('successfully paid')
                        User.findOne({username:req.user.username},(err,result)=>{
                            if(err){
                                console.log(err);
                            }else{
                                User.updateOne({username:result.username},{wallet:(result.wallet-Number(req.body.amount))},(err)=>{
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log('done n dusted');
                                        res.redirect('/home')
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                console.log('no username found');
                res.redirect('/home')
            }
        }
    })

    

})

app.post('/add',(req,res)=>{
    
    User.findOne({username:req.user.username},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            User.updateOne({username:req.user.username},{wallet:(result.wallet+Number(req.body.amount))},(err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('added yesss');
                    res.redirect('/home')
                }
            })   
        }
    })

})



app.listen(3030,()=>{
    console.log('Server running on port 3030');
})

