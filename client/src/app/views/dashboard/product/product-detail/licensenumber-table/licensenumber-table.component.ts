import { ToastController } from '@ionic/angular';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { LicenseState } from '../../../../../modules/products/store/license/license.state';
import { tap } from 'rxjs/operators';
import { Sort, PageEvent } from '@angular/material';

export interface SortModel {
  key: string;
  direction: string;
  type: string;
}

@Component({
  selector: 'app-licensenumber-table',
  templateUrl: './licensenumber-table.component.html',
  styleUrls: ['./licensenumber-table.component.scss']
})
export class LicensenumberTableComponent implements OnInit {
  @Input() productId: number = null;

  tableDataSource$ = new BehaviorSubject<any[]>([]);
  licenses$ = new Observable<any[]>();

  displayedColumns$ = new BehaviorSubject<string[]>([
    'id',
    'userId',
    'licenseName',
    'status',
    'validUntil',
    'supportUntil',
    'url',
    'createdAt',
    'update',
  ]);


  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataOnPage$ = new BehaviorSubject<any[]>([]);

  sort$ = new BehaviorSubject<SortModel>({
    key: 'createdAt',
    direction: 'desc',
    type: 'date'
  });

  constructor(
    private store: Store,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.licenses$ = this.store.select(LicenseState.getLicensenumbersForProduct(this.productId)).pipe(
      tap(data => {
        this.tableDataSource$.next(data);
      }))

    combineLatest(this.licenses$, this.sort$)
      .subscribe(([data, sort]) => {
        let filteredLicensenumbers: any[] = data;

        if (!sort.direction) sort.direction = 'asc';

        let sortedLicensenumbers = [];
        switch (sort.type) {
          case 'date':
            sortedLicensenumbers = filteredLicensenumbers.sort((a, b) => {
              if (sort.direction === 'asc') {
                return new Date(a[sort.key]).getTime() - new Date(b[sort.key]).getTime() 
              } else {
                return new Date(b[sort.key]).getTime() - new Date(a[sort.key]).getTime() 
              }
            });

            break;
          default:
            sortedLicensenumbers = filteredLicensenumbers.sort((a, b) => {
              if (a[sort.key] > b[sort.key]) return sort.direction === 'asc' ? 1 : -1;
              if (a[sort.key] < b[sort.key]) return sort.direction === 'asc' ? -1 : 1;
              return 0;
            });
            break;
        }



        this.tableDataSource$.next(sortedLicensenumbers);
      });

    combineLatest(this.tableDataSource$, this.currentPage$, this.pageSize$)
      .subscribe(([allSources, currentPage, pageSize]) => {
        const startingIndex = (currentPage - 1) * pageSize;
        const onPage = allSources.slice(startingIndex, startingIndex + pageSize);
        this.dataOnPage$.next(onPage);
      });
  }

  update(licensenumberId) {

  }

  copy(licensenumberId) {
    window.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', licensenumberId);
      e.preventDefault();
      this.showSuccess('Lizenznummer in der Zwischenablage');
    });

    document.execCommand('copy');
  }

  async showSuccess(successMessage) {
    const successToast = await this.toast.create({
      message: successMessage,
      cssClass: 'toast-success',
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'Okay',
      duration: 3000
    });
    successToast.present();
  }

  sortData(sort: Sort) {
    let type = '';
    switch (sort.active) {
      case 'createdAt': case 'validUntil': case 'supportUntil':
        type = 'date';
        break;
      default:
        type = 'string';
        break;
    }
    this.sort$.next({
      key: sort.active,
      direction: sort.direction,
      type: type
    });
  }

  /**
   * Angular Material Pageinator
   * @param $event 
   */
  changePage($event: PageEvent) {
    const nextPage = $event.pageIndex+1;
    this.currentPage$.next(nextPage);
    this.pageSize$.next($event.pageSize);
  }
}
