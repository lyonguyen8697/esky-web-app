import { Component, OnInit } from '@angular/core';


import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';

@Component({
    templateUrl: 'library-page.component.html',
    styleUrls: ['library-page.component.css']
})

export class LibraryPageComponent implements OnInit {

    questions: Question[];

    filter: string;

    constructor(private questionService: QuestionService) { }

    ngOnInit() {
        this.questionService.getAll()
            .subscribe(questions => this.questions = questions);
    }
}
