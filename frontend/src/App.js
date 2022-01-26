import React, { useState, useEffect } from "react";
import axios from "axios";
import removeSvg from "./img/remove.svg";
import editSvg from "./img/edit.svg";

function App() {
  const [people, setPeople] = useState(null);

  /**
   * Getting an array by requesting a backend server
   */
  useEffect(() => {
    axios("http://localhost:8080/people").then(({ data }) => {
      setPeople(data);
    });
  }, []);

  /**
   * Updating data when the list changes
   */
  useEffect(() => {
    axios("http://localhost:8080/people").then(({ data }) => {
      setPeople(data);
    });
  }, [people]);

  /**
   * This function updates the values of the object (person)
   * @param {object} person - person to edit
   */
  const editPerson = async (person) => {
    /**
     * New values entered by the user
     */
    const newFirstName = window.prompt("First name", person.first_name);
    const newLastName = window.prompt("Last name", person.last_name);
    const newAge = window.prompt("Age", person.age);

    /**
     * Object with new values
     */
    const obj = {
      first_name: newFirstName,
      last_name: newLastName,
      age: newAge,
      id: person.id,
    };
    /**
     * If the new object has both fields, then replace the old object with them
     */
    if (obj.first_name && obj.last_name) {
      try {
        await axios.patch("http://localhost:8080/people", obj);
        const newList = people.map((person) => {
          if (obj.id === person.id) {
            person.fin = obj.first_name;
            person.eng = obj.last_name;
          }
          return person;
        });
        setPeople(newList);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Fields should not be empty!");
    }
  };

  /**
   * This function makes a request to delete an object from the database
   * @param {number} id - id of the object to be deleted
   */
  const deletePerson = async (id) => {
    if (window.confirm("Are you sure want to delete this word?")) {
      await axios.delete(`http://localhost:8080/people/${id}`);
      const newLists = people.filter((person) => person.id !== id);
      setPeople(newLists);
    }
  };

  return (
    <div className="App">
      {people === null
        ? "Loading..."
        : people.map((person) => (
            <div className="" key={person.id}>
              {person.first_name} {person.last_name} {person.age}{" "}
              <img
                src={editSvg}
                alt="edit icon"
                onClick={() => {
                  editPerson(person);
                }}
              />
              <img
                src={removeSvg}
                alt="remove icon"
                onClick={() => {
                  deletePerson(person.id);
                }}
              />
            </div>
          ))}
    </div>
  );
}

export default App;
