import {
  Component,
  AfterViewChecked,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule, NgForOf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SimpleMarkdownPipe } from '../../../shared/pipes/markdown.pipe';
import { GeminiService } from '../../../services/gemini.service';

interface Message {
  from: 'user' | 'ia';
  text: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgClass,
    FormsModule,
    CardModule,
    ScrollPanelModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    SimpleMarkdownPipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('scroll') scrollPanel!: ElementRef;
  messages: Message[] = [];
  userInput = '';
  loading = false;
  private shouldScroll = false;

  constructor(private gemini: GeminiService) {}

  send(): void {
    const text = this.userInput.trim();
    if (!text) return;
    this.messages.push({ from: 'user', text, timestamp: new Date() });
    this.userInput = '';
    this.loading = true;
    this.shouldScroll = true;

    this.gemini.generate(text).subscribe({
      next: resp => {
        const reply =
          resp.candidates?.[0]?.content.parts[0].text ||
          'No se recibió respuesta válida.';
        this.messages.push({ from: 'ia', text: reply, timestamp: new Date() });
        this.loading = false;
        this.shouldScroll = true;
      },
      error: err => {
        this.messages.push({
          from: 'ia',
          text: `Error: ${err.message}`,
          timestamp: new Date()
        });
        this.loading = false;
        this.shouldScroll = true;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.scrollPanel) {
      const el: HTMLElement = this.scrollPanel.nativeElement.querySelector(
        '.p-scrollpanel-content'
      );
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }
}
