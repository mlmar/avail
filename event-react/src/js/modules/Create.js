import { useState } from 'react';
import { Panel } from './ui/Interface';

const Create = () => {
  const [dates, setDates] = useState([new Date()]);

  const handleDateChange = (event) => {
    const { id, value } = event.target;

    setDates((prev) => {
      let changes = [...prev];
      changes[id] = new Date(value);
      return changes;
    });
  }

  const handleAddDate = () => {
    setDates((prev) => [...prev, new Date(dates[dates.length-1].valueOf())]);
  }

  return (
    <Panel className="create flex-col">
      {/* <label className="subtitle medium bold"> Create an Event </label> */}

      <div className="flex-col">
        <label className="medium"> Event Name </label>
        <input type="text"/>
      </div>

      <div className="flex-col">
        <label className="medium"> Event Date </label>
        { dates.map((date, i) => <input type="date" value={date.toLocaleDateString('en-CA')} id={i} onChange={handleDateChange} key={i}/> )}
        <button onClick={handleAddDate}> + Add Another Date </button>
      </div>

      <button> Create Event </button>
    </Panel>
  )
}

export default Create;