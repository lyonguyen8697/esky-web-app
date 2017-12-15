import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl, Validators } from '@angular/forms';

import { ContributorService } from '../../services/contributor.service';
import { QuestionService } from '../../services/question.service';
import { ModalService } from '../../services/modal.service';
import { Lesson } from '../../models/lesson.model';
import { Question } from '../../models/question.model';

@Component({
    selector: 'app-lesson-creator',
    templateUrl: 'lesson-creator.component.html',
    styleUrls: ['lesson-creator.component.css']
})
export class LessonCreatorComponent implements OnInit {

    questionSource: Question[];

    canSelectQuestions: Question[];

    selectedNewQuestions: Question[];

    selectedRemoveQuestions: Question[];

    questionFilter: string;

    editingQuestions: Question[];

    form: FormGroup;

    lesson: Lesson;

    questions: Question[];

    isCreate: boolean;

    editing: boolean;

    serverError: string;

    submitting = false;

    questionSelectModal = 'questionSelectModal';

    deleteModal = 'deleteModal';

    confirmModal = 'confirmModal';

    confirmOk: Function;

    confirmCancel: Function;

    confirmContent: string;

    responseModal = 'responseModal';

    deleteNote: string;

    get subject() {
        return this.form.get('subject');
    }

    get title() {
        return this.form.get('title');
    }

    get description() {
        return this.form.get('description');
    }

    get level() {
        return this.form.get('level');
    }

    get note() {
        return this.form.get('note');
    }

    get isSubjectChanged() {
        return this.subject.value !== this.lesson.subject;
    }

    get isTitleChanged() {
        return this.title.value !== this.lesson.title;
    }

    get isDescriptionChanged() {
        return this.description.value !== this.lesson.description;
    }

    get isLevelChanged() {
        return this.level.value !== this.lesson.level;
    }

    get isNoteChanged() {
        return this.note.value.length !== 0;
    }

    get isQuestionsChanged() {
        return !this.compareQuestions(this.questions, this.editingQuestions);
    }

    get isFormChanged() {
        return this.isSubjectChanged || this.isTitleChanged || this.isDescriptionChanged
            || this.isLevelChanged || this.isNoteChanged || this.isQuestionsChanged;
    }

    get isFormValid() {
        return this.subject.valid && this.title.valid && this.description.valid && this.level.valid
            && (this.isCreate || this.note.valid) && this.editingQuestions.length > 0;
    }

    constructor(private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private contributor: ContributorService,
        private questionService: QuestionService,
        private modal: ModalService) { }

    ngOnInit() {
        this.questionService.getAll()
            .subscribe(questions => {
                this.questionSource = questions;
                this.distinctQuestion();
            });
        this.route.data
            .subscribe(data => {
                this.submitting = false;
                this.serverError = '';
                this.deleteNote = '';
                if (data.lesson) {
                    this.lesson = data.lesson.lesson;
                    this.questions = data.lesson.questions;
                    this.exceptNull(this.lesson);
                    this.exceptNull(this.questions);
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
                this.selectedNewQuestions = [];
                this.selectedRemoveQuestions = [];
                this.canSelectQuestions = [];
                this.editingQuestions = [];
                this.questions.forEach(question => this.editingQuestions.push(question));
                this.distinctQuestion();
            });
    }

    initDefaultValue() {
        this.lesson = {
            id: null,
            subject: '',
            title: '',
            description: '',
            level: 1
        };
        this.questions = [];
    }

    exceptNull(object: any) {
        for (const key in object) {
            if (object[key] instanceof String && object[key] === null) {
                object[key] = '';
            }
        }
    }

    distinctQuestion() {
        if (this.questionSource && this.editingQuestions) {
            this.questionSource.forEach(question => {
                if (!this.editingQuestions.find(item => item.id === question.id)) {
                    this.canSelectQuestions.push(question);
                }
            });
        }
    }

    createForm() {
        this.form = this.fb.group({
            subject: this.fb.control(
                this.lesson.subject || '',
                Validators.compose([Validators.required, Validators.maxLength(50)])
            ),
            title: this.fb.control(
                this.lesson.title || '',
                Validators.compose([Validators.required, Validators.maxLength(50)])
            ),
            description: this.fb.control(
                this.lesson.description || '',
                Validators.compose([Validators.required, Validators.maxLength(100)])
            ),
            level: this.fb.control(
                this.lesson.level || 1,
                Validators.compose([Validators.required, Validators.min(1)])
            ),
            note: this.fb.control(
                '',
                Validators.compose([Validators.required, Validators.maxLength(200)])
            )
        });
    }

    resetForm() {
        this.form.reset({
            subject: this.lesson.subject || '',
            title: this.lesson.title || '',
            description: this.lesson.description || '',
            level: this.lesson.level || 1,
            note: ''
        });
        this.selectedNewQuestions = [];
        this.selectedRemoveQuestions = [];
        this.canSelectQuestions = [];
        this.editingQuestions = [];
        this.questions.forEach(question => this.editingQuestions.push(question));
        this.distinctQuestion();
    }

    serialize(): Lesson {
        const lesson: Lesson = {
            id: this.lesson.id,
            subject: this.subject.value,
            title: this.title.value,
            description: this.description.value,
            level: this.level.value
        };
        return lesson;
    }

    create() {
        if (this.isCreate && this.isFormChanged && this.isFormValid) {
            this.contributor.insertLesson(this.note.value, this.serialize(), this.editingQuestions)
                .subscribe(res => {
                    if (res.status === 200) {
                        this.serverError = '';
                    } else {
                        this.serverError = res.message;
                    }
                    this.showModal(this.responseModal);
                });
            this.submitting = true;
            this.disableForm();
        }
    }

    save() {
        if (!this.isCreate && this.isFormChanged && this.isFormValid) {
            this.contributor.updateLesson(this.note.value, this.serialize(), this.editingQuestions)
                .subscribe(res => {
                    if (res.status === 200) {
                        this.serverError = '';
                    } else {
                        this.serverError = res.message;
                    }
                    this.showModal(this.responseModal);
                });
            this.submitting = true;
            this.disableForm();
        }
    }

    delete() {
        this.hideModal(this.deleteModal);
        if (!this.isCreate) {
            this.contributor.deleteLesson(this.deleteNote, this.lesson.id)
                .subscribe(res => {
                    if (res.status === 200) {
                        this.serverError = '';
                    } else {
                        this.serverError = res.message;
                    }
                    this.showModal(this.responseModal);
                });
        }
    }

    enableForm() {
        this.subject.enable();
        this.title.enable();
        this.description.enable();
        this.level.enable();
        this.note.enable();
    }

    disableForm() {
        this.subject.disable();
        this.title.disable();
        this.description.disable();
        this.level.disable();
        this.note.disable();
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

    removeQuestionButtonClicked() {
        this.selectedRemoveQuestions
            .forEach(question => this.editingQuestions.
                splice(this.editingQuestions.indexOf(question), 1));
        this.selectedRemoveQuestions = [];
    }

    openQuestionSelectModalButtonClicked() {
        this.showModal(this.questionSelectModal);
    }

    addQuestionButtonClicked() {
        this.selectedNewQuestions.forEach(question => this.editingQuestions.push(question));
        this.selectedNewQuestions = [];
        this.canSelectQuestions = [];
        this.distinctQuestion();
        this.hideModal(this.questionSelectModal);
    }

    cancelAddQuestionButtonClicked() {
        this.selectedNewQuestions = [];
        this.hideModal(this.questionSelectModal);
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

    compareQuestions(arr1: Question[], arr2: Question[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }
        return arr1.every(question1 => {
            return arr2.some(question2 => question1.id === question2.id);
        });
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
}
