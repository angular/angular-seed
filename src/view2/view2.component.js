import template from './view2.html';

export const View2Component = {
    template,
    controller: class View2Component {
        constructor() {
            'ngInject';
        }

        $onInit() {
            this.title = 'VIEW 2';
        }
    }
};