#!/usr/bin/env node
"use strict"
const args = process.argv

type PrintArgs = () => void

const printArgs: PrintArgs = () => {
  console.log('args:', args)
}
printArgs()
