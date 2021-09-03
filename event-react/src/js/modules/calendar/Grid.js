import { useState, useRef } from 'react';

const HOURS = 24;
const TIMES = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const COLORS = {
  GREEN:  (opacity) => `rgba(0, 160, 20, ${opacity || 1})`,
  RED:    (opacity) => `rgba(255, 44, 44, ${opacity || 1})`,
  PURPLE: (opacity) => `rgba(205, 173, 247, ${opacity || 1})`,
}

const PIXELS = 20; // number of pixels to horizontally scroll by

/*
  Grid component
    - Cell table corresponding to dates and times

    - {dates}     : date string labels in order
    - {counts}    : object of availability per cell
    - {onSelect}  : function to call when cell(s) are selected with arguments of cells id {month/day-time} and selection type {add/delete}
    - {editing}   : boolean if editing mode is enabled -- early returns all mouse listeners
*/
const Grid = ({ dates, counts, onSelect, editing }) => {
  const [anchor, setAnchor] = useState(null);
  const posRef = useRef({}); // current mouse cell position

  const [selected, setSelected] = useState({ max: 1 }); // placeholder counts for current selection
  const selectedRef = useRef([]);

  const gridRef = useRef(null);

  const [available, setAvailable] = useState({ amount: 0, users: []})

  // Finds the index of a specific {month/day} string in the dates array
  const findDateIndex = (date) => {
    const index = dates.findIndex((d) => {
      return d === date;
    });
    return index;
  }

  // resets all user selections
  const reset = () => {
    setAnchor(null)
    setSelected({ max: 1 });
    posRef.current = ({});
  }

  /*
    captures info of the initial cell selection
      - if cell is already in counts object, set type to delete, otherwise type is add
      - essentially anchors every time mouse is down
  */
  const handleMouseDown = (event) => {
    let { nodeName, id } = event.target;
    if(!editing || nodeName !== "SPAN") return;

    const split = id.split("-");
    const date = split[0], time = parseInt(split[1]);
    const index = findDateIndex(date);
    const type = counts?.[date]?.[time] ? "delete" : "add"; // delete selected cells if anchor is already selected
    setAnchor({ id, time, index, type });
  }

  /*
    if anchored and editing, while mouse is moving, dynamically select all cells between anchor and current position
  */
  const handleMouseMove = (event) => {
    let { nodeName, id } = event.target;

    if(event.touches?.[0]) { // if touch screen
      event.preventDefault();
      const element = document.elementFromPoint(event.touches?.[0]?.clientX, event.touches?.[0]?.clientY); // get touched element
      id = element.id;
      if(!id) { // if not in grid, simulate mouse leave
        handleMouseUp(event);
        return;
      }
    }
    
    const split = id.split("-");
    const date = split[0], time = parseInt(split[1]);
    const index = findDateIndex(date);
    
    setAvailable((prev) => ({ ...prev, amount: (counts[date]?.[time] || 0)}));
    
    if(!anchor || !editing || nodeName !== "SPAN") return;
    
    
    // prevent rerendering within the same cell
    if(id === posRef.current?.id || id === anchor.id) return;
    
    
    posRef.current = { id, time, index };
    
    const next = { max: 1}

    let startDate = Math.min(anchor.index, index);
    let endDate = Math.max(anchor.index, index);
    let startTime = Math.min(anchor.time, time);
    let endTime = Math.max(anchor.time, time);

    let nextCounts = [];
    for(var i = startDate; i <= endDate; i++) {
      for(var j = startTime; j <= endTime; j++) {
        if(!next[dates[i]]) next[dates[i]] = {};
        next[dates[i]][j] = 1;
        nextCounts.push(dates[i] + "-" + j);
      }
    }
    
    setSelected(next);
    selectedRef.current = nextCounts;
  }

  // save/delete currently selected cells based on the anchor cell
  const handleMouseUp = (event) => {
    event?.preventDefault();
    if(!editing || !anchor) return;
    if(onSelect) {
      if(!posRef.current.id) { // if mouse never moved outside of anchor, perform the normal action
        onSelect(anchor.id);
      } else { // otherwise do action specified by anchor to cell selected cells
        selectedRef.current.forEach((val) => onSelect(val, anchor.type));
      }
    }
    reset();
  }

  const handleScrollButton = (event) => {
    let { nodeName, id } = event.target;
    if(nodeName !== "BUTTON") return;
    const distance = (id === "left-scroll") ? -PIXELS : PIXELS;
    gridRef.current.scrollBy(distance, 0);
  }

  // get time column wih am/pm format
  const getTimes = () => {
    let rows = [<span className="flex" key="placeholder"></span>];
    for(var i = 0; i < HOURS; i++) {
      const NOON = 12;
      const time = i >= NOON ? TIMES[i - 12] : TIMES[i];
      const half = i >= NOON ? "pm" : "am"
      rows.push(<span className="flex small time" key={i}> {time} <span className="flex"> {half} </span> </span>)
    }
    return rows;
  }

  // get regular date cell column
  const getColumn = (date) => {
    let col = [];
    for(var i = 0; i < HOURS; i++) {
      const selectedStyle = selected?.[date]?.[i] ? ({
        backgroundColor: anchor.type === "delete" ? COLORS.RED() : COLORS.GREEN(),
      }) : null;

      const allStyle = counts?.[date]?.[i] ? ({ 
        backgroundColor: COLORS.GREEN((counts[date]?.[i] / counts?.max)) 
      }) : null;
      
      col.push(<span className="flex small date cell" style={selectedStyle || allStyle} id={date + "-" + i} key={date + "-" + i}> </span>)
    }
    return col;
  }

  return (
    <div className="flex-col">
      <div className={"flex grid"} ref={gridRef}> 
        <div className="flex-col">
          {getTimes()}
        </div>
        <div className="flex-col">
          <div className="flex"
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove} 
            onMouseUp={handleMouseUp} 
            onMouseLeave={handleMouseUp}

            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            { dates?.map((date, i) => {
              return (
                <div className="flex-col column" key={date}>
                  <label className="date flex small"> {date} </label>
                  {getColumn(date)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div className="flex scroll-buttons mobile" onClick={handleScrollButton}>
        <button className="medium" id="left-scroll"> &#8592; </button>
        <button className="medium" id="right-scroll"> &#8594; </button>
      </div>

      <label className="small"> {available.amount} people available </label>
    </div>
  )
}

export default Grid;