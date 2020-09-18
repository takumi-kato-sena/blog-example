#!/usr/bin/env -S npx ts-node
import { deleteFile, deleteDirectory } from './scripts/fileUtils'

deleteFile('posts.html')
deleteFile('category.html')
deleteDirectory('./category')
