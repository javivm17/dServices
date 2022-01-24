import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Llora mirando gráficas
        </p>
        <a
          className="App-link"
          href="https://tradingview.es"
          target="_blank"
          rel="noopener noreferrer"
        >
          No clickes si quieres seguir teniendo dinero
        </a>
      </header>
    </div>
  );
}

export default App;
