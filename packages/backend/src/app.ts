import process, {env} from 'process'
import express from 'express'
import cors from 'cors'
import router from './router'

const production = false
const PORT= 8443
const app = express()

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({limit: '10mb', extended: true, parameterLimit: 50000}))
app.use(cors())
app.use('/api', router)

const start = async () => {
    try {
        const server = app.listen(PORT, `${production? '0.0.0.0' : '127.0.0.1'}`, () => {
            console.log(`Server listening on ${PORT}!`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()