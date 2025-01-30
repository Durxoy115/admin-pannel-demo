// import React, { useState } from 'react';

// const Test = () => {
//     const [test, setTest] = useState("");
// const handleFile = (i) =>{
//     setTest(i);
//     console.log(test);
// }
// const handleSubmit = async (event) => {
//     event.preventDefault();



//     // Create a FormData object
//     const formData = new FormData();
    
//     // Append image
//     formData.append("image", selectedFile); // selectedFile should be the file from input

//     // Append JSON data
//     const jsonData = {
//         name: "e-commerce marketplace",
//         client_id: "zcl-1edea9b8",
//         order_date: "2024-12-24",
//         estimate_delivery_date: "2025-12-24"
//     };

//     // Convert JSON to Blob and append
//     formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

//     try {
//         const response = await fetch("http://127.0.0.1:8000/api/orders/", {
//             method: "POST",
//             body: formData,
//         });

//         if (response.ok) {
//             console.log("Order created successfully");
//         } else {
//             console.error("Error creating order");
//         }
//     } catch (error) {
//         console.error("Request failed", error);
//     }
// };
//     return (
//         <div>
//         <form action="submit" onClick={handleSubmit}>
//             <input type = "file"  onClick={handleFile} alt="" />
//         </form>
//         </div>
//     );
// };

// export default Test;