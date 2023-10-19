const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/dbConnect')
const morgan = require('morgan')
const cors = require('cors')

const { errorHandler } = require('./middlewares/errorHandler')
const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const categoryRouter = require('./routes/categoryRoute')
const brandRouter = require('./routes/brandRoute')
const colorRouter = require('./routes/colorRoute')

dbConnect()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/color', colorRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})