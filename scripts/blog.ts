import path from 'path'
import fs from 'fs/promises'
import dedent from 'dedent'
import { Post } from './interfaces/post'

const BASE_DIR = process.cwd()

/** 記事リストアイテムのHTMLを生成 */
export const generatePost = (post: Post) => {
  const { fileName, attributes } = post
  const postName = fileName.replace('.content', '')

  return dedent(`
    @item
    {
      <a href="@pathto(post/${postName})">
        <h2 class="border-b-0">${attributes.title}</h2>
        <p>${attributes.description}</p>
      </a>
    }
  `)
}

/** 記事リストアイテムのHTMLを生成 */
export const generateCategoryPost = (post: Post) => {
  const { fileName, attributes } = post
  const postName = fileName.replace('.content', '')

  return dedent(`
    <a href="@pathto(post/${postName})">
      <h2 class="border-b-0">${attributes.title}</h2>
      <p>${attributes.description}</p>
    </a>
  `)
}

/** 記事リストを生成して保存 */
export const savePosts = async (posts: Post[]) => {
  const items = posts.map(post => generatePost(post))
  const html = items.join('\n')
  const filePath = path.join(BASE_DIR, 'posts.html')
  return fs.writeFile(filePath, html, {
    encoding: 'utf-8'
  })
}
