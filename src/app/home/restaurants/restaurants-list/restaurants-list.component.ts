import { Component } from '@angular/core';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent {
  restaurantList = [
    {
      name: 'Bustling Food Stall',
      image: 'https://via.placeholder.com/300x200.png?text=Cafe+Mocha+Bliss',
      rating: 4.5
    },
    {
      name: 'Cafe Mocha Bliss',
      image: 'https://via.placeholder.com/300x200.png?text=Cafe+Mocha+Bliss',
      rating: 4
    },
    {
      name: 'Pizza Paradise',
      image: 'https://via.placeholder.com/300x200.png?text=Pizza+Paradise',
      rating: 5
    },
    {
      name: 'Sushi Delights',
      image: 'https://via.placeholder.com/300x200.png?text=Sushi+Delights',
      rating: 4
    }
  ];
}
