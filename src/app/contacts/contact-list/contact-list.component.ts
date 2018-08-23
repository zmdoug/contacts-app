// Adicionando a logica do APP

import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact'; // Importando classe Contact
import { ContactService } from '../contact.service'; // Importando requisições
import { ContactDetailsComponent } from '../contact-details/contact-details.component'; // Template para exibir os detalhes do contato

@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactService]
})

export class ContactListComponent implements OnInit {

  contacts: Contact[]
  selectedContact: Contact

  constructor(private contactService: ContactService) { }

  ngOnInit() {
  	// Recuperar lista completa de contatos
  	// Armazena localmente para modificar dinamicamente sem necessidade de realizar requisições HTTP extras para a API.
     this.contactService
      .getContacts()
      .then((contacts: Contact[]) => {
        this.contacts = contacts.map((contact) => {
          if (!contact.phone) {
            contact.phone = ''
          }
          return contact;
        });
      });
  }

  private getIndexOfContact = (contactId: String) => {
    return this.contacts.findIndex((contact) => {
      return contact._id === contactId;
    });
  }
	// Criando as funções do app

	// Ao selecionar um contato
  selectContact(contact: Contact) {
    this.selectedContact = contact
  }
  // Ao criar um novo contato
  createNewContact() {
    var contact: Contact = {
      name: '',
      email: '',
      phone: {
        work: '',
        mobile: ''
      }
    };

    // Seleciona o contato recém criado
    this.selectContact(contact);
  }
  // Ao deletar um contato
  deleteContact = (contactId: String) => {
    var idx = this.getIndexOfContact(contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1); // splice = remover do array
      this.selectContact(null);
    }
    return this.contacts;
  }

  addContact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectContact(contact);
    return this.contacts;
  }

  updateContact = (contact: Contact) => {
    var idx = this.getIndexOfContact(contact._id);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
    return this.contacts;
  }
}