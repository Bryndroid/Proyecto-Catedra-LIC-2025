const modal = new Popzy({
  templateId: 'my-modal-template',
  footer: true,
  destroyOnClose: false,
  closeMethods: ['overlay', 'button', 'escape'],
});

function abrirModal(){
    
    modal.open();
}
