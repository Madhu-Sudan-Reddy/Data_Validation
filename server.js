const express = require("express");
require("dotenv").config();
const app = express();
const PORT = 8082;
const mongoose = require("mongoose");
const URL = process.env.MongoURL;

const connettomongoose = async () => {
  try {
    mongoose.connect(URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};
app.use(express.json());
connettomongoose();
//! defining schema of the profile with Validation
const profileSchema = new mongoose.Schema(
  {
    EmployID: {
      type: String,
      required: [true, "Please Enter the EmployID"],
      unique: true,
      minLength: 5,
      maxLength: 20,
    },
    Name: {
      type: String,
      required: [true, "Please Enter Employ Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter the Mobile Number"],
      match: /@/,
    },
    Number: {
      type: Number,
      required: [true, "Please Enter the Mobile Number"],
      minLength: 10,
      maxlength: 10,
    },
    age: {
      required: [true, "Please Enter the Mobile Number"],
      type: Number,
      min: 18,
      max: 100,
    },
  },

  { timestamps: true } // Corrected timestamps
);
const Employ = mongoose.model("Employ_Profile", profileSchema);
//! CRUD operations
//! C-create
app.post("/create", (req, res) => {
  const data = req.body;
  console.log(data);
  Employ.create({
    EmployID: data.EmployID,
    Name: data.Name,
    email: data.email,
    Number: data.Number,
    age: data.age,
  })
    .then((d) => {
      console.log("User Created:", d);
      res.json({ message: d });
    })
    .catch((err) => {
      console.log("Validation Error:", err.message);
      res.status(400);
      res.json({ message: "Validation Error" });
    });
});

//! R-read
app.get("/read", async (req, res) => {
  const query = req.body;
  console.log(query);
  const data = await Employ.findOne(query);
  if (data) {
    console.log(data);
    res.json({ Data: data });
  } else {
    res.status(400);
    res.json({ message: "Invalid credentials " });
  }
});

//! u-update
app.put("/update/:EmployID", async (req, res) => {
  const employID = req.params.EmployID;
  console.log(employID);
  const query = req.body;
  console.log(query);
  const updated = await Employ.findOneAndUpdate(
    {
      EmployID: employID,
    },
    {
      $set: query,
    },
    {
      returnDocument: "after",
    }
  );
  if (updated) {
    res.json({ message: "Post Updated", data: updated });
  } else {
    res.status(400);
    res.json({ message: "Invalid credentials " });
  }
});

//! d-delete
app.delete("/delete/:EmployID", async (req, res) => {
  const query = req.params.EmployID;
  const data = await Employ.findOneAndDelete(query);
  if (data) {
    console.log(data);
    res.json({ message: "Employ Data deleted", Data: data });
  } else {
    res.status(400);
    res.json({ message: "Invalid credentials " });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
