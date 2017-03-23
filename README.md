This project provides a web user interface for the ECNU postgraduate management system. It uses techniques such as HTML5, CSS, Bootstrap and AnguarJS.


# Howto

Clone this project and go through the following steps to finish installation, execute tests or serve the project locally.

1. install node.js
`npm` and `bower` are used to manage dependencies and some functionalities of project manager. `npm` is the package manager for Node.js. You still need to install npm by yourself whlie `bower` will be installed by `npm`. `npm` is accompanied with Node.js.

Visiting https://docs.npmjs.com/getting-started/installing-node to find the proper way to install Node.js. To install Node.js in mac osx, visit https://nodejs.org/en/ to download the latest version. To install from binaries for linux, visit https://github.com/nodesource/distributions.

1. install all required libraries that are required by NodeJs and frontend. 
Execute the following command to install required libraries. After NodeJs libraries are installed, it will also install frontend libraries using bower.

~~~
$ npm install
~~~

1. execute unit tests locally
Each time you want to merge your branch into the master, you should invoke the following command to **guarantee all your codes pass the tests**.
 
~~~
npm test
~~~
 
1. execute end-to-end test locally
Each time you want to merge your branch into the master, you should invoke the following command to **guarantee all your codes pass the end-to-end tests**.
 
~~~
npm run protractor
~~~

1. serve your web site locally  
if you want to run the web site locally, you can execute the following command in the  terminal:

~~~
npm start
~~~

In the file package.json you can find what actually happens when you execute this command. You can change the port and address http-server listens on. You can also change the location where files of your web site locate.

~~~
"start": "live-server --host localhost --port 8081 --no-browser --mount=/:./webui"
~~~

1. try it in your browser!

~~~
http://localhost:35337/webui/department/dp-home.html
~~~

## Manually install frontend dependency
After pulling remote repository or merging others' repository, building the code may fail as others have added new frontend dependency in the bower.json. In such case, you
need to invoke the following command to manually install those new libraries.
```
$ npm run-script bower-install
```

# Build codes
## Generate codes for Development 
Execute the follow command to generate codes for development environment. It will generate codes in a new directory called "build".
```
$ npm run-script dev
```

## Generate codes for Deployment
Execute the follow command to generate codes for deployment environment. It will generate codes in a new directory called "dist". Codes in dist can be copied to any web servers to serve customers. 
```
$ npm run-script deploy
```

# Test
## Unit test
We adopts the test settings of the angular-seed project. Jasmine is used as the unit test framework. Karma is choosed as the unit test runner.

To execute the unit test locally, you can execute the following commands in the terminal:

~~~
npm test
~~~

It will invoke "npm install" to install all required third-party libraries. Then it will start Karma to execute all unit tests.

