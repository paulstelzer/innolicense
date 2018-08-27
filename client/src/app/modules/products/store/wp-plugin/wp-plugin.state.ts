import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, NgxsOnInit, createSelector, Actions, ofActionSuccessful } from '@ngxs/store';
import { ApiService } from '../../services/api.service';
import { WpPluginStateModel, WpPluginModel } from './wp-plugin.model';
import { CheckPlugins, AddPlugin, RefreshAllPlugins, AddedPlugin, DeletePlugin, UpdatePlugin, ClearPlugins } from './wp-plugin.actions';
import { UserNull } from '../../../user/store/user.actions';

@State<WpPluginStateModel>({
    name: 'plugins',
    defaults: {
        plugins: [],
        envato: []
    }
})
export class WpPluginState implements NgxsOnInit {
    /**
     * Selectors
     */
    @Selector()
    static getPlugins(state: WpPluginStateModel) {
        return state.plugins;
    }

    static getPlugin(slug: string) {
        return createSelector([WpPluginState], (state: WpPluginStateModel) => {
            const plugin: WpPluginModel[] = state.plugins.filter(plugin => plugin.slug === slug);
            if (plugin && plugin.length > 0) return plugin[0];
            return null;
        });
    }


    constructor(
        private router: Router,
        private api: ApiService,
        private actions: Actions,
    ) { }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<WpPluginStateModel>) {
        ctx.dispatch(new CheckPlugins());

        this.actions.pipe(ofActionSuccessful(UserNull)).subscribe((data) => {
            ctx.dispatch(new ClearPlugins());
        });
    }

    /**
     * Commands
     */
    @Action(CheckPlugins)
    checkPlugins(ctx: StateContext<WpPluginStateModel>) {
        const current = ctx.getState();
        if (!current) {
            ctx.dispatch(new RefreshAllPlugins());
            ctx.setState({
                plugins: [],
                envato: []
            })
        }
    }

    @Action(AddPlugin)
    async addPlugin(ctx: StateContext<WpPluginStateModel>, { data }: AddPlugin) {
        const plugin: any = await this.api.addPlugin(data);
        if (plugin && plugin.success) {
            console.log('Plugin data', plugin.data)
            ctx.dispatch(new AddedPlugin(plugin.data))
            ctx.dispatch(new RefreshAllPlugins());
        }
    }

    @Action(UpdatePlugin)
    async updatePlugin(ctx: StateContext<WpPluginStateModel>, { slug, data, notify }: UpdatePlugin) {
        const currentPlugins = ctx.getState().plugins;
        const index = currentPlugins.findIndex(plugin => plugin.slug === data.slug);

        if (index < 0) return;

        const plug = {
            ...currentPlugins[index],
            ...data
        };

        const newPlugins = [...currentPlugins];
        newPlugins[index] = plug;

        ctx.patchState({
            plugins: newPlugins
        })
        const plugin: any = await this.api.updatePlugin(slug, data, notify);
        if (plugin && plugin.success) {
            if (slug !== data.slug) {
                this.router.navigate(['plugin']);
            }
        } else {
            ctx.patchState({
                plugins: currentPlugins
            })
        }

    }

    @Action(DeletePlugin)
    async deletePlugin(ctx: StateContext<WpPluginStateModel>, { slug }: DeletePlugin) {
        const currentPlugins = ctx.getState().plugins;
        const newPlugins = currentPlugins.filter(plugin => plugin.slug !== slug);
        ctx.patchState({
            plugins: newPlugins
        })
        const plugin: any = await this.api.deletePlugin(slug);
        if (plugin && plugin.success) {
        } else {
            ctx.patchState({
                plugins: currentPlugins
            })
        }
    }

    @Action(AddedPlugin)
    async addedPlugin(ctx: StateContext<WpPluginStateModel>, { data }: AddedPlugin) { }

    @Action(RefreshAllPlugins)
    async refreshPlugin(ctx: StateContext<WpPluginStateModel>) {
        const plugins: any = await this.api.getPlugins();
        if (plugins && plugins.success && plugins.data) {
            ctx.patchState({
                plugins: plugins.data
            })
        }
    }

    @Action(ClearPlugins)
    async clear(ctx: StateContext<WpPluginStateModel>) {
        ctx.setState({
            plugins: [],
            envato: []
        })
    }


}
