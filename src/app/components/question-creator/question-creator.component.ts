import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';

import { ContributorService } from '../../services/contributor.service';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { TooltipService } from '../../services/tooltip.service';
import { AudioService } from '../../services/audio.service';
import { AnswerType } from '../../enums/answer-type.enum';
import { ModalService } from '../../services/modal.service';
import { slideInOut } from '../../animations/slide-in-out.animation';

@Component({
    selector: 'app-question-creator',
    templateUrl: 'question-creator.component.html',
    styleUrls: ['question-creator.component.css'],
    animations: [
        slideInOut({ slideOut: false, timing: '200ms', translate: '15%' }),
        slideInOut({ name: 'slideInOutDelay', slideOut: false, timing: '200ms 50ms', translate: '15%' })
    ]
})
export class QuestionCreatorComponent implements OnInit {

    form: FormGroup;

    question: Question;

    isCreate: boolean;

    editing: boolean;

    previewQuestion: Question;

    isPreviewCorrect: boolean;

    deleteModal = 'deleteModal';

    confirmModal = 'confirmModal';

    previewModal = 'previewModal';

    confirmOk: Function;

    confirmCancel: Function;

    confirmContent: string;

    responseModal = 'responseModal';

    deleteNote: string;

    serverError: string;

    submitting = false;

    correctArrangementChoices: string[];

    wrongArrangementChoices: string[];

    get questiontext() {
        return this.form.get('questiontext');
    }

    get phrase() {
        return this.form.get('phrase');
    }

    get voice() {
        return this.form.get('voice');
    }

    get picture() {
        return this.form.get('picture');
    }

    get answerType() {
        return this.form.get('answerType');
    }

    get arrangementAnswer() {
        return this.form.get('arrangementAnswer');
    }

    get multiChoiceAnswer() {
        return <FormArray>this.form.get('multiChoiceAnswer');
    }

    get speechAndTypingAnswers() {
        return <FormArray>this.form.get('speechAndTypingAnswers');
    }

    get arrangementChoices() {
        return <FormArray>this.form.get('arrangementChoices');
    }

    get multiChoiceChoices() {
        return <FormArray>this.form.get('multiChoiceChoices');
    }

    get newSpeechAndTypingAnswer() {
        return this.form.get('newSpeechAndTypingAnswer');
    }

    get newArrangementChoice() {
        return this.form.get('newArrangementChoice');
    }

    get difficulty() {
        return this.form.get('difficulty');
    }

    get note() {
        return this.form.get('note');
    }

    get isQuestiontextChanged() {
        return this.questiontext.value !== this.question.question;
    }

    get isPhraseChanged() {
        return this.phrase.value !== this.question.phrase;
    }
    get isVoiceChanged() {
        return this.voice.value !== this.question.voice;
    }

    get isPictureChanged() {
        // return this.picture.value !== this.question.picture;
        return false;
    }

    get isAnswerTypeChanged() {
        return this.answerType.value !== this.question.answerType;
    }

    get isAnswersChanged() {
        switch (this.answerType.value) {
            case 'ARRANGEMENT':
                return this.arrangementAnswer.value !== this.question.answers.join(' ');
            case 'MULTI_CHOICE':
                return this.isCreate ? !this.multiChoiceAnswer.value[0]
                    : this.multiChoiceAnswer.value.length !== this.question.answers.length
                    || this.multiChoiceAnswer.value[0] !== this.question.answers[0];
            case 'SPEECH':
            case 'TYPING':
                return this.isCreate ? this.speechAndTypingAnswers.value.some(value => value !== '')
                    : this.speechAndTypingAnswers.value.length !== this.question.answers.length
                    || this.speechAndTypingAnswers.value.some((value, index) => this.question.answers[index] !== value);
        }
    }

    get isChoicesChanged() {
        switch (this.answerType.value) {
            case 'ARRANGEMENT':
                return this.isCreate ? this.arrangementChoices.value.some(value => value !== '')
                    : this.arrangementChoices.value.length !== this.question.choices.length
                    || this.arrangementChoices.value.some((value, index) => this.question.choices[index] !== value);
            case 'MULTI_CHOICE':
                return this.isCreate ? this.multiChoiceChoices.value.some(value => value !== '')
                    : this.multiChoiceChoices.value.length !== this.question.choices.length
                    || this.multiChoiceChoices.value.some((value, index) => this.question.choices[index] !== value);
            case 'SPEECH':
            case 'TYPING':
                return false;
        }
    }

    get isDifficultyChanged() {
        return this.difficulty.value !== this.question.difficulty;
    }

    get isNoteChanged() {
        return this.note.value.length !== 0;
    }

    get isFormChanged() {
        return this.isQuestiontextChanged || this.isPhraseChanged || this.isVoiceChanged || this.isPictureChanged
            || this.isAnswerTypeChanged || this.isAnswersChanged || this.isChoicesChanged || this.isDifficultyChanged
            || this.isNoteChanged;
    }

    get isFormValid() {
        return this.isQuestionValid && (this.isCreate || this.note.valid);
    }

    get isQuestionValid() {
        const valid = this.questiontext.valid && this.phrase.valid
            && this.voice.valid && this.picture.valid && (this.phrase.value || this.voice.value || this.picture.value);
        switch (this.answerType.value) {
            case 'ARRANGEMENT':
                return valid && this.arrangementAnswer.valid && this.arrangementChoices.valid;
            case 'MULTI_CHOICE':
                return valid && this.multiChoiceAnswer.valid && this.multiChoiceChoices.valid;
            case 'SPEECH':
            case 'TYPING':
                return valid && this.speechAndTypingAnswers.valid;
        }
    }

    constructor(private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private contributor: ContributorService,
        private questionService: QuestionService,
        private audio: AudioService,
        private modal: ModalService,
        private tooltip: TooltipService) { }

    ngOnInit() {
        this.route.data
            .subscribe(data => {
                this.submitting = false;
                this.serverError = '';
                this.deleteNote = '';
                if (data.question) {
                    this.question = data.question;
                    for (const key in this.question) {
                        if (this.question[key] === null) {
                            this.question[key] = '';
                        }
                    }
                    this.isCreate = false;
                    this.editing = false;
                    this.createForm();
                    this.disableForm();
                } else {
                    this.initDefaultValue();
                    this.isCreate = true;
                    this.editing = true;
                    this.createForm();
                }
            });
    }

    initDefaultValue() {
        this.question = {
            id: null,
            question: '',
            phrase: '',
            voice: '',
            picture: '',
            answerType: 'MULTI_CHOICE',
            answers: ['0'],
            choices: ['', '', '', ''],
            difficulty: 'BASIC'
        };
    }

    createForm() {
        this.form = this.fb.group({
            questiontext: this.fb.control(
                this.question.question || '',
                Validators.compose([Validators.required, Validators.maxLength(100)])
            ),
            phrase: this.fb.control(
                this.question.phrase || '',
                Validators.compose([Validators.maxLength(100)])
            ),
            voice: this.fb.control(
                this.question.voice || '',
                Validators.compose([Validators.maxLength(100)])
            ),
            picture: this.fb.control(
                this.question.picture || '',
                Validators.compose([Validators.maxLength(50)])
            ),
            answerType: this.fb.control(
                this.question.answerType || 'MULTI_CHOICE',
                Validators.compose([Validators.required])
            ),
            arrangementAnswer: this.fb.control(
                '',
                Validators.compose([Validators.required])
            ),
            multiChoiceAnswer: this.fb.array(
                [
                    this.fb.control('0', Validators.required)
                ],
                Validators.compose([Validators.required])
            ),
            speechAndTypingAnswers: this.fb.array(
                [],
                Validators.compose([Validators.required])
            ),
            arrangementChoices: this.fb.array(
                [],
                Validators.compose([Validators.required])
            ),
            multiChoiceChoices: this.fb.array(
                [
                    this.fb.control('', Validators.required),
                    this.fb.control('', Validators.required),
                    this.fb.control('', Validators.required),
                    this.fb.control('', Validators.required)
                ],
                Validators.compose([Validators.required])
            ),
            newSpeechAndTypingAnswer: this.fb.control(
                '',
                Validators.compose([Validators.required])
            ),
            newArrangementChoice: this.fb.control(
                '',
                Validators.compose([Validators.required])),
            choices: this.fb.array([]),
            difficulty: this.fb.control(
                this.question.difficulty || 'BASIC',
                Validators.compose([Validators.required])
            ),
            note: this.fb.control(
                '',
                Validators.compose([Validators.required, Validators.maxLength(200)])
            )
        });
        this.correctArrangementChoices = [];
        this.wrongArrangementChoices = [];
        switch (this.question.answerType) {
            case 'ARRANGEMENT':
                this.arrangementAnswer.setValue(this.question.answers.join(' '));
                this.question.answers.forEach(value => this.correctArrangementChoices.push(value));
                this.question.choices
                    .forEach(value => {
                        this.arrangementChoices
                            .push(this.fb.control(value, Validators.required));
                        this.wrongArrangementChoices.push(value);
                    });
                this.question.choices.forEach(value => {
                    if (this.correctArrangementChoices.indexOf(value) !== -1
                        && this.wrongArrangementChoices.length > this.question.choices.length - this.question.answers.length) {
                        this.wrongArrangementChoices.splice(this.wrongArrangementChoices.indexOf(value), 1);
                    }
                });
                break;
            case 'MULTI_CHOICE':
                this.multiChoiceAnswer.setValue(this.question.answers);
                this.multiChoiceChoices.setValue(this.question.choices);
                break;
            case 'SPEECH':
            case 'TYPING':
                this.question.answers
                    .forEach(value => this.speechAndTypingAnswers
                        .push(this.fb.control(value, Validators.required)));
                break;
        }
        this.registerOnChanges();
    }

    registerOnChanges() {
        this.arrangementAnswer.valueChanges
            .subscribe((value: string) => {
                if (value !== null) {
                    this.clearFormArray(this.arrangementChoices);
                    this.correctArrangementChoices = value.split(' ').filter(s => s !== '');
                    this.correctArrangementChoices.forEach(choice => this.arrangementChoices
                        .push(this.fb.control(choice, Validators.required)));
                    this.wrongArrangementChoices.forEach(choice => this.arrangementChoices
                        .push(this.fb.control(choice, Validators.required)));
                }
            });
    }

    resetForm() {
        this.form.reset({
            questiontext: this.question.question || '',
            phrase: this.question.phrase || '',
            voice: this.question.voice || '',
            picture: this.question.picture || '',
            answerType: this.question.answerType || 'MULTI_CHOICE',
            multiChoiceAnswer: '0',
            difficulty: this.question.difficulty || 'BASIC',
            note: ''
        });
        this.clearFormArray(this.arrangementChoices);
        this.correctArrangementChoices = [];
        this.wrongArrangementChoices = [];
        this.clearFormArray(this.speechAndTypingAnswers);
        switch (this.question.answerType) {
            case 'ARRANGEMENT':
                this.question.answers.forEach(value => this.correctArrangementChoices.push(value));
                this.question.choices
                    .forEach(value => {
                        this.arrangementChoices
                            .push(this.fb.control(value, Validators.required));
                        this.wrongArrangementChoices.push(value);
                    });
                this.question.choices.forEach(value => {
                    if (this.correctArrangementChoices.indexOf(value) !== -1
                        && this.wrongArrangementChoices.length > this.question.answers.length - this.question.choices.length) {
                        this.wrongArrangementChoices.splice(this.wrongArrangementChoices.indexOf(value), 1);
                    }
                });
                this.arrangementAnswer.setValue(this.question.answers.join(' '));
                break;
            case 'MULTI_CHOICE':
                this.multiChoiceAnswer.setValue(this.question.answers);
                this.multiChoiceChoices.setValue(this.question.choices);
                break;
            case 'SPEECH':
            case 'TYPING':
                this.question.answers
                    .forEach(value => this.speechAndTypingAnswers
                        .push(this.fb.control(value, Validators.required)));
                break;
        }
    }

    serialize(): Question {
        const question: Question = {
            id: this.question.id,
            question: this.questiontext.value,
            phrase: this.phrase.value,
            voice: this.voice.value,
            picture: this.picture.value,
            answerType: this.answerType.value,
            answers: [],
            choices: [],
            difficulty: this.difficulty.value
        };
        switch (question.answerType) {
            case 'ARRANGEMENT':
                question.answers = this.arrangementAnswer.value.split(' ');
                question.choices = this.arrangementChoices.value;
                break;
            case 'MULTI_CHOICE':
                question.answers = this.multiChoiceAnswer.value;
                question.choices = this.multiChoiceChoices.value;
                break;
            case 'SPEECH':
            case 'TYPING':
                question.answers = this.speechAndTypingAnswers.value;
                break;
        }
        return question;
    }

    create() {
        if (this.isCreate && this.isFormChanged && this.isFormValid) {
            this.contributor.insertQuestion(this.note.value, this.serialize())
                .finally(() => {
                    this.showModal(this.responseModal);
                })
                .subscribe(
                () => {
                    this.serverError = '';
                },
                (error) => {
                    this.serverError = error.message;
                });
            this.submitting = true;
            this.disableForm();
        }
    }

    save() {
        if (!this.isCreate && this.isFormChanged && this.isFormValid) {
            this.contributor.updateQuestion(this.note.value, this.serialize())
                .finally(() => {
                    this.showModal(this.responseModal);
                })
                .subscribe(
                () => {
                    this.serverError = '';
                },
                (error) => {
                    this.serverError = error.message;
                });
            this.submitting = true;
            this.disableForm();
        }
    }

    delete() {
        this.hideModal(this.deleteModal);
        if (!this.isCreate) {
            this.contributor.deleteQuestion(this.deleteNote, this.question.id)
                .finally(() => {
                    this.showModal(this.responseModal);
                })
                .subscribe(
                () => {
                    this.serverError = '';
                },
                (error) => {
                    this.serverError = error.message;
                });
        }
    }

    edit() {
        this.editing = true;
        this.enableForm();
    }

    cancelEdit() {
        this.editing = false;
        this.disableForm();
        this.resetForm();
        this.hideModal(this.confirmModal);
    }

    enableForm() {
        this.questiontext.enable();
        this.phrase.enable();
        this.voice.enable();
        this.picture.enable();
        this.answerType.enable();
        this.arrangementAnswer.enable();
        this.arrangementChoices.enable();
        this.multiChoiceAnswer.enable();
        this.multiChoiceChoices.enable();
        this.speechAndTypingAnswers.enable();
        this.newSpeechAndTypingAnswer.enable();
        this.newArrangementChoice.enable();
        this.difficulty.enable();
        this.note.enable();
    }

    disableForm() {
        this.questiontext.disable();
        this.phrase.disable();
        this.voice.disable();
        this.picture.disable();
        this.answerType.disable();
        this.arrangementAnswer.disable();
        this.arrangementChoices.disable();
        this.multiChoiceAnswer.disable();
        this.multiChoiceChoices.disable();
        this.speechAndTypingAnswers.disable();
        this.newSpeechAndTypingAnswer.disable();
        this.newArrangementChoice.disable();
        this.difficulty.disable();
        this.note.disable();
    }

    /* Arrangement */
    addArrangementChoice(value: string) {
        this.arrangementChoices.push(this.fb.control(value, Validators.required));
        this.wrongArrangementChoices.push(value);
    }

    editArrangementChoice(input: HTMLInputElement) {
        if (this.editing) {
            input.readOnly = false;
            input.focus();
        }
    }

    endArrangementChoiceEdit(index: number, input: HTMLInputElement) {
        if (this.arrangementChoices.at(index).invalid) {
            this.removeArrangementChoice(index);
        } else {
            input.readOnly = true;
            const value: string[] = this.arrangementChoices.value;
            this.correctArrangementChoices = value.slice(0, this.correctArrangementChoices.length);
            this.arrangementAnswer.setValue(this.correctArrangementChoices.join(' '), { emitEvent: false });
            this.wrongArrangementChoices = value.slice(this.correctArrangementChoices.length, value.length);
        }
    }

    removeArrangementChoice(index: number) {
        if (index < this.correctArrangementChoices.length) {
            this.correctArrangementChoices.splice(index, 1);
            this.arrangementAnswer.setValue(this.correctArrangementChoices.join(' '));
        } else {
            this.wrongArrangementChoices.splice(index - this.correctArrangementChoices.length);
            this.arrangementChoices.removeAt(index);
        }
    }

    addArrangementChoiceButtonClicked() {
        if (this.newArrangementChoice.valid) {
            this.addArrangementChoice(this.newArrangementChoice.value);
            this.newArrangementChoice.setValue('');
        }
    }

    /* Multi choice */
    editMultiChoice(input: HTMLInputElement) {
        if (this.editing) {
            input.readOnly = false;
            input.focus();
        }
    }

    endMultiChoiceEdit(input: HTMLInputElement) {
        input.readOnly = true;
    }

    markAtAnswer(event: any, index: number) {
        this.multiChoiceAnswer.at(0).setValue(index.toString());
        event.stopPropagation();
    }

    /* Speech and Typing */
    addSpeechAndTypingAnswer(value: string) {
        this.speechAndTypingAnswers.insert(0, this.fb.control(value, Validators.required));
    }

    removeSpeechAndTypingAnswer(index: number) {
        this.speechAndTypingAnswers.removeAt(index);
    }

    addSpeechAndTypingAnswerButtonClicked() {
        if (this.newSpeechAndTypingAnswer.valid) {
            this.addSpeechAndTypingAnswer(this.newSpeechAndTypingAnswer.value);
            this.newSpeechAndTypingAnswer.setValue('');
        }
    }

    editSpeechAndTypingAnswer(input: HTMLInputElement) {
        if (this.editing) {
            input.readOnly = false;
            input.focus();
        }
    }

    endSpeechAndTypingAnswerEdit(index: number, input: HTMLInputElement) {
        if (this.speechAndTypingAnswers.at(index).invalid) {
            this.speechAndTypingAnswers.removeAt(index);
        } else {
            input.readOnly = true;
        }
    }

    cancelEditButtonClicked() {
        if (this.isFormChanged) {
            this.confirm({
                content: 'Thao tác chưa hoàn thành. Bạn có muốn hủy?',
                ok: () => this.cancelEdit(),
                cancel: () => this.hideModal(this.confirmModal)

            });
        } else {
            this.cancelEdit();
        }
    }

    deleteButtonClicked() {
        if (!this.isCreate) {
            this.showModal(this.deleteModal);
        }
    }

    previewButtonClicked() {
        if (!this.editing || this.isQuestionValid) {
            this.previewQuestion = this.serialize();
            this.isPreviewCorrect = null;
            this.showModal(this.previewModal);
        }
    }

    accept() {
        this.hideModal(this.responseModal);
        if (this.serverError) {
            this.submitting = false;
            if (this.editing) {
                this.enableForm();
            }
        } else {
            this.router.navigate(['']);
        }
    }

    answerPreviewQuestion(answer: string) {
        if (this.questionService.checkAnswer(this.previewQuestion, answer)) {
            this.isPreviewCorrect = true;
            this.audio.play(this.audio.correct);
        } else {
            this.isPreviewCorrect = false;
            this.audio.play(this.audio.wrong);
        }
        window.setTimeout(() => this.hideModal(this.previewModal), 1000);
    }

    confirm(option: { content, ok: Function, cancel: Function }) {
        this.confirmContent = option.content;
        this.confirmOk = option.ok;
        this.confirmCancel = option.cancel;
        this.showModal(this.confirmModal);
    }

    showModal(modal: string) {
        this.modal.show(modal);
    }

    hideModal(modal: string) {
        this.modal.hide(modal);
    }

    clearFormArray(array: FormArray) {
        while (array.length > 0) {
            array.removeAt(0);
        }
    }
}
