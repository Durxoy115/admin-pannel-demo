const localStorage = {
    setItem: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error("Error saving to localStorage", error);
        }
    },
    getItem: (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
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
    }
};

export default localStorage;
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