import { ProximateUpdatePage } from './app.po';

describe('proximate-update App', function() {
  let page: ProximateUpdatePage;

  beforeEach(() => {
    page = new ProximateUpdatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
