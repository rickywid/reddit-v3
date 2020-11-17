import React, { useState } from 'react';
import Routes from './routes';
import './App.scss';
import UserContext from './context/userContext';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
     {Routes}
     </UserContext.Provider>
    </div>
  );
}

export default App;
