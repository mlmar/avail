import './css/main.css';

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Create from './js/modules/Create.js';
import Calendar from './js/modules/Calendar.js';

const App = () => {
  const [event, setEvent] = useState(null);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Create setEvent={setEvent}/>}/>
          <Route path="/:id" element={<Calendar {...event}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
