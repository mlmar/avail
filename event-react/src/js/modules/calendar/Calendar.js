import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { findEvent } from '../../service/EventsService.js';
import { updateUser, findUsers, findUser, deleteUser } from '../../service/UsersService.js';
import { Panel } from '../ui/Interface.js';
import Load from '../ui/Load.js'
import Grid from './Grid.js';

/*
  Calendar component
    - makes api calls to server to retrieve event information
    - users can sign into edit their availability using the grid component
*/
const Calendar = () => {
  const { id } = useParams();

  const [eventInfo, setEventInfo] = useState({ loading: true }); // event name and date
  const [counts, setCounts] = useState({}); // contains availability counts

  const [user, setUser] = useState(""); // user name
  const [selected, setSelected] = useState(new Set()); // current user's date availability

  const [signedIn, setSignedIn] = useState(false);
  const [editing, setEditing] = useState(false);

  // arbitrarily calculates only current users availability to show during editing
  const calculateSelectedCounts = () => {
    const _counts = { max: 1 };
    selected.forEach((value) => {
      const split = value.split("-");
      const date = split[0], time = split[1];
      if(!_counts[date]) _counts[date] = {};
      _counts[date][time] = 1;
    });
    return _counts;
  }

  // calculates date availability based on all users from server
  const calculateCounts = (countsArr) => {
    let _counts = { max: countsArr.length };
    countsArr.forEach((u) => {
      u.selected?.forEach((sel) => {
        const split = sel.split("-");
        const date = split[0], time = split[1];
        if(!_counts[date]) _counts[date] = {};
        _counts[date][time] = (_counts[date][time] || 0) + 1;
      });
    });
    return _counts;
  }
  
  // retreive event and user availability from server
  useEffect(() => {
    const fetch = async () => {
      const eventResponse = await findEvent(id)
      setEventInfo(eventResponse?.data);
      if(!eventResponse?.data) return;
      document.title = eventResponse?.data.name

      const usersResponse = await findUsers(id)
      let _counts = calculateCounts(usersResponse?.data);
      _counts.max = usersResponse.data?.length;
      setCounts(_counts);
    };

    fetch();
  }, [id]);

  // returns date strings based on date object values from the server
  const getDateStrings = () => {
    return eventInfo?.dates.map((d) => {
      const _date = new Date(d);
      return (_date.getUTCMonth() + 1) + "/" + _date.getUTCDate();
    })
  }
  
  // saves users name as it is inputted
  const handleUserChange = (event) => {
    setUser(event.target.value);
  }

  /*
    selection function passed to grid component
      - {id}  : {month/day-time} string id from grid cell
      - {type} : if type is specified, perform that action, otherwise do opposite action (i.e select/deselect)
  */
  const handleSelect = (id, type) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if(type) {
        if(type === "add") next.add(id);
        if(type === "delete") next.delete(id);
        return next;
      }

      if(prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // upon signing in, get current user's availibility
  const handleSignIn = async () => {
    const response = await findUser({ id, user });
    setSelected(new Set(response?.data?.selected));
    setSignedIn(true);
  }

  /*
    performs an action based on current user's selection
      - if selection is empty, delete user from databasde
      - otherwise, update selection in the database
      - then recallculate availability counts
  */
  const handleSave = async () => {
    const selectedArray = Array.from(selected);
    const event = { id, user, selected: selectedArray };

    if(selectedArray.length === 0) {
      await deleteUser(event)
    } else {
      await updateUser(event);
    }

    const usersResponse = await findUsers(id)
    let _counts = calculateCounts(usersResponse?.data);
    setCounts(_counts);
    setEditing(false);
  }

  // default loading screen to show 
  if(eventInfo?.loading) {
    return <Load/>
  }

  // if no event is found, show message
  if(!eventInfo) {
    return (
      <Panel className="calendar center-self flex-col">
        <label className="large"> Event does not exist! </label>
      </Panel>
    )
  }

  // otherwise show calendar
  return (
    <Panel className="calendar center-self flex-col">
      <div className="flex-col">
        <label className="medium"> {eventInfo?.name} </label>
        <Grid dates={getDateStrings()} counts={editing ? calculateSelectedCounts() : counts} onSelect={handleSelect} editing={editing}/>
      </div>

      { !signedIn &&
        <div className="flex-col">
          <label className="medium"> Your Name </label>
          <input type="text" value={user} onChange={handleUserChange} pattern="([A-z0-9À-ž\s]){2,}"/>
          <button disabled={user.trim().length === 0} onClick={handleSignIn}> Sign In </button>
        </div>
      }

      { signedIn && !editing && 
        <button onClick={setEditing}> Edit Your Availability </button>
      }

      { editing &&
        <button onClick={handleSave}> Save Changes </button>
      }
    </Panel>
  )
}

export default Calendar;