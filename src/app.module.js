import 'babel-polyfill';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngMaterial from 'angular-material';
import 'angular-animate';
import 'angular-aria';

import { AppComponent } from './app.component';
import { View1Module } from './view1/view1.modules';
import { View2Module } from './view2/view2.modules';

import 'bootstrap';
const css = require('./scss/styles.scss');

export const app = angular.module('app', [
    uiRouter,
    ngMaterial,
    View1Module,
    View2Module
  ])
  .component('app', AppComponent) 
  .config(($locationProvider, $urlMatcherFactoryProvider, $uiRouterProvider, $stateProvider, $urlRouterProvider) => {
    'ngInject';

    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('view1', {
        url: '/',
        component: 'view1'
      })
      .state('view2', {
        url: '/view2',
        component: 'view2'
      });
  
    $urlRouterProvider.otherwise('/');
  }
).name;