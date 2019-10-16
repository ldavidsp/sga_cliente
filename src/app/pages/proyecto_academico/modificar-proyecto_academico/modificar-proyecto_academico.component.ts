import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OikosService } from '../../../@core/data/oikos.service';
import { CoreService } from '../../../@core/data/core.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {ProyectoAcademicoPost} from '../../../@core/data/models/proyecto_academico/proyecto_academico_post'
import Swal from 'sweetalert2';
import 'style-loader!angular2-toaster/toaster.css';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { UnidadTiempoService } from '../../../@core/data/unidad_tiempo.service';
import { ProyectoAcademicoInstitucion } from '../../../@core/data/models/proyecto_academico/proyecto_academico_institucion';
import { TipoTitulacion } from '../../../@core/data/models/proyecto_academico/tipo_titulacion';
import { Metodologia } from '../../../@core/data/models/proyecto_academico/metodologia';
import { NivelFormacion } from '../../../@core/data/models/proyecto_academico/nivel_formacion';
import { RegistroCalificadoAcreditacion } from '../../../@core/data/models/proyecto_academico/registro_calificado_acreditacion';
import { TipoRegistro } from '../../../@core/data/models/proyecto_academico/tipo_registro';
import { ProyectoAcademicoService } from '../../../@core/data/proyecto_academico.service';
import { InstitucionEnfasis } from '../../../@core/data/models/proyecto_academico/institucion_enfasis';
import { Enfasis } from '../../../@core/data/models/proyecto_academico/enfasis';
import { Titulacion } from '../../../@core/data/models/proyecto_academico/titulacion';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TipoDependencia } from '../../../@core/data/models/oikos/tipo_dependencia';
import { DependenciaTipoDependencia } from '../../../@core/data/models/oikos/dependencia_tipo_dependencia';
import { Dependencia } from '../../../@core/data/models/oikos/dependencia';
import { SgaMidService } from '../../../@core/data/sga_mid.service';
import * as moment from 'moment';
import { Inject } from '@angular/core';
import * as momentTimezone from 'moment-timezone';
import { InformacionBasicaPut } from '../../../@core/data/models/proyecto_academico/informacion_basica_put';
import { RegistroPut } from '../../../@core/data/models/proyecto_academico/registro_put';
import { PersonaService } from '../../../@core/data/persona.service';
import { Persona } from '../../../@core/data/models/persona';
import { Coordinador } from '../../../@core/data/models/proyecto_academico/coordinador';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'ngx-modificar-proyecto-academico',
  templateUrl: './modificar-proyecto_academico.component.html',
  styleUrls: ['./modificar-proyecto_academico.component.scss'],
  })
export class ModificarProyectoAcademicoComponent implements OnInit {
  config: ToasterConfig;
  settings: any;
  basicform: any;
  resoluform: any;
  resolualtaform: any;
  actoform: any;
  compleform: any;
  coordinador: any;
  facultad = [];
  area = [];
  opcionSeleccionadoFacultad: any;
  opcionSeleccionadoUnidad: any;
  opcionSeleccionadoArea: any;
  opcionSeleccionadoNucleo: any;
  opcionSeleccionadoEnfasis: any;
  opcionSeleccionadoNivel: any;
  opcionSeleccionadoMeto: any;
  checkenfasis: boolean = false;
  checkciclos: boolean = false;
  checkalta: boolean = false;
  checkofrece: boolean = false;
  nucleo = [];
  unidad= [];
  enfasis = [];
  nivel = [];
  metodo = [];
  fecha_creacion_calificado: Date;
  fecha_creacion_alta: Date;
  fecha_inicio_coordinador: Date;
  fecha_creacion_cordin: Date;
  fecha_vencimiento: string;
  fecha_vencimiento_alta: string;
  fecha_vigencia: string;
  check_alta_calidad: boolean ;
  fecha_calculada_vencimiento: string;
  fecha_vencimiento_mostrar: string;
  fecha_creacion: Date;
  proyecto_academicoPost: ProyectoAcademicoPost;
  informacion_basicaPut: InformacionBasicaPut;
  registro_put: RegistroPut;
  proyecto_academico: ProyectoAcademicoInstitucion;
  tipo_titulacion: TipoTitulacion;
  metodologia: Metodologia;
  nivel_formacion: NivelFormacion;
  registro_califacado_acreditacion: RegistroCalificadoAcreditacion;
  registro_califacado_alta_calidad: RegistroCalificadoAcreditacion;
  tipo_registro: TipoRegistro;
  enfasis_proyecto: InstitucionEnfasis;
  coordinador_data: Coordinador;
  coordinadorSeleccionado: Persona;
  enfasis_basico: Enfasis;
  titulacion_proyecto_snies: Titulacion;
  titulacion_proyecto_mujer: Titulacion;
  titulacion_proyecto_hombre: Titulacion;
  tipo_dependencia: TipoDependencia;
  dependencia_tipo_dependencia: DependenciaTipoDependencia;
  dependencia: Dependencia;
  personas: Array<Persona>;
  creandoAutor: boolean= true;


  CampoControl = new FormControl('', [Validators.required]);
  Campo1Control = new FormControl('', [Validators.required]);
  Campo2Control = new FormControl('', [Validators.required]);
  Campo3Control = new FormControl('', [Validators.required]);
  Campo4Control = new FormControl('', [Validators.required]);
  Campo5Control = new FormControl('', [Validators.required]);
  Campo6Control = new FormControl('', [Validators.required]);
  Campo7Control = new FormControl('', [Validators.required]);
  Campo8Control = new FormControl('', [Validators.required]);
  Campo9Control = new FormControl('', [Validators.required]);
  Campo10Control = new FormControl('', [Validators.required]);
  Campo11Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo12Control = new FormControl('', [Validators.required]);
  Campo13Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo14Control = new FormControl('', [Validators.required]);
  Campo16Control = new FormControl('', [Validators.required]);
  Campo17Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo18Control = new FormControl('', [Validators.required]);
  Campo19Control = new FormControl('', [Validators.required]);
  Campo20Control = new FormControl('', [Validators.required]);
  Campo21Control = new FormControl('', [Validators.required]);
  Campo22Control = new FormControl('', [Validators.required, Validators.maxLength(2)]);
  Campo23Control = new FormControl('', [Validators.required, Validators.maxLength(1)]);
  CampoCorreoControl = new FormControl('', [Validators.required, Validators.email]);
  CampoCreditosControl = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo24Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo25Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo26Control = new FormControl('', [Validators.required]);
  Campo28Control = new FormControl('', [Validators.required, Validators.maxLength(1)]);
  Campo27Control = new FormControl('', [Validators.required, Validators.maxLength(2)]);
  Campo29Control = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  @Output() eventChange = new EventEmitter();

  source_emphasys: LocalDataSource = new LocalDataSource();
  arr_enfasis_proyecto: any[] = [];
  settings_emphasys: any;

  dpDayPickerConfig: any = {
    locale: 'es',
    format: 'YYYY-MM-DD HH:mm',
    showTwentyFourHours: false,
    showSeconds: false,
    returnedValueType: 'String',
    // appendTo: document.body,
  }

  constructor(private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModificarProyectoAcademicoComponent>,
    private toasterService: ToasterService,
    private oikosService: OikosService,
    private personaService: PersonaService,
    private coreService: CoreService,
    private proyectoacademicoService: ProyectoAcademicoService,
    private sgamidService: SgaMidService,
    private routerService: Router,
    private unidadtiempoService: UnidadTiempoService,
    private formBuilder: FormBuilder) {
      this.basicform = this.formBuilder.group({
        codigo_snies: ['', Validators.required],
        facultad: ['', Validators.required],
        nivel_proyecto: ['', Validators.required],
        metodologia_proyecto: ['', Validators.required],
        nombre_proyecto: ['', Validators.required],
        abreviacion_proyecto: ['', [Validators.required, Validators.maxLength(20)]],
        correo_proyecto: ['', [Validators.required, Validators.email]],
        numero_proyecto: ['', Validators.required],
        creditos_proyecto: ['', [Validators.required, Validators.maxLength(4), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
        duracion_proyecto: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
        tipo_duracion_proyecto: ['', Validators.required],
        ciclos_proyecto: ['', Validators.required],
        ofrece_proyecto: ['', Validators.required],
        // enfasis_proyecto: ['', Validators.required],
     })

     this.resoluform = formBuilder.group({
      resolucion: ['', Validators.required],
      ano_resolucion: ['', [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ['', Validators.required],
      mes_vigencia: ['', [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ['', [Validators.required, Validators.maxLength(1)]],
     })
     this.resolualtaform = formBuilder.group({
      resolucion: ['', Validators.required],
      ano_resolucion: ['', [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ['', Validators.required],
      mes_vigencia: ['', [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ['', [Validators.required, Validators.maxLength(1)]],
     })
     this.actoform = formBuilder.group({
      acto: ['', Validators.required],
      ano_acto: ['', [Validators.required, Validators.maxLength(4)]],
     })
     this.compleform = formBuilder.group({
       titulacion_snies: ['', Validators.required],
       titulacion_mujer: ['', Validators.required],
       titulacion_hombre: ['', Validators.required],
       competencias: ['', Validators.required],
     });
     this.coordinador = formBuilder.group({
      fecha_creacion_coordinador: ['', Validators.required],
     })
    this.loadfacultad();
   this.loadnivel();
   this.loadmetodologia();
   this.loadunidadtiempo();
   this.loadarea();
   this.loadnucleo();
   this. loadpersonas();
   this.loadenfasis();
   this.loadfechacoordinador();
   this.checkofrece = Boolean(JSON.parse(this.data.oferta_check));
   this.checkciclos = Boolean(JSON.parse(this.data.ciclos_check));
   this.fecha_creacion_calificado = momentTimezone.tz(this.data.fecha_creacion_registro[0], 'America/Bogota').format('YYYY-MM-DDTHH:mm');
   this.checkalta =  Boolean(JSON.parse(this.data.tieneregistroaltacalidad));
   this.fecha_creacion_alta = momentTimezone.tz(this.data.fecha_creacion_registro_alta[0], 'America/Bogota').format('YYYY-MM-DDTHH:mm');
   // enfasis
   this.arr_enfasis_proyecto = this.data.enfasis;
   this.source_emphasys.load(this.arr_enfasis_proyecto);

  this.settings_emphasys = {
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      edit: false,
      add: false,
      position: 'right',
    },
    hideSubHeader: true,
    mode: 'external',
    columns: {
      EnfasisId: {
        title: this.translate.instant('GLOBAL.nombre'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          return value.Nombre;
        },
        width: '60%',
      },
      Activo: {
        title: this.translate.instant('GLOBAL.activo'),
        // type: 'string;',
        valuePrepareFunction: (value) => {
          return value ? translate.instant('GLOBAL.si') : translate.instant('GLOBAL.no');
        },
        width: '20%',
      },
    },
  };

    }

    loadfechacoordinador() {
      if (this.data.fechainiciocoordinador == null) {
        this.fecha_creacion_calificado = null
      }else {
        this.fecha_creacion_cordin = momentTimezone.tz(this.data.fechainiciocoordinador, 'America/Bogota').format('YYYY-MM-DD HH:mm');
      }
    }

    loadenfasis() {
      this.proyectoacademicoService.get('enfasis')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.enfasis = <any>res;
        }
      },
      (error: HttpErrorResponse) => {
        Swal({
          type: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
    }

    onCreateEmphasys(event: any) {
      const emphasys = event.value;
      if (!this.arr_enfasis_proyecto.find((enfasis: any) => emphasys.Id === enfasis.EnfasisId.Id ) && emphasys.Id) {
        const enfasis_temporal: any = {};
        enfasis_temporal.Activo = true;
        enfasis_temporal.EnfasisId = emphasys;
        enfasis_temporal.ProyectoAcademicoInstitucionId = this.data.proyectoJson;
        enfasis_temporal.esNuevo = true;
        this.arr_enfasis_proyecto.push(enfasis_temporal);
        this.source_emphasys.load(this.arr_enfasis_proyecto);
      } else {
        Swal({
          type: 'error',
          title: 'ERROR',
          text: this.translate.instant('enfasis.error_enfasis_ya_existe'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      }
      const matSelect: MatSelect = event.source;
      matSelect.writeValue(null);
    }

    onDeleteEmphasys(event: any) {
      const findInArray = (value, array, attr) => {
        for (let i = 0; i < array.length; i += 1) {
          if (array[i]['EnfasisId'][attr] === value) {
              return i;
          }
        }
        return -1;
      }
      const to_delete = this.arr_enfasis_proyecto[findInArray(event.data.EnfasisId.Id, this.arr_enfasis_proyecto, 'Id')];
      if (to_delete.esNuevo) {
        this.arr_enfasis_proyecto.splice(findInArray(event.data.EnfasisId.Id, this.arr_enfasis_proyecto, 'Id'), 1);
      } else {
        to_delete.Activo = !to_delete.Activo;
      }
      this.source_emphasys.load(this.arr_enfasis_proyecto);
    }

  useLanguage(language: string) {
    this.translate.use(language);
  }
  onclick(): void {
    this.dialogRef.close();
  }

  cloneProject(project: any): void {
    this.routerService.navigateByUrl(`pages/proyecto_academico/crud-proyecto_academico/${project.Id}`);
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  getFullAuthorName(p: Persona): string {
    return p.PrimerNombre + ' ' + p.SegundoNombre + ' ' + p.PrimerApellido + ' ' + p.SegundoApellido;
  }

  loadpersonas(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.personaService.get('persona/?limit=0')
        .subscribe(res => {
          // if (res !== null) {
          if (Object.keys(res[0]).length > 0) {
            this.personas = <Array<Persona>>res;
            this.personas.forEach( (persona: Persona) => {
              persona['Nombre'] = this.getFullAuthorName(persona);
              if (persona.Id === Number(this.data.idcoordinador)) {
                this.coordinadorSeleccionado = persona;
              }
            });
            resolve(true);
          } else {
            this.personas = [];
            reject({status: 404});
          }
        }, (error: HttpErrorResponse) => {
          reject(error);
        });
    });
  }


   calculateEndDate (date: Date, years: number, months: number, days: number): Date {
    const convertDate = moment(date).add(years, 'year').add(months, 'month').add(days, 'day').format('YYYY-MM-DDTHH:mm:ss');
    this.fecha_vencimiento = convertDate
    return new Date(convertDate);
  }

  calculateEndDateAlta (date: Date, years: number, months: number, days: number): Date {
    const convertDate = moment(date).add(years, 'year').add(months, 'month').add(days, 'day').format('YYYY-MM-DDTHH:mm:ss');
    this.fecha_vencimiento_alta = convertDate
    return new Date(convertDate);
  }
  loadfacultad() {
    this.oikosService.get('dependencia_tipo_dependencia/?query=TipoDependenciaId:2')
    .subscribe((res: any) => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.facultad = res.map((data: any) => (data.DependenciaId));
        this.facultad.forEach((fac: any ) => {
          if (fac.Id === Number(this.data.idfacultad)) {
            this.opcionSeleccionadoFacultad = fac;
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }

  loadnivel() {
    this.proyectoacademicoService.get('nivel_formacion')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.nivel = <any>res;
        this.nivel.forEach((niv: any ) => {
          if (niv.Id === Number(this.data.idnivel)) {
            this.opcionSeleccionadoNivel = niv;
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }
  loadmetodologia() {
    this.proyectoacademicoService.get('metodologia')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.metodo = <any>res;
        this.metodo.forEach((met: any ) => {
          if (met.Id === Number(this.data.idmetodo)) {
            this.opcionSeleccionadoMeto = met;
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }
  loadunidadtiempo() {
    this.unidadtiempoService.get('unidad_tiempo')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.unidad = <any>res;
        this.unidad.forEach((uni: any ) => {
          if (uni.Id === Number(this.data.idunidad)) {
            this.opcionSeleccionadoUnidad = uni;
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }
  loadarea() {
    this.coreService.get('area_conocimiento')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.area = <any>res;
        this.area.forEach((are: any ) => {
          if (are.Id === Number(this.data.idarea)) {
            this.opcionSeleccionadoArea = are;
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }

  loadnucleo() {
    this.coreService.get('nucleo_basico_conocimiento')
    .subscribe(res => {
      const r = <any>res;
      if (res !== null && r.Type !== 'error') {
        this.nucleo = <any>res;
        this.nucleo.forEach((nuc: any ) => {
          if (nuc.Id === Number(this.data.idnucleo)) {
            this.opcionSeleccionadoNucleo = nuc;
          }
        });
      }
    },
    (error: HttpErrorResponse) => {
      Swal({
        type: 'error',
        title: error.status + '',
        text: this.translate.instant('ERROR.' + error.status),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    });
  }

  putinformacionbasica() {
    if ( this.compleform.valid && this.basicform.valid) {
    this.metodologia = {
      Id: this.opcionSeleccionadoMeto['Id'],
    }
    this.nivel_formacion = {
      Id: this.opcionSeleccionadoNivel['Id'],
    }
    this.proyecto_academico = {
      Id : Number(this.data.idproyecto) ,
      Codigo : '0',
      Nombre : String(this.basicform.value.nombre_proyecto),
      CodigoSnies: String(this.basicform.value.codigo_snies),
      Duracion: Number(this.basicform.value.duracion_proyecto),
      NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
      CorreoElectronico: String(this.basicform.value.correo_proyecto),
      CiclosPropedeuticos: this.checkciclos,
      NumeroActoAdministrativo: Number(this.actoform.value.acto),
      EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
      Competencias: String(this.compleform.value.competencias),
      CodigoAbreviacion: String(this.basicform.value.abreviacion_proyecto),
      Activo: true,
      Oferta: this.checkofrece,
      UnidadTiempoId: this.opcionSeleccionadoUnidad['Id'],
      AnoActoAdministrativoId: String(this.actoform.value.ano_acto),
      DependenciaId: this.opcionSeleccionadoFacultad['Id'],
      AreaConocimientoId: this.opcionSeleccionadoArea['Id'],
      NucleoBaseId: this.opcionSeleccionadoNucleo['Id'],
      MetodologiaId: this.metodologia,
      NivelFormacionId: this.nivel_formacion,
      AnoActoAdministrativo: String(this.actoform.value.ano_acto),

    }

    this.titulacion_proyecto_snies = {
      Id: 0,
      Nombre: String(this.compleform.value.titulacion_snies),
      Activo: true,
      TipoTitulacionId: this.tipo_titulacion = {
        Id: 1,
      },
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
    }
    this.titulacion_proyecto_mujer = {
      Id: 0,
      Nombre: String(this.compleform.value.titulacion_mujer),
      Activo: true,
      TipoTitulacionId: this.tipo_titulacion = {
        Id: 3,
      },
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
    }
    this.titulacion_proyecto_hombre = {
      Id: 0,
      Nombre: String(this.compleform.value.titulacion_hombre),
      Activo: true,
      TipoTitulacionId: this.tipo_titulacion = {
        Id: 2,
      },
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
    }
    const informacion_basicaPut = {
      ProyectoAcademicoInstitucion: this.proyecto_academico,
      Titulaciones: [this.titulacion_proyecto_snies, this.titulacion_proyecto_mujer, this.titulacion_proyecto_hombre],
      Enfasis: this.arr_enfasis_proyecto,
    }
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('editarproyecto.seguro_continuar_actualizar_proyecto'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willCreate) => {
      if (willCreate.value) {
        this.proyectoacademicoService.put('tr_proyecto_academico/informacion_basica/' + Number(this.data.idproyecto), informacion_basicaPut)
        .subscribe((res: any) => {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
               title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            this.showToast('error', 'error', this.translate.instant('editarproyecto.proyecto_no_actualizado'));
          } else {
            this.arr_enfasis_proyecto.forEach((enfasis_temp: any) => {
              enfasis_temp.esNuevo = false;
            });
            const opt1: any = {
              title: this.translate.instant('editarproyecto.actualizado'),
              text: this.translate.instant('editarproyecto.proyecto_actualizado'),
              icon: 'warning',
              buttons: true,
              dangerMode: true,
              showCancelButton: true,
            }; Swal(opt1)
            .then((willDelete) => {
              if (willDelete.value) {
              }
            });
          }
        });
      }
    });
  } else {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('proyecto.error_datos'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    }; Swal(opt1)
    .then((willDelete) => {
      if (willDelete.value) {

      }
    });
  }
}
putinformacionregistro() {
  if ( this.checkalta === true ) {
    if ( this.resolualtaform.valid ) {
      this.metodologia = {
        Id: this.opcionSeleccionadoMeto['Id'],
      }
      this.nivel_formacion = {
        Id: this.opcionSeleccionadoNivel['Id'],
      }
      this.proyecto_academico = {
        Id : Number(this.data.idproyecto) ,
        Codigo : '0',
        Nombre : String(this.basicform.value.nombre_proyecto),
        CodigoSnies: String(this.basicform.value.codigo_snies),
        Duracion: Number(this.basicform.value.duracion_proyecto),
        NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
        CorreoElectronico: String(this.basicform.value.correo_proyecto),
        CiclosPropedeuticos: this.checkciclos,
        NumeroActoAdministrativo: Number(this.actoform.value.acto),
        EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
        Competencias: String(this.compleform.value.competencias),
        CodigoAbreviacion: String(this.basicform.value.abreviacion_proyecto),
        Activo: true,
        Oferta: this.checkofrece,
        UnidadTiempoId: this.opcionSeleccionadoUnidad['Id'],
        AnoActoAdministrativoId: String(this.actoform.value.ano_acto),
        DependenciaId: this.opcionSeleccionadoFacultad['Id'],
        AreaConocimientoId: this.opcionSeleccionadoArea['Id'],
        NucleoBaseId: this.opcionSeleccionadoNucleo['Id'],
        MetodologiaId: this.metodologia,
        NivelFormacionId: this.nivel_formacion,
        AnoActoAdministrativo: String(this.actoform.value.ano_acto),
      }
      this.calculateEndDate(this.data.fecha_creacion_registro[0], this.resoluform.value.ano_vigencia, this.resoluform.value.mes_vigencia, 0)
      this.registro_califacado_acreditacion = {
      Id: 0,
      AnoActoAdministrativoId: String(this.resoluform.value.ano_resolucion),
      NumeroActoAdministrativo: Number(this.resoluform.value.resolucion),
      FechaCreacionActoAdministrativo: this.fecha_creacion_calificado + ':00Z',
      VigenciaActoAdministrativo: 'Meses:' + this.resoluform.value.mes_vigencia + 'Años:' + this.resoluform.value.ano_vigencia,
      VencimientoActoAdministrativo: this.fecha_vencimiento + 'Z',
      EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
      Activo: true,
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
      TipoRegistroId: this.tipo_registro = {
        Id: 1,
      },
    }
    this.calculateEndDateAlta(this.fecha_creacion_alta, this.resolualtaform.value.ano_vigencia, this.resolualtaform.value.mes_vigencia, 0)
    this.registro_califacado_alta_calidad = {
      Id: 0,
      AnoActoAdministrativoId: String(this.resolualtaform.value.ano_resolucion),
      NumeroActoAdministrativo: Number(this.resolualtaform.value.resolucion),
      FechaCreacionActoAdministrativo: this.fecha_creacion_alta + ':00Z',
      VigenciaActoAdministrativo: 'Meses:' + this.resolualtaform.value.mes_vigencia + 'Años:' + this.resolualtaform.value.ano_vigencia,
      VencimientoActoAdministrativo: this.fecha_vencimiento_alta + 'Z',
      EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
      Activo: true,
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
      TipoRegistroId: this.tipo_registro = {
        Id: 2,
      },

    }
    const registro_put = {
      ProyectoAcademicoInstitucion: this.proyecto_academico,
      Registro: [this.registro_califacado_acreditacion, this.registro_califacado_alta_calidad],
    }
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('editarproyecto.seguro_continuar_actualizar_proyecto'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willCreate) => {
      if (willCreate.value) {
        this.proyectoacademicoService.put('tr_proyecto_academico/registro/' + Number(this.data.idproyecto), registro_put)
        .subscribe((res: any) => {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
               title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            this.showToast('error', 'error', this.translate.instant('editarproyecto.proyecto_no_actualizado'));
          } else {
            const opt1: any = {
              title: this.translate.instant('editarproyecto.actualizado'),
              text: this.translate.instant('editarproyecto.proyecto_actualizado'),
              icon: 'warning',
              buttons: true,
              dangerMode: true,
              showCancelButton: true,
            }; Swal(opt1)
            .then((willDelete) => {
              if (willDelete.value) {
              }
            });
          }
        });
      }
    });


    } else {
      const opt1: any = {
        title: this.translate.instant('GLOBAL.atencion'),
        text: this.translate.instant('proyecto.error_datos'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      }; Swal(opt1)
      .then((willDelete) => {
        if (willDelete.value) {

        }
      });
    }

}else {
  if ( this.resoluform.valid ) {
    this.metodologia = {
      Id: this.opcionSeleccionadoMeto['Id'],
    }
    this.nivel_formacion = {
      Id: this.opcionSeleccionadoNivel['Id'],
    }
    this.proyecto_academico = {
      Id : Number(this.data.idproyecto) ,
      Codigo : '0',
      Nombre : String(this.basicform.value.nombre_proyecto),
      CodigoSnies: String(this.basicform.value.codigo_snies),
      Duracion: Number(this.basicform.value.duracion_proyecto),
      NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
      CorreoElectronico: String(this.basicform.value.correo_proyecto),
      CiclosPropedeuticos: this.checkciclos,
      NumeroActoAdministrativo: Number(this.actoform.value.acto),
      EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
      Competencias: String(this.compleform.value.competencias),
      CodigoAbreviacion: String(this.basicform.value.abreviacion_proyecto),
      Activo: true,
      Oferta: this.checkofrece,
      UnidadTiempoId: this.opcionSeleccionadoUnidad['Id'],
      AnoActoAdministrativoId: this.actoform.value.ano_acto,
      DependenciaId: this.opcionSeleccionadoFacultad['Id'],
      AreaConocimientoId: this.opcionSeleccionadoArea['Id'],
      NucleoBaseId: this.opcionSeleccionadoNucleo['Id'],
      MetodologiaId: this.metodologia,
      NivelFormacionId: this.nivel_formacion,
      AnoActoAdministrativo: this.actoform.value.ano_acto,
    }

    this.calculateEndDate(this.data.fecha_creacion_registro[0], this.resoluform.value.ano_vigencia, this.resoluform.value.mes_vigencia, 0)
    this.registro_califacado_acreditacion = {
      Id: 0,
      AnoActoAdministrativoId: String(this.resoluform.value.ano_resolucion),
      NumeroActoAdministrativo: Number(this.resoluform.value.resolucion),
      FechaCreacionActoAdministrativo: this.fecha_creacion_calificado + ':00Z',
      VigenciaActoAdministrativo: 'Meses:' + this.resoluform.value.mes_vigencia + 'Años:' + this.resoluform.value.ano_vigencia,
      VencimientoActoAdministrativo: this.fecha_vencimiento + 'Z',
      EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
      Activo: true,
      ProyectoAcademicoInstitucionId: this.proyecto_academico,
      TipoRegistroId: this.tipo_registro = {
        Id: 1,
      },
    }
    const registro_put = {
      ProyectoAcademicoInstitucion: this.proyecto_academico,
      Registro: [this.registro_califacado_acreditacion],
    }
    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('editarproyecto.seguro_continuar_actualizar_proyecto'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willCreate) => {
      if (willCreate.value) {
        this.proyectoacademicoService.put('tr_proyecto_academico/registro/' + Number(this.data.idproyecto), registro_put)
        .subscribe((res: any) => {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
               title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            this.showToast('error', 'error', this.translate.instant('editarproyecto.proyecto_no_actualizado'));
          } else {
            const opt1: any = {
              title: this.translate.instant('editarproyecto.actualizado'),
              text: this.translate.instant('editarproyecto.proyecto_actualizado'),
              icon: 'warning',
              buttons: true,
              dangerMode: true,
              showCancelButton: true,
            }; Swal(opt1)
            .then((willDelete) => {
              if (willDelete.value) {
              }
            });
          }
        });
      }
    });


  } else {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('proyecto.error_datos'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    }; Swal(opt1)
    .then((willDelete) => {
      if (willDelete.value) {

      }
    });
  }
}
}
registrocoordinador() {
  if ( this.coordinador.valid ) {
    this.coordinador_data = {
      PersonaId: this.coordinadorSeleccionado['Id'],
      DependenciaId: 0,
      RolId: 0,
      Activo: true,
      // FechaInicio: this.coordinador.value.fecha_creacion_coordinador + ':00Z',
      FechaInicio: moment(this.coordinador.value.fecha_creacion_coordinador).format('YYYY-MM-DDTHH:mm') + ':00Z',
      ProyectoAcademicoInstitucionId: {
        Id:  Number(this.data.idproyecto),
      },
    }

    const opt: any = {
      title: this.translate.instant('GLOBAL.asignar'),
      text: this.translate.instant('editarproyecto.seguro_continuar_asignar'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal(opt)
    .then((willCreate) => {
      if (willCreate.value) {
        this.proyectoacademicoService.post('proyecto_academico_rol_persona_dependecia/', this.coordinador_data)
        .subscribe((res: any) => {
          if (res.Type === 'error') {
            Swal({
              type: 'error',
               title: res.Code,
              text: this.translate.instant('ERROR.' + res.Code),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
            this.showToast('error', 'error', this.translate.instant('editarproyecto.coordinador_no_asignado'));
          } else {
            const opt1: any = {
              title: this.translate.instant('editarproyecto.creado'),
              text: this.translate.instant('editarproyecto.coordinador_asignado'),
              icon: 'warning',
              buttons: true,
              dangerMode: true,
              showCancelButton: true,
            }; Swal(opt1)
            .then((willDelete) => {
              if (willDelete.value) {
              }
            });
          }
        });
      }
    });


} else {
  const opt1: any = {
    title: this.translate.instant('GLOBAL.atencion'),
    text: this.translate.instant('proyecto.error_datos'),
    icon: 'warning',
    buttons: true,
    dangerMode: true,
    showCancelButton: true,
  }; Swal(opt1)
  .then((willDelete) => {
    if (willDelete.value) {

    }
  });
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