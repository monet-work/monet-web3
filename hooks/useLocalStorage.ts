import { useState, useEffect, Dispatch, SetStateAction } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Retrieve the stored value from local storage or use the initial value
  const storedValue: T = (() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(
        `Error retrieving value for key '${key}' from local storage:`,
        error
      );
      return initialValue;
    }
  })();

  // State to hold the current value
  const [value, setValue] = useState<T>(storedValue);

  // Update local storage whenever the value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Error storing value for key '${key}' in local storage:`,
        error
      );
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
