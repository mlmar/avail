import './css/main.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Create from './js/modules/Create.js';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Create/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
