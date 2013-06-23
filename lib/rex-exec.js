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
var fs = require('fs')
  , path = require('path')
  , os = require('os')
  , cp = require('child_process')
  , cli = require('rex-shell')
  , utils = require('rex-utils')
  , _ = require('rex-utils')._
  , package = require('../package')
  , config = require('../package').config

module.exports = function(dir, command, done) {
  if(_.isFunction(command) && done == null ) {
    done = command
    command = dir
    dir = "./"
  }

  var output = []
  
  var worker = cp.exec(command, {
    cwd : _.osPath(dir)
  })

  worker.stdout.on('data', function(data) {
    output.push(data)
  })

  worker.stderr.on('data', function(err) {
    if(_.isFunction(done))
      done(err, null)
  })

  worker.on('exit', function(code) {
    if(_.isFunction(done))
      done(null, output.join(""))
  })
}

module.exports.batch = function(dir, commands, done, each) {
  commands = commands || []
  if(_.isFunction(commands)) {
    each = done
    done = commands
    commands = dir || []
    dir = "./"
  }

  if(Object.prototype.toString.call( commands ) != "[object Array]")
    commands = [commands]

  var total = commands.length
    , completed = 0
    , output = ""
    , after = function(buffer) {
      completed++
      output += buffer
      if(completed == total && _.isFunction(done))
        done(null, output)
    }

  commands.forEach(function(cmd) {
    var buffer = ""
    var proc = cp.exec(cmd, {
      cwd : _.osPath(dir)
    })

    proc.stdout.on('data', function(data) {
      if(_.isFunction(each))
        each(null, data)
      buffer += data
    })

    proc.stderr.on('data', function(err) {
      if(_.isFunction(each))
        each(err, null)
      buffer += err
    })

    proc.on('exit', function(code) {
      after(buffer)  
    })
  })
}

module.exports.version = package.version
module.exports.package = package
