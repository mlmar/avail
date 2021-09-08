import { useState, useEffect, useRef } from 'react';

import { Panel } from './Interface.js';
import Icon from './Icon.js';

const DEFAULT_DELAY = 5000;

export const useToast = () => {
  const [message, setMessage] = useState(null);

  const timerRef = useRef({});

  useEffect(() => {
    if(!message) return;

    const clear = () => clearTimeout(timerRef.current);
    if(timerRef.current) clear();

    const timeoutFunc = () => setMessage(null);
    timerRef.current = setTimeout(timeoutFunc, DEFAULT_DELAY);

    return () => {
      if(timerRef.current) clear();
    }
  }, [message]);

  const getToast = () => {
    if(!message) return;
    return (
      <Panel className={"toast small fade-in"} onClick={() => setMessage(null)}>
        <p> {message} </p>
        <Icon type="close"/>
      </Panel>
    )
  }

  return [getToast(), setMessage];
}