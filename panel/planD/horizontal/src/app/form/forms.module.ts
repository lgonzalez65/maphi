import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FormsRoutes } from './forms.routing';

import { FormBasicComponent } from './form-basic/basic.component';
import { FormvalComponent } from './form-validation/form-validation.component';
import { CheckradioComponent } from './checkbox-radio/cr.component';
import { ForminputsComponent } from './form-inputs/inputs.component';
import { GridsComponent } from './input-grids/grids.component';
import { InputgroupsComponent } from './input-groups/input-groups.component';
import { FormhorizontalComponent } from './form-horizontal/horizontal.component';
import { FormactionsComponent } from './form-actions/actions.component';
import { FormrowsepComponent } from './form-row-separator/row-sep.component';
import { FormstripedComponent } from './form-striped-row/striped.component';
import { FormdetailComponent } from './form-detail/detail.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(FormsRoutes), FormsModule, NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    FormBasicComponent,
    FormvalComponent,
    CheckradioComponent,
    ForminputsComponent,
    GridsComponent,
    InputgroupsComponent,
    FormhorizontalComponent,
    FormactionsComponent,
    FormrowsepComponent,
    FormstripedComponent,
    FormdetailComponent,
    MultiselectComponent
  ]
})
export class FormModule {}
