// dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");

// tells node that we are creating an "express" server
const app = express();

// sets an initial port
const PORT = process.env.PORT || 3000;

// sets up the Express app to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

// getting the html content
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// if no matching route is found default to index
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

// API POST request - below code handles when a user inputs a note - submits data to the server
app.post("/api/notes", (req, res) => {
    // read JSON file
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
      if (err) throw err;
        const db = JSON.parse(data);
        const newDB = [];

        db.push(req.body);

        for (let i = 0; i < db.length; i++)
        {
          const newNote = {
            title: db[i].title,
            text: db[i].text,
            id: i
          };

          // add new note to array
          newDB.push(newNote);
        }

        // add new note to db - stringify to add to JSON file
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newDB, null, 2), (err) => {
            if (err) throw err;
            res.json(req.body);
        });
    });
});

// code for deleting notes from the app
app.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    // read JSON file
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        const db = JSON.parse(data);
        const newDB = [];
        for(let i = 0; i < db.length; i++)
        {
          if (i !== id)
          {
            const newNote = {
              title: db[i].title,
              text: db[i].text,
              id: newDB.length
            };
            newDB.push(newNote);
          }
        }

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newDB, null, 2), (err) => {
            if (err) throw err;
            res.json(req.body);
        });
    });
});

// listener - the below code effectively "starts" our server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}.`);
})