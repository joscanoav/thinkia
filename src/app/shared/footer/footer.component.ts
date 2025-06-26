// src/app/shared/footer/footer.component.ts
import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';  // << ToolbarModule, no Toolbar

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ToolbarModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']       // << Cambiado a styleUrls
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
