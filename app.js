
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const mysql = require('mysql');



var pool = new mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library'
});

var app = express();
app.use(fileUpload());
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function (req, res) {
    //res.send("<h1>Hello from express</h1>");
    res.sendFile(__dirname + '/index.html');
});

// app.get("/books", function (req, res) {
//     res.send(books);
// });

app.get("/books", function (req, res) {
    if (Object.keys(req.query).length === 0) {
        pool.query("Select * from books", function (err, result) {
            if (err) throw err;
            res.json(result);
            //console.log(result);
        });
    } else {
        var que = req.query.que;
        //console.log(que);
        var partOfQuery;
        //res.json(req.query);
        switch (que) {
            case 'most_popular':
                partOfQuery = "rating = 5";
                break;

            case 'free':
                partOfQuery = "price = 0";
                break;

            case 'most_recent':
                partOfQuery = " 1 ORDER by date DESC  LIMIT 5";
                break;

            default:
                partOfQuery = " 1";
            // default:
            //     res.json(list ? fromList(list) : books);
        }

        pool.query("Select * from books where " + partOfQuery, function (err, result) {
            if (err) throw err;
            res.json(result);
            //console.log(result);
        });
    }
});

app.get("/books/:id", function (req, res) {
    var bookId = req.params.id;

    pool.query("Select * from books where id =" + bookId, function (err, result) {
        if (err) throw err;
        res.json(result);
        //console.log(result);
    });
});

app.get("/search", function (req, res) {
    var word = req.query.word;
    pool.query("SELECT * FROM books WHERE author LIKE '%" + word + "%' OR title LIKE '%" + word + "%'",function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

//add new book
app.post("/books", function (req, res) {
    var title = req.body.title;
    var author = req.body.author;
    var price = req.body.price;
    var pic = req.files.img;

    if (!req.files) return res.status(400).send('No files were uploaded.');
    //console.log(req.files.afile);
    var pictureName = Math.random().toString(36).substring(7) + ".jpg";
    pic.mv('static/img/pictures/' + pictureName, function (err) {
        if (err) return res.status(500).send(err);
        console.log('File uploaded!');
    });

    pool.query("INSERT INTO `books`(`title`,`author`,`price`,`date`,`picture`) VALUES (?,?,?,NOW(),?)", [title, author, price, pictureName], function (err, result) {
    });
    res.send(req.files);
    //res.send("rr");
});

/*** Update rating ***/
app.put('/books:id', function (req, res) {
    var newRating = req.body.newRating;
    var bookId = parseInt(req.params.id);
    pool.query("UPDATE `books` SET rating=" + newRating + " WHERE id = " + bookId, function (err, result) {
        //console.log(result);
    });

    res.send('1');
});

//add new book
// app.post("/books", function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//     //console.log(req.body);
//     if (!req.files) return res.status(400).send('No files were uploaded.');
//
//     //console.log(req.files.picture);
//     var pictureName = Math.random().toString(36).substring(7) + ".jpg";
//     req.files.picture.mv('static/img/pictures/' + pictureName, function (err) {
//         if (err) return res.status(500).send(err);
//         console.log('File uploaded!');
//     });
//
//     var title = req.body.title;
//     var author = req.body.author;
//     var price = req.body.price;
//     pool.query("INSERT INTO `books`(`title`,`author`,`price`,`date`,`picture`) VALUES (?,?,?,NOW(),?)", [title, author, price, pictureName], function (err, result) {
//     });
//     res.send(title + author + price);
// });

app.listen(3000, function () {
    console.log("Server started!");
});