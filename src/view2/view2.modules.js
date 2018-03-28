import angular from 'angular';

import { View2Component } from './view2.component';

const css = require('./view2.scss');

export const View2Module = angular
    .module('view2Module', [])
    .component('view2', View2Component) 
    .name;