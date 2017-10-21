import { Injectable } from '@angular/core';

@Injectable()
export class SpeechService {

    speak(text: string) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
}
