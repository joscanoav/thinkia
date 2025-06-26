// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']   // << Cambiado a styleUrls
})
export class HeaderComponent {

// header.component.ts
darkMode = false;
toggleTheme() {
  this.darkMode = !this.darkMode;
  document.body.classList.toggle('dark', this.darkMode);
}
}
