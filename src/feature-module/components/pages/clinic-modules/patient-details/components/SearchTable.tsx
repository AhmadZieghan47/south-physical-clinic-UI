import SearchInput from "@/core/common/dataTable/dataTableSearch";

export interface Props {
  searchText: string;
  handleSearch: any;
}

export default function SearchTable({ searchText, handleSearch }: Props) {
  return (
    <div className=" d-flex align-items-center justify-content-between flex-wrap">
      <div className="d-flex align-items-center gap-2">
        <div className="search-set mb-3">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div className="table-search d-flex align-items-center mb-0">
              <div className="search-input">
                <SearchInput value={searchText} onChange={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
