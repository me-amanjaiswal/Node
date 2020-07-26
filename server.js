let express = require("express")
let app = express()

let sanitizeHtml = require("sanitize-html")

let mongodb = require('mongodb')
let db

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


let port = process.env.PORT
if(port== null || port==""){
  port=80
}

let connectionString = "mongodb+srv://toDoApp:qwerty@1234@cluster0-zks3i.mongodb.net/firstApp?retryWrites=true&w=majority"

mongodb.connect(connectionString,{useUnifiedTopology: true},function(err,client){
  db = client.db()
  app.listen(port)
})


function passwordProtected(req,res,next)
{
  res.set('www-Authenticate', 'Basic realm="Simple To Do app"')
  //console.log(req.headers.authorization)
  if(req.headers.authorization == 'Basic YW1hbjp0b2RvYXBw')
  {
    next()
  }
  else{
    res.status("401").send("entry not allowed")
  }
  
}
app.use(passwordProtected)

app.get("/", function (req, res){
    db.collection("items").find().toArray(function(err, items){
      res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App !</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="createForm" action="/createlist" method="POST">
            <div class="d-flex align-items-center">
              <input id="createField" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="itemList" class="list-group pb-5">

        </ul>
        
      </div>
      </body>
      <script>
        let items = ${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <!-- Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL. -->
    <script src="/browser.js"></script>
    </html>`)
    })  
})

app.post("/create-item", function(req , res){
  let safetext = sanitizeHtml(req.body.text , {allowedTags :[] , allowedAttributes: {} }  )
  db.collection("items").insertOne({text : safetext}, function(err, info)
  {
    res.json(info.ops[0])
  })
  
})

app.post("/update-item", function(req,res){
  let safetext = sanitizeHtml(req.body.text , {allowedTags :[] , allowedAttributes: {} }  )
  db.collection("items").findOneAndUpdate({_id : new mongodb.ObjectID(req.body.id)},{$set : {text : safetext}},function(){
    res.send("success")
  })
})

app.post("/delete-item", function(req,res){
  db.collection("items").deleteOne({_id : new mongodb.ObjectID(req.body.id)},function(){
    res.send("success")
  })
})

