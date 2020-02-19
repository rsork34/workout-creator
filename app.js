const express = require('express');
const mysql = require('mysql');
const app = express();
var cors = require('cors');

// If CRUD api requests are completed
const CRUD = false;

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let pool = mysql.createPool({
    connectionLimit: 400,
    host: 'localhost',
    user: 'root',
    password: 'poiu0987!poiu',
    database: 'workouts',
});

// An api endpoint that returns a short list of items
app.get('/api/getList', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return res.json({error: true})
        }
        connection.query('select * from workouts', function (error, row, fields) {
            if (error) {
                console.log(error);
                connection.release();
                return res.send({ error: true })
            }

            connection.release();
            res.json({ error: false, row: row });
        });
    });
});

app.get('/api/deleteWorkout', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return res.json({ error: true })
        }

        const workoutID = req.query.id;
        const deleteQuery = `delete from workouts where WorkoutID=${workoutID}`;
        connection.query(deleteQuery, function (error, row, fields) {
            connection.release();

            if (error) {
                console.log(error);
                return res.json({ error: true });
            }

            return res.json({ error: false });
        });
    });
});

app.post('/api/addWorkout', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return res.json({ error: true });
        }
        const { group, link, name } = req.body;

        // Check if new workout already exists with this group
        const checkQuery = 'select * from workouts where WorkoutName=? and WorkoutGroup=?';
        connection.query(checkQuery, [name, group], function (error, row, fields) {
            if (error) {
                console.log(error);
                connection.release();
                return res.json({ error: true });
            }
            // Entry already exists with this name + group
            if (row.length > 0) {
                connection.release();
                return res.json({ duplicate: true });
            }

            const insertQuery = 'insert into workouts(WorkoutName, WorkoutGroup, WikipediaLink) values(?,?,?);';
            connection.query(insertQuery, [name, group, link], function (error, row, fields) {
                connection.release();

                if (error) {
                    console.log(error);
                    return res.json({ error: true });
                }

                return res.json({ newID: row.insertId });
            });
        });
    });
});

app.post('/api/updateWorkout', function(req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err)
            return res.json({error: true})
        }

        const {name, link, group, id} = req.body;
        
        const updateQuery = `update workouts set WorkoutName=?, WorkoutGroup=?, WikipediaLink=? where WorkoutID=${id}`;
        connection.query(updateQuery, [name, group, link], function(error, row, fields) {
            connection.release();

            if (error) {
                console.log(error);
                return res.json({error: true});
            }

            return res.json({error: false})
        });
    });
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);