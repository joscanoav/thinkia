import { Component } from '@angular/core';
import { CommonModule, NgForOf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { GeminiService } from '../../../services/gemini.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SimpleMarkdownPipe } from '../../../shared/pipes/markdown.pipe';



interface Message { from: 'user' | 'ia'; text: string; }

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NgForOf, NgClass, FormsModule, CardModule, ScrollPanelModule, InputTextModule, ButtonModule,ProgressSpinnerModule,SimpleMarkdownPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: Message[] = [];
  userInput = '';
  loading = false;   

  constructor(private gemini: GeminiService) {}

  send(): void {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ from: 'user', text });
    this.userInput = '';
    this.loading = true;         // ← activamos spinner

    this.gemini.generate(text).subscribe({
      next: resp => {
        const reply = resp.candidates?.[0]?.content.parts[0].text
          || 'No se recibió respuesta válida.';
        this.messages.push({ from: 'ia', text: reply });
        this.loading = false;     // ← desactivamos spinner
      },
      error: err => {
        this.messages.push({ from: 'ia', text: `Error: ${err.message}` });
        this.loading = false;     // ← desactivamos spinner
      }
    });
  }
}