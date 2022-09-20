import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContatoFireabaseService } from 'src/app/services/contato-fireabase.service';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  contatos: Contato[];

  constructor(private router: Router,
    private contatoFirevaseService: ContatoFireabaseService) {
    this.carregarContatos();
}

carregarContatos(){
  this.contatoFirevaseService.getContatos()
  .subscribe(res => {
    this.contatos = res.map(e => {
      return{
        id: e.payload.doc.id,
        ...e.payload.doc.data() as Contato,
      } as Contato;
    });
  });
}

irParaCadastrar(){
  this.router.navigate(["/cadastrar"]);
}

irParaDetalhar(contato: Contato){
  this.router.navigateByUrl("/detalhar",
  {state: {objeto:contato}});
}

}
