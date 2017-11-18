import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class ArrangementService {

    getFragments(containerSelector: string): string[] {
        const fragments = $(containerSelector + '>.fragment:not(.hide)');
        return fragments.map(e => fragments[e].innerText).toArray();
    }

    moveElementTo(
        srcElementSelector: string,
        srcContainerSelector: string,
        destContainerSelector: string,
        duration?: number,
        handler?: Function
    ) {
        const srcElement = $(srcElementSelector);
        if (srcElement.hasClass('animating')) {
            return;
        }
        const srcContainer = $(srcContainerSelector);
        const destElement = this.getDestinationElement(destContainerSelector);
        const destContainer = $(destContainerSelector);

        this.toggleAnimatingClass(srcElement);
        this.toggleAnimatingClass(destElement);

        this.swapHtml(srcElement, destElement);

        destElement.animate({
            width: 'show',
            paddingLeft: 'show',
            paddingRight: 'show',
            marginLeft: 'show',
            marginRight: 'show'
        }, duration / 2, () => {

            srcElement.css({
                position: 'absolute',
                top: srcElement.position().top,
                left: srcElement.position().left
            })
            .animate({
                position: 'absolute',
                top: destElement.position().top,
                left: destElement.position().left
            }, duration, () => {

                this.resetElement(srcElement);

                this.swapElement(srcElement, destElement);

                if (handler) {
                    handler();
                }

                this.toggleAnimatingClass(srcElement);
                this.toggleAnimatingClass(destElement);

            });

        });

    }

    getDestinationElement(destContainerSelector: string): any {
        return $(destContainerSelector + '>.hide:not(.animating)').first();
    }

    toggleAnimatingClass(element: any) {
        element.toggleClass('animating');
    }

    swapHtml(srcElement: any, destElement: any) {
        const html = srcElement.html();
        destElement.html(html);
    }

    swapElement(srcElement: any, destElement: any) {
        const id = srcElement.attr('id');
        srcElement.removeAttr('id');
        destElement.attr('id', id);

        srcElement.addClass('hide');
        destElement.removeClass('hide');
    }

    resetElement(element: any) {
        element.css({
            position: 'initial',
            display: 'none'
        });
    }
}
