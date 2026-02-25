const BasePage = require('./BasePage');

class LoginPage extends BasePage {

  constructor(page) {
    super(page);
    this.username = '#username';
    this.password = '#password';
    this.loginBtn = '#submit';
  }

  async login(user, pass) {
    await this.type(this.username, user);
    await this.type(this.password, pass);
    await this.click(this.loginBtn);
  }
}

module.exports = LoginPage;