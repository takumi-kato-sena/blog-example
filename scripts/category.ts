import path from 'path'
import fs from 'fs/promises'
import { niftTrackFile, niftRemoveFile } from './niftUtils'
import { fsExists } from './fileUtils'
import { generateCategoryPost } from './blog'
import { pagination } from './pagination'
import { Post, PostsByCategory } from './interfaces/post'
import dedent from 'dedent'

const BASE_DIR = process.cwd()
const CATEGORY_DIR = path.join(BASE_DIR, './content/category')
const FALLBACK_CATEGORY = '未設定'

/** 記事リストをカテゴリ別にまとめる */
const filterByCategory = (posts: Post[]) => {
  const postsByCategory: PostsByCategory = {}
  posts.forEach(post => {
    // カテゴリが設定されていない場合は「未設定」をセット
    const category = post.attributes.category || FALLBACK_CATEGORY
    // 追加済みのカテゴリリスト
    const categories = Object.keys(postsByCategory)
    // 既にカテゴリが追加済みの場合はtrue
    const categoryExists = categories.includes(category)

    if (categoryExists) {
      // 既に存在している場合は配列の末尾に挿入
      postsByCategory[category].push(post)
    } else {
      // 存在していない場合は配列として追加
      postsByCategory[category] = [post]
    }
  })
  return postsByCategory
}

/** content/category内のファイルを削除する */
const removeCategories = async () => {
  // ディレクトリが存在しない場合は処理しない
  const dirExists = await fsExists(CATEGORY_DIR)
  if (!dirExists) return

  const files = await fs.readdir(CATEGORY_DIR, {
    encoding: 'utf-8'
  })
  const result = files.map(async fileName => {
    const title = fileName.replace('.content', '')
    return niftRemoveFile(`category/${title}`)
  })

  return Promise.all(result)
}

/** カテゴリ別記事リストを生成 */
export const savePostsByCategory = async (posts: Post[]) => {
  await removeCategories()
  const postsByCategory = filterByCategory(posts)

  // 出力先ディレクトリがない場合は作成
  const htmlDirPath = path.join(BASE_DIR, '/category')
  const htmlDirExists = await fsExists(htmlDirPath)
  if (!htmlDirExists) {
    await fs.mkdir(htmlDirPath)
  }

  const result = Object.entries(postsByCategory).map(async ([category, _posts]) => {
    // カテゴリ別記事リストのHTMLを生成
    const html = _posts.map(post => generateCategoryPost(post)).join('\n')
    await fs.writeFile(`${htmlDirPath}/${category}.html`, html, {
      encoding: 'utf-8'
    })

    // カテゴリ別記事リストのコンテンツを生成
    await niftTrackFile(`category/${category}`, category)
    const content = `@input("category/${category}.html")`
    return fs.writeFile(`${CATEGORY_DIR}/${category}.content`, content, {
      encoding: 'utf-8'
    })
  })

  return Promise.all(result)
}

/** カテゴリ一覧を生成 */
export const saveCategories = async (posts: Post[]) => {
  const items = new Set<string>()

  posts.forEach(post => {
    const category = post.attributes.category || FALLBACK_CATEGORY
    const html = dedent(`
      <a href="@pathto(category/${category})">
        <p>${category}</p>
      </a>
    `)
    items.add(html)
  })

  const html = [...items.values()].join('\n')
  return fs.writeFile(`${BASE_DIR}/category.html`, html, {
    encoding: 'utf-8'
  })
}
