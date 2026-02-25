class BasePage {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await this.page.locator(locator).click();
  }

  async type(locator, value) {
    await this.page.locator(locator).fill(value);
  }
}

module.exports = BasePage;