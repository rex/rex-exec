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
  , _ = require('underscore')._
  , cli = require('rex-shell')
  , package = require('../package.json')
  , config = require('../package.json').config

var osPath = function(pathString) {
  if (pathString.substr(0,1) === '~')
    pathString = process.env.HOME + pathString.substr(1)
  return path.resolve(pathString)
}

exports.do = function(dir, command, callback) {
  if(typeof command == 'function' && callback == null ) {
    callback = command
    command = dir
    dir = "./"
  }
  
  cli("Executing single command '"+ command +"' in directory: '"+ process.cwd() +"'")
  
  var worker = cp.exec(command, {
    cwd : osPath(dir)
  })

  worker.stdout.on('data', function(data) {
    cli("do() STDOUT", data)
    callback(null, data, null)
  })

  worker.stderr.on('data', function(err) {
    cli.error("do() STDERR", err)
    callback(null, null, err)
  })

  worker.on('close', function(code) {
    if(code !== 0)
      cli.error("Completed with code #"+code)
    else
      cli.success("Completed with code #"+code+" :)")
  })

  /*
  exec(command, { cwd : osPath(dir) }, function(err, stdout, stderr) {
    cli("["+process.cwd()+"] ("+cmd+")", err, stdout, stderr, "/output")
    if(err) throw err
    cli("STDOUT: ", stdout)
    cli("STDERR: ", stderr)

    //callback(err, stdout, stderr)
  })
  */
}

exports.batch = function(dir, commands, callback) {
  var exec = function(){}

  commands = commands || []
  if(typeof commands == 'function' && callback == null) {
    callback = commands
    commands = dir || []
    dir = "./"
  }

  if(Object.prototype.toString.call( commands ) != "[object Array]")
    commands = [commands]

  cli("Executing command batch in directory '"+ process.cwd() +"'", commands)
  
  count = commands.length
  done = 0

  commands.forEach(function(cmd) {
    cli("Executing command: '"+cmd+"' in '"+process.cwd()+"'")
    exec(cmd, { cwd : osPath(dir) }, function(err, stdout, stderr) {
      cli("["+process.cwd()+"] ("+cmd+")", err, stdout, stderr, "/batchoutput")
      if(err) throw err
      if(stdout)
        cli(stdout)
      if(stderr != "")
        cli.error(stderr); process.exit(1)

      if(done++ == count)
        cli.success("Batch completed!")

      //callback(err, stdout, stderr)
    })
  })
}
