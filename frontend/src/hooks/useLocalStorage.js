import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

// Hook for storing objects with automatic serialization
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const updateValue = (updates) => {
    setValue(prev => ({ ...prev, ...updates }));
  };

  const removeKey = (keyToRemove) => {
    setValue(prev => {
      const newValue = { ...prev };
      delete newValue[keyToRemove];
      return newValue;
    });
  };

  return [value, setValue, updateValue, removeKey];
};

// Hook for storing arrays
export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const addItem = (item) => {
    setValue(prev => [...prev, item]);
  };

  const removeItem = (index) => {
    setValue(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, newItem) => {
    setValue(prev => prev.map((item, i) => i === index ? newItem : item));
  };

  const clearArray = () => {
    setValue([]);
  };

  return [value, setValue, addItem, removeItem, updateItem, clearArray];
};

// Hook for storing primitive values with type safety
export const useLocalStorageString = (key, initialValue = '') => {
  return useLocalStorage(key, initialValue);
};

export const useLocalStorageNumber = (key, initialValue = 0) => {
  return useLocalStorage(key, initialValue);
};

export const useLocalStorageBoolean = (key, initialValue = false) => {
  return useLocalStorage(key, initialValue);
}; 