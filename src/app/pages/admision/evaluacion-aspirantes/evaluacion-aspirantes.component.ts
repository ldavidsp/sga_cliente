import { Component, OnInit, OnChanges } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UtilidadesService } from '../../../@core/utils/utilidades.service';
import { UserService } from '../../../@core/data/users.service';
import { ProyectoAcademicoService } from '../../../@core/data/proyecto_academico.service' 
import { ParametrosService } from '../../../@core/data/parametros.service';
import { EvaluacionInscripcionService } from '../../../@core/data/evaluacion_inscripcion.service';
import { InscripcionService } from '../../../@core/data/inscripcion.service';
import { TercerosService } from '../../../@core/data/terceros.service';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Inscripcion } from '../../../@core/data/models/inscripcion/inscripcion';
import { TipoCriterio } from '../../../@core/data/models/admision/tipo_criterio';
import { LocalDataSource } from 'ng2-smart-table';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { from } from 'rxjs';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { FormControl, Validators } from '@angular/forms';
import { PopUpManager } from '../../../managers/popUpManager';
import { load } from '@angular/core/src/render3';
import { CheckboxAssistanceComponent } from '../../../@theme/components/checkbox-assistance/checkbox-assistance.component';
import { takeUntil } from 'rxjs/operators';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'evaluacion-aspirantes',
  templateUrl: './evaluacion-aspirantes.component.html',
  styleUrls: ['./evaluacion-aspirantes.component.scss']
})
export class EvaluacionAspirantesComponent implements OnInit {
  toasterService: any;

  @Input('criterios_select')
  set name(inscripcion_id: number) {
    this.inscripcion_id = inscripcion_id;
    if (this.inscripcion_id === 0 || this.inscripcion_id.toString() === '0') {
      this.selectedValue = undefined;
      window.localStorage.setItem('programa', this.selectedValue);
    }
    if (this.inscripcion_id !== undefined && this.inscripcion_id !== 0 && this.inscripcion_id.toString() !== ''
      && this.inscripcion_id.toString() !== '0') {
      // this.getInfoInscripcion();
    }
  }

  @Output() eventChange = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('result') result: EventEmitter<any> = new EventEmitter();

  config: ToasterConfig;
  inscripcion_id: number;
  info_persona_id: number;
  info_ente_id: number;
  estado_inscripcion: number;
  info_info_persona: any;
  usuariowso2: any;
  datos_persona: any;
  inscripcion: Inscripcion;
  preinscripcion: boolean;
  step = 0;
  cambioTab = 0;
  nForms: number;
  SelectedTipoBool: boolean = true;
  info_inscripcion: any;

  percentage_info: number = 0;
  percentage_acad: number = 0;
  percentage_expe: number = 0;
  percentage_proy: number = 0;
  percentage_prod: number = 0;
  percentage_desc: number = 0;
  percentage_docu: number = 0;
  percentage_total: number = 0;

  total: boolean = false;

  percentage_tab_info = [];
  percentage_tab_expe = [];
  percentage_tab_acad = [];
  proyectos = [];
  criterios = [];
  periodos = [];
  show_icfes = false;
  show_profile = false;
  show_expe = false;
  show_acad = false;
  Aspirantes = [];

  save: boolean;
  asistencia: boolean;
  info_persona: boolean;
  loading: boolean;
  ultimo_select: number;
  button_politica: boolean = true;
  programa_seleccionado: any;
  viewtag: any;
  selectedValue: any;
  selectedTipo: any;
  proyectos_selected: any[];
  criterio_selected: any[];
  selectTipoIcfes: any;
  selectTipoEntrevista: any;
  selectTipoPrueba: any;
  selectTipoHojaVida: any;
  selectTabView: any;
  showTab: any;
  tag_view_posg: boolean;
  tag_view_pre: boolean;
  selectprograma: boolean = true;
  selectcriterio: boolean = true;
  imagenes: any;
  periodo: any;
  nivel_load: any;
  selectednivel: any;
  tipo_criterio: TipoCriterio;
  dataSource: LocalDataSource;
  settings: any;

  CampoControl = new FormControl('', [Validators.required]);
  Campo1Control = new FormControl('', [Validators.required]);
  Campo2Control = new FormControl('', [Validators.required]);

  constructor( 
    private translate: TranslateService,
    private userService: UserService,
    private parametrosService: ParametrosService,
    private projectService: ProyectoAcademicoService,
    private evaluacionService: EvaluacionInscripcionService,
    private tercerosService: TercerosService,
    private sgaMidService: SgaMidService,
    private popUpManager: PopUpManager,
    private inscripcionService: InscripcionService,) {
    this.translate = translate;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {});
    this.total = true;
    this.save = true;
    this.selectTipoIcfes = false;
    this.selectTipoEntrevista = false;
    this.selectTipoPrueba = false;
    this.selectTipoHojaVida = false;
    this.showTab = true;
    this.dataSource = new LocalDataSource();
    this.loadData();
    this.loadCriterios();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.createTable();
    });
  }


  activateTab() {
    this.showTab = true;
  }

  async loadData() {
    try {
      this.info_persona_id = this.userService.getPersonaId();
      await this.cargarPeriodo();
      await this.loadLevel();
    } catch (error) {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('inscripcion.error_cargar_informacion'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  cargarPeriodo() {
    return new Promise((resolve, reject) => {
      this.parametrosService.get('periodo/?query=Activo:true,CodigoAbreviacion:PA&sortby=Id&order=desc&limit=1')
        .subscribe(res => {
          const r = <any>res;
          if (res !== null && r.Status === '200') {
            this.periodo = <any>res['Data'][0];
            window.localStorage.setItem('IdPeriodo', String(this.periodo['Id']));
            resolve(this.periodo);
            const periodos = <any[]>res['Data'];
            periodos.forEach(element => {
              this.periodos.push(element);
            });
          }
        },
          (error: HttpErrorResponse) => {
            reject(error);
          });
    });
  }

  loadLevel(){
    this.projectService.get('nivel_formacion?limit=2').subscribe(
      (response: any) => {
        if (response !== null || response !== undefined){
          this.nivel_load = <any>response;
        }
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
        this.loading = false;
      },
    );
  }

  loadProyectos() {
    this.selectprograma = false;
    this.projectService.get('proyecto_academico_institucion?query=NivelFormacionId:'+Number(this.selectednivel)+'&limit=0').subscribe(
      (response: any) => {
        if (response !== null || response !== undefined){
          this.proyectos = <any>response;
        }
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('ERROR.general'));
        this.loading = false;
      },
    );
  }

  loadCriterios() {
    
    this.evaluacionService.get('requisito?limit=0&query=Activo:true&sortby=Id&order=asc').subscribe(
      (response: any) => {
        if (response !== null || response !== undefined){
          this.criterios = <any>response.filter(c => c['RequisitoPadreId'] === null);
        }
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
      }
    );
  }

  async createTable(){
    var data: any;
    const IdCriterio = sessionStorage.getItem('tipo_criterio')
    await this.loadColumn(IdCriterio).then(
      response => {
        data = response; 
      }
    )
    this.settings = {
      columns: data,
      actions: {
        edit: true,
        add: false,
        delete: false,
        position: 'right',
        columnTitle: this.translate.instant('GLOBAL.acciones'),
        width: '5%'
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark-circle"></i>',
        cancelButtonContent: '<i class="nb-close-circled"></i>',
      },
    }
  }

  async activeCriterios() {
    this.selectcriterio = false;
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  guardarEvaluacion(){
    var Evaluacion: any = {};
    Evaluacion.Aspirantes = this.Aspirantes;
    Evaluacion.PeriodoId = this.periodo.Id;
    Evaluacion.ProgramaId = this.proyectos_selected;
    Evaluacion.CriterioId = sessionStorage.getItem('tipo_criterio');
    this.sgaMidService.post('admision/registrar_evaluacion', Evaluacion).subscribe(
      (response: any) => {
        if (response.Response.Code == "200"){
          this.popUpManager.showSuccessAlert(this.translate.instant('admision.registro_exito'));
        } else {
          this.popUpManager.showErrorToast(this.translate.instant('admision.registro_error'));
        }
      }, 
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
      }
    );
  }

  async perfil_editar(event) {
    this.save = true;
    this.tipo_criterio = new TipoCriterio();
    this.tipo_criterio.Periodo = this.periodo.Nombre;
    var proyecto;
    for (var i = 0; i < this.proyectos.length; i++){
      if (this.proyectos_selected === this.proyectos[i].Id){
        proyecto = this.proyectos[i].Nombre;
      }
    }
    this.tipo_criterio.ProgramaAcademico = proyecto; 
    switch (event) {
      case 'info_icfes':
        this.tipo_criterio.Nombre = this.criterios[0].Nombre;
        sessionStorage.setItem('tipo_criterio', '1');
        this.ngOnChanges();
        await this.loadAspirantes();
        await this.loadInfo(1);
        await this.createTable();
        this.selectTipoIcfes = true;
        this.showTab = false;
        break;
      case 'info_entrevista':
        this.tipo_criterio.Nombre = this.criterios[1].Nombre;
        sessionStorage.setItem('tipo_criterio', '2');
        this.ngOnChanges();
        await this.loadAspirantes();
        await this.loadInfo(2);
        await this.createTable();
        this.selectTipoEntrevista = true;
        this.showTab = false;
        break;
      case 'info_prueba':
        this.tipo_criterio.Nombre = this.criterios[2].Nombre;
        sessionStorage.setItem('tipo_criterio', '3');
        this.ngOnChanges();
        await this.loadAspirantes();
        await this.loadInfo(3);
        await this.createTable();
        this.selectTipoPrueba = true;
        this.showTab = false;
        break;
      case 'info_hoja':
        this.tipo_criterio.Nombre = this.criterios[3].Nombre;
        sessionStorage.setItem('tipo_criterio', '11');
        this.ngOnChanges();
        await this.loadAspirantes();
        await this.loadInfo(11);
        await this.createTable();
        this.selectTipoHojaVida = true;
        this.showTab = false;
        break;
      default:
        this.show_icfes = false;
        break;
    }
  }

  loadAspirantes(){
    this.inscripcionService.get('inscripcion?query=EstadoInscripcionId__Id:5,ProgramaAcademicoId:'+this.proyectos_selected+',PeriodoId:'+this.periodo.Id+'&sortby=Id&order=asc').subscribe(
      (response: any) => {
        if (response !== '[{}]') {
          const data = <Array<any>>response;
          data.forEach(element => {  
            if (element.PersonaId != undefined) {
              this.tercerosService.get('tercero/'+element.PersonaId).subscribe(
                (res: any) => {
                  var aspiranteAux = {
                    Id: res.Id,
                    Aspirantes: res.NombreCompleto,
                    Asistencia: false
                  }
                  this.Aspirantes.push(aspiranteAux);
                  this.dataSource.load(this.Aspirantes);
                }, 
                error => {
                  this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
                }
              );
            }                
          });
        } else {
          this.popUpManager.showErrorToast(this.translate.instant('admision.no_data'));
        }
      },
      error => {
        this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
      }
    );
  }

  loadInfo(IdCriterio: number){
    return new Promise((resolve, reject) => {
      this.sgaMidService.get('admision/consultar_evaluacion/'+this.proyectos_selected+'/'+this.periodo.Id+'/'+IdCriterio).subscribe(
        (response: any) => {
          if (response.Response.Code === "200"){
            const data = <Array<any>>response.Response.Body[0].areas;
            this.dataSource.load(data)
            this.save = false;
            resolve(data)
          } else if (response.Response.Code === "404"){
            this.dataSource.load([]);
            resolve(response)
          } else {
            this.popUpManager.showErrorToast(this.translate.instant('admision.error'));
            this.dataSource.load([]);
            resolve("error")  
          }
        }, 
        error => {
          this.popUpManager.showErrorToast(this.translate.instant('admision.error'));
          reject(error)
        }
      );
    });
  }

  itemSelect(event): void{    
    if (this.asistencia != undefined){
      event.data.Asistencia = this.asistencia;
    }
  }

  loadColumn(IdCriterio: any){
    return new Promise((resolve, reject) => {
      this.evaluacionService.get('requisito?query=RequisitoPadreId:'+IdCriterio+'&limit=0').subscribe(
        (response: any) => {
          this.evaluacionService.get('requisito/'+IdCriterio).subscribe(
            async (res: any) => {
              var data: any = {};
              var porcentaje: any;

                  //Columna de aspirantes
                  data.Aspirantes = {
                    title: this.translate.instant('admision.aspirante'),
                    editable: false,
                    filter: false,
                    width: '55%',
                    valuePrepareFunction: (value) => {
                      return value;
                    }
                  }

                  //Columna de asistencia si lo requiere
                  if (res.Asistencia === true){
                    data.Asistencia = {
                      title: this.translate.instant('admision.asistencia'),
                      editable: false,
                      filter: false,
                      width: '4%',
                      type: 'custom',
                      renderComponent: CheckboxAssistanceComponent,
                      onComponentInitFunction: (instance) => {
                        instance.save.subscribe(data => {
                          //sessionStorage.setItem('EstadoInscripcion', data);     
                          this.asistencia = data;
                        });
                      }                                     
                    }
                  }
          
                  if (response.length > 1){
                    await this.getPercentageSub(IdCriterio).then(
                      res => {
                        porcentaje = res;
                      }
                    )

                    for (var key in porcentaje.areas){
                      for (var key2 in porcentaje.areas[key]){
                        for (var i = 0; i < response.length; i++){    
                          if (key2 == response[i].Nombre){
                            data[response[i].Nombre] = {
                              title: response[i].Nombre + ' (' + porcentaje.areas[key][key2] + '%)', 
                              editable: true,
                              filter: false,      
                              valuePrepareFunction: (value) => {
                                return value;
                              }
                            }
                            break;
                          }
                        }
                      }
                    } 
                    
                  } else {
                    data.Puntuacion = {
                      title: 'Puntaje',
                      //editable: true,
                      filter: false,
                      width: '35%',
                      valuePrepareFunction: (value) => {
                        return value;
                      }
                    }
                  }
                  resolve(data)
            }, 
            error => {
              this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
              reject(error)
            }
          );
        },
        error => {
          this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
          reject(error)
        }
      );

    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.dataSource.load([]);
    this.Aspirantes = [];
    for (var i = 0; i < this.Aspirantes.length; i++){
      this.Aspirantes[i].Asistencia = false;
    }
  }

  getPercentageSub(IdCriterio: any){
    return new Promise((resolve, reject) => {
      this.evaluacionService.get('requisito_programa_academico?query=ProgramaAcademicoId:'+this.proyectos_selected+',PeriodoId:'+this.periodo.Id+',RequisitoId:'+IdCriterio).subscribe(
        (Res: any) => {
          var porcentaje = JSON.parse(Res[0].PorcentajeEspecifico)
          resolve(porcentaje)
                                 
        }, 
        error => {
          this.popUpManager.showErrorToast(this.translate.instant('admision.error_cargar'));
          reject(error)
        }
      );
    });
  }

  viewtab() {
    this.selectTipoIcfes = false;
    this.selectTipoEntrevista = false;
    this.selectTipoPrueba = false;
    this.selectTipoHojaVida = false;

    for (let i = 0; i < this.criterio_selected.length; i++) {
      switch (this.criterio_selected[i]) {
        case 1:
          this.selectTipoIcfes = true;
          break;
        case 2:
          this.selectTipoEntrevista = true;
          break;
        case 3:
          this.selectTipoPrueba = true;
          break;
        case 11:
          this.selectTipoHojaVida = true;
          break;
        default:
          this.selectTipoIcfes = false;
          this.selectTipoEntrevista = false;
          this.selectTipoPrueba = false;
          this.selectTipoHojaVida = false;
          break;
      }
    }
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