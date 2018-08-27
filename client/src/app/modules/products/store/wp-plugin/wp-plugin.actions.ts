import { WpPluginModel } from "./wp-plugin.model";

export class ClearPlugins {
    static type = '[Plugin] Clear';
}

export class CheckPlugins {
    static type = '[Plugin] Check';
}

export class AddPlugin {
    static type = '[Plugin] Add new';
    constructor(public data: WpPluginModel) { }
}

export class UpdatePlugin {
    static type = '[Plugin] Update';
    constructor(public slug: string, public data: WpPluginModel, public notify: boolean) { }
}

export class DeletePlugin {
    static type = '[Plugin] Delete';
    constructor(public slug: string) { }
}

export class RefreshAllPlugins {
    static type = '[Plugin] Refresh all';
}

export class AddedPlugin {
    static type = '[Plugin] Added';
    constructor(public data: WpPluginModel) { }
}