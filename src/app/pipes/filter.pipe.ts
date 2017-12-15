import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any, filter: any): any {
        if (!filter || !Array.isArray(items)) {
            return items;
        }
        if (this.isPrimitive(filter)) {
            return items.filter(item => {
                if (this.isPrimitive(item)) {
                    return this.isMatch(item, filter);
                } else {
                    return Object.keys(item)
                        .some(key => this.isMatch(item[key], filter));
                }
            });
        } else {
            return items.filter(item => Object.keys(filter)
                .every(key => this.isMatch(item[key], filter[key])
                )
            );
        }
    }

    isPrimitive(object: any): boolean {
        return object !== Object(object);
    }

    isMatch(item: any, filter: any): boolean {
        if (typeof item === 'string' && typeof filter === 'string') {
            return item.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
        } else {
            return item === filter;
        }
    }
}
