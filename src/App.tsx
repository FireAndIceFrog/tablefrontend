import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import HeaderMapDialog from './features/HeaderMapDialog';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HeaderMapDialog/>
        <Counter />
      </header>
        
        
    </div>
  );
}

export default App;
