import { Proximo2Page } from './app.po';

describe('proximo2 App', function() {
  let page: Proximo2Page;

  beforeEach(() => {
    page = new Proximo2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
