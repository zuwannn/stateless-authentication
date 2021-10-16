/* import All library */
const express = require('express')
const jwt = require('jwt-simple')
const passport = require('passport')
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt 
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy 

const app = express()
app.use(express.json()) // ให้รับ json จาก body ได้

const SECRET = "mysecretkey" //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ

//สร้าง Strategy
const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader("authorization"),
    secretOrKey: SECRET //SECRETเดียวกับตอนencodeในกรณีนี้คือ mysecretkey
}

const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
    if(payload.sub === "suwannee") done(null, true)
    else done(null, false)
})

//เสียบ Strategy เข้า Passport
passport.use(jwtAuth)

//ทำ Passport Middleware
const requireJWTAuth = passport.authenticate("jwt",{session:false});

//เสียบ middleware ยืนยันตัวตน JWT เข้าไป
app.get("/", requireJWTAuth, (req, res) => {
    res.send("ยอดเงินคงเหลือ 50");
 });

//ทำ Middleware สำหรับขอ JWT
const loginMiddleware = (req, res, next) => {
    if(req.body.username === "suwannee" && 
       req.body.password === "123") next()
    else res.send("wrong username or password")
}

app.post('/login', loginMiddleware, (req, res) => {
    const payload = {
        sub: req.body.username,
        iat: new Date().getTime() //มาจากคำว่า issued at time (สร้างเมื่อ)
    }
    res.send(jwt.encode(payload, SECRET))
})

app.listen(3000)