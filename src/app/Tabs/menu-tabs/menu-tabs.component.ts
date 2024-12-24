import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-menu-tabs',
  templateUrl: './menu-tabs.component.html',
  styleUrls: ['./menu-tabs.component.scss'],
})
export class MenuTabsComponent implements OnInit {
user: any;

  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {
    addIcons({
      library: icons.library,
      playCircle: icons.playCircle,
      radio: icons.radio,
      person: icons.person
    });
  }
    // Function to switch to a specific tab
    switchToTab(tab: string) {
      this.navCtrl.navigateRoot(`/tabs/${tab}`);
    }
}
