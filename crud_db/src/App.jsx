import React, { useState } from "react";
import DatabaseSelection from "./components/DatabaseSelection";
import CRUDPage from "./components/CRUDPage";
import "./index.css";

function App() {

  const [selectedDB, setSelectedDB] = useState(null);

  return (
    <div className="app-container">

      {!selectedDB ? (
        <DatabaseSelection setSelectedDB={setSelectedDB} />
      ) : (
        <CRUDPage
          dbType={selectedDB}
          goBack={() => setSelectedDB(null)}
        />
      )}

    </div>
  );
}

export default App;