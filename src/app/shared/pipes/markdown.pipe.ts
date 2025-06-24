import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'simpleMarkdown',
  standalone: true        // ← aquí
})
export class SimpleMarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return value;

    // 1) **negrita**
    let html = value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 2) *cursiva*
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // 3) listas “- ”
    if (/- /.test(html)) {
      const items = html
        .split(/\r?\n/)
        .filter(line => line.startsWith('- '))
        .map(line => `<li>${line.substr(2)}</li>`)
        .join('');
      html = html.replace(/(- .+\r?\n?)+/, `<ul>${items}</ul>`);
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
