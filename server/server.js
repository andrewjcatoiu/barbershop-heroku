require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const db = require('./db');

const app = express();
// const port = process.env.PORT || 3001;
const port = 4001;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(session({
    secret: 'specificBarber',
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    const timeQuery = 'SELECT date, time FROM customers';

    db.query(timeQuery, (timeError, timeResults) => {
        if (timeError) {
            console.error("error selecting time ranges:", timeError);
            return res.render(path.join(__dirname, "index"), { timeData: [] });
        }
        const timeData = timeResults.rows;

        if (req.session) {
            req.session.timeData = timeData;
        }

        console.log("bookings:",timeData);
        res.render(path.join(__dirname, "index"), { timeData });
    });
});
app.post("/", (req, res) => {
    const { name, email, phone, barber, date, time } = req.body;
    console.log(req.body);
    db.query('INSERT INTO customers (name, email, phone, barber, date, time) values ($1, $2, $3, $4, $5, $6)', [name, email, phone, barber, date, time], (error, results) => {
        if (error) {
            console.error("error inserting data:", error);
        } else {
            console.log('data inserted successfully');
            const timeQuery = 'SELECT date, time FROM customers';
            db.query(timeQuery, (timeError, timeResults) => {
                if (timeError) {
                    console.error("error selecting time ranges:", timeError);
                    return res.redirect("/")
                }
                const timeData = timeResults.rows;
                req.session.timeData = timeData;
                // console.log(timeData);
                return res.redirect("/")
            })
        }
    });
});


app.get("/home", (req, res) => {
    const timeQuery = 'SELECT date, time FROM customers';

    db.query(timeQuery, (timeError, timeResults) => {
        if (timeError) {
            console.error("error selecting time ranges:", timeError);
            return res.render(path.join(__dirname, "index"), { timeData: [] });
        }
        const timeData = timeResults.rows;

        if (req.session) {
            req.session.timeData = timeData;
        }

        console.log("bookings:",timeData);
        res.render(path.join(__dirname, "index"), { timeData });
    });
});


app.get("/contact", (req, res) => {
    const timeQuery = 'SELECT date, time FROM customers';

    db.query(timeQuery, (timeError, timeResults) => {
        if (timeError) {
            console.error("error selecting time ranges:", timeError);
            return res.render(path.join(__dirname, "contact"), { timeData: [] });
        }
        const timeData = timeResults.rows;

        if (req.session) {
            req.session.timeData = timeData;
        }

        console.log("bookings:",timeData);
        res.render(path.join(__dirname, "contact"), { timeData });
    });
});
app.post("/contact", (req, res) => {
    const { name, email, phone, barber, date, time } = req.body;
    
    db.query('INSERT INTO customers (name, email, phone, barber, date, time) values ($1, $2, $3, $4, $5, $6)', [name, email, phone, barber, date, time], (error, results) => {
        if (error) {
            console.error("error inserting data:", error);
        } else {
            console.log('data inserted successfully');
            const timeQuery = 'SELECT date, time FROM customers';
            db.query(timeQuery, (timeError, timeResults) => {
                if (timeError) {
                    console.error("error selecting time ranges:", timeError);
                    return res.redirect("/contact")
                }
                const timeData = timeResults.rows;
                req.session.timeData = timeData;
                // console.log(timeData);
                return res.redirect("/contact")
            })
        }
    });
});


function isAuthenticated(req, res, next) {
    if (req.session.userID) {
        next();
    } else {
        res.redirect("/login");
    }
};


app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
})
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const adminCommand = 'SELECT username, password, id FROM admin WHERE username = $1';
    const adminParams = [username];
    const barberCommand = 'SELECT first_name, username, password, emp_id FROM employees WHERE username = $1';
    const barberParams = [username];

    db.query(adminCommand, adminParams, (error, adminResults) => {
        if (error) {
            console.error("error executing query:", error);
            return res.redirect("/login");
        }

        if (adminResults.rowCount > 0) {
            const admin = adminResults.rows[0];
            if (password === admin.password) {
                req.session.userID = admin.id;
                req.session.userRole = 'admin';

                //Retrieving data to load current PSQL table
                const empDataQuery = 'SELECT * FROM employees';
                db.query(empDataQuery, (empDataError, empDataResults) => {
                    if (empDataError) {
                        console.error("error retrieving data: ", empDataError);
                        return res.redirect("/admin");
                    }
                    const empData = empDataResults.rows;
                    req.session.empData = empData;
                    return res.redirect("/admin")
                });
        
            } else {
                return res.redirect("/login");
            }
        } else {
            db.query(barberCommand, barberParams, (barberErr, barberResults) => {
                if (barberErr) {
                    console.error("Error executing employee query:", barberErr);
                    return res.redirect("/login");
                }
                if (barberResults.rowCount > 0) {
                    const barber = barberResults.rows[0];
                    if (password === barber.password) {
                        req.session.userID = barber.emp_id;
                        req.session.userRole = 'barber';
                        return res.redirect(`/barber/${barber.emp_id}`);
                    } else {
                        return res.redirect("/login");
                    }
                } else {
                    res.redirect("/login");
                }
            });
        }
    });
});
app.get("/login/logged-out", isAuthenticated, (req, res) => {
    req.session.userID = "";
    req.session.userRole = "";
    res.redirect("/login");
});


app.get("/admin", isAuthenticated, async (req, res) => {
    if (req.session.userRole === 'barber') {
        return res.redirect("/login");
    }

    if (req.session.userRole === 'admin') {
        const empData = req.session.empData;
        console.log("......................")
        console.log(empData);

        const customerDataQuery = 'SELECT * FROM customers';
        db.query(customerDataQuery, (customerDataError, customerDataResults) => {
            if (customerDataError) {
                console.error("error selecting customer data:", customerDataError);
            } else {
                console.log("data selected successfully");
                const customerData = customerDataResults.rows;
                req.session.customerData = customerData;
                res.render(path.join(__dirname, "admin"), { empData, customerData });
            }
        })
    } else {
        res.redirect("/login")
    }
});
app.post("/admin", upload.single('serviceImage'), async (req, res) => {
    const { 
        newFirstName, newUsername, newPassword, newEmpID, deletePassword, cancelAppointmentID,
        serviceTitle, serviceDescription, servicePrice, serviceSecondaryDescription
    } = req.body;

    // const imageBuffer = req.file.buffer;
    
    if (newFirstName, newUsername, newPassword, newEmpID) {
        db.query('INSERT INTO employees (first_name, username, password, emp_id) VALUES ($1, $2, $3, $4) RETURNING *', [newFirstName, newUsername, newPassword, newEmpID], (error, results) => {
            if (error) {
                console.error("error inserting data:", error);
            } else {
                console.log("data inserted successfully");
                const empDataQuery = "SELECT * FROM employees";
                db.query(empDataQuery, (empDataError, empDataResults) => {
                    if (empDataError) {
                        console.error("error retrieving data:", empDataError);
                        return res.redirect("/admin");
                    } else {
                        const customerDataQuery = 'SELECT * FROM customers';
                        db.query(customerDataQuery, (customerDataError, customerDataResults) => {
                            if (customerDataError) {
                                console.error("error selected customer data:", customerDataError);
                                return res.redirect("/admin");
                            } else {
                                setTimeout(function() {
                                    const empData = empDataResults.rows;
                                    req.session.empData = empData;
                                    const customerData = customerDataResults.rows;
                                    req.session.customerData = customerData;
                                    res.render(path.join(__dirname, "admin"), { empData, customerData });
                                    console.log(empData, customerData, "newest update");
                                }, 5000);
                            }
                        });
                    }
                });
            }
        });
    }

    if (deletePassword) {
        const deleteQuery = 'DELETE FROM employees WHERE password = $1'
        db.query(deleteQuery, [deletePassword], (deleteError, deleteResults) => {
            if (deleteError) {
                console.error("error deleting account", deleteError);
            } else {
                console.log("data deleted successfully", deleteResults);
                const empDataQuery = "SELECT * FROM employees";
                db.query(empDataQuery, (empDataError, empDataResults) => {
                    if (empDataError) {
                        console.error("error retrieving data:", empDataError);
                        return res.redirect("/admin");
                    } else {
                        const customerDataQuery = 'SELECT * FROM customers';
                        db.query(customerDataQuery, (customerDataError, customerDataResults) => {
                            if (customerDataError) {
                                console.error("error selected customer data:", customerDataError);
                                return res.redirect("/admin");
                            } else {
                                setTimeout(function() {
                                    const empData = empDataResults.rows;
                                    req.session.empData = empData;
                                    const customerData = customerDataResults.rows;
                                    req.session.customerData = customerData;
                                    res.render(path.join(__dirname, "admin"), { empData, customerData });
                                }, 5000);
                            }
                        });
                    }
                });
            }
        });
    }

    if (cancelAppointmentID) {
        const cancellationQuery = 'DELETE FROM customers WHERE id = $1';
        db.query(cancellationQuery, [cancelAppointmentID], (cancellationError, cancellationResults) => {
            if (cancellationError) {
                console.error(cancellationError);
                return res.redirect("/admin");
            } else {
                console.log("appointment cancelled successfully", cancellationResults);
                const empDataQuery = "SELECT * FROM employees";
                db.query(empDataQuery, (empDataError, empDataResults) => {
                    if (empDataError) {
                        console.error("error retrieving data:", empDataError);
                        return res.redirect("/admin");
                    } else {
                        const customerDataQuery = 'SELECT * FROM customers';
                        db.query(customerDataQuery, (customerDataError, customerDataResults) => {
                            if (customerDataError) {
                                console.error("error selected customer data:", customerDataError);
                                return res.redirect("/admin");
                            } else {
                                setTimeout(function() {
                                    const empData = empDataResults.rows;
                                    req.session.empData = empData;
                                    const customerData = customerDataResults.rows;
                                    req.session.customerData = customerData;
                                    res.render(path.join(__dirname, "admin"), { empData, customerData });
                                }, 5000);
                            }
                        });
                    }
                });
            }
        })
    }

    if (serviceTitle 
        // && imageBuffer
        ) {
        const serviceQuery = 'INSERT INTO services (title, description, price, secondary_description) VALUES ($1, $2, $3, $4)';
        db.query(serviceQuery, [serviceTitle, serviceDescription, servicePrice, serviceSecondaryDescription], (serviceError, serviceResults) => {
            if (serviceError) {
                console.error('error inserting service:', serviceError);
                return res.redirect("/admin");
            } else {
                console.log('service inserted successfully', serviceResults);
                // console.log(imageBuffer);
                return res.redirect("/admin");
            }
        });
    }
});
app.get("/admin/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const grabEmp = await db.query("SELECT * FROM employees WHERE id = $1", [id]);
        res.json(grabEmp.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})
app.delete("/admin/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEmp = await db.query("DELETE FROM employees WHERE id = $1", [id])
        res.json("deleted");
    } catch (err) {
        console.error(err.message)
    }
});


app.get("/barber/:id", isAuthenticated, (req, res) => {
    const barberID = req.params.id;
    res.sendFile(path.join(__dirname + "/barber.html"));
});


app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});