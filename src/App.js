import Dashboard from './components/Dashboard'
import PollBoard from './components/PollBoard'
import ResultModal from './components/ResultModal'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import './App.css';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Switch>
          <Route exact path="/Dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/PollBoard">
            <PollBoard />
          </Route>
          <Route exact path="/ResultModal">
            <ResultModal />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;