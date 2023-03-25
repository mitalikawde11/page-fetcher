// Implementing a node app
// It should download the resource at the URL to the local path on your machine.

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// fetcher function takes two command line arguments:
// 1. a URL     2. a local file path 
const fetcher = function(reqUrl, wFileLocalPath) {
  request(reqUrl, (error, response, body) => {
    if(error) {
      return console.log(error);
    }

    // check if the file is exists or not
    fs.stat(wFileLocalPath, (error, stats) => {
      if(error === null) {
        rl.question('the file path already exists, Do you want to overwrite the file?(Y/N): ', (answer) => {
          if(answer === 'Y') {
            writeFileFun(wFileLocalPath, body);
            rl.close();
          } else {
            rl.close();
            return false;
          }
        });
      } else {
        writeFileFun(wFileLocalPath, body);
        rl.close();
      }
          
    });

  });
};

const writeFileFun = function(wFileLocalPath, body) {
  // writing the resource at the URL into the local file 
  // "wFileLocalPath" is the local file path to write
  // "body" is the content of the requested URL (URL response)
  fs.writeFile(wFileLocalPath, body, error => {
    if(error) {
      return console.log(error);
    }
    // get file size using stat() method
    fs.stat(wFileLocalPath, (error, stats) => {
      return console.log(`Downloaded and saved ${stats.size} bytes to ${wFileLocalPath}`);
    });
  });
}

const cmdLineUrl = process.argv[2];
const cmdLineLocalFP = process.argv[3];

fetcher(cmdLineUrl, cmdLineLocalFP);
