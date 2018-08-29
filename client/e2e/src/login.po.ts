import { browser, by, element } from 'protractor';

export class LoginPage {

  navigateTo() {
    return browser.get('/');
  }

  getLoginText() {
    return element(by.deepCss('app-login .header-text')).getText();
  }

  fillLoginForm(userData) {
    element(by.css('form [name="email"]')).sendKeys(userData.email);
    element(by.css('form [name="password"]')).sendKeys(userData.password);
    return element(by.deepCss('form')).submit();
  }
  
}
