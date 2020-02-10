import React from "react";
import { Button } from "antd";
import { openErrorNotification } from "../utils";
import CustomTable from "./table";
import {getAges, getGenders, getAreas, getOffences, getYears} from '../api';

class HelperTable extends React.Component {
  state = {
    dataSource: null,
    loading: true
  };

  fetchData = async () => {
    this.setState({
      loading: true
    });

    try {
      const data = await this.props.fetchData();
      const dataSource = data.map((value, index) => ({
        index: index,
        [this.props.name]: value,
        key: index
      }));
      this.setState({
        dataSource: dataSource,
        loading: false
      });
    } catch (error) {
      openErrorNotification("Fetch", error.message);
      this.setState({
        loading: false
      });
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      sorter: (a, b) => a.index - b.index
    },
    {
      title: this.props.name[0].toUpperCase() + this.props.name.slice(1),
      dataIndex: this.props.name,
      key: this.props.name,
      sorter: (a, b) => (a[this.props.name] < b[this.props.name] ? -1 : 1)
    }
  ];

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "16px 0"
          }}
        >
          <Button
            type="primary"
            loading={this.state.loading}
            onClick={this.fetchData}
          >
            Fetch
          </Button>
        </div>
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

export function AgesTable(props) {
  return <HelperTable fetchData={getAges} name="age" />;
}

export function AreasTable(props) {
  return <HelperTable fetchData={getAreas} name="area" />;
}

export function GendersTable(props) {
  return <HelperTable fetchData={getGenders} name="gender" />;
}

export function OffencesTable(props) {
  return <HelperTable fetchData={getOffences} name="offence" />;
}

export function YearsTable(props) {
  return <HelperTable fetchData={getYears} name="year" />;
}
