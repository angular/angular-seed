import angular from 'angular';

import { View1Component } from './view1.component';

const css = require('./view1.scss');

export const View1Module = angular.module('view1Module', [])
  .component('view1', View1Component) 
  .name;