rex-exec
========

A small set of functions designed to provide a simple way to execute shell commands and process the output.

#### Assuming `var rexec = require('rex-exec')`

Execute a single command in a different directory
---

````
rexec(dir, command, done)
````
Accepts one callback
````
done(stderr, stdout)
````

Execute a single command
---

````
rexec(command, done)
````
Accepts one callback

````
done(stderr, stdout)
````

Execute an array of commands
---

````
rexec(commands, done, each)
````
Accepts two callbacks:

````
done(output)
````  
````
each(stderr, stdout)
````  

Execute multiple commands in a different directory:
---

````
rexec.batch(dir, commands, done, each)
````
Accepts two callbacks:

````
done(output)
````  
````
each(stderr, stdout)
````  

#### Run test suite with `npm test`

**MIT License**, *2013*

Pierce Moore
[rex](https://github.com/rex)
me@prex.io
