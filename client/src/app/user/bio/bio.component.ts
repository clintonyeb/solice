import { Component, OnInit } from '@angular/core';
import * as Rellax from "rellax";

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit {
  user;
  constructor() { }

  ngOnInit() {
    const rellaxHeader = new Rellax(".rellax-header");
  }

  getUserInfo() {
    
  }

}
