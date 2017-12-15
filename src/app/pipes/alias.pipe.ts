import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alias'
})
export class AliasPipe implements PipeTransform {

    transform(item: any): any {
        switch (item) {
            case 'ARRANGEMENT':
                return 'Sắp xếp';
            case 'MULTI_CHOICE':
                return 'Trắc nghiệm';
            case 'SPEECH':
                return 'Phát âm';
            case 'TYPING':
                return 'Đánh chữ';
            case 'BASIC':
                return 'Cơ bản';
            case 'MEDIUM':
                return 'Trung bình';
            case 'ADVANCED':
                return 'Nâng cao';
            default:
                return item;
        }
    }
}
