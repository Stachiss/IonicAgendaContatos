import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';
import { Contato } from 'src/app/models/contato';
import { ContatoFireabaseService } from 'src/app/services/contato-fireabase.service';
import { ContatoService } from 'src/app/services/contato.service';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
})
export class DetalharPage implements OnInit {
  contato: Contato;
  data: string;
  edicao: boolean = true;
  form_cadastrar: FormGroup;
  isSubmitted: boolean = false;

  constructor(private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private contatoFS: ContatoFireabaseService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.data = new Date().toISOString();
    const nav = this.router.getCurrentNavigation();
    this.contato = nav.extras.state.objeto;
    console.log(this.contato);
    this.form_cadastrar = this.formBuilder.group({
      nome:[this.contato.nome ,[Validators.required]],
      telefone:[this.contato.telefone,[Validators.required, Validators.minLength(10)]],
      genero:[this.contato.genero,[Validators.required]],
      data_nascimento:[this.contato.data_nascimento ,[Validators.required]]
    });
  }

  get errorControl(){
    return this.form_cadastrar.controls;
  }

  submitForm(): boolean{
    this.isSubmitted = true;
    if(!this.form_cadastrar.valid){
      this.presentAlert("Agenda", "Erro","Todos os campos são Obrigatórios!");
      return false;
    }else{
      this.editar();
    }
  }

  alterarEdicao(): void{
    if(this.edicao == false){
      this.edicao = true;
    }else{
      this.edicao = false;
    }
  }

  editar(){
    this.contatoFS.editarContato(this.form_cadastrar.value, this.contato.id)
    .then(() => {
      this.presentAlert("Agenda", "Sucesso", "Edição Realizado");
      this.router.navigate(["/home"]);
    })
    .catch((error) => {
      this.presentAlert("Agenda", "Erro", "Edição não foi Realizada com Sucesso");
      console.log(error);
    })
  }

  excluir(): void{
    this.presentAlertConfirm("Agenda", "Excluir Contato",
    "Você realmente deseja excluir o contato?",
    this.excluirContato());
  }

excluirContato(){
  this.contatoFS.excluirContato(this.contato)
  .then(() => {
    this.presentAlert("Agenda", "Sucesso", "Edição Realizado");
    this.router.navigate(["/home"]);
  })
  .catch((error) => {
    console.log(error);
    this.presentAlert("Agenda", "Erro", "Contato Não Encontrado!");
  })
}

//no trabalho deverão estar em outro arquivo
  private validar(campo: any) : boolean{
    if(!campo){
      return false;
    }
    return true;
  }

  async presentAlert(cabecalho: string, subcabecalho: string,
    mensagem: string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentAlertConfirm(cabecalho: string,
    subcabecalho: string, mensagem: string,
    acao: any) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: mensagem,
      buttons: [
        {
          text:'Cancelar',
          role:'cancelar',
          cssClass:'secondary',
          handler: ()=>{
            console.log("Cancelou")
          }
        },
        {
          text:'Confirmar',
          role: 'confirm',
          handler: (acao)=>{
           acao
          }
        }
      ],
    });
    await alert.present();
  }

}
