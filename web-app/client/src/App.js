import './css/App.css';
import OfferServices from './components/OfferServices';
import ChatComponent from './components/ChatComponent';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

function App() {
  return (
    <div className="App">
        <OfferServices />
    </div>
  );
}

export default App;