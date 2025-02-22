import { Component } from '@angular/core';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent {
  restaurantList = [
    {
      name: 'Cheeseburger',
      description: 'Wendy\'s Burger',
      rating: 4.9,
      image: 'assets/icon/cake.png', // Replace with actual image paths
    },
    {
      name: 'Hamburger',
      description: 'Veggie Burger',
      rating: 4.8,
      image: 'assets/icon/cake.png',
    },
    {
      name: 'Hamburger',
      description: 'Chicken Burger',
      rating: 4.6,
      image: 'assets/icon/cake.png',
    },
    {
      name: 'Hamburger',
      description: 'Fried Chicken Burger',
      rating: 4.5,
      image: 'assets/icon/cake.png',
    },
  ];
  
}
