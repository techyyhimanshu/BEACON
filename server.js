const express=require('express')
const app=express();
const routes=require('./routes/index')
const dotenv=require('dotenv')
const cors=require('cors')
dotenv.config()
app.use(cors({
    origin:'*',
    methods:'GET,HEAD,PUT,POST,DELETE',
    allowedHeaders:'Origin,X-Requested-With,Content-Type,Accept,Authorization'
}))
const PORT=process.env.PORT || 3000

app.use(express.json())
app.use(routes)

app.listen(PORT,()=>console.log('Listening on port: '+PORT))