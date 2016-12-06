basePath = '../../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/scenarios.js'
];

autoWatch = true;

proxies = {
  '/': 'http://localhost:8000/'
};

