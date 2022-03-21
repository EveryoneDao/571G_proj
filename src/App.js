import HelloWorld from './HelloWorld'
import Dashboard from './components/Dashboard'
import PollBoard from './components/PollBoard'
import FirstPage from './components/FirstPage'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import './App.css';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <HelloWorld />
          </Route>
          <Route exact path="/Dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/FirstPage">
            <FirstPage />
          </Route>
          <Route exact path="/PollBoard">
            <PollBoard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;