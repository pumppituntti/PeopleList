import React, { useState, useEffect } from "react";
import axios from "axios";
import removeSvg from "./img/remove.svg";
import editSvg from "./img/edit.svg";

function App() {
  const [people, setPeople] = useState(null);
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputAge, setInputAge] = useState("");
  const [sortType, setSortType] = useState("");

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
  // useEffect(() => {
  //   axios("http://localhost:8080/people").then(({ data }) => {
  //     setPeople(data);
  //   });
  // }, [people]);

  /**
   * This function sends a request to the backend server to add a new person to the database
   */
  const addNewPerson = async () => {
    /**
     * New object to be added
     */
    const obj = {
      first_name: inputFirstName,
      last_name: inputLastName,
      age: Number(inputAge),
      id: Math.random(),
    };

    /**
     * If all values exist then add the person
     */
    if (obj.first_name && obj.last_name && obj.age) {
      try {
        await axios.post("http://localhost:8080/people", obj);
        const newList = [...people, obj];
        setPeople(newList);
        setInputFirstName("");
        setInputLastName("");
        setInputAge("");
        await axios("http://localhost:8080/people").then(({ data }) => {
          setPeople(data);
        });
      } catch (error) {
        alert(
          error +
            "\nName must be up to 40 characters and age must be between 1 and 130"
        );
      }
    } else {
      alert("Try again! Fields should not be empty and age must be a number!");
    }
  };

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
      age: Number(newAge),
      id: person.id,
    };
    /**
     * If the new object has all fields, then replace the old object with them
     */
    if (obj.first_name && obj.last_name && obj.age) {
      try {
        await axios.patch("http://localhost:8080/people", obj);
        const newList = people.map((person) => {
          if (obj.id === person.id) {
            person.first_name = obj.first_name;
            person.last_name = obj.last_name;
            person.age = obj.age;
          }
          return person;
        });
        setPeople(newList);
      } catch (error) {
        alert(
          error +
            "\nName must be up to 40 characters and age must be between 1 and 130"
        );
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
    if (window.confirm("Are you sure want to delete this person?")) {
      await axios.delete(`http://localhost:8080/people/${id}`);
      const newList = people.filter((person) => person.id !== id);
      setPeople(newList);
    }
  };

  useEffect(() => {
    const sortArray = (type) => {
      const types = {
        first_name: "first_name",
        last_name: "last_name",
        age: "age",
      };
      const sortProperty = types[type];
      if (people !== null) {
        const sorted = [...people].sort((a, b) => {
          if (sortProperty === "age") {
            if (a[sortProperty] > b[sortProperty]) {
              return 1;
            }
            if (a[sortProperty] < b[sortProperty]) {
              return -1;
            }
            return 0;
          } else {
            if (a[sortProperty].toLowerCase() > b[sortProperty].toLowerCase()) {
              return 1;
            }
            if (a[sortProperty].toLowerCase() < b[sortProperty].toLowerCase()) {
              return -1;
            }
            return 0;
          }
        });
        setPeople(sorted);
      }
    };
    sortArray(sortType);
  }, [sortType]);

  return (
    <div className="App">
      <div className="sorting">
        Sort by{" "}
        <select
          onChange={(e) => {
            setSortType(e.target.value);
            console.log(sortType);
          }}
        >
          <option value="" disabled selected>
            Select
          </option>
          <option value="first_name">First name</option>
          <option value="last_name">Last name</option>
          <option value="age">Age</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <td>First name</td>
            <td>Last name</td>
            <td>Age</td>
          </tr>
        </thead>
        <tbody>
          {people === null
            ? "Loading..."
            : people.map((person) => (
                <tr className="Person_data" key={person.id}>
                  <td>{person.first_name}</td>
                  <td>{person.last_name}</td>
                  <td>{person.age}</td>
                  <div>
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
                </tr>
              ))}
        </tbody>
      </table>
      <div className="add_form">
        Add new Person
        <div>
          <input
            className="field"
            value={inputFirstName}
            type="text"
            placeholder="First name"
            onChange={(e) => setInputFirstName(e.target.value)}
          />
          <input
            className="field"
            value={inputLastName}
            type="text"
            placeholder="Last name"
            onChange={(e) => setInputLastName(e.target.value)}
          />
          <input
            className="field"
            value={inputAge}
            type="text"
            placeholder="Age"
            onChange={(e) => setInputAge(e.target.value)}
          />
          <button onClick={addNewPerson}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default App;
