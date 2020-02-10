import React from "react";
import { Empty, Form, Select, Row, Col, Button } from "antd";
import { Bar, Line } from "react-chartjs";
import { openWarningNotification, offences, years, areas } from "./utils";
import { search } from "./api";

// const data = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "My Second dataset",
//       fillColor: "rgba(151,187,205,0.5)",
//       strokeColor: "rgba(151,187,205,0.8)",
//       highlightFill: "rgba(151,187,205,0.75)",
//       highlightStroke: "rgba(151,187,205,1)",
//       data: [28, 48, 40, 19, 86, 27, 90]
//     }
//   ]
// };

export default class GraphPanel extends React.Component {
  state = {
    graphData: null,
    offence: "Arson",
    area: "Balonne Shire Council",
    loading: false,
    graph: "bar"
  };

  handleGraphTypeChange = graph => {
    this.setState({ graph });
  };

  handleDraw = async () => {
    if (!this.props.token) {
      openWarningNotification("Graph", "You should login first!");
      return;
    }

    if (!this.state.offence || !this.state.area) {
      openWarningNotification("Graph", "Offence/Area empty!");
      return;
    }

    this.setState({
      loading: true
    });

    const data = await Promise.all(
      years.map(year =>
        search(this.props.token, this.state.offence, {
          year: year,
          area: this.state.area
        })
          .then(result => {
            if (result.length !== 0) {
              return result[0].total;
            } else {
              return 0;
            }
          })
          .catch(e => {
            console.log("[Error]", e.message);
            return 0;
          })
      )
    );

    console.log(data);

    const graphData = {
      labels: years,
      datasets: [
        {
          label: "total",
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,0.8)",
          highlightFill: "rgba(151,187,205,0.75)",
          highlightStroke: "rgba(151,187,205,1)",
          data: data
        }
      ]
    };

    this.setState({
      graphData,
      loading: false
    });
  };

  handleOffenceChange = value => {
    this.setState({
      offence: value
    });
  };

  handleAreaChange = value => {
    this.setState({
      area: value
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

  getAreasOption = () => {
    let children = [];
    for (let area of areas) {
      children.push(
        <Select.Option key={area} value={area}>
          {area}
        </Select.Option>
      );
    }
    return children;
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 24 - 8 }
    };

    let graph_view;
    if (this.state.graphData) {
      if (this.state.graph === "bar") {
        graph_view = (
          <Bar data={this.state.graphData} width="600" height="300" />
        );
      } else if (this.state.graph === "line") {
        graph_view = (
          <Line data={this.state.graphData} width="600" height="300" />
        );
      }
    } else {
      graph_view = <Empty />;
    }

    return (
      <div>
        <Form {...formItemLayout}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Graph Type">
                <Select
                  onChange={this.handleGraphTypeChange}
                  value={this.state.graph}
                >
                  <Select.Option value="bar">Bar</Select.Option>
                  <Select.Option value="line">Line</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Area to Plot">
                <Select
                  onChange={this.handleAreaChange}
                  value={this.state.area}
                >
                  {this.getAreasOption()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Y-axis">
                <Select
                  onChange={this.handleOffenceChange}
                  value={this.state.offence}
                >
                  {this.getOffencesOption()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="X-axis">
                <Select defaultValue="year">
                  <Select.Option value="year">Year</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "right", marginBottom: 24 }}>
              <Button
                type="primary"
                onClick={this.handleDraw}
                loading={this.state.loading}
              >
                Plot
              </Button>
            </Col>
          </Row>
        </Form>
        <div style={{ background: "#fff", textAlign: "center" }}>
          {graph_view}
        </div>
      </div>
    );
  }
}
