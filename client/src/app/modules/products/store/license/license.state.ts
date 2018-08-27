import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, NgxsOnInit, createSelector, Actions, ofActionSuccessful } from '@ngxs/store';
import { LicenseModel, LicenseStateModel } from './license.model';
import { CheckLicenses, AddLicense, AddedLicense, RefreshLicenses, DeleteLicense, UpdateLicense, UpdateWpPluginLicense, AddEnvatoItem, EnvatoItemAdded, CreateLicensenumber, ClearLicenses } from './license.actions';
import { ApiService } from '../../services/api.service';
import { UserNull } from '../../../user/store/user.actions';

@State<LicenseStateModel>({
    name: 'licenses',
    defaults: {

    }
})
export class LicenseState implements NgxsOnInit {
    /**
     * Selectors
     */
    static getLicenses(productId: number) {
        return createSelector([LicenseState], (state: LicenseStateModel) => {
            const license: LicenseModel[] = state[productId];
            if (license && license.length > 0) return license;
            return [];
        });
    }

    static getLicensenumbersForProduct(productId: number) {
        return createSelector([LicenseState], (state: LicenseStateModel) => {
            const licenses: LicenseModel[] = state[productId];
            const licensenumbers = [];
            if (licenses && licenses.length > 0) {
                // Loop through all licenses, save license name and add licensenumbers to array
                for (let license of licenses) {
                    if (license.licenseNumbers && license.licenseNumbers.length > 0) {
                        const licenseName = license.name;

                        for(let l of license.licenseNumbers) {
                            const licenseNumber = {
                                ...l,
                                licenseName
                            };
                            licensenumbers.push(licenseNumber);
                        }
                        

                    }
                }
            }
            return licensenumbers;
        });
    }

    static getLicense(productId: number, id: number) {
        return createSelector([LicenseState], (state: LicenseStateModel) => {
            const license: LicenseModel[] = state[productId].filter(license => license.id === id);
            if (license && license.length > 0) return license[0];
            return null;
        });
    }




    constructor(
        private router: Router,
        private api: ApiService,
        private actions: Actions,
    ) {

    }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<LicenseStateModel>) {
        ctx.dispatch(new CheckLicenses());

        this.actions.pipe(ofActionSuccessful(UserNull)).subscribe((data) => {
            ctx.dispatch(new ClearLicenses());
        });
    }

    /**
     * Commands
     */
    @Action(CheckLicenses)
    checkLicenses(ctx: StateContext<LicenseStateModel>) {
        const current = ctx.getState()
        if (!current) {
            ctx.setState(null);
        }
    }

    @Action(AddLicense)
    async addLicense(ctx: StateContext<LicenseStateModel>, { productId, data }: AddLicense) {
        const license = await this.api.addLicense(productId, data);
        if (license && license.id) {
            ctx.dispatch(new AddedLicense(license.id, data))
            ctx.dispatch(new RefreshLicenses(productId));
        }
    }

    @Action(UpdateLicense)
    async updateLicense(ctx: StateContext<LicenseStateModel>, { productId, data }: UpdateLicense) {
        const currentLicenses = ctx.getState()[productId];
        const index = currentLicenses.findIndex(license => license.id === data.id);

        if (index < 0) return;

        const productLicense = {
            ...currentLicenses[index],
            ...data
        };

        const newLicenses = [...currentLicenses];
        newLicenses[index] = productLicense;

        ctx.patchState({
            [productId]: newLicenses
        })
        const plugin: any = await this.api.updateLicense(productId, data);
        if (plugin && plugin.success) {
            // ctx.dispatch(new AddedPlugin(Plugin.id, name))
            // ctx.dispatch(new RefreshAllPlugins());
        } else {
            ctx.patchState({
                [productId]: currentLicenses
            })
        }
    }

    @Action(DeleteLicense)
    async deleteLicense(ctx: StateContext<LicenseStateModel>, { productId, id }: DeleteLicense) {
        const currentLicenses = ctx.getState()[productId];
        const newLicenses = currentLicenses.filter(license => license.id !== id);

        ctx.patchState({
            [productId]: newLicenses
        })
        const license = await this.api.deleteLicense(productId, id);
        if (license && license.success) {
        } else {
            ctx.patchState({
                [productId]: currentLicenses
            })
        }

    }

    @Action(UpdateWpPluginLicense)
    async updateWpPluginLicense(ctx: StateContext<LicenseStateModel>, { licenseId, slug }: UpdateWpPluginLicense) {
        return await this.api.updateWpPluginLicense(licenseId, slug);
    }

    @Action(AddedLicense)
    async addedLicense(ctx: StateContext<LicenseStateModel>, { productId, data }: AddedLicense) {
        return {
            productId,
            ...data
        }
    }

    @Action(RefreshLicenses)
    async refreshLicense(ctx: StateContext<LicenseStateModel>, { productId }: RefreshLicenses) {
        const licenses = await this.api.getLicenses(productId);
        if (licenses && licenses.success) {
            ctx.patchState({
                [productId]: licenses.data
            })
        }
    }

    @Action(AddEnvatoItem)
    async addEnvatoItem(ctx: StateContext<LicenseStateModel>, { productId, licenseId, data }: AddEnvatoItem) {
        const res = await this.api.addEnvatoItem(licenseId, data);
        if (res && res.success) {
            ctx.dispatch(new RefreshLicenses(productId));
            ctx.dispatch(new EnvatoItemAdded(res.data));
        }
    }

    @Action(EnvatoItemAdded)
    envatoItemAdded(ctx: StateContext<LicenseStateModel>, { res }: EnvatoItemAdded) {
        return res;
    }

    @Action(CreateLicensenumber)
    async createLicensenumber(ctx: StateContext<LicenseStateModel>, { productId, licenseId, email, sendEmail }: CreateLicensenumber) {
        const res = await this.api.createLicensenumber(licenseId, email, sendEmail);
        if (res && res.success) {
            ctx.dispatch(new RefreshLicenses(productId));
        }
    }

    @Action(ClearLicenses)
    async clear(ctx: StateContext<LicenseStateModel>) {
        ctx.setState({})
    }

}
