'use strict';
const yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
// var config = require('git-config').sync(process.cwd() + '/../.git/config');
var gitConfig = require('git-config');
// var gitConfigLocal = gitConfig.sync(__dirname + '/../../.git/config');

module.exports = yeoman.Base.extend({

  initializing : function () {
    // this.composeWith('npm-init', npmPackageJSON, {
    //   local: require.resolve('generator-npm-init/app')
    // });
  },

  prompting: function () {

    this.log(yosay(
      'Welcome to the grand ' + chalk.red('generator-aoki-hubot-script') + ' generator!'
    ));

    var gitConfigLocal = gitConfig.sync(this.destinationRoot() + '/.git/config');
    console.log(gitConfigLocal['remote "origin"']);
    var gitConfigGlobal = require('git-config').sync();

    var remote = (function() {
      if (typeof gitConfigLocal['remote "origin"'] === 'undefined') {
        return '';
      }
      return gitConfigLocal['remote "origin"'].url || '';
    }());

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'name:',
        default: path.basename(this.destinationRoot())
      }, {
        type: 'input',
        name: 'version',
        message: 'version:',
        default: '1.0.0'
      }, {
        type: 'input',
        name: 'description',
        message: 'description:',
        default: 'None'
      }, {
        type: 'input',
        name: 'repo',
        message: 'git repository:',
        default: remote
      }, {
        type: 'input',
        name: 'keywords',
        message: 'keywords (space-delimited):',
        default: 'hubot'
      }, {
        type: 'input',
        name: 'author',
        message: 'author:',
        default: gitConfigGlobal.user.name || ''
      }, {
        type: 'input',
        name: 'license',
        message: 'license:',
        default: 'MIT'
      }, {
        type: 'input',
        name: 'configurations',
        message: 'configuration',
        default: 'None'
      }, {
        type: 'input',
        name: 'commands',
        message: 'commands',
        default: 'None'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      this.name = props.name;
      this.version = props.version;
      this.description = props.description;
      this.keywords = JSON.stringify(props.keywords.split(' '));
      this.author = props.author;
      this.license = props.license;
      this.repo = props.repo;
      this.url = (function(){
        var match = props.repo.match(/^ssh:\/\/git@(.*?)\.git$/m);
        if (match === null) {
          return '';
        }
        return match[1];
      }());
      this.dependencies = 'Show package.json';
      this.configurations = props.configurations;
      this.commands = props.commands;
    }.bind(this));
  },

  writing: function () {
    this.directory('lib', 'lib');
    this.template('scripts/main-script.js', 'scripts/' + this.name + '.js');
    this.template('test/main-script.test.js', 'test/' + this.name + '.test.js');
    this.copy('.codeclimate.yml', '.codeclimate.yml');
    this.copy('.coveralls.yml', '.coveralls.yml');
    this.copy('.eslintignore', '.eslintignore');
    this.copy('.eslintrc', '.eslintrc');
    this.copy('.gitignore', '.gitignore');
    var codeClimate = {
      'codeClimateRepoToken':
      'Get token from https://codeclimate.com/repos/::YOUR_REPOSITORY::/coverage_setup and use travis command to encrypt your token with `travis encrypt <token> --add addons.code_climate.repo_token`'
    };
    this.template('.travis.yml', '.travis.yml', codeClimate);
    this.template('package.json.ejs', 'package.json', this);
  },

  install: function () {
    this.installDependencies();
  }
});
