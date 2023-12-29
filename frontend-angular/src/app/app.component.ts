import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})

export class AppComponent implements OnInit {
  title = 'A_Correia_Project';

  constructor()
  {
    console.log('AppComponent.constructor()');
  }

  ngOnInit()
  {
    console.log('AppComponent.ngOnInit()');
  }
}


