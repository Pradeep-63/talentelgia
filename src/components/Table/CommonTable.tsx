import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onPageChange: (selectedItem: { selected: number }) => void;
  totalPages: number;
  currentPage: number;
  renderActions?: (item: any) => React.ReactNode;
}

const CommonTable: React.FC<TableProps> = ({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onPageChange,
  totalPages,
  currentPage,
  renderActions,
}) => {
  return (
    <div className="table-responsive">
      <table className="table datanew">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={
                  column.sortable && sortColumn === column.key
                    ? sortDirection
                    : ""
                }
                onClick={() => column.sortable && onSort(column.key)}
              >
                <div className="d-flex gap-3">
                  {column.label}
                  {column.sortable && (
                    <span className="dt-column-order">
                      <FontAwesomeIcon icon={faChevronUp} />
                      <FontAwesomeIcon icon={faChevronDown} />
                    </span>
                  )}
                </div>
              </th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} title={item[column.key]}>
          
                   {column?.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {renderActions && <td>{renderActions(item)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center">
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {data.length > 0 && (
        <div className="pagination">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={onPageChange}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="<"
            forcePage={currentPage - 1}
          />
        </div>
      )}
    </div>
  );
};

export default CommonTable;
