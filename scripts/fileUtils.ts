import path from 'path'
import fs from 'fs/promises'

const BASE_DIR = process.cwd()

/** ファイル・フォルダが存在するかどうか */
export const fsExists = async (filePath: string) => {
  try {
    await fs.stat(filePath)
    return true
  } catch(e) {
    return false
  }
}

/** ファイルを削除 */
export const deleteFile = async (targetPath: string) => {
  const filePath = path.join(BASE_DIR, targetPath)
  if (!fsExists(filePath)) return
  return fs.unlink(filePath)
}

/** ディレクトリを削除 */
export const deleteDirectory = async (targetPath: string) => {
  const dirPath = path.join(BASE_DIR, targetPath)
  if (!fsExists(dirPath)) return
  return fs.rmdir(dirPath, { recursive: true })
}
