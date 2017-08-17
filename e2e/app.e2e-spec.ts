import { SarafanPage } from './app.po';

describe('sarafan App', () => {
  let page: SarafanPage;

  beforeEach(() => {
    page = new SarafanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
