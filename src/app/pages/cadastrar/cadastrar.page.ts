import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ContatoFireabaseService } from 'src/app/services/contato-fireabase.service';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {
  data: string;
  form_cadastrar: FormGroup;
  isSubmitted: boolean = false;

  constructor(private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private contatoFS: ContatoFireabaseService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.data = new Date().toISOString();
    this.form_cadastrar = this.formBuilder.group({
      nome: ["", [Validators.required]],
      telefone: ["", [Validators.required, Validators.minLength(10)]],
      genero: ["", [Validators.required]],
      data_nascimento: ["", [Validators.required]]
    });
  }

  get errorControl(){
    return this.form_cadastrar.controls;
  }

  submitForm(): boolean{
    this.isSubmitted = true;
    if(!this.form_cadastrar.valid){
      this.presentAlert("Agenda", "Erro",
       "Todos os campos são Obrigatórios!");
      return false;
    }else{
      this.cadastrar();
    }
  }

  private cadastrar(){
    this.showLoading("Aguarde...",10000);
    this.contatoFS.inserirContato(this.form_cadastrar.value)
    .then(() => {
      this.loadingCtrl.dismiss();
      this.presentAlert("Agenda", "Sucesso", "Cliente Cadastrado!");
      this.router.navigate(["/home"]);
    })
    .catch((error) => {
      this.loadingCtrl.dismiss();
      this.presentAlert("Agenda", "Erro", "Erro ao Realizar Cadastro!");
      console.log(error);
    })
  }


  async presentAlert(header: string, subHeader: string,
    message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showLoading(mensagem: string, duracao:number) {
    const loading = await this.loadingCtrl.create({
      message: mensagem,
      duration: duracao,
    });
    loading.present();
  }
}
