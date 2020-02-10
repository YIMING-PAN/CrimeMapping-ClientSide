import React from "react";
import { Layout, Menu, Icon } from "antd";
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export const MenuItemKey = {
  Search: "search",
  Offences: "offences",
  Areas: "areas",
  Ages: "ages",
  Genders: "genders",
  Years: "years",
  Graph: "graph",
  Map: "map"
};

export class SideBar extends React.Component {
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    this.props.onMenuSelect(key);
  };

  render() {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[MenuItemKey.Search]}
          defaultOpenKeys={["table"]}
          onSelect={this.handleMenuSelect}
        >
          <SubMenu
            key="table"
            title={
              <span>
                <Icon type="table" />
                <span>Table</span>
              </span>
            }
          >
            <Menu.Item key={MenuItemKey.Search}>Search</Menu.Item>
            <Menu.Item key={MenuItemKey.Offences}>Offences</Menu.Item>
            <Menu.Item key={MenuItemKey.Areas}>Areas</Menu.Item>
            <Menu.Item key={MenuItemKey.Ages}>Ages</Menu.Item>
            <Menu.Item key={MenuItemKey.Genders}>Genders</Menu.Item>
            <Menu.Item key={MenuItemKey.Years}>Years</Menu.Item>
          </SubMenu>
          <Menu.Item key={MenuItemKey.Graph}>
            <Icon type="area-chart" />
            <span className="nav-text">Graph</span>
          </Menu.Item>
          <Menu.Item key={MenuItemKey.Map}>
            <Icon type="pushpin" />
            <span className="nav-text">Map</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
