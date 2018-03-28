import template from './view1.html';

export const View1Component = {
    template,
    controller: class View1Component {
        constructor($state) {
            'ngInject';
            this.$state = $state;

            this.title = 'VIEW 1';
        }

        $onInit() {
            this.date = this.getFormattedDate();
        }

        getFormattedDate(){
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth()+1;
            let yyyy = today.getFullYear();

            if(dd<10){
                dd='0'+dd;
            }

            if(mm<10){
                mm='0'+mm;
            }

            return `${dd}/${mm}/${yyyy}`;
        }

        navigateToView2() {
            this.$state.go('view2');
        }
    }
};