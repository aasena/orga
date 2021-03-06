import { Component } from "@angular/core";
import {
  NativePageTransitions,
  NativeTransitionOptions
} from "@ionic-native/native-page-transitions";
import {
  AlertController,
  NavController,
  NavParams,
  ActionSheetController,
  App,
  ModalController
} from "ionic-angular";
import { AuthStorage } from "../../../providers/auth/auth-storage";
import { AuthService } from "../../../providers/auth/auth-service";
import { Home } from "../../home/home";
import { NoteModal } from "./note.modal";

@Component({
  selector: "page-note",
  templateUrl: "note.html"
})
export class NoteTab {
  options: NativeTransitionOptions;
  profile: any;
  new = false;
  title: string;
  note: string;
  newCollection: string;
  collection: string;
  notAdd = true;
  active = {};
  collections = [];
  notes = {};
  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public app: App,
    public service: AuthService,
    public storage: AuthStorage,
    public sheet: ActionSheetController,
    public nativePageTransitions: NativePageTransitions,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.profile = storage.getProfile();

    let id;
    service.id(this.profile).subscribe(response => {
      id = response.data.user;

      service.getCollection(id).subscribe(res => {
        res.forEach((element, index) => {
          service.getNote(id, element.name).subscribe(resp => {
            //this.collections.push({name: element.name, active: false})
            //this.notes[element.name] = resp;
            console.log(resp)
          })
        })
        console.log(this.collections)
      });
    });
  }

  swipe(event) {
    if (event.direction === 4) {
      this.navCtrl.parent.select(2);
      this.options = {
        direction: "right",
        duration: 200,
        iosdelay: 50,
        fixedPixelsBottom: 48
      };
    }
  }

  add() {
    this.notAdd = !this.notAdd;
  }

  openModal(item) {
    let noteModal = this.modalCtrl.create(NoteModal, { note: this.notes[item.name], coll: this.collections });

    noteModal.present();
    noteModal.onWillDismiss(data => {
      let id;
      this.collections = [];
      this.notes = {};
      this.service.id(this.profile).subscribe(response => {
        id = response.data.user;

        this.service.getCollection(id).subscribe(res => {
          res.forEach((element, index) => {
            this.service.getNote(id, element.name).subscribe(resp => {
              this.collections.push({name: element.name, active: false})
              this.notes[element.name] = resp;
            })
          })
        });
      });
    });
  }

  profileSettings() {
    let actionSheet = this.sheet.create({
      title: "Modify your profile",
      buttons: [
        {
          text: "Impostazioni",
          handler: () => {
            //TODO
          }
        },
        {
          text: "Logout",
          handler: () => {
            if (this.profile.google) {
              this.service.logOutGoggle().then(res => {
                console.log(res);
                this.profile = {};
                this.app.getRootNav().push(Home);
              });
            } else {
              this.service.logoutSQL();
              this.profile = {};
              this.app.getRootNav().push(Home);
            }
            error => {
              let alert = this.alertCtrl.create({
                title: "Errore durante il logout",
                subTitle: `Si è verificato un errore durante il logout,
                          ti consigliamo di chiudere l'app.`,
                buttons: ["OK"]
              });
              alert.present();
            };
          }
        }
      ]
    });
    actionSheet.present();
  }

  ionViewWillLeave() {
    this.nativePageTransitions.slide(this.options);
  }

  ionViewWillEnter() {
    let id;
    this.service.id(this.profile).subscribe(response => {
      id = response.data.user;

      this.service.getCollection(id).subscribe(res => {
        console.log(res)
        res.forEach((element, index) => {
          this.service.getNote(id, element.name).subscribe(resp => {
            this.collections.push({name: element.name, active: false})
            this.notes[element.name] = resp;
          })
        })
      });
    });
  }

  createNote() {
    this.service.noteCreate(
      this.profile.email,
      this.title,
      this.note,
      this.new,
      this.newCollection,
      this.collection
    ).subscribe(res => {
      let alert = this.alertCtrl.create({
        title: res.title,
        subTitle: res.sub,
        buttons: [{
          text: 'ok',
          handler: () => {
            let id;
            this.service.id(this.profile).subscribe(response => {
              id = response.data.user;

              this.service.getCollection(id).subscribe(res => {
                console.log(res)
                res.forEach((element, index) => {
                  this.service.getNote(id, element.name).subscribe(resp => {
                    this.collections.push({name: element.name, active: false})
                    this.notes[element.name] = resp;
                  })
                })
              });
            });
          }
        }]
      });
      alert.present();
    });
  }
}
