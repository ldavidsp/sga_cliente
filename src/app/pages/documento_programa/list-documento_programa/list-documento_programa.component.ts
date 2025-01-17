import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PopUpManager } from '../../../managers/popUpManager';
import { NuxeoService } from '../../../@core/utils/nuxeo.service';
import { DocumentoService } from '../../../@core/data/documento.service';
import { InscripcionService } from '../../../@core/data/inscripcion.service';
import { SoporteDocumentoAux } from '../../../@core/data/models/documento/soporte_documento_aux';
import { Documento } from '../../../@core/data/models/documento/documento';

@Component({
  selector: 'ngx-list-documento-programa',
  templateUrl: './list-documento_programa.component.html',
  styleUrls: ['./list-documento_programa.component.scss'],
})
export class ListDocumentoProgramaComponent implements OnInit {
  uid: number;
  persona: number;
  programa: number;
  periodo: number;
  inscripcion: number;
  cambiotab: boolean = false;
  contador: number;
  settings: any;
  tipo_documentos: any[];
  data: any;
  info_data: any;
  programaDocumento: any;
  tipoProgramaDocumento: any;
  soporteDocumento: SoporteDocumentoAux[];
  soporteId: number;
  source: LocalDataSource = new LocalDataSource();
  estadoObservacion: string = '';
  observacion: string = '';

  @Input('persona_id')
  set info(info: number) {
    this.persona = info;
  }

  @Input('inscripcion_id')
  set info2(info2: number) {
    this.inscripcion = info2;
    if (this.inscripcion !== undefined && this.inscripcion !== null && this.inscripcion !== 0 &&
      this.inscripcion.toString() !== '') {

    }
  }

  @Output() eventChange = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('result') result: EventEmitter<any> = new EventEmitter();

  loading: boolean;
  percentage: number;

  constructor(
    private translate: TranslateService,
    private nuxeoService: NuxeoService,
    private documentoService: DocumentoService,
    private inscripcionService: InscripcionService,
    private popUpManager: PopUpManager,
  ) {
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
    this.loading = false;
    this.percentage = 0;
  }

  cargarCampos() {
    this.settings = {
      columns: {
        TipoDocumento: {
          title: this.translate.instant('GLOBAL.tipo_documento_programa'),
          width: '30%',
          editable: false,
        },
        EstadoObservacion: {
          title: this.translate.instant('admision.estado'),
          width: '10%',
          editable: false,
        },
        Observacion: {
          title: this.translate.instant('admision.observacion'),
          width: '60%',
          editable: false,
        },
      },
      mode: 'external',
      hideSubHeader: true,
      actions: {
        position: 'right',
        columnTitle: this.translate.instant('GLOBAL.acciones'),
        add: false,
        edit: false,
        delete: false,
        custom: [
          {
            name: 'open',
            title: '<i class="nb-compose" title="' + this.translate.instant('GLOBAL.tooltip_ver_registro') + '"></i>',
          },
          {
            name: 'edit',
            title: '<i class="nb-edit" title="' + this.translate.instant('GLOBAL.tooltip_editar_registro') + '"></i>',
          },
        ],
      },
    };
  }

  async loadData() {
    this.loading = true;
    this.soporteDocumento = [];
    this.percentage = 0;
    this.inscripcionService.get('soporte_documento_programa?query=InscripcionId.Id:' +
      this.inscripcion + ',DocumentoProgramaId.ProgramaId:' + this.programa).subscribe(
        (response: any[]) => {
          console.info(Object.keys(response[0]).length)
          if (Object.keys(response[0]).length > 0) {
            response.forEach(async soporte => {
              const documento: SoporteDocumentoAux = new SoporteDocumentoAux();
              documento.TipoDocumentoId = soporte['DocumentoProgramaId']['TipoDocumentoProgramaId']['Id'];
              documento.TipoDocumento = soporte['DocumentoProgramaId']['TipoDocumentoProgramaId']['Nombre'];
              documento.DocumentoId = soporte['DocumentoId'];
              documento.SoporteDocumentoId = soporte['Id'];
              await this.cargarEstadoDocumento(documento);
              documento.EstadoObservacion = this.estadoObservacion;
              documento.Observacion = this.observacion;
              this.soporteDocumento.push(documento);
              this.source.load(this.soporteDocumento);
              if (documento.EstadoObservacion !== 'No aprobado') {
                this.getPercentage(1 / this.tipo_documentos.length);
              }
            });
          } else {
            this.popUpManager.showAlert(this.translate.instant('GLOBAL.info'), this.translate.instant('documento_programa.no_documentos'));
          }
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.popUpManager.showErrorToast(this.translate.instant('ERROR.' + error.status));
        },
      );
  }

  cargarEstadoDocumento(documento: SoporteDocumentoAux) {
    return new Promise((resolve) => {
      this.documentoService.get('documento/' + documento.DocumentoId).subscribe(
        (doc: Documento) => {
          if (doc.Metadatos == '') {
            this.estadoObservacion = '';
            this.observacion = '';
          } else {
            if (doc.Metadatos !== '') {
              const metadatos = JSON.parse(doc.Metadatos);
              if (metadatos.aprobado) {
                this.estadoObservacion = 'Aprobado';
                this.observacion = '';
              } else {
                this.estadoObservacion = 'No aprobado';
                this.observacion = metadatos.observacion;
              }
            }
          }
          resolve(this.estadoObservacion)
        });
    });

  }

  ngOnInit() {
    this.uid = 0;
    this.soporteDocumento = [];
    this.inscripcion = parseInt(sessionStorage.getItem('IdInscripcion'), 10);
    this.programa = parseInt(sessionStorage.getItem('ProgramaAcademicoId'), 10)
    if (this.inscripcion !== undefined && this.inscripcion !== null && this.inscripcion !== 0 &&
      this.inscripcion.toString() !== '') {
      this.loadData();
    }
    this.loadLists();
  }

  public loadLists() {
    this.inscripcionService.get('documento_programa?query=Activo:true,ProgramaId:' + this.programa).subscribe(
      response => {
        this.tipo_documentos = <any[]>response;
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
      },
    );
  }

  onOpen(event) {
    const filesToGet = [
      {
        Id: event.data.DocumentoId,
        key: event.data.DocumentoId,
      },
    ];
    this.nuxeoService.getDocumentoById$(filesToGet, this.documentoService)
      .subscribe(response => {
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

  onEdit(event): void {
    this.uid = event.data.TipoDocumentoId;
    this.soporteId = event.data.SoporteDocumentoId;
  }

  onAction(event): void {
    switch (event.action) {
      case 'open':
        this.onOpen(event);
        break;
      case 'edit':
        this.onEdit(event);
        break;
    }
  }

  onChange(event) {
    if (event === true) {
      this.uid = 0;
      this.loadData();
    } /*else {
      // this.getPercentage(this.soporteDocumento.length / event)
      this.getPercentage(event)
    }*/
  }

  getPercentage(event) {
    if (event !== undefined) {
      this.percentage += event;
    }
    this.result.emit(this.percentage);
  }

}
