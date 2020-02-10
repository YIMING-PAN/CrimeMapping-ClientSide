import React from "react";
import { search } from "./api";
import { openErrorNotification, openWarningNotification } from "./utils";
import CustomTable from "./table/table";
import SearchForm from "./search_form";

export default class SearchPanel extends React.Component {
  state = {
    dataSource: null,
    loading: false,
    search: {
      offence: null,
      filters: {
        area: null,
        age: null,
        gender: null,
        year: null,
        month: null
      }
    }
  };

  handleSearchInputChange = (name, value) => {
    if (name === "offence") {
      this.setState({
        search: {
          ...this.state.search,
          offence: value
        }
      });
    } else {
      this.setState({
        search: {
          ...this.state.search,
          filters: {
            ...this.state.search.filters,
            [name]: value
          }
        }
      });
    }
  };

  handleClear = () => {
    this.setState({
      dataSource: null,
      search: {
        offence: null,
        filters: {
          area: null,
          age: null,
          gender: null,
          year: null,
          month: null
        }
      }
    });
  };

  handleSearch = async () => {
    if (!this.props.token) {
      openWarningNotification("Search", "You should log in first!");
      return;
    }

    if (!this.state.search.offence) {
      openWarningNotification(
        "Search",
        "You should provide the offence type to search!"
      );
      return;
    }

    this.setState({
      loading: true
    });

    try {
      const result = await search(
        this.props.token,
        this.state.search.offence,
        this.state.search.filters
      );
      console.log(result);
      const dataSource = result.map(value => ({
        ...value,
        key: value.LGA
      }));
      this.setState({
        dataSource: dataSource,
        loading: false
      });
    } catch (error) {
      openErrorNotification("Search", error.message);
      this.setState({
        loading: false
      });
    }
  };

  columns = [
    {
      title: "LGA",
      dataIndex: "LGA",
      key: "LGA",
      sorter: (a, b) => (a.LGA < b.LGA ? -1 : 1)
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total
    },
    {
      title: "Latitude",
      dataIndex: "lat",
      key: "lat",
      sorter: (a, b) => a.lat - b.lat
    },
    {
      title: "Longitude",
      dataIndex: "lng",
      key: "lng",
      sorter: (a, b) => a.lng - b.lng
    }
  ];

  render() {
    return (
      <div>
        <SearchForm
          search={this.state.search}
          onSearchInputChange={this.handleSearchInputChange}
          onSearch={this.handleSearch}
          onClear={this.handleClear}
          loading={this.state.loading}
        />
        <div style={{ background: "#fff" }}>
          <CustomTable
            dataSource={this.state.dataSource}
            columns={this.columns}
            loading={this.state.loading}
          />
        </div>
      </div>
    );
  }
}
