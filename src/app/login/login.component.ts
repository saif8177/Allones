import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  passwordVisible: boolean = false; 
  constructor() { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  ngOnInit() {}

}
