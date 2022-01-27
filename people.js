const express = require("express");
const connection = require("./connection.js");
var people = express.Router();
const Validator = require("jsonschema").Validator;
const validator = new Validator();

/**
 * Schema for object (person) validation when added to the database
 */
var schema = {
  properties: {
    first_name: {
      type: "string",
      minLength: 1,
      maximum: 40,
    },
    last_name: {
      type: "string",
      minimum: 1,
      maximum: 40,
    },
    age: {
      type: "number",
      minimum: 1,
      maximum: 130,
    },
  },
};

people.use(express.json());

/**
 * Getting all objects from the database
 */
people.get("/", async (req, res) => {
  try {
    let result = await connection.findAll();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

/**
 * Getting an object from the database by id
 */
people.get("/:number([0-9]+)", async (req, res) => {
  try {
    let num = req.params.number;
    let result = await connection.findById(num);
    if (Object.keys(result).length !== 0) {
      res.send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
  }
});

/**
 * Adding an object to the database
 */
people.post("/", async (req, res) => {
  try {
    let person = req.body;
    let result = validator.validate(person, schema);
    if (result.errors.length === 0) {
      console.log(await connection.save(person));
      res.statusCode = 201;
      res.send(person);
    } else {
      console.log("ERROR");
      res.statusCode = 400;
      res.send(res.statusCode + " Bad request\n" + result.errors);
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Updating an object in the database
 */
people.patch("/", async (req, res) => {
  try {
    let person = req.body;
    let result = validator.validate(person, schema);
    if (result.errors.length === 0) {
      var response = await connection.editPerson(person);
      res.statusCode = 200;
      res.end();
    } else {
      res.statusCode = 400;
      res.send(res.statusCode + " Bad request\n" + result.errors);
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Deleting an object from the database
 */
people.delete("/:number([0-9]+)", async (req, res) => {
  try {
    let num = req.params.number;
    console.log(await connection.deleteById(num));
    res.statusCode = 204;
    res.send(res.statusCode + "Deleted");
  } catch (err) {
    console.log(err);
  }
});

module.exports = people;
