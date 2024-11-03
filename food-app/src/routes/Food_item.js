import { useEffect, useState } from 'react';
import axios from 'axios';
import Restaurant_container from '../components/restaurent_food/Restautent_container';
import { useParams } from 'react-router-dom';

export default function Food_item() {
    const [foodItem, setFoodItem] = useState([]);
    const { restaurantEmailId } = useParams();  // Get restaurantEmailId from the URL params

    

    const jsonurl = `http://localhost:8081/api/guest/restaurants/menu/${restaurantEmailId}`;  // API endpoint

    useEffect(() => {
      axios.get(jsonurl)
          .then((response) => {
              console.log("Fetched menu data: ", response.data); // Check what is being fetched
              setFoodItem(response.data);  // Set fetched menu data
          })
          .catch((error) => {
              console.error("Error fetching the menu!", error);
          });
  }, [restaurantEmailId]);  // Fetch data whenever restaurantEmailId changes

    return (
        <div>
            <Restaurant_container menu={foodItem} />
        </div>
    );
}
