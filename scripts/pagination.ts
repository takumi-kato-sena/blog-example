import dedent from 'dedent'

/** ページネーションの追加 */
export const pagination = (itemsPerPage: number) => {
  return dedent(`
    @paginate
    @paginate.no_items_per_page(${itemsPerPage})
    @paginate.separator("<hr>")
    @paginate.template
    {
      <div id="blog">
        $[paginate.page]
      </div>
      <div>
        @if{!s}($[paginate.page_no] > 1)
          <a href="@pathtopageno(@\`$[paginate.page_no]-1\`)">前へ</a>
        @if{!s}($[paginate.page_no] < $[paginate.no_pages])
          <a href="@pathtopageno(@\`$[paginate.page_no]+1\`)">次へ</a>
      </div>
    }
  `)
}
