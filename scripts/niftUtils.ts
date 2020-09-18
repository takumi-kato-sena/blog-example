import util from 'util'
import childProcess from 'child_process'
const exec = util.promisify(childProcess.exec)

/** ファイルを新規作成して、更新対象に追加する */
export const niftTrackFile = async (
  fileName: string,
  title: string,
  template = 'template/page.template'
) => {
  return exec(`nift track \"${fileName}\" \"${title}\" \"${template}\"`)
}

/** 更新対象から除外後、ファイルを削除する */
export const niftRemoveFile = async (fileName: string) => {
  return exec(`nift rmv \"${fileName}\"`)
}
