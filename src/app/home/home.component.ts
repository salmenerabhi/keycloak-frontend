import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input()
  isLogged: boolean = false;
  @Input()
  isAdmin: boolean = false;
  @Input() username: string | undefined;


  constructor() { }

  ngOnInit(): void {
    
  }
}