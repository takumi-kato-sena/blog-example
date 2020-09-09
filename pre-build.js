#!/usr/bin/env node
const path = require('path')
const fs = require('fs/promises')
const fm = require('front-matter')
const { JSDOM } = require('jsdom')

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
 * @returns {{ attributes: {[key: string]: string}, body: string }} 処理結果
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
 * データをHTML形式で保存
 * @param {string} fileName - ファイル名
 * @param {string} text - 文字列
*/
const saveHTML = async (fileName, text) => {
  const fileNameWithExt = appendFileExtension(fileName, 'html')
  const savePath = path.join(BASE_DIR, fileNameWithExt)
  return fs.writeFile(savePath, text, {
    encoding: 'utf-8'
  })
}

/**
 * 記事のメタデータリストを取得
 * @returns {Promise<{ fileName: string, attributes: {[key: string]: string} }[]>} メタデータリスト
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

/**
 * 記事リストアイテムのHTML要素を生成
 * @param {{ fileName: string, attributes: {[key: string]: string} }} metaData - 記事メタデータ
 * @returns {HTMLAnchorElement} a要素
*/
const generatePostListItem = (metaData) => {
  const jsdom = new JSDOM()
  const document = jsdom.window.document

  const { fileName, attributes } = metaData

  // a要素の生成
  const aElement = document.createElement('a')
  const postName = fileName.replace('.content', '')
  aElement.href = `./post/${postName}.html`

  // h2要素の生成
  const headingElement = document.createElement('h2')
  headingElement.textContent = attributes.title
  aElement.appendChild(headingElement)

  // p要素の生成
  const pElement = document.createElement('p')
  pElement.textContent = attributes.description
  aElement.appendChild(pElement)

  return aElement
}

/**
 * 記事リストのHTMLを生成
*/
const savePostListHTML = async () => {
  const metaDataList = await getMetaDataList()

  const postItems = metaDataList.map(metaData => {
    const postListItem = generatePostListItem(metaData)
    return postListItem.outerHTML
  })

  const html = postItems.join('\n')
  saveHTML('posts', html)
}

savePostListHTML()
