import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import BuyPage from './BuyPage'
import CollectionPage from './CollectionPage'
import { Button } from 'react-bootstrap'
function App() {
  return (
    <div>
      <header>
        <h1 className="titleSection">Welcome to our NFT marketplace</h1>

      </header>

      <div>
        <Router>
          <div className="App">
          </div>
          <Routes>
            <Route exact path='/Buy' element={< BuyPage />}></Route>
            <Route exact path='/contact' element={< CollectionPage />}></Route>
          </Routes>

          <div className="App">

            <Link to="/Buy"><Button variant="primary" className="buttonConf">Buy NFT</Button></Link>
            <Link to="/Collection"><Button variant="primary" className="buttonConf">Your Collection</Button></Link>


          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
