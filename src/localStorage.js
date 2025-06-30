const localStorageWrapper = {
    setItem: (key, value, expiryInMs = 3600 * 1000) => {
      try {
        const item = {
          value,
          expiry: Date.now() + expiryInMs,
        };
        localStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.error("Error saving to localStorage", error);
      }
    },
  
    getItem: (key) => {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
  
        const item = JSON.parse(itemStr);
        if (item.expiry && Date.now() > item.expiry) {
          localStorage.removeItem(key); // auto-remove expired
          return null;
        }
  
        return item.value;
      } catch (error) {
        console.error("Error reading from localStorage", error);
        return null;
      }
    },
  
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage", error);
      }
    },
  };
  
  export default localStorageWrapper;
  
  
// src/utils/localStorage.js
// const localStorageWrapper = {
//     setItem: (key, value) => {
//         try {
//             const serializedValue = JSON.stringify(value);
//             window.localStorage.setItem(key, serializedValue);
//         } catch (error) {
//             console.error("Error saving to localStorage", error);
//         }
//     },
//     getItem: (key) => {
//         try {
//             const value = window.localStorage.getItem(key);
//             return value ? JSON.parse(value) : null;
//         } catch (error) {
//             console.error("Error reading from localStorage", error);
//             return null;
//         }
//     },
//     removeItem: (key) => {
//         try {
//             window.localStorage.removeItem(key);
//         } catch (error) {
//             console.error("Error removing from localStorage", error);
//         }
//     }
// };

// export default localStorageWrapper;