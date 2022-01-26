import React, { useState, useEffect } from "react";
import axios from "axios";

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
  return (
    <div className="App">
      {people === null
        ? "Loading..."
        : people.map((person) => (
            <div className="" key={person.id}>
              {person.first_name} {person.last_name} {person.age}
            </div>
          ))}
    </div>
  );
}

export default App;
