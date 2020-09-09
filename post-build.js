#!/usr/bin/env node
const path = require('path')
const fs = require('fs/promises')

const BASE_DIR = path.resolve(__dirname)

/**
 * ファイルを削除
 * @param {string} fileName - ファイル名
*/
const deleteFile = async (fileName) => {
  const filePath = path.join(BASE_DIR, fileName)
  return fs.unlink(filePath)
}

deleteFile('posts.html')
