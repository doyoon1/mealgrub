export const getUserFromToken = (token) => {
    if (token && typeof token === 'object') {
      if ('user' in token) {
        // If 'user' key is present, return the user data
        return token.user;
      } else {
        // Recursively check nested tokens
        for (const key in token) {
          const userData = getUserFromToken(token[key]);
          if (userData) {
            return userData;
          }
        }
      }
    }
    // Return null if user data is not found
    return null;
  };

    // if (status === "authenticated") {
  //   // Retrieve and log the user data from the session token
  //   const userData = getUserFromToken(session?.token);
  //   if (userData) {
  //     console.log('User Data:', userData);
  //   } else {
  //     console.log('User Data not found');
  //   }
  // }
  
  // if (status === "unauthenticated") {
  //   console.log("unauthenticated");
  // }
  