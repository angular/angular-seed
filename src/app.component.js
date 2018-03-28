export const AppComponent = {
    template: `
        <ui-view></ui-view>
        `,
    controller: class AppComponent {
        $onInit(){
            this.test = 'test';
        }
    }  
};