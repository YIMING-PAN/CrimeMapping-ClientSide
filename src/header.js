import React from "react";
import { Icon, Input, Button, Row, Col } from "antd";
import { register, login } from "./api";
import {
  openErrorNotification,
  openSuccessNotification,
  openWarningNotification
} from "./utils";

class UserInfoHeader extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    console.log(this.props.form.getFieldValue("username"));
    console.log(e);
  };

  state = {
    logged_user: null,
    email: null,
    password: null,
    login_loading: false,
    register_loading: false
  };

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value
    });
  };

  handleLoginClick = async e => {
    if (!this.state.email || !this.state.password) {
      openWarningNotification(
        "Login",
        "You should provide email and password!"
      );
      return;
    }

    this.setState({
      login_loading: true
    });

    const email = this.state.email;
    const password = this.state.password;
    try {
      const token = await login(email, password);
      console.log("[INFO] Login token", token);
      openSuccessNotification(
        "Login Succeeded",
        `You are logged in as ${email}!`
      );
      this.props.onTokenChange(token);
      this.setState({
        logged_user: email,
        login_loading: false
      });
    } catch (error) {
      openErrorNotification("Login Failed", error.message);
      this.setState({
        login_loading: false
      });
    }
  };

  handleRegisterClick = async e => {
    if (!this.state.email || !this.state.password) {
      openWarningNotification(
        "Register",
        "You should provide email and password!"
      );
      return;
    }

    this.setState({
      register_loading: true
    });

    const email = this.state.email;
    const password = this.state.password;
    try {
      const message = await register(email, password);
      openSuccessNotification("Register Succeeded", message);
    } catch (error) {
      openErrorNotification("Register Failed", error.message);
    }

    this.setState({
      register_loading: false
    });
  };

  render() {
    return (
      <div style={{ background: "#fff", padding: 0 }}>
        <Row style={{ margin: "8px 16px" }}>
          <Col span={6}>
            <span style={{ whiteSpace: "nowrap" }}>
              {this.state.logged_user
                ? `Logged in as: ${this.state.logged_user}`
                : "Not logged in."}
            </span>
          </Col>
          <Col span={18} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              style={{ width: "150px" }}
            />
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              style={{ marginLeft: 8, width: "150px" }}
            />
            <Button
              type="primary"
              onClick={this.handleLoginClick}
              style={{ marginLeft: 8 }}
              loading={this.state.login_loading}
            >
              Log in
            </Button>
            <Button
              type="primary"
              onClick={this.handleRegisterClick}
              style={{ marginLeft: 8 }}
              loading={this.state.register_loading}
            >
              Register
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserInfoHeader;
