'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({

  promptUser: function() {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name ?'
    }];

    this.prompt(prompts, function (props) {

      this.appName = props.appName.replace(/([^a-z0-9]+)/gi, '-');

      done();
    }.bind(this));
  },

  createAppFolder: function() {
    var done = this.async();
    mkdirp(this.destinationPath(this.appName),function(err){
      if (err)
        console.error(err);
      else
        done();
    });
  },

  copyMainFiles: function(){

    this.fs.copy(this.templatePath('.templates/**/*'), this.destinationPath(this.appName + '/.templates'));

    this.fs.copy(this.templatePath('public/**/*'), this.destinationPath(this.appName + '/public'));

    this.fs.copy(this.templatePath('config/**/*'), this.destinationPath(this.appName));

  },

  addContext:function(){
    var context = {
      appName: this.appName
    };
    var script = '/public/scripts/1_app.main.js';
    var index = '/public/index.html';
    var pkg = '/config/package.json';
    var finalPkg = '/package.json';

    // Update Directive JS
    this.fs.copyTpl(this.templatePath(script),
      this.destinationPath(this.appName + script),
      context);

    // Update index html
    this.fs.copyTpl(this.templatePath(index),
      this.destinationPath(this.appName + index),context);

    // Update the package json
    this.fs.copyTpl(this.templatePath(pkg),
      this.destinationPath(this.appName + finalPkg),context);
  },

  scaffoldFolders: function(){
    var _this = this;
    mkdirp(_this.destinationPath(_this.appName+'/public/styles/scss/partials/'));
    mkdirp(_this.destinationPath(_this.appName+'/public/scripts/controllers/'), function(err){
      if(err){console.error(err)}
      else{
        mkdirp(_this.destinationPath(_this.appName+'/public/scripts/directives/'));
        mkdirp(_this.destinationPath(_this.appName+'/public/scripts/filters/'));
        mkdirp(_this.destinationPath(_this.appName+'/public/scripts/services/'));
        mkdirp(_this.destinationPath(_this.appName+'/public/scripts/vendors/'));
      }
    });
    mkdirp(_this.destinationPath(_this.appName+'/public/views/'));
    mkdirp(_this.destinationPath(_this.appName+'/public/assets/fonts/'),function(err){
      if(err){console.error(err)}
      else{
        mkdirp(_this.destinationPath(_this.appName+'/public/assets/images/'));
      }
    });
  }

//runNpm: function(){
//  var done = this.async();
//  this.npmInstall("", function(){
//    console.log("\nEverything Setup !!!\n");
//    done();
//  });
//}

});
