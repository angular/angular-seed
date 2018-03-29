import template from './view2.html';

export const View2Component = {
    template,
    controller: class View2Component {
        constructor($state) {
            'ngInject';

            this.$state = $state;

            this.title = 'VIEW 2';
        }

        $onInit() {
            this.message = 'ALL YOUR BASE ARE BELONG TO US';
        }

        navigateToView1(){
            this.$state.go('view1');
        }
    }
};