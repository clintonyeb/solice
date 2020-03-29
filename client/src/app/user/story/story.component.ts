import { Component, OnInit, Input } from '@angular/core';
import { IPost } from '../../utils/interfaces';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  @Input() feed: Array<IPost>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
