import { Component, OnInit, OnDestroy, Renderer2  } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  isDarkTheme: boolean = false; // Default to light theme
  banners = [
    { image: 'assets/download.jpeg', alt: 'Hotels' },
    { image: 'assets/images2.jpeg', alt: 'Coming Soon' },
    { image: 'assets/food.JPG', alt: 'Destination' }
  ];
  foodCategories = [
    { name: 'Pizza', image: 'assets/icon/pizza.png' },
    { name: 'Burger', image: 'assets/icon/burger.png' },
    { name: 'Biryani', image: 'assets/icon/biryani.png' },
    { name: 'Thaliplate', image: 'assets/icon/thaliplate.png' },
    { name: 'Roll', image: 'assets/icon/roll.png' },
    { name: 'Momo', image: 'assets/icon/momo.png' },
  ];
  constructor(private renderer: Renderer2) {}

  currentIndex: number = 0;
  intervalId: any;

  ngOnInit() {
    this.startBannerRotation();
    this.loadTheme();
  }

  toggleTheme(event: any) {
    this.isDarkTheme = event.detail.checked;
    const theme = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    this.renderer.removeClass(document.body, 'dark-theme');
    this.renderer.removeClass(document.body, 'light-theme');
    this.renderer.addClass(document.body, theme);
    localStorage.setItem('theme', theme); // Save theme preference
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    this.isDarkTheme = savedTheme === 'dark-theme';
    this.renderer.addClass(document.body, savedTheme);
  }
  startBannerRotation() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.banners.length;
    }, 3000); // Rotate every 3 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
