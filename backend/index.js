const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("../configFiles/configfile.json");

var x = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const auth = admin.auth();
const db = admin.firestore();
var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post("/register", async function (req, res, next) {
  let data = req.body;
  console.log(data);

  try {
    const userRecord = await auth.createUser({
      email: data["email"],
      password: data["password"],
    });

    console.log("User registered successfully:", userRecord.uid);

    await db.collection("STUDENTS").doc().set({
      userId: userRecord.uid,
      emailId: data["email"],
      // for adding more field
    });

    return res.json({
      status: true,
      userId: userRecord.uid,
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      status: false,
    });
  }
});

app.listen(3030, function (req, res) {
  console.log("app listening successfully");
});
