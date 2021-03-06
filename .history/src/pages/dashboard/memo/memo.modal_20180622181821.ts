import { Component } from "@angular/core";
import { ViewController, NavParams, Platform } from "ionic-angular";

@Component({
    templateUrl: 'memo.modal.html'
})
export class MemoModal {
  memo: any;
time: any;
data: any;
month: string;
  constructor (
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.memo = this.params.get('memo');
    switch (this.memo.date_time.split(" ")[2]) {
        case "Gennaio": this.month = '01'; break;
        case "Febbraio": this.month = '02'; break;
        case "Marzo": this.month = '03'; break;
        case "Aprile": this.month = '04'; break;
        case "Maggio": this.month = '05'; break;
        case "Giugno": this.month = '06'; break;
        case "Luglio": this.month = '07'; break;
        case "Agosto": this.month = '08'; break;
        case "Settembre": this.month = '09'; break;
        case "Ottobre": this.month = '10'; break;
        case "Novembre": this.month = '11'

    }
    this.data = this.memo.date_time.split(" ")[3].replace(',', '') + '-' + this.memo.date_time.split(" ")[3]
    console.log(this.memo)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
