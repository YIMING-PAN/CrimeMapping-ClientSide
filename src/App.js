import React from "react";
import "antd/dist/antd.css";
import { Layout, Empty } from "antd";
import UserInfoHeader from "./header";
import { MenuItemKey, SideBar } from "./sider";
import SearchPanel from "./search_panel";
import GraphPanel from "./graph_panel";
import MapPanel from "./map_panel";

import {
  AreasTable,
  AgesTable,
  OffencesTable,
  YearsTable,
  GendersTable
} from "./table/helper_tables";

const { Content } = Layout;

class App extends React.Component {
  state = {
    currentPage: MenuItemKey.Search,
    token: null
  };

  handleMenuSelect = menu => {
    if (menu === this.state.currentPage) {
      return;
    }

    this.setState({
      currentPage: menu
    });
  };

  handleTokenChange = token => {
    this.setState({
      token
    });
  };

  render() {
    let page_content;
    switch (this.state.currentPage) {
      case MenuItemKey.Search:
        page_content = <SearchPanel token={this.state.token} />;
        break;
      case MenuItemKey.Areas:
        page_content = <AreasTable />;
        break;
      case MenuItemKey.Ages:
        page_content = <AgesTable />;
        break;
      case MenuItemKey.Genders:
        page_content = <GendersTable />;
        break;
      case MenuItemKey.Offences:
        page_content = <OffencesTable />;
        break;
      case MenuItemKey.Years:
        page_content = <YearsTable />;
        break;
      case MenuItemKey.Graph:
        page_content = <GraphPanel token={this.state.token} />;
        break;
      case MenuItemKey.Map:
        page_content = <MapPanel token={this.state.token} />;
        break;
      default:
        page_content = <Empty />;
        break;
    }

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar onMenuSelect={this.handleMenuSelect} />
        <Layout>
          <UserInfoHeader onTokenChange={this.handleTokenChange} />
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            {page_content}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
