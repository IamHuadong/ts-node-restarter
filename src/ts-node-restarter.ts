#!/usr/bin/env node
"use strict"

import fs from 'fs'
import path from 'path'

import childProcessModule from 'child_process'

type ParseTargetFile = () => string

const parsePath = (pathName: string) => {
  return path.resolve(__dirname, '..', pathName)
}

const parseTargetScriptPath: ParseTargetFile = () => {
  const args = process.argv
  if (args.length !== 3) {
    console.log('can\'t find target script!')
    process.exit(1)
  }
  const targetScriptName = args[2]
  const targetScriptPath = parsePath(targetScriptName)
  return targetScriptPath
}

const parseConfig = () => {
  const configFilePath = parsePath('restarter.json')
  const configString = fs.readFileSync(configFilePath, { encoding: 'utf8' })
  const configObj = JSON.parse(configString)
  return configObj
}

const main = () => {
  const targetScriptPath = parseTargetScriptPath()
  let targetProcess = childProcessModule.fork(targetScriptPath)
  console.log('Server started!')

  const config = parseConfig()
  const watchFiles = config?.watch || []

  const handleFileChange = (filename: string) => {
    targetProcess.kill()
    console.log(`${filename} changed!`)
    console.log('Server stopped!')
    targetProcess = childProcessModule.fork(targetScriptPath)
    console.log('Server restarted!')
  }

  const watchers: fs.FSWatcher[] = []

  watchFiles.array.forEach((path: string) => {
    const isFile = /\.(ts|js)$/.test(path)
    const absolutePath = parsePath(path)
    if (isFile) {
      fs.watchFile(absolutePath, () => {
        handleFileChange(absolutePath)
      })
    } else {
      const watcher = fs.watch(absolutePath, (event: fs.WatchEventType, filename: string) => {
        handleFileChange(filename)
      })
      watchers.push(watcher)
    }
  });

  process.on('SIGINT', () => {
    // exist target process
    targetProcess.kill()
    // unwatch files
    watchFiles.array.forEach((path: string) => {
      const isFile = /\.(ts|js)$/.test(path)
      const absolutePath = parsePath(path)
      if (isFile) {
        fs.unwatchFile(absolutePath)
      }
    });
    watchers.forEach(watcher => watcher.close())
    // exit current process
    process.exit()
  })
}

main()
