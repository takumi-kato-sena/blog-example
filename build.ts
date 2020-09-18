#!/usr/bin/env -S npx ts-node
import { getPosts } from './scripts/post'
import { savePosts } from './scripts/blog'
import { savePostsByCategory, saveCategories } from './scripts/category'

(async () => {
  const posts = await getPosts()
  await savePosts(posts)
  await savePostsByCategory(posts)
  await saveCategories(posts)
})()
