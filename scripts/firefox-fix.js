// Firefox manifest background fix script
const path = require('path')
const fs = require('fs-extra')

const ffPath = path.join(__dirname, '../build/firefox')
const manifestPath = path.join(ffPath, 'manifest.json')
const backgroundFilePath = path.join(ffPath, 'background.js')

const manifest = require(manifestPath)

main()

async function main() {
  // Read the contents of the background.js file
  const backgroundFileContent = fs.readFileSync(backgroundFilePath, 'utf8')

  // Parse the contents to find all the JavaScript file paths
  const regex = /importScripts\('([^']+)'\)/g
  const matches = backgroundFileContent.match(regex)

  // Create an array to store the parsed JavaScript file paths
  const jsFilePaths = []

  // Iterate over the matches and extract the JavaScript file paths
  matches.forEach(match => {
    const filePath = match.split("'")[1]
    jsFilePaths.push(filePath)
  })

  // Log the parsed JavaScript file paths
  console.log(jsFilePaths)
  manifest.background = {
    scripts: jsFilePaths
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
}
