import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CardService} from "../../services/card.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Card} from "../../models/card";
import {Observable} from "rxjs";
import {SnackbarService} from "../../services/snackbar.service";



@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit{
  cardForm!: FormGroup
  showSpinner:boolean =false;
  constructor(
    private dialogRef:MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService:CardService,
    private _snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:Card,
    private snackbarService: SnackbarService
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    this.cardForm = this.fb.group({
      name:[this.data?.name || '',[Validators.maxLength(50)]],
      title:[this.data?.title || '',[Validators.required,Validators.maxLength(50)]],
      phone:[this.data?.phone || '',[Validators.required]],
      email:[this.data?.email || '',[Validators.maxLength(50)]],
      address:[this.data?.address || '',[Validators.maxLength(50)]]
    });
  }
  addCard():void {
    this.showSpinner = true;
    this.cardService.addCard(this.cardForm.value)
      .subscribe((res:any) => {
        this.getSuccess(res || 'Kartvizit Başarıyla Eklendi.')
      }, error => (err: any) => {
        this.getError(err.message || 'Kartvizit eklenirken bir sorun oluştu.');
      });

  }
  updateCard(): void {
    this.showSpinner = true;
    this.cardService.updateCard(this.cardForm.value,this.data.id)
      .subscribe((res:any) => {
        this.getSuccess(res || 'Kartvizit Başarıyla Güncellendi.')
      }, error => (err: any) => {
        this.getError(err.message || 'Kartvizit güncellenirken bir sorun oluştu.');
      });


  }
  deleteCard(): void{
    this.showSpinner = true;
    this.cardService.deleteCard(this.data.id)
      .subscribe((res:any) => {
        this.getSuccess(res || 'Kartvizit Başarıyla Silindi.')
      }, error => (err: any) => {
        this.getError(err.message || 'Kartvizit silinirken bir sorun oluştu.');
      });

  }
  getSuccess(message: string):void {
    this.snackbarService.createSnackbar('success', message);
    this.cardService.getCards();
    this.showSpinner = false;
    this.dialogRef.close();
  }
  getError(message: string) {
    this.snackbarService.createSnackbar( 'error', message);
    this.showSpinner = false;
  }



}
