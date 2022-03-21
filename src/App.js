import HelloWorld from './HelloWorld'
import Dashboard from './components/Dashboard'
// import EventCard from './components/EventCard'
import PollBoard from './components/PollBoard'
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
          <Route exact path="/PollBoard">
            <PollBoard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;