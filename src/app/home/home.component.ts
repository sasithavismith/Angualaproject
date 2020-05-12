import { Component, OnInit } from '@angular/core';
import {Dish} from'../shared/dish';
import {DishService} from '../services/dish.service';
import {Promotion} from '../shared/promotion';
import {PromotionService} from '../services/promotion.service';
import {LeaderService} from '../services/leader.service';
import { from } from 'rxjs';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dish:Dish;
  promotion:Promotion;
  leader:Leader;
  leaders: Leader[];
  constructor(private dishService:DishService,
    private promotionService: PromotionService,
    private leaderService:LeaderService
    ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
    .then(dish=>this.dish=dish);
    this.promotionService.getFeaturedPromotion()
    .then(promotion=>this.promotion=promotion);
   
    this.leaderService.getFeaturedLeader()
    .then(leader=>this.leader=leader);
  }

}