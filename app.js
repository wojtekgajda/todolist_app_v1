const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const date = require(__dirname + '/date.js')


const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
let itemsList = []
let workItems = []

app.get('/', function (req, res) {
    let day = date()
    res.render('list', {listTitle: day, itemsList: itemsList})

})

app.post('/', function (req, res) {
    let item = req.body.newItem
    if (req.body.list === 'Work list') {
        workItems.push(item)
        res.redirect('/work')
    }else{
        itemsList.push(item)
        res.redirect('/')
    }
})

app.get('/work', function (request, response) {
    response.render('list', {listTitle: 'Work list', itemsList: workItems})
})

app.listen(3000, function () {
    console.log('Server running on port 3000')
})

