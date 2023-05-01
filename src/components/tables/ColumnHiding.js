import React, { useMemo, useState } from 'react'
import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination } from 'react-table'
import MOCK_DATA from '../MOCK_DATA.json'
import { COLUMNS } from '../columns'
import '../table.css'
import { Checkbox } from '../Checkbox'
import Button from '@mui/material/Button';
import { GlobalFilter } from '../GlobalFilter'
import { ColumnFilter } from '../ColumnFilter'


const ColumnHiding = () => {
  const columns = useMemo(() => COLUMNS, [])
  const data = useMemo(() => MOCK_DATA, [])
  const [isVisible, setVisible] = useState(false)

  const defaultColumn = React.useMemo(
    () => ({
      Filter: ColumnFilter
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    allColumns,
    getToggleHideAllColumnsProps,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow
  } = useTable({
    columns,
    data,
    defaultColumn,
    initialState: { pageIndex: 0 }
  },
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination
  )

  const { globalFilter, pageIndex, pageSize } = state
  
  return (
    <>
    <Button variant="outlined"
      onClick={() => {
        console.log('clicked');
        setVisible(!isVisible)
      }}
    >
      Show Hide Columns
    </Button>
    {(isVisible) ? 
         <div className='second'>
         <div>
           <Checkbox {...getToggleHideAllColumnsProps()} /> Toggle All
         </div>
         {allColumns.map(column => (
           <div key={column.id}>
             <label>
               <input type='checkbox' {...column.getToggleHiddenProps()} />{' '}
               {column.Header}
             </label>
           </div>
         ))}
         <br />
       </div>
    : ""}

<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

<div className='first'>
    <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                 <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' ⬇'
                          : ' ⬆'
                        : ''}
                    </span>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
          </tbody>
        </table>
        <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={e => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(pageNumber)
            }}
            style={{ width: '50px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}>
          {[10, 25, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      </div>
    </>
  )
}


export default ColumnHiding