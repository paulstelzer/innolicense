import { WpPluginModule } from './wp-plugin.module';

describe('WpPluginModule', () => {
  let wpPluginModule: WpPluginModule;

  beforeEach(() => {
    wpPluginModule = new WpPluginModule();
  });

  it('should create an instance', () => {
    expect(wpPluginModule).toBeTruthy();
  });
});
