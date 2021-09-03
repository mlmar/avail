import { useState } from 'react';
import { Navigate } from 'react-router';
import { Panel } from './ui/Interface';

import { createEvent } from '../service/EventsService.js';

const DEFAULT_DATE = new Date();
DEFAULT_DATE.setHours(0, 0, 0, 0);

/*
  Create component home page
    - shows input for event name and function to add calendar days to the event
*/
const Create = () => {
  const [redirect, setRedirect] = useState(null);
  const [eventName, setEventName] = useState("");
  const [dates, setDates] = useState([DEFAULT_DATE]);

  const handleEventName = (event) => {
    setEventName(event.target.value);
  }

  /*
    prevent identical dates
      - returns valid date if true
  */
  const isValidDate = (value) => {
    const userDate = new Date(value);
    const identical = dates.find((d) => d.getTime() === userDate.getTime());
    return !identical ? userDate : false;
  }

  // validates date then reorders the date array
  const handleDateChange = (event) => {
    const { id, value } = event.target;
    
    setDates((prev) => {
      let next = [...prev];
      const validated = isValidDate(value);
      if(validated) {
        next[id] = validated;
      }
      next = next.sort((a,b) => a - b);
      return next;
    });
  }

  // adds the next day after the most recent date by default
  const handleAddDate = () => {
    const nextDate = new Date(dates[dates.length-1].valueOf() + 1000*3600*24);
    setDates((prev) => [...prev, nextDate]);
  }

  // make creation request to server containing event info then redirect user
  const handleCreate = async () => {
    const event = { name: eventName.trim(), dates };
    const response = await createEvent(event);
    setRedirect(<Navigate to={`/${response?.data?.id}`}/>);
  }

  if(redirect) return redirect;
  return (
    <Panel className="create center-self flex-col">
      {/* <label className="subtitle medium bold"> Create an Event </label> */}

      <div className="flex-col">
        <label className="medium"> Event Name </label>
        <input type="text" value={eventName} onChange={handleEventName} pattern="([A-z0-9À-ž\s]){2,}" title="Event Name"/>
      </div>

      <div className="flex-col">
        <label className="medium"> Event Date </label>
        { dates.map((date, i) => <input type="date" value={date.toLocaleDateString('en-CA')} onChange={handleDateChange} id={i} key={date.getTime()}/> )}
        <button onClick={handleAddDate}> + Add Another Date </button>
      </div>

      <button onClick={handleCreate} disabled={eventName.trim().length === 0}> Create Event </button>
    </Panel>
  )
}

export default Create;