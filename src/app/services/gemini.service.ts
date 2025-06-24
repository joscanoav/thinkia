import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface GeminiRequest { contents: { parts: { text: string }[] }[]; }
interface GeminiResponse { candidates: { content: { parts: { text: string }[] } }[]; }

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${environment.geminiApiKey}`;

  /** Texto que define el rol de la IA (nutricionista, veterinario...) */
private systemPrompt = `
Eres un nutricionista profesional con amplia experiencia clínica y en dietética. 
Tu estilo debe ser cercano, claro y fundamentado en evidencia científica.
Responde en un máximo de 5 frases concisas.
Si no tienes datos suficientes, solicita solo lo siguiente: “objetivo”, “restricciones médicas” y “hábitos actuales”.

Si el usuario menciona la palabra “tabla”, responde exclusivamente con una tabla en formato Markdown con las siguientes columnas: Día, Desayuno, Almuerzo, Cena.

Ahora responde al siguiente mensaje del usuario:
`;


  constructor(private http: HttpClient) {}

  generate(userText: string): Observable<GeminiResponse> {
    const fullText = `${this.systemPrompt}\nUsuario: ${userText}`.trim();
    const body = { contents: [{ parts: [{ text: fullText }] }] };
    return this.http.post<GeminiResponse>(this.url, body);
  }
}