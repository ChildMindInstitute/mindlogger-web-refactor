/**
 * todo: add error handling, logging, and response parsing
 * todo: add types for url and data
 * todo: add return type
 * todo: add JSDoc comments
 * todo: decide if this should be in a class as an extension of a general method
**/

export async function DataToAPI({ url, data, method }: { url: any; data: any; method: string; }): Promise<any> {
    try {
      const response = await fetch(url, {
        method: method, // Specify the HTTP method as POST
        headers: {
          'Content-Type': 'application/json' // Indicate that the request body is JSON
        },
        body: JSON.stringify(data) // Convert the data object to a JSON string
      });
  
      if (!response.ok) {
        // Handle HTTP errors (e.g., 404 Not Found, 500 Internal Server Error)
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json(); // Parse the JSON response
      console.log('Success:', responseData);
      return responseData; // Return the parsed response data
    } catch (error) {
      console.error('Error posting data:', error);
      throw error; // Re-throw the error for further handling
    }
  };

//   export async function DataToAPI({ url, data }: { url: any; data: any; }): Promise<any> {
//     try {
//       const response = await fetch(url, {
//         method: 'POST', // Specify the HTTP method as POST
//         headers: {
//           'Content-Type': 'application/json' // Indicate that the request body is JSON
//         },
//         body: JSON.stringify(data) // Convert the data object to a JSON string
//       });
  
//       if (!response.ok) {
//         // Handle HTTP errors (e.g., 404 Not Found, 500 Internal Server Error)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const responseData = await response.json(); // Parse the JSON response
//       console.log('Success:', responseData);
//       return responseData; // Return the parsed response data
//     } catch (error) {
//       console.error('Error posting data:', error);
//       throw error; // Re-throw the error for further handling
//     }
//   };
