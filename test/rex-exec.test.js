/*###############################################################################
#           
#             _ __ _____  __   Welcome to the      _             
#            | '__/ _ \ \/ / ___ __ ___ ____  _ __| |_ ___ _ __  
#            | | |  __/>  < / -_) _/ _ (_-< || (_-<  _/ -_) '  \ 
#            |_|  \___/_/\_\\___\__\___/__/\_, /__/\__\___|_|_|_|
#                                          |__/                  
#
# The rex-* ecosystem is a collection of like-minded modules for Node.js/NPM
#   that allow developers to reduce their time spent developing by a wide margin. 
#   
#   Header File Version: 0.0.1, 06/08/2013
# 
# The MIT License (MIT)
# 
# Copyright (c) 2013 Pierce Moore <me@prex.io>
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
# 
#######*/ 
var exec = require('../lib/rex-exec.js')
  , cli = require('rex-shell')
  , async = require('async')
  
cli.config.messages.error = "FAILED"
cli.config.messages.success = "PASSED"
cli.config.appName("rex-exec tests")

async.series([
  function(next) {
    cli( cli.$$.m("TEST:") +" Single exec(), complex Git operation")
    exec("~/Toolbox","git clone https://github.com/rex/rex-ecosystem.git && cd rex-ecosystem && git submodule init && git submodule update && cd .. && rm -rf rex-ecosystem", function(stderr, stdout) {
      cli("#1 stdout: " + stdout )
      cli("#1 stderr: " + stderr )
      next(null, "Single exec(), complex Git operation")
    })
  },
  function(next) {
    cli( cli.$$.m("TEST:") +" Single exec(), changing directory")
    exec("~/GitHub/rex/rex-template","pwd", function(stderr, stdout) {
      cli("#2 stdout: " + stdout )
      cli("#2 stderr: " + stderr )
      next(null, "Single exec(), change directory")
    })
  },
  function(next) {
    cli( cli.$$.m("TEST:") +" Single exec(), same directory")
    exec("pwd", function(stderr, stdout) {
      cli("#3 stdout: " + stdout )
      cli("#3 stderr: " + stderr )
      next(null, "Single exec(), same directory")
    })
  },
  function(next) {
    cli( cli.$$.m("TEST:") +" Batch exec(), changing directory")
    exec.batch("~/GitHub/rex/rex-foreman", [
      "echo Batch 1, Command 1",
      "echo Batch 2, Command 2"
    ],
    function() { 
      next(null, "Batch exec(), change directory")
    },
    function(stderr, stdout) {
      if(stdout)
        cli("stdout received: " + stdout)
      else if(stderr)
        cli("stderr received: " + stderr)
    })
  },
  function(next) {
    cli( cli.$$.m("TEST:") +" Batch exec(), same directory")
    exec.batch([
      "echo Batch 2, Command 1",
      "echo Batch 2, Command 2"
    ],
    function() {
      next(null, "Batch exec(), same directory")
    },
    function(stderr, stdout) {
      if(stdout)
        cli("stdout received: " + stdout)
      else if(stderr)
        cli("stderr received: " + stderr)
    })
  }
], function(err, tests) {
  tests.forEach(function(test) {
    cli.config.appName(test)
    err ? cli.error(" ") : cli.success(" ")  
  })
})
