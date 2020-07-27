const express = require('express')  //使用express
const app = express()
const exphbs = require('express-handlebars')  //handlebars
const port = 3000
const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const restList = require('./restaurant.json')

const Restaurant = require('./models/restaurant') // 載入 restaurant model

mongoose.connect('mongodb://localhost/Restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))


//setting static files
app.use(express.static('public'))



// ...
app.get('/', (req, res) => {
  // 取出 Restaurant model 裡的所有資料
  Restaurant.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板 restaurants 是拿到的資料
    .catch(error => console.error(error)) // 錯誤處理
})


//detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//edit
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//edit
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      return restaurant.save()
    })
    .then(() => res.redirect('/restaurants/${id}'))
    .catch(error => console.log(error))
})

//delete
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//點擊圖片
app.get('/restaurants/:id/show', (req, res) => {
  // console.log(req.params.restaurant_id)
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//search bar
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})