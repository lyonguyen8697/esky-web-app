import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
    SpeechRecognition: any;
    SpeechGrammarList: any;
}

@Injectable()
export class SpeechService {

    recognition: any;

    constructor(private zone: NgZone) {
        const { webkitSpeechRecognition, SpeechRecognition }: IWindow = <IWindow>window;
        this.recognition = new (SpeechRecognition || webkitSpeechRecognition)();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

    }

    speak(text: string) {
        if (speechSynthesis.speaking) {
            this.cancelSpeak();
        }
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }

    cancelSpeak() {
        speechSynthesis.cancel();
    }

    recognize(words?: string[]): Observable<string> {
        if (words) {
            return this.recognizeWords(words);
        }
        return this.recognizeSentence();
    }

    recognizeSentence(): Observable<string> {
        return Observable.create(observer => {
            this.recognition.grammars = this.createGrammarList();

            this.recognition.onresult = speech => {
                let term = '';
                if (speech.results) {
                    term = speech.results[0][0].transcript;
                }
                this.zone.run(() => {
                    observer.next(term);
                });
            };

            this.recognition.onerror = error => {
                observer.error(error);
            };

            this.recognition.onend = () => {
                observer.complete();
            };

            this.recognition.start();
        });
    }

    recognizeWords(words: string[]): Observable<string> {
        return Observable.create(observer => {
            this.recognition.grammars = this.createGrammarList(words);

            this.recognition.onresult = speech => {
                let term = '';
                if (speech.results) {
                    term = speech.results[0][0].transcript;
                }
                this.zone.run(() => {
                    observer.next(term);
                });
            };

            this.recognition.onerror = error => {
                observer.error(error);
            };

            this.recognition.onspeechend = () => {
                this.stopRecognize();
            };

            this.recognition.onend = () => {
                observer.complete();
            };

            this.recognition.start();
        });
    }

    createGrammarList(words?: string[]): any {
        const { webkitSpeechGrammarList, SpeechGrammarList }: IWindow = <IWindow>window;
        const speechRecognitionList = new (SpeechGrammarList || webkitSpeechGrammarList)();
        if (words) {
            speechRecognitionList.addFromString(this.buildGrammar(words), 1);
        }
        return speechRecognitionList;
    }

    buildGrammar(words: string[]): string {
        return '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;';
    }

    stopRecognize() {
        this.recognition.stop();
    }
}
