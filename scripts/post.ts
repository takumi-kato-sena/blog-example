import path from 'path'
import fs from 'fs/promises'
import fm from 'front-matter'
import { Post, PostMetaData } from './interfaces/post'

const BASE_DIR = process.cwd()
const POST_DIR = path.join(BASE_DIR, './content/post')

/** 記事リストを取得 */
export const getPosts = async (): Promise<Post[]> => {
  // ディレクトリからファイル一覧を取得
  const files = await fs.readdir(POST_DIR, {
    encoding: 'utf-8'
  })
  const posts = files.map(async fileName => {
    const filePath = path.join(POST_DIR, fileName)
    // ファイル読み込み
    const content = await fs.readFile(filePath, {
      encoding: 'utf-8'
    })
    // Markdownをパース
    const { attributes } = fm<PostMetaData>(content)
    return {
      fileName,
      attributes
    }
  })
  return Promise.all(posts)
}
