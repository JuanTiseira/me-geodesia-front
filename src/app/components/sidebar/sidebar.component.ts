import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  direction = "";
  url = "";

  constructor(
    public _functionsService: FunctionsService
  ) { }



  ngOnInit(): void {
  }

  // cambioUrl(url: string){
  //   this.url = url;
  // }

}
