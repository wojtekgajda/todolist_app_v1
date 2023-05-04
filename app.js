const express = require('express')
const bodyParser = require('body-parser')
// const ejs = require('ejs')
const _ = require('lodash')
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')
const app = express()

//app
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

//mongoose
mongoose.connect('mongodb://localhost:27017/todolistDB')

const itemSchema = mongoose.Schema({
    name: String
})

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
})


const TodoModel = mongoose.model('DailyItems', itemSchema, 'dailyItems')
const ListModel = mongoose.model('List', listSchema,)
const day = date.getDate()


app.get('/', function (req, res) {

    TodoModel.find().then(function (items) {
        res.render('list', {listTitle: day, itemsList: items})
    }).catch(function (err) {
        console.log(err)
    })
})

app.post('/', function (req, res) {
    const item = req.body.newItem
    const listName = req.body.list
    if (item.trim().length > 0) {
        if (listName !== day) {
            ListModel.findOne({name: listName}).then(function (foundList) {
                foundList.items.push({name: item})
                foundList.save().then(() => console.log('Item saved'))
            })
            res.redirect('/' + listName)
        } else {
            const todoItem = new TodoModel({
                name: item
            })
            todoItem.save().then(() => console.log(todoItem + " item added"))
            res.redirect('back')
        }
    } else {
        res.redirect('back')
    }
})

// remove from list

app.post('/delete', function (req, res) {
    const deleteItemID = req.body.checkbox
    const listName = req.body.listName
    console.log(deleteItemID)
    console.log(listName)
    setTimeout(function () {
        if (listName !== day) {
            ListModel.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deleteItemID}}}).then(listFound => {
                listFound.save()
                console.log('List updated')
                res.redirect('back')
            }).catch(err => console.log(err))
        } else {
            TodoModel.findByIdAndRemove(deleteItemID).then(console.log(deleteItemID + " item removed from list database"))
            res.redirect('back')
        }
    }, 1500)
})

// Add Custom List

app.get('/:customListName', function (req, res) {
    const customListName = _.capitalize(req.params.customListName)

    ListModel.findOne({name: customListName}).then((response) => {
        if (response === null) {
            const list = new ListModel({
                name: customListName,
                items: []
            })
            list.save().then(() => {
                res.redirect('/' + customListName)
                console.log('New list added to database')
            })
        } else {
            res.render('list', {listTitle: customListName, itemsList: response.items})
        }
    }).catch(err => {
        console.log(err)
    })
})


app.listen(3000, function () {
    console.log('Server running on port 3000')
})

