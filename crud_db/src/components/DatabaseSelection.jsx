import React from "react";


function DatabaseSelection({ setSelectedDB }) {

  return (

    <div className="db-selection">

      <h1>Select Database</h1>

      <div className="db-buttons">

        <button onClick={() => setSelectedDB("mysql")}>
          MySQL
        </button>

        <button onClick={() => setSelectedDB("sqlite")}>
          SQLite
        </button>

        <button onClick={() => setSelectedDB("mongodb")}>
          MongoDB
        </button>

      </div>

    </div>

  );

}

export default DatabaseSelection;