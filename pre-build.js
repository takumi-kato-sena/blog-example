#!/usr/bin/env node
const path = require('path')
const fs = require('fs/promises')
const fm = require('front-matter')

const BASE_DIR = path.resolve(__dirname)
const POST_DIR = path.join(BASE_DIR, './content/post')

/**
 * 記事のファイルリストを取得
 * @returns {string[]} 記事データリスト
*/
const getPostFileList = async () => {
  return fs.readdir(POST_DIR, {
    encoding: 'utf-8'
  })
}

/**
 * 記事のデータを取得
 * @param {string} fileName - ファイル名
 * @returns {string} 記事データ
*/
const getPostData = async (fileName) => {
  const filePath = path.join(POST_DIR, fileName)
  return fs.readFile(filePath, {
    encoding: 'utf-8'
  })
}

/**
 * Markdownドキュメントをパース
 * @param {string} text - 文字列
 * @returns {{ attributes: string[], body: string }} 処理結果
*/
const parseMarkdown = (text) => {
  return fm(text)
}

/**
 * ファイル拡張子を追加
 * @param {string} fileName - ファイル名
 * @param {string} ext - 拡張子(ドットなし)
 * @returns {string} ファイル名
*/
const appendFileExtension = (fileName, ext) => {
  const hasExtension = fileName.includes(ext)
  if (!hasExtension) {
    return fileName + '.' + ext
  } else {
    return fileName
  }
}

/**
 * データをJSON形式で保存
 * @param {string} fileName - ファイル名
 * @param {object} data - データ
*/
const saveJson = async (fileName, data) => {
  const jsonData = JSON.stringify(data)
  const fileNameWithExt = appendFileExtension(fileName, 'json')
  const savePath = path.join(BASE_DIR, fileNameWithExt)
  return fs.writeFile(savePath, jsonData, {
    encoding: 'utf-8'
  })
}

/**
 * ファイルを削除
 * @param {string} fileName - ファイル名
*/
const deleteFile = async (fileName) => {
  const filePath = path.join(BASE_DIR, fileName)
  return fs.unlink(filePath)
}

/**
 * 記事のメタデータリストを取得
 * @returns {Promise<{ fileName: string, attributes: string[] }[]>} メタデータリスト
*/
const getMetaDataList = async () => {
  const files = await getPostFileList()
  const metaDataList = files.map(async fileName => {
    const postData = await getPostData(fileName)
    const { attributes } = parseMarkdown(postData)
    return { fileName, attributes }
  })
  return Promise.all(metaDataList)
}

/** 記事のメタデータリストを保存 */
const saveMetaDataList = async () => {
  const metaDataList = await getMetaDataList()
  saveJson('post', metaDataList)
}

saveMetaDataList()
