const { exec } = require("child_process")

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message)
      } else {
        resolve(stdout)
      }
    })
  })
}

module.exports = execCommand
