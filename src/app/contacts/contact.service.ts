import { Injectable } from '@angular/core';
import { Contact } from './contact'; // Importando classe Contact
import { Http, Response } from '@angular/http'; // Importando biblioteca de requisições Http

@Injectable()
export class ContactService {
    private contactsUrl = '/api/contacts';

    constructor (private http: Http) {}

    // Criando requisição get ("/api/contact") e inserindo no array Contact[]
    getContacts(): Promise<void | Contact[]> {
      return this.http.get(this.contactsUrl)
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.exibeErro);
    }

    // Criando requisição post ("api/contact") e enviando no formato da classe Contact
    createContact(newContact: Contact): Promise<void | Contact> {
      return this.http.post(this.contactsUrl, newContact)
                 .toPromise()
                 .then(response => response.json() as Contact)
                 .catch(this.exibeErro);
    }

    // Criando requisição delete ("api/contact:id") passando delContactId para excluir o contato
    deleteContact(delContactId: String): Promise<void | String> {
      return this.http.delete(this.contactsUrl + '/' + delContactId)
                 .toPromise()
                 .then(response => response.json() as String)
                 .catch(this.exibeErro);
    }

    // Criando requisição PUT ("api/contact:id") passando ContactId para atualizar os dados do contato
    updateContact(putContact: Contact): Promise<void | Contact> {
      var putUrl = this.contactsUrl + '/' + putContact._id;
      return this.http.put(putUrl, putContact)
                 .toPromise()
                 .then(response => response.json() as Contact)
                 .catch(this.exibeErro);
    }

    private exibeErro (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
}