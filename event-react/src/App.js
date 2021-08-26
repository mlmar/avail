import './css/main.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Create from './js/modules/Create.js';
import Calendar from './js/modules/Calendar.js';

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Create/>}/>
          <Route path="/:id" element={<Calendar/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
