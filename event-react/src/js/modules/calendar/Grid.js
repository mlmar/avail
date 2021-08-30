const HOURS = 24;

const Grid = ({ dates, counts }) => {
  const getTime = () => {
    let time = [<span className="flex" key="placeholder"></span>];
    for(var i = 0; i < HOURS; i++) {
      time.push(<span className="flex small time" key={i}> {i} </span>)
    }
    return time;
  }

  const getColumn = (date) => {
    let col = [];
    for(var i = 0; i < HOURS; i++) {
      const style = counts?.[date] ? (
        {
          backgroundColor: `rgba(0, 255, 17, ${(counts[date]?.[i] / counts?.max)})`,
        }
      ) : {};

      col.push(<span className="flex small date" style={style} id={date + "-" + i} key={i}> </span>)
    }
    return col;
  }

  return (
    <div className="flex grid">
      <div className="flex-col">
        {getTime()}
      </div>
      <div className="flex-col">
        <div className="flex">
          { dates?.map((d, i) => {
            const _date = new Date(d);
            const date = (_date.getUTCMonth() + 1) + "/" + _date.getUTCDate();
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
  )
}

export default Grid;