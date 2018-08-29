import { browser, by, element } from 'protractor';

export class DashboardPage {

    getToolbarText() {
        return element(by.deepCss('.toolbar-title')).getText();
    }
}
