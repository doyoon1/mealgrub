import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export const BagContext = createContext({});

export function BagContextProvider({ children }) {
  const { data: session } = useSession();
  const [bagRecipes, setBagRecipes] = useState([]);

  useEffect(() => {
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
      toast.error('Please log in to save recipes.', {
        position: 'top-center',
      });
      return;
    }
  
    const userId = session.user._id;
  
    axios.post('/api/bag', { userId, recipeId, action }, { withCredentials: true })
      .then(response => {

        axios.get(`/api/bag?userId=${userId}`)
          .then(response => {
            setBagRecipes(response.data.bag);
            toast.success('Saved successfully!', {
              position: 'top-center',
            });
          })
          .catch(error => {
            console.error('Error fetching updated bag data:', error);
          });
      })
      .catch(error => {
        console.error('Error managing recipe in bag:', error);
        toast.error('Failed to save recipe.', {
          position: 'top-center',
        });
      });
  }

  function addRecipe(recipeId) {
    manageRecipe('add', recipeId);
  }

  function removeRecipe(recipeId) {
    if (!session) {
      console.error('User not logged in.');
      toast.error('Please log in to save recipes.', {
        position: 'top-center',
      });
      return;
    }
  
    const userId = session.user._id;
  
    axios.post('/api/bag', { userId, recipeId, action: 'remove' }, { withCredentials: true })
      .then(response => {

        axios.get(`/api/bag?userId=${userId}`)
          .then(response => {
            setBagRecipes(response.data.bag);
            toast.success('Recipe removed successfully!', {
              position: 'top-center',
            });
          })
          .catch(error => {
            console.error('Error fetching updated bag data:', error);
          });
      })
      .catch(error => {
        console.error('Error removing recipe from bag:', error);
        toast.error('Failed to remove recipe.', {
          position: 'top-center',
        });
      });
  }
  
  return (
    <BagContext.Provider value={{ bagRecipes, setBagRecipes, addRecipe, removeRecipe }}>
      {children}
    </BagContext.Provider>
  );
}