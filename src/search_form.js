import React from "react";
import { Form, Input, Row, Col, Button, Icon, Select } from "antd";
import { offences } from "./utils";

export default class SearchForm extends React.Component {
  state = {
    expand: false
  };

  handleSearchInputChange = (name, value) => {
    this.props.onSearchInputChange(name, value);
  };

  getAllFilterInputs = () => {
    const filters = ["area", "age", "gender", "year", "month"];
    let children = [];
    for (let filter_name of filters) {
      children.push(
        <Col
          span={8}
          key={filter_name}
          style={{ display: this.state.expand ? "block" : "none" }}
        >
          <Form.Item label={`${filter_name}`}>
            <Input
              value={this.props.search.filters[filter_name]}
              onChange={e =>
                this.handleSearchInputChange(filter_name, e.target.value)
              }
            />
          </Form.Item>
        </Col>
      );
    }
    return children;
  };

  toggleFilter = () => {
    this.setState({
      expand: !this.state.expand
    });
  };

  getOffencesOption = () => {
    let children = [];
    for (let offence of offences) {
      children.push(
        <Select.Option key={offence} value={offence}>
          {offence}
        </Select.Option>
      );
    }
    return children;
  };

  render() {
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 14
      }
    };

    return (
      <Form {...formItemLayout}>
        <Row>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  <span
                    style={{
                      marginRight: 4,
                      color: "#f5222d"
                    }}
                  >
                    *
                  </span>
                  Offence Type
                </span>
              }
            >
              <Select
                onChange={value =>
                  this.handleSearchInputChange("offence", value)
                }
                value={this.props.search.offence}
              >
                {this.getOffencesOption()}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={this.props.onSearch}
              loading={this.props.loading}
            >
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.props.onClear}>
              Clear
            </Button>
            <Button type="link" onClick={this.toggleFilter}>
              Filters <Icon type={this.state.expand ? "up" : "down"} />
            </Button>
          </Col>
        </Row>
        <Row gutter={24}>{this.getAllFilterInputs()}</Row>
      </Form>
    );
  }
}
