@echo off

REM Windows script for running e2e tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Protractor (npm install protractor)

set BASE_DIR=%~dp0
node_modules\.bin\protractor "%BASE_DIR%\..\config\protracror-e2e.conf.js" %*
