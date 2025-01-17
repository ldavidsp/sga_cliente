import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { PracticasAcademicasService } from '../../../@core/data/practicas_academicas.service';
import { UserService } from '../../../@core/data/users.service';
import { FORM_SOLICITUD_PRACTICAS, FORM_DOCUMENTOS_ADICIONALES, FORM_RESPUESTA_SOLICITUD } from '../form-solicitud-practica';

@Component({
  selector: 'ngx-detalle-practica-academica',
  templateUrl: './detalle-practica-academica.component.html',
  styleUrls: ['./detalle-practica-academica.component.scss'],
})
export class DetallePracticaAcademicaComponent implements OnInit {

  formDocente: FormGroup;
  InfoPracticasAcademicas: any;
  FormPracticasAcademicas: any;
  periodos: any[];
  proyectos: any[];
  espaciosAcademicos: any;
  tiposVehiculo: any;
  process: string;
  idSolicitud: string;
  estadosSolicitud: any;
  sub: any;
  tablaEstados: any;
  files: any = [];
  formDocumentosAdicionales: any;
  formRespuestaSolicitud: any;
  estadosList: any = [];
  InfoPersona: any = {}
  constructor(
    private builder: FormBuilder,
    private translate: TranslateService,
    private practicasService: PracticasAcademicasService,
    private _Activatedroute: ActivatedRoute,
    private userService: UserService,
  ) {
    this.formDocente = this.builder.group({
      NombreDocente: [{ value: '', disabled: true }],
      NumeroDocumento: [{ value: '', disabled: true }],
      EstadoDocente: [{ value: '', disabled: true }],
    });
    this.FormPracticasAcademicas = FORM_SOLICITUD_PRACTICAS;
    this.formDocumentosAdicionales = FORM_DOCUMENTOS_ADICIONALES;
    this.formRespuestaSolicitud = FORM_RESPUESTA_SOLICITUD;
    this.inicializiarDatos();
    this.crearTabla();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.inicializiarDatos();
      this.construirForm();
      this.crearTabla();
    });

  }

  ngOnInit() {
    this.formDocente.setValue({
      NombreDocente: 'Docente de prueba',
      NumeroDocumento: '123456789',
      EstadoDocente: 'Autor principal',
    });
    this.construirForm();


    this.sub = this._Activatedroute.paramMap.subscribe((params: any) => {
      const { process, id } = params.params;
      this.process = atob(process);
      this.estadosSolicitud = this.practicasService.getPracticas(id, null)[0].estados
      if (['invitation'].includes(this.process)) {
        this.files = [
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'cronograma_practica') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'presupuesto_practica') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'presentacion_practica') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'lista_estudiantes') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'guia_practica') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'lista_personal_apoyo') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'acta_compromiso') },
          { id: 140089, label: this.translate.instant('practicas_academicas.' + 'info_asistencia_practica') },
        ]
      }
    });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  inicializiarDatos() {
    this.files = [
      { id: 140089, label: this.translate.instant('practicas_academicas.' + 'cronograma_practica') },
      { id: 140089, label: this.translate.instant('practicas_academicas.' + 'presupuesto_practica') },
      { id: 140089, label: this.translate.instant('practicas_academicas.' + 'presentacion_practica') },
      { id: 140089, label: this.translate.instant('practicas_academicas.' + 'lista_estudiantes') },
      { id: 140089, label: this.translate.instant('practicas_academicas.' + 'guia_practica') },
      { id: 140089, label: this.translate.instant('practicas_academicas.' + 'lista_personal_apoyo') },
    ]
    this.periodos = [{ Nombre: '2021-1', Id: 1 }];
    this.proyectos = [{ Nombre: 'Ingeniería Industrial', Id: 1 }];
    this.espaciosAcademicos = [{ Nombre: '123 - Calculo Integral', Id: 1 }];
    this.tiposVehiculo = [
      { Nombre: 'Colectivo', Id: 1 },
      { Nombre: 'Buseta', Id: 2 },
      { Nombre: 'Bus', Id: 3 },
      { Nombre: 'Otro', Id: 4 },
    ];
    this.estadosList = [
      { Nombre: 'Verificada', Id: 1 },
      { Nombre: 'Devuelta', Id: 2 },
      { Nombre: 'Rechazada', Id: 3 },
    ]
    this.InfoPracticasAcademicas = {
      Periodo: { Id: 1 },
      Proyecto: { Id: 1 },
      EspacioAcademico: { Id: 1 },
      Semestre: 2,
      NumeroEstudiantes: 40,
      NumeroGrupos: 2,
      FechaHoraSalida: '',
      FechaHoraRegreso: '',
      Duracion: 2,
      NumeroVehiculos: 1,
      TipoVehiculo: { Id: 1 }
    }

    this.userService.tercero$.subscribe((user: any) => {;
      this.InfoPersona = { Nombre: user.NombreCompleto, FechaRespuesta: new Date()}
    })
  }

  construirForm() {
    this.FormPracticasAcademicas.titulo = this.translate.instant('practicas_academicas.datos');
    this.FormPracticasAcademicas.btn = ''
    this.FormPracticasAcademicas.campos.forEach(campo => {
      if (campo.etiqueta === 'select') {
        switch (campo.nombre) {
          case 'Periodo':
            campo.opciones = this.periodos;
            break;
          case 'Proyecto':
            campo.opciones = this.proyectos;
            break;
          case 'EspacioAcademico':
            campo.opciones = this.espaciosAcademicos;
            break;
          case 'TipoVehiculo':
            campo.opciones = this.tiposVehiculo;
            break;
        }
      }
      campo.label = this.translate.instant('practicas_academicas.' + campo.label_i18n);
      campo.deshabilitar = true;
    });

    this.formDocumentosAdicionales.campos.forEach(element => {
      element.label = this.translate.instant('practicas_academicas.' + element.label_i18n);
    });

    this.formRespuestaSolicitud.campos.forEach(element => {
      element.label = this.translate.instant('practicas_academicas.' + element.label_i18n);
      if (element.etiqueta === 'select') {
        switch (element.nombre) {
          case 'Estado':
            element.opciones = this.estadosList;
            break;
        }
      }
    });

  }

  verEstado(event) {
    const opt: any = {
      title: this.translate.instant("GLOBAL.estado"),
      html: `<span>${event.data.FechaSolicitud}</span><br>
                <span>${event.data.EstadoSolicitud}</span><br>
                <span class="form-control">${event.data.Observaciones}</span><br>`,
      icon: "info",
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt)
      .then((result) => {
        if (result) {
        }
      })
  }

  enviarInvitacion(event) {
    const opt: any = {
      title: this.translate.instant("GLOBAL.invitacion"),
      html: `Próximamente envío de invitación aquí`,
      icon: "info",
      buttons: true,
      dangerMode: true,
      showCancelButton: true
    };
    Swal.fire(opt)
  }

  crearTabla() {
    this.tablaEstados = {
      columns: {
        EstadoSolicitud: {
          title: this.translate.instant('solicitudes.estado'),
          width: '20%',
          editable: false,
        },
        FechaSolicitud: {
          title: this.translate.instant('solicitudes.fecha'),
          width: '20%',
          editable: false,
        },
        Observaciones: {
          title: this.translate.instant('solicitudes.Observaciones'),
          width: '20%',
          editable: false,
        },
      },
      mode: 'external',
      hideSubHeader: true,
      actions: {
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        columnTitle: this.translate.instant('GLOBAL.acciones'),
        custom: [
          {
            name: 'view',
            title:
              '<i class="nb-search" title="' +
              this.translate.instant(
                'practicas_academicas.tooltip_ver_registro',
              ) +
              '"></i>',
          },
        ],
      },
      noDataMessage: this.translate.instant('practicas_academicas.no_data'),
    };
  }

}
