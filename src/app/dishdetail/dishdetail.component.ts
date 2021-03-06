import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import{Params, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import { of, from } from 'rxjs';
import{delay, switchMap} from 'rxjs/operators';
import{Comment} from  '../shared/comment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {visibility} from '../animations/app.animation';
import{flyInOut,expand} from '../animations/app.animation';

import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
      },
  animations: [
   flyInOut(),
visibility(),
expand()
  ]
})

export class DishdetailComponent implements OnInit {
  
  dish : Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  @ViewChild('cform')  commentFormDirective;
  commentForm:FormGroup;
  dishcopy: Dish;
  comment:Comment;
  visibility = 'shown';

  formErrors={
    'author': '',
    'çomment':''
  };

  validationMessage={
    'author':{
      'required':'Author Name is Required.',
      'minlength':'Author name must be a least 2 characters',
      'maxlength':'Author Name cannot be more than 25 charactes'
    },
    'comment':{
      'required':'Comment is Required.',
    
    }
  };
  
  constructor(private dishService: DishService,
    private route:ActivatedRoute,
    private location:Location,
    private fb:FormBuilder,
    @Inject('BaseURL') public BaseURL
   
    ) {
      
     }

  

  ngOnInit(): void {

    

    this.createForm();
    
     this.dishService.getDishIds()
    .subscribe((dishIds)=>this.dishIds=dishIds);
    this.route.params
    .pipe(switchMap((params: Params) => {this.visibility ='hidden'; return this.dishService.getDish(params['id']);})) 
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility='shown' ;},
      errmess => this.errMess = <any>errmess );
      }
  setPrevNext(dishId:string){
    const index=this.dishIds.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds.length + index -1)%this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length + index +1)%this.dishIds.length];
  
  }
  goBack():void{
    this.location.back();
  }
  createForm(){
    this.commentForm=this.fb.group({
      author:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating:5,
      comment:['',[Validators.required, Validators.minLength(2)]]

    });
    this.commentForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any){
    if(!this.commentForm){return;}
    const form= this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field]='';
        const control= form.get(field);
        if(control && control.dirty && !control.valid){
          const messages= this.validationMessage[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field]+=messages[key] + '';
            }
          }
        }
      }
    }
  }
  onSubmit(){
    this.comment=this.commentForm.value;
    this.comment.date=new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
    errmess => {this.dish= null; this.dishcopy=null; this.errMess= <any>errmess;});
   
    this.commentForm.reset({
      author:'',
      rating:5,
      comment:'',
    

    });
    this.commentFormDirective.resetForm();
   
     
  }

  

}
