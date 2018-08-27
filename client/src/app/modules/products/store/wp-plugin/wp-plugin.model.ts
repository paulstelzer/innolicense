export interface WpPluginStateModel {
    plugins: WpPluginModel[];
    envato: EnvatoItemModel[];
}

export interface WpPluginModel {
    name: string;
    slug: string;
    version: string;
    downloadUrl: string;
    description: string;
    changelog?: string;
    homepage?: string;
    requires?: string;
    tested?: string;
    author?: string;
    authorHomepage?: string;
}

export interface EnvatoItemModel {
    id: number;
    name: string;
    type: string;
    licenseId: number;
}