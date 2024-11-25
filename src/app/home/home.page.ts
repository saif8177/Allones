import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
[x: string]: any;
  categories = [
    { name: 'Pizza', icon: 'pizza-outline' },
    { name: 'Burger', icon: 'fast-food-outline' },
    { name: 'Biryani', icon: 'restaurant-outline' },
    { name: 'Cake', icon: 'cake-outline' },
    { name: 'Rolls', icon: 'wrap-outline' },
    { name: 'Momo', icon: 'nutrition-outline' },
    { name: 'Chowmein', icon: 'leaf-outline' }
  ];

  restaurants = [
    {
      name: 'Chowringhee',
      cuisine: 'North Indian',
      time: '30-35 min',
      offer: '40% OFF up to ₹80',
      distance: '2.5 km',
      price: '₹250 for one',
      rating: 4.1,
      image: 'assets/restaurant1.jpg'
    },
    {
      name: 'LunchBox - Meals and Thalis',
      cuisine: 'North Indian',
      time: '25-30 min',
      offer: '40% OFF up to ₹80',
      distance: '2.0 km',
      price: '₹200 for one',
      rating: 4.2,
      image: 'assets/restaurant2.jpg'
    },
    {
      name: 'Hong’s Momos',
      cuisine: 'Chinese',
      time: '25-30 min',
      offer: '60% OFF up to ₹250',
      distance: '2.5 km',
      price: '₹250 for one',
      rating: 4.1,
      image: 'assets/restaurant3.jpg'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
