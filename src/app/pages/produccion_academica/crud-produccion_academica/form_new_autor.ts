
export let NUEVO_AUTOR = {
  // titulo: 'FormacionAcademica',
  tipo_formulario: 'mini',
  alertas: true,
  btn: 'Guardar',
  btnLimpiar: false,
  modelo: 'Autor',
  campos: [
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'NombreCompleto',
      label_i18n: 'nombre_autor',
      placeholder_i18n: 'nombre_autor',
      requerido: true,
      tipo: 'InfoPersona',
      key: 'NombreCompleto',
      opciones: [],
      entrelazado: true,
    },
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
      nombre: 'TipoContribuyenteId',
      label_i18n: 'tipo_contribuyente',
      placeholder_i18n: 'tipo_contribuyente',
      requerido: true,
      tipo: 'TipoContribuyente',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-4 col-md-6 col-sm-12 col-xs-12',
      nombre: 'TipoDocumentoId',
      label_i18n: 'tipo_documento',
      placeholder_i18n: 'tipo_documento',
      requerido: true,
      tipo: 'TipoDocumento',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-5 col-md-12 col-sm-12 col-xs-12',
      nombre: 'NumeroIdentificacion',
      label_i18n: 'documento',
      placeholder_i18n: 'nit',
      requerido: true,
      tipo: 'text',
    },
  ],
}