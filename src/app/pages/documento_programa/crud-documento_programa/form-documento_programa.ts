export let FORM_DOCUMENTO_PROGRAMA = {
  // titulo: 'DocumentoPrograma',
  tipo_formulario: 'mini',
  btn: 'Guardar',
  btnLimpiar: 'Limpiar',
  alertas: true,
  modelo: 'DocumentoPrograma',
  campos: [
    {
      etiqueta: 'select',
      claseGrid: 'col-12 col-md-6',
      nombre: 'DocumentoProgramaId',
      label_i18n: 'tipo_documento_programa',
      placeholder_i18n: 'tipo_documento_programa',
      requerido: true,
      tipo: 'DocumentoPrograma',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'file',
      claseGrid: 'col-12 col-md-6',
      clase: 'form-control',
      nombre: 'Documento',
      label_i18n: 'soporte_documento',
      placeholder_i18n: 'soporte_documento',
      requerido: false,
      tipo: 'pdf,png',
      tipoDocumento: 6,
      formatos: 'pdf,png',
      url: '',
      tamanoMaximo: 2,
    },
  ],
}
