const express = require('express')
const app = express()

const middleware = (req, res, next) => {
    // ตรวจสอบว่า authorization คือ Boy หรือไม่
    if(req.headers.authorization === "Boy")
        next() // อนุญาตให้ไปฟังก์ชันถัดไป
    else
        res.send("ไม่อนุญาค")
}
app.get('/', middleware, (req, res)=>{ // เพิ่มmiddlewareขั้นกลาง
    res.send('ยอดเงินคงเหลือ 50')
})

app.listen(3000)