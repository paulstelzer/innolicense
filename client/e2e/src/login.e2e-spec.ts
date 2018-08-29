import { DashboardPage } from './dashboard.po';
import { LoginPage } from './login.po';
import { browser } from 'protractor';

describe('Login', () => {
  let page: LoginPage;
  let dashboard: DashboardPage;
  let userData = {
    email: 'test@test.com',
    password: 'test1234'
  }

  beforeEach(() => {
    page = new LoginPage();
    dashboard = new DashboardPage();
    page.navigateTo();
  });

  it('should display login message', () => {
    expect(page.getLoginText()).toContain('Bitte logge dich ein!');
  });

  it('should login with user credentials', async () => {
    await page.fillLoginForm(userData);
    await browser.sleep(3000);
    expect(dashboard.getToolbarText()).toContain('Dashboard');
  });

  afterAll(() => {
    browser.sleep(10000);
  })

});
