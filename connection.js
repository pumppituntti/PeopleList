const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
});

let connectionFunctions = {
  /**
   * Database connection
   * @returns promise object on which the connect() function is called
   */
  connect: () =>
    new Promise((resolve, reject) => {
      connection.connect((err) => {
        reject(err);
      });
      resolve();
    }),

  /**
   * Closing the connection to the database
   * @returns promise object on which the end() function is called
   */
  close: () =>
    new Promise((resolve, reject) => {
      connection.end((err) => {
        reject(err);
      });
      resolve();
    }),

  /**
   * The function saves the new object (person) to the database
   * @param {object} person object with id, first_name, last_name, age fields
   * @returns promise object in which the new object is added to the database
   */
  save: (person) => {
    return new Promise((resolve, reject) => {
      let sql =
        "insert into people (first_name, last_name, age) values (" +
        connection.escape(person.first_name) +
        ", " +
        connection.escape(person.last_name) +
        ", " +
        connection.escape(person.age) +
        ")";
      connection.query(sql, (err, people) => {
        if (err) {
          reject(err);
        } else {
          resolve("Successfully saved!");
        }
      });
    });
  },

  /**
   * This function updates the values of the object in the database
   * @param {object} person object with id, first_name, last_name, age fields
   * @returns promise object in which the object is updated in the database
   */
  editPerson: (person) =>
    new Promise((resolve, reject) => {
      connection.query(
        "update people set first_name = " +
          connection.escape(person.first_name) +
          ", last_name = " +
          connection.escape(person.last_name) +
          ", age = " +
          connection.escape(person.age) +
          "where id = " +
          connection.escape(person.id),
        (err, people) => {
          if (err) {
            reject("data can't be edited for some reason, please try again");
          }
          if (people.affectedRows == 0) {
            reject("No such person");
          } else {
            resolve("Person info succesfully edited");
          }
        }
      );
    }),

  /**
   * This function returns all elements of the database
   * @returns promise object in which the query is made to the database
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      connection.query("select * from people", (err, people) => {
        if (err) {
          reject(err);
        } else {
          resolve(people);
        }
      });
    });
  },

  /**
   * This function deletes an object from the database by id
   * @param {number} id - id of the element to be removed from the database
   * @returns promise object in which the query is made to the database
   */
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      let sql = "delete from people where id = " + connection.escape(id);
      connection.query(sql, (err, people) => {
        if (err) {
          reject(err);
        } else {
          resolve("Successfully deleted!");
        }
      });
    });
  },

  /**
   * This function finds an object in the database by id
   * @param {number} id - id of the element to be found
   * @returns promise object in which the query is made to the database
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      let sql = "select * from people where id = " + connection.escape(id);
      connection.query(sql, (err, people) => {
        if (err) {
          reject(err);
        } else {
          resolve(people);
        }
      });
    });
  },
};

module.exports = connectionFunctions;
