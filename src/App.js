import Dashboard from './components/Dashboard'
import PollBoard from './components/PollBoard'
import ResultModal from './components/ResultModal'
import FirstPage from './components/FirstPage'
import PollFeature from './components/PollFeature'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import image from './images/logo.png'   
import './App.css';
import './index.css';

function App() {
  return (
    <div className="App">
    <BrowserRouter  basename="/">
        <Switch>
          <Route exact path = "/">
            <FirstPage />
          </Route>
          <Route exact path = "/PollFeature">
            <PollFeature />
          </Route>
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
      <div id = "logo"><img src={image} /></div>
    </div>
  );
}
export default App;