import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActividadCalendarioAcademicoComponent } from '../actividad-calendario-academico/actividad-calendario-academico.component';
import { Proceso } from '../../../@core/data/models/calendario-academico/proceso';
import { Calendario } from '../../../@core/data/models/calendario-academico/calendario';
import { ActividadHija } from '../../../@core/data/models/calendario-academico/actividadHija';
import { EventoService } from '../../../@core/data/evento.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { TranslateService } from '@ngx-translate/core';
import { DocumentoService } from '../../../@core/data/documento.service';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { CalendarioEvento } from '../../../@core/data/models/calendario-academico/calendarioEvento';
import { PopUpManager } from '../../../managers/popUpManager';
import * as moment from 'moment';
import { Actividad } from '../../../@core/data/models/calendario-academico/actividad';

@Component({
  selector: 'ngx-detalle-calendario',
  templateUrl: './detalle-calendario.component.html',
  styleUrls: ['./detalle-calendario.component.scss'],
})
export class DetalleCalendarioComponent implements OnInit, OnChanges {

  activetab: boolean = false;
  calendarForEditId: number = 0;
  dataSource: any;
  data: any;
  processSettings: any;
  activitiesSettings: any;
  idDetalle: any
  processes: Proceso[];
  calendar: Calendario;
  calendarActivity: ActividadHija;
  processTable: LocalDataSource;
  fileResolucion: any;
  calendarForm: FormGroup;
  calendarioEvento: CalendarioEvento;
  loading: boolean = false;
  responsable: string;

  @Input()
  calendarForProject: string = '0';
  @Input()
  projectId: number = 0;

  constructor(
    private sgaMidService: SgaMidService,
    private translate: TranslateService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private popUpManager: PopUpManager,
    private eventoService: EventoService,
  ) {
    this.createActivitiesTable();
  }

  loadSelects(id: any) {
    this.loading = true;
    this.processes = [];
    this.sgaMidService.get('consulta_calendario_academico/' + id).subscribe(
      (response: any[]) => {
        const calendar = response[0];
        this.calendar = new Calendario();
        this.calendar.Nombre = calendar['Nombre'];
        this.calendar.ListaCalendario = calendar['ListaCalendario'];
        this.calendar.calendarioId = calendar['Id'];
        this.calendar.DocumentoId = calendar['resolucion']['Id'];
        this.calendar.resolucion = calendar['resolucion']['Resolucion'];
        this.calendar.anno = calendar['resolucion']['Anno'];
        this.calendar.Nivel = calendar['Nivel'];
        this.calendar.Activo = calendar['Activo'];
        this.calendar.PeriodoId = calendar['PeriodoId'];
        this.fileResolucion = calendar['resolucion']['Nombre'];
        const processes: any[] = calendar['proceso'];
        if (processes !== null) {
          processes.forEach(element => {
            if (Object.keys(element).length !== 0) {
              const loadedProcess: Proceso = new Proceso();
              loadedProcess.Nombre = element['Proceso'];
              loadedProcess.CalendarioId = { Id: this.calendar.calendarioId};
              loadedProcess.actividades = [];
              const activities: any[] = element['Actividades']
              if (activities !== null) {
                activities.forEach(element => {

                  this.route.paramMap.subscribe(params => {
                    if (params.get('Id') !== null) {
                      if (Object.keys(element).length !== 0 && element['EventoPadreId'] == null) {
                        const loadedActivity: Actividad = new Actividad();
                        loadedActivity.actividadId = element['actividadId'];
                        loadedActivity.TipoEventoId = { Id: element['TipoEventoId']['Id'] };
                        loadedActivity.Nombre = element['Nombre'];
                        loadedActivity.Descripcion = element['Descripcion'];
                        loadedActivity.Activo = element['Activo'];
                        loadedActivity.FechaInicio = moment(element['FechaInicio'], 'YYYY-MM-DD').format('DD-MM-YYYY');
                        loadedActivity.FechaFin = moment(element['FechaFin'], 'YYYY-MM-DD').format('DD-MM-YYYY');
                        loadedActivity.responsables = element['Responsable'];
                        loadedProcess.procesoId = element['TipoEventoId']['Id'];
                        loadedProcess.Descripcion = element['TipoEventoId']['Descripcion'];
                        loadedProcess.TipoRecurrenciaId = { Id: element['TipoEventoId']['TipoRecurrenciaId']['Id'] };
                        loadedProcess.actividades.push(loadedActivity);
                      }
                    }else {
                      if (Object.keys(element).length !== 0) {
                        const loadedActivity: Actividad = new Actividad();
                        loadedActivity.actividadId = element['actividadId'];
                        loadedActivity.TipoEventoId = { Id: element['TipoEventoId']['Id'] };
                        loadedActivity.Nombre = element['Nombre'];
                        loadedActivity.Descripcion = element['Descripcion'];
                        loadedActivity.Activo = element['Activo'];
                        loadedActivity.FechaInicio = moment(element['FechaInicio']).format('YYYY-MM-DD');
                        loadedActivity.FechaFin = moment(element['FechaFin']).format('YYYY-MM-DD');
                        loadedActivity.responsables = element['Responsable'];
                        loadedProcess.procesoId = element['TipoEventoId']['Id'];
                        loadedProcess.Descripcion = element['TipoEventoId']['Descripcion'];
                        loadedProcess.TipoRecurrenciaId = { Id: element['TipoEventoId']['TipoRecurrenciaId']['Id'] };
                        loadedProcess.actividades.push(loadedActivity);
                      }
                    }
                  });


                });
                this.processes.push(loadedProcess);
              }
            }
          });
        }
        this.loading = false;
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
        this.loading = false;
      },
    );
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('Id') !== null) {
        this.idDetalle = params.get('Id');
        this.loadSelects(this.idDetalle)
      }
    });
    this.createActivitiesTable();
  }

  ngOnChanges() {
    if (this.calendarForProject != '0') {
      this.loadSelects(this.calendarForProject);
    }
  }

  cambiarCalendario(id: any) {
    this.loadSelects(id)
  }

  createActivitiesTable() {
    this.activitiesSettings = {
      columns: {
        Nombre: {
          title: this.translate.instant('calendario.nombre'),
          witdh: '20%',
          editable: false,
          filter: false,
        },
        Descripcion: {
          title: this.translate.instant('GLOBAL.descripcion'),
          witdh: '20%',
          editable: false,
          filter: false,
        },
        FechaInicio: {
          title: this.translate.instant('calendario.fecha_inicio'),
          witdh: '20%',
          editable: false,
          filter: false,
          // valuePrepareFunction: (value) => value = moment(value).format('YYYY-MM-DD'),
        },
        FechaFin: {
          title: this.translate.instant('calendario.fecha_fin'),
          witdh: '20%',
          editable: false,
          filter: false,
          // valuePrepareFunction: (value) => value = moment(value).format('YYYY-MM-DD'),
        },
        responsables: {
          title: this.translate.instant('calendario.responsable'),
          witdh: '20%',
          editable: false,
          filter: false,
          valuePrepareFunction: value => {
            if (value != null) {
              this.responsable = '';
              for (let i = 0; i < value.length; i++) {
                this.responsable = value[i]['Nombre'] + ', ' + this.responsable;
              }
              if (this.responsable != '') {
                this.responsable = this.responsable.substring(
                  0,
                  this.responsable.length - 2,
                );
              }
              return this.responsable;
            } else {
              return value;
            }
          },
        },
        Activo: {
          title: this.translate.instant('calendario.estado'),
          witdh: '20%',
          editable: false,
          filter: false,
          valuePrepareFunction: (value: boolean) =>
            value
              ? this.translate.instant('GLOBAL.activo')
              : this.translate.instant('GLOBAL.inactivo'),
        },
      },
      mode: 'external',
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
        columnTitle: this.translate.instant('GLOBAL.acciones'),
        custom: [
          {
            name: 'clone',
            title: '<i class="nb-plus-circled" title="' +
                this.translate.instant('calendario.tooltip_clonar_actividad') +
                '"></i>',
          },
          {
            name: 'edit',
            title: '<i class="nb-edit" title="' + this.translate.instant('calendario.tooltip_editar_actividad') + '"></i>',
          },
        ],
      },
      add: {
        addButtonContent: '<i class="nb-plus" title="' +
        this.translate.instant('calendario.tooltip_crear_actividad') +
        '"></i>',
      },
      noDataMessage: this.translate.instant('calendario.sin_actividades'),
    };
  }

  onActionActivity(event, process: Proceso) {
    switch (event.action) {
      case 'edit':
        this.editActivity(event, process);
        break;
      case 'assign':
        this.assignActivity(event);
        break;
    }
  }

  editActivity(event, process: Proceso) {
    const activityConfig = new MatDialogConfig();
    activityConfig.width = '800px';
    activityConfig.height = '700px';
    activityConfig.data = { process: process, calendar: this.calendar, editActivity: event.data };
    const editedActivity = this.dialog.open(ActividadCalendarioAcademicoComponent, activityConfig);
    editedActivity.afterClosed().subscribe((activity: any) => {
      if (activity !== undefined) {
        this.eventoService.get('calendario_evento/' + event.data.actividadId).subscribe(
          response => {
            const activityPut = response;
            activityPut['Nombre'] = activity.Actividad.Nombre;
            activityPut['Descripcion'] = activity.Actividad.Descripcion;
            activityPut['FechaInicio'] = activity.Actividad.FechaInicio;
            activityPut['FechaFin'] = activity.Actividad.FechaFin;
            this.eventoService.put('calendario_evento', activityPut).subscribe(
              response => {
                this.sgaMidService.put('crear_actividad_calendario/update', {Id: event.data.actividadId, resp: activity.responsable}).subscribe(
                  response => {
                    this.popUpManager.showSuccessAlert(this.translate.instant('calendario.actividad_actualizada'));
                    this.loadSelects(this.calendar.calendarioId);
                  },
                  error => {
                    this.popUpManager.showErrorToast(this.translate.instant('calendario.error_registro_actividad'));
                  },
                );
              },
              error => {
                this.popUpManager.showErrorToast(this.translate.instant('calendario.error_registro_actividad'));
              },
            );
          },
          error => {
            this.popUpManager.showErrorToast(this.translate.instant('calendario.error_registro_actividad'));
          },
        );
      }
    });
  }

  assignActivity(event: any) {
    this.loading = true;

    this.calendarioEvento = new CalendarioEvento();
    // this.calendarActivity = new ActividadHija();

    // this.calendarActivity.Id = this.calendar.calendarioId
    // this.calendarActivity.Nombre = event.data.Nombre
    // if (this.calendar.Activo) {
    //   this.calendarActivity.Estado = 'Activo'
    // } else {
    //   this.calendarActivity.Estado = 'Inactivo'
    // }
    this.calendarioEvento.Id = 0
    this.calendarioEvento.Nombre = '-' + event.data.Nombre;
    this.calendarioEvento.Descripcion = event.data.Descripcion;
    // this.calendarioEvento.FechaCreacion = moment().format('YYYY-MM-DDTHH:mm') + ':00Z';
    // this.calendarioEvento.FechaModificacion = moment().format('YYYY-MM-DDTHH:mm') + ':00Z';
    this.calendarioEvento.FechaInicio = moment(event.data.FechaInicio).format('YYYY-MM-DDTHH:mm') + ':00Z';
    this.calendarioEvento.FechaFin = moment(event.data.FechaFin).format('YYYY-MM-DDTHH:mm') + ':00Z';
    this.calendarioEvento.Activo = event.data.Activo;
    this.calendarioEvento.DependenciaId = JSON.stringify({ proyectos: this.projectId });
    this.calendarioEvento.EventoPadreId = { Id: event.data.actividadId };
    this.calendarioEvento.TipoEventoId = event.data.TipoEventoId;

    this.eventoService.post('calendario_evento', this.calendarioEvento).subscribe(
      response => {
        if (this.calendarForProject != '0') {
          this.loadSelects(this.calendarForProject);
        }else {
          this.loadSelects(this.idDetalle);
        }
        this.createActivitiesTable();
        this.popUpManager.showSuccessAlert(this.translate.instant('calendario.actividad_hija_exito'));
        this.loading = false;
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
        this.loading = false;
      },
    );
  }

  downloadFile(id_documento: any) {
    const filesToGet = [
      {
        Id: id_documento,
        key: id_documento,
      },
    ];
    this.nuxeoService.getDocumentoById$(filesToGet, this.documentoService).subscribe(
      response => {
        const filesResponse = <any>response;
        if (Object.keys(filesResponse).length === filesToGet.length) {
          filesToGet.forEach((file: any) => {
            const url = filesResponse[file.Id];
            window.open(url);
          });
        }
      },
      error => {
        this.popUpManager.showErrorToast('ERROR.error_cargar_documento');
      },
    );
  }

  activateTab() {
    this.router.navigate(['../list-calendario-academico'], { relativeTo: this.route });
  }

}
