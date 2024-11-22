import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-flash-screen',
  templateUrl: './flash-screen.component.html',
  styleUrls: ['./flash-screen.component.scss'],
})
export class FlashScreenComponent implements OnInit {
  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {} // Inject Renderer2 and ElementRef

  ngOnInit(): void {
    // Get the red circle element
    const redCircle = this.el.nativeElement.querySelector('.red-circle');

    // Listen for the animationend event on the red circle
    this.renderer.listen(redCircle, 'animationend', () => {
      this.router.navigate(['/welcome']); // Navigate to the welcome component
    });
  }
}
