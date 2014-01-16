# next-update v0.2.15

> Tests if module's dependencies can be updated to latest version

[![NPM][next-update-icon] ][next-update-url]

[![Build status][next-update-ci-image] ][next-update-ci-url]
[![dependencies][next-update-dependencies-image] ][next-update-dependencies-url]
[![devdependencies][next-update-devdependencies-image] ][next-update-devdependencies-url]

[next-update-icon]: https://nodei.co/npm/next-update.png?downloads=true
[next-update-url]: https://npmjs.org/package/next-update
[next-update-ci-image]: https://travis-ci.org/bahmutov/next-update.png?branch=master
[next-update-ci-url]: https://travis-ci.org/bahmutov/next-update
[next-update-dependencies-image]: https://david-dm.org/bahmutov/next-update.png
[next-update-dependencies-url]: https://david-dm.org/bahmutov/next-update
[next-update-devdependencies-image]: https://david-dm.org/bahmutov/next-update/dev-status.png
[next-update-devdependencies-url]: https://david-dm.org/bahmutov/next-update#info=devDependencies



Tests if module's dependencies can be updated to newer / latest versions
without breaking the tests.

    next-update --available
    // shows new versions available without installing anything
    next-update --latest
    // checks if latest versions of 3rd party break any unit tests

### Example

Imagine your nodejs module *foo* has the following dependencies listed in *package.json*

    "dependencies": {
        "lodash": "~1.2.0",
        "async": "~0.2.5"
    }

You would like to update lodash and async to latest versions, to not sure if
this would break anything. With *next-update* it is easy: run command `next-update`
in the folder with module *foo*. Here is the example output:

    next updates:
    lodash
        1.2.1 PASS
    async
        0.2.6 PASS
        0.2.7 PASS
        0.2.8 PASS


Both *package.json* file and *node_modules* folder are left unchanged,
and now you know that you can safely upgrade both libraries to later versions.

#### It even tells you the install command ;)

    Use the following command to install working versions
    npm install --save lodash@2.1.0

This might not appear like a big deal for a single module that is using
popular 3rd party libraries with stable apis only. *next-update* is most useful
in the larger development context, where multiple modules are being developed
side by side, often by different teams. In such situations, checking if an upgrade
is possible could be part of the continuous build pipeline.

You can see if your dependencies are out of date by using
[david](https://david-dm.org),
it even has badges you can add to your README files.

*next-update* reports the probability of success for a given dependency update using
anonymous global statistics from [next-update](http://next-update.herokuapp.com/) server

```
available updates:
package               available  from version  average success %  successful updates  failed updates
--------------------  ---------  ------------  -----------------  ------------------  --------------
grunt-contrib-jshint  0.8.0      0.7.2         100%               34                  0
grunt-bump            0.0.13     0.0.12        100%               4                   0
```

### Install

    npm install -g next-update  // installs module globally
    next-update --help          // shows command line options

### Anonymous usage collection

After testing each module A upgrade from version X to Y, *next-update* sends
anonymous result to [http://next-update.herokuapp.com/](http://next-update.herokuapp.com/).
The only information transmitted is:

```json
{
    "name": "lodash",
    "from": "1.0.0",
    "to": "2.0.0",
    "success": true
}
```

This information is used to answer the following questions later:
what is the probability module A can be upgraded from X to Y?
Thus even if you do not have tests covering this particular module,
you can judge how compatible version X and Y really are over the entire
internet.

You can inspect data send in
[stats.js](https://github.com/bahmutov/next-update/blob/master/src/stats.js).

If the dependency module has been upgraded by anyone else, its statistics
will be displayed with each test.

```sh
stats: deps-ok 0.0.7 -> 0.0.8 success probability 44.44% 8 success(es) 10 failure(s)
```

A lot of NPM modules [do not have tests](http://npmt.abru.pt/), but
at least you can judge if someone else has success going from verion X to version Y
of a dependency.

### Use

Make sure the target module has unit / integration tests,
and the tests can be run using `npm test` command.

Run `next-update` from the command line in the same folder as
the target module. In general this tool does the following:

1. Reads the module's dependencies (including dev) and their versions
2. Queries npm registry to see if there are newer versions
3. For each dependency that has newer versions available:
    1. Installs each version
    2. Runs command `npm test` to determine if the new version breaks the tests
    3. Installs back the current version.
4. Reports results

#### Misc

* To see what has changed in the latest version of any module,
use my companion tool [changed](https://npmjs.org/package/changed)
like this `changed foo` (*foo* is package name)
* When comparing versions, keywords *latest* and *** are both assumed to equal to "0.0.0".
* A good workflow using *next-update*
    * see available new versions `next-update --available`
    * check latest version of each module using `next-update --latest`
    * install new versions of the desired modules using standard `npm i dependency@version --save`
* You can use custom test command, for example `next-update -t "grunt test"`
    * `npm test` is used by default.



## Development

Edit source, run unit tests, run end to end tests and release
new version commands:

```sh
npm test
npm run e2e
grunt release
npm publish
```


### 3<sup>rd</sup> party libraries

* [lo-dash](https://github.com/bestiejs/lodash) is used throught the code to deal with collections.
* [check-types](https://github.com/philbooth/check-types.js) is used to verify arguments through out the code.
* [optimist](https://github.com/substack/node-optimist) is used to process command line arguments.
* [request](https://npmjs.org/package/request) is used to fetch NPM registry information.
* [semver](https://npmjs.org/package/semver) is used to compare module version numbers.
* [q](https://npmjs.org/package/q) library is used to handle promises. While developing this tool,
I quickly ran into problems managing the asynchronous nature of fetching information, installing multiple modules,
testing, etc. At first I used [async](https://npmjs.org/package/async), but it was still too complex.
Using promises allowed to cut the program's code and the complexity to very manageable level.
* [cli-color](https://npmjs.org/package/cli-color) prints colored text to the terminal.


### Small print

Author: Gleb Bahmutov &copy; 2014

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://bahmutov.calepin.co/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet / open issue on Github



## MIT License

Copyright (c) 2014 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.


