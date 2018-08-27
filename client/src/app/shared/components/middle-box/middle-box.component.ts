import { platformEnvironment } from './../../../../environments/constants';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-middle-box',
  templateUrl: './middle-box.component.html',
  styleUrls: ['./middle-box.component.scss']
})
export class MiddleBoxComponent implements OnInit {
  platformName: string = platformEnvironment.platform.name;
  constructor() { }

  ngOnInit() {
  }

}
