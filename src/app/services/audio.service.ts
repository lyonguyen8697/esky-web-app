import { Injectable } from '@angular/core';

@Injectable()
export class AudioService {

    correct = 'assets/sounds/correct.mp3';

    wrong = 'assets/sounds/wrong.mp3';

    play(source: string) {
        const audio = new Audio(source);
        audio.load();
        audio.play();
    }
}
