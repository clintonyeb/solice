import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedFriendComponent } from './feed-friend.component';

describe('FeedFriendComponent', () => {
  let component: FeedFriendComponent;
  let fixture: ComponentFixture<FeedFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedFriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
