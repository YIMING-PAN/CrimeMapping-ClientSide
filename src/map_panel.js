import React from "react";
import { Form, Select, Row, Col, Button } from "antd";
import { openWarningNotification, openErrorNotification } from "./utils";
import { search } from "./api";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  Tooltip
} from "react-leaflet";
import "./index.css";
import { offences } from "./utils";

export default class MapPanel extends React.Component {
  state = {
    lat: -21.45654688461539,
    lng: 144.80614912820513,
    zoom: 4,
    offence: null,
    loading: false,
    markers: []
  };

  handleOffenceChange = value => {
    this.setState({
      offence: value
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

  handleShow = async () => {
    if (!this.props.token) {
      openWarningNotification("Map", "You should login first!");
      return;
    }

    if (!this.state.offence) {
      openWarningNotification("Map", "Offence Type is empty!");
      return;
    }

    this.setState({
      loading: true
    });

    let markers = [];
    let lats = [];
    let lngs = [];
    try {
      const result = await search(this.props.token, this.state.offence);
      console.log(result);
      for (let item of result) {
        if (!item.lat || !item.lng) {
          continue;
        }
        lats.push(item.lat);
        lngs.push(item.lng);
        markers.push(
          <Marker key={item.LGA} position={[item.lat, item.lng]}>
            <Tooltip>
              {item.LGA} <br /> {`Offence count: ${item.total}`}
            </Tooltip>
          </Marker>
        );
      }

      // console.log(lats.reduce((a, b) => a + b) / lats.length);
      // console.log(lngs.reduce((a, b) => a + b) / lngs.length);
      // console.log(markers);
      console.log("total markers", markers.length);
      // console.log(Math.min(lats), Math.max(lats));
      // console.log(Math.min(lngs), Math.max(lngs));

      this.setState({
        markers: markers,
        lat: lats.reduce((a, b) => a + b) / lats.length,
        lng: lngs.reduce((a, b) => a + b) / lngs.length,
        zoom: 5,
        loading: false
      });
    } catch (error) {
      openErrorNotification("Map", error.message);
      this.setState({
        loading: false
      });
    }
  };

  render() {
    const accessToken =
      "pk.eyJ1IjoieGVydWciLCJhIjoiY2p3MWQxMzFnMDV0bDN5bzhtN280dXlqdSJ9.-DnfhfjVmySOhEISHnn6qA";
    const id = "mapbox.streets";

    const position = [this.state.lat, this.state.lng];
    return (
      <div>
        <Form>
          <Row>
            <Col span={16}>
              <Form.Item
                label="Offence Type"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 - 11 }}
              >
                <Select
                  onChange={this.handleOffenceChange}
                  value={this.state.offence}
                >
                  {this.getOffencesOption()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={this.handleShow}
                  loading={this.state.loading}
                >
                  Show
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ background: "#fff" }}>
          <LeafletMap center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
              url={`https://api.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${accessToken}`}
            />
            {/* <Marker position={[-13.354875, 141.729058]}>
              <Popup>Aurukun Shire Council - 6</Popup>
            </Marker> */}
            {/* <Marker position={position}>
              <Popup>Center</Popup>
            </Marker> */}
            {this.state.markers}
          </LeafletMap>
        </div>
      </div>
    );

    // return <div id="mapid" />;
  }
}
