import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { Subscription } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { Validators, FormControl } from '@angular/forms';
import { TipoDescuento } from '../../../@core/data/models/descuento/tipo_descuento'
import { PopUpManager } from '../../../managers/popUpManager';
import { DescuentoAcademicoService } from '../../../@core/data/descuento_academico.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DescuentoDependencia } from '../../../@core/data/models/descuento/descuento_dependencia';

@Component({
  selector: 'ngx-select-descuento-proyecto',
  templateUrl: './select-descuento-proyecto.component.html',
  styleUrls: ['./select-descuento-proyecto.component.scss'],
})
export class SelectDescuentoProyectoComponent implements OnInit {
  uid: number;
  config: ToasterConfig;
  settings: any;
  Campo2Control = new FormControl('', [Validators.required]);
  source: LocalDataSource = new LocalDataSource();
  administrar_descuentos: boolean = false;
  boton_retornar: boolean = false;
  loading: boolean;

  descuentos = [];
  subscription: Subscription;
  descuento_proyecto = [];

  constructor(private translate: TranslateService,
    private descuentoService: DescuentoAcademicoService,
    private dialogRef: NbDialogRef<SelectDescuentoProyectoComponent>,
    private popUpManager: PopUpManager,
    private toasterService: ToasterService) {
    this.loading = true;
    this.loadData();
    this.loadDataProyecto();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }

  @Input() asDialog: boolean;

  dismissDialog() {
    this.dialogRef.close();
  }

  cargarCampos() {
    this.settings = {
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      actions: {
        edit: false,
        add: false,
        columnTitle: this.translate.instant('GLOBAL.eliminar'),
        position: 'right',
      },
      mode: 'external',
      columns: {
        Nombre: {
          title: this.translate.instant('GLOBAL.nombre'),
          valuePrepareFunction: (value) => {
            return value;
          },
          width: '75%',
        },
        PorcentajeDescuento: {
          title: this.translate.instant('GLOBAL.porcentaje'),
          valuePrepareFunction: (value) => {
            return value;
          },
          width: '5%',
        },
      },
    };
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
  }

  activetab(): void {
    this.administrar_descuentos = !this.administrar_descuentos;
    this.boton_retornar = !this.boton_retornar;
  }

  onChange(event) {
    if (event) {
      this.loadData();
      this.loadDataProyecto();
      this.administrar_descuentos = !this.administrar_descuentos;
    }
  }

  onCreateDescuento(event: any) {
    const descuento = <TipoDescuento>event.value;
    if (!this.descuento_proyecto.find((descuento_registrado: any) => descuento_registrado.Id === descuento.Id) && descuento.Id) {

      const opt: any = {
          title: this.translate.instant('GLOBAL.registrar'),
          text: this.translate.instant('descuento_academico.seguro_continuar_registrar_descuento'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
          showCancelButton: true,
        };

        Swal.fire(opt)
          .then((create) => {
            if (create.value) {
              Swal.fire({
                title: this.translate.instant('descuento_academico.carga_nuevo_descuento'),
                html: `<b></b>`,
                timerProgressBar: true,
                onOpen: () => {
                  Swal.showLoading();
                },
              });

              let content = Swal.getHtmlContainer();
              if (content) {
                const b: any = content.querySelector('b');
                if (b) {
                  b.textContent = this.translate.instant('GLOBAL.carga_recolectando');
                }
              }

              const descuentoNuevo: DescuentoDependencia = new DescuentoDependencia();
              descuentoNuevo.DependenciaId = parseInt(sessionStorage.getItem('ProgramaAcademicoId'), 10);
              descuentoNuevo.PeriodoId = parseInt(sessionStorage.getItem('PeriodoId'), 10);
              descuentoNuevo.PorcentajeDescuento = 0; ////////////////////////////
              descuentoNuevo.Activo = true;
              descuentoNuevo.TipoDescuentoId = descuento;

              content = Swal.getHtmlContainer();
              if (content) {
                const b: any = content.querySelector('b');
                if (b) {
                  b.textContent = this.translate.instant('GLOBAL.carga_guardando');
                }
              }

              this.descuentoService.post('descuentos_dependencia', descuentoNuevo).subscribe(response => {
                Swal.close();
                if (response.Type !== 'error') {

                  const opt1: any = {
                    title: this.translate.instant('GLOBAL.registrar'),
                    text: this.translate.instant('descuento_academico.descuento_creado'),
                    icon: 'success',
                    buttons: true,
                    dangerMode: true,
                    showCancelButton: true,
                  };

                  Swal.fire(opt1).then((willCreate) => {
                    if (willCreate.value) {
                      this.loadDataProyecto();
                    }
                  });

                } else {
                  this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('descuento_academico.descuento_no_creado'));
                }
              }, () => {
                this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('descuento_academico.descuento_no_creado'));
              });
            }
          });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: this.translate.instant('descuento_academico.error_descuento_ya_existe'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  onDeleteDescuento(event: any) {
    const descuento = <TipoDescuento>event.data;

    const opt: any = {
      title: this.translate.instant('GLOBAL.eliminar'),
      text: this.translate.instant('descuento_academico.seguro_continuar_eliminar_descuento'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete) => {

        if (willDelete.value) {
          Swal.fire({
            title: this.translate.instant('descuento_academico.carga_eliminando_descuento'),
            html: `<b></b>`,
            timerProgressBar: true,
            onOpen: () => {
              Swal.showLoading();
            },
          });

          const descuentoModificado: DescuentoDependencia = new DescuentoDependencia();
          descuentoModificado.Id = event.data.IdDescPrograma;
          descuentoModificado.DependenciaId = parseInt(sessionStorage.getItem('ProgramaAcademicoId'), 10);
          descuentoModificado.PeriodoId = parseInt(sessionStorage.getItem('PeriodoId'), 10);
          descuentoModificado.PorcentajeDescuento = 0; ////////////////////////////
          descuentoModificado.Activo = false;
          descuentoModificado.TipoDescuentoId = descuento;

          this.descuentoService.put('descuentos_dependencia', descuentoModificado).subscribe(res => {
            Swal.close()
            if (res.Type !== 'error') {

              const opt1: any = {
                title: this.translate.instant('GLOBAL.eliminar'),
                text: this.translate.instant('descuento_academico.descuento_eliminado'),
                icon: 'success',
                buttons: true,
                dangerMode: true,
                showCancelButton: true,
              };

              Swal.fire(opt1).then((willDelete1) => {
                if (willDelete1.value) {
                  this.loadDataProyecto();
                }
              });

            } else {
              this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('descuento_academico.descuento_no_eliminado'));
            }
          }, () => {
            this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('descuento_academico.descuento_no_eliminado'));
          });
        }
      });
  }

  openListDescuentoComponent() {
    this.administrar_descuentos = true;
    this.boton_retornar = true;
  }

  retorno(event) {
    this.boton_retornar = event;
    this.loadData();
  }

  close() {
    this.dialogRef.close();
  }

  loadData() {
    this.loading = true;
    this.descuentoService.get('tipo_descuento?limit=0&query=Activo:true').subscribe(
      response => {
        response.forEach(descuento => {
          this.descuentos.push(descuento);
          this.loading = false;
        });
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
      },
    );
  }

  loadDataProyecto() {
    this.loading = true;
    this.descuento_proyecto = [];
    this.descuentoService.get('descuentos_dependencia?limit=0&query=Activo:true,DependenciaId:' + sessionStorage.getItem('ProgramaAcademicoId')).subscribe(
      response => {
        response.forEach(descuento => {
          this.loading = true;

          this.loadInfoDescuento(descuento).then(aux => {
            this.descuento_proyecto.push(aux[0]);
            this.source.load(this.descuento_proyecto);
          })
          this.loading = false;
        });
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
      },
    );
  }

  loadInfoDescuento(descuento) {
    return new Promise((resolve, reject) => {
      this.descuentoService.get('tipo_descuento?query=Id:' + descuento.TipoDescuentoId.Id).subscribe(
        descuentoProyecto => {
          const r = <any>descuentoProyecto;
          r[0].IdDescPrograma = descuento.Id
          r[0].PorcentajeDescuento = descuento.PorcentajeDescuento;
          resolve(r);
        },
        (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: type, // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }
}
