export let FORM_INFO_CARACTERISTICA_PREGRADO = {
    // titulo: 'InfoCaracteristica',
    tipo_formulario: 'mini',
    btn: 'Guardar',
    alertas: true,
    modelo: 'InfoCaracteristica',
    campos: [
        {
            etiqueta: 'select',
            relacion: false,
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'GrupoSanguineo',
            label_i18n: 'grupo_sanguineo',
            placeholder_i18n: 'grupo_sanguineo',
            requerido: true,
            tipo: 'text',
            key: 'Id',
            opciones: [
                { Id: 'A' },
                { Id: 'AB' },
                { Id: 'B' },
                { Id: 'O' },
            ],
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'Rh',
            relacion: false,
            label_i18n: 'rh',
            placeholder_i18n: 'rh',
            requerido: true,
            tipo: 'text',
            key: 'Id',
            opciones: [
                { Id: '-' },
                { Id: '+' },
            ],
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'GrupoEtnico',
            label_i18n: 'grupo_etnico',
            placeholder_i18n: 'grupo_etnico',
            requerido: true,
            tipo: 'GrupoEtnico',
            key: 'Nombre',
            opciones: [],
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'PaisNacimiento',
            label_i18n: 'pais_nacimiento',
            placeholder_i18n: 'pais_nacimiento',
            requerido: true,
            tipo: 'Lugar',
            key: 'Nombre',
            opciones: [],
            entrelazado: true,
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'DepartamentoNacimiento',
            label_i18n: 'departamento_nacimiento',
            placeholder_i18n: 'departamento_nacimiento',
            requerido: true,
            tipo: 'Lugar',
            key: 'Nombre',
            opciones: [],
            entrelazado: true,
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'Lugar',
            label_i18n: 'ciudad_nacimiento',
            placeholder_i18n: 'ciudad_nacimiento',
            requerido: true,
            tipo: 'Lugar',
            key: 'Nombre',
            opciones: [],
        },
        {
            etiqueta: 'selectmultiple',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'TipoDiscapacidad',
            label_i18n: 'tipo_discapacidad',
            placeholder_i18n: 'tipo_discapacidad',
            requerido: true,
            tipo: 'TipoDiscapacidad',
            key: 'Nombre',
            opciones: [],
        },
        {
            etiqueta: 'selectmultiple',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'EPS',
            label_i18n: 'eps',
            placeholder_i18n: 'eps',
            requerido: true,
            opciones: [],
        },
        {
            etiqueta: 'select',
            relacion: false,
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'NumeroHermanos',
            label_i18n: 'hermanos',
            placeholder_i18n: 'hermanos',
            requerido: true,
            tipo: 'text',
            key: 'Id',
            opciones: [
                { Id: '0' },
                { Id: '1' },
                { Id: '2' },
                { Id: '3' },
                { Id: '4' },
                { Id: '5' },
            ],
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-3 col-md-3 col-sm-12 col-xs-12',
            nombre: 'PuntajeSisbe',
            label_i18n: 'puntaje',
            placeholder_i18n: 'puntaje',
            requerido: true,
            tipo: 'text',
        },
    ],
}