import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export const BagContext = createContext({});

export function BagContextProvider({ children }) {
  const { data: session } = useSession();
  const [bagRecipes, setBagRecipes] = useState([]);

  useEffect(() => {
    // Fetch the initial bag data when the component mounts
    if (session) {
      axios.get(`/api/bag?userId=${session.user._id}`)
        .then(response => {
          setBagRecipes(response.data.bag);
        })
        .catch(error => {
          console.error('Error fetching user bag:', error);
        });
    }
  }, [session]);

  function manageRecipe(action, recipeId) {
    if (!session) {
      console.error('User not logged in.');
      // Display a toast error message here
      toast.error('Please log in to save recipes.', {
        position: 'bottom-left', // Set the position to bottom-left
      });
      return;
    }
  
    const userId = session.user._id;
  
    axios.post('/api/bag', { userId, recipeId, action }, { withCredentials: true })
      .then(response => {
        // Handle success if needed
        // Fetch the updated bag data after successful update
        axios.get(`/api/bag?userId=${userId}`)
          .then(response => {
            setBagRecipes(response.data.bag);
            // Display a toast success message here
            toast.success('Saved successfully!', {
              position: 'bottom-left', // Set the position to bottom-left
            });
          })
          .catch(error => {
            console.error('Error fetching updated bag data:', error);
          });
      })
      .catch(error => {
        // Handle error if needed
        console.error('Error managing recipe in bag:', error);
        // Display a toast error message here if saving fails
        toast.error('Failed to save recipe.', {
          position: 'bottom-left', // Set the position to bottom-left
        });
      });
  }

  function addRecipe(recipeId) {
    manageRecipe('add', recipeId);
  }

  function removeRecipe(recipeId) {
    if (!session) {
      console.error('User not logged in.');
      // Display a toast error message here
      toast.error('Please log in to save recipes.', {
        position: 'bottom-left', // Set the position to bottom-left
      });
      return;
    }
  
    const userId = session.user._id;
  
    axios.post('/api/bag', { userId, recipeId, action: 'remove' }, { withCredentials: true })
      .then(response => {
        // Handle success if needed
        // Fetch the updated bag data after successful update
        axios.get(`/api/bag?userId=${userId}`)
          .then(response => {
            setBagRecipes(response.data.bag);
            // Display a toast success message here
            toast.success('Recipe removed successfully!', {
              position: 'bottom-left', // Set the position to bottom-left
            });
          })
          .catch(error => {
            console.error('Error fetching updated bag data:', error);
          });
      })
      .catch(error => {
        // Handle error if needed
        console.error('Error removing recipe from bag:', error);
        // Display a toast error message here if removal fails
        toast.error('Failed to remove recipe.', {
          position: 'bottom-left', // Set the position to bottom-left
        });
      });
  }
  
  return (
    <BagContext.Provider value={{ bagRecipes, setBagRecipes, addRecipe, removeRecipe }}>
      {children}
    </BagContext.Provider>
  );
}