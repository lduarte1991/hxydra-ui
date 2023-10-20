/* eslint-disable */
<template>
  <v-container id="edit-form">
    <v-toolbar
      v-if="show_messages"
      style="position: sticky; top: 0; z-index: 99999; overflow-y: scroll; padding: 5px; height: 33%"
      :class="Object.keys(error_messages).length > 0 ? 'red accent-1' : 'green accent-1'"
    >
      <v-row>
        <v-col v-if="Object.keys(error_messages).length > 0">
          <span class="text-h6">Errors({{ Object.keys(error_messages).length }}):</span>
          <ul>
            <li
              v-for="(value, propertyName) in error_messages"
              :key="propertyName"
            >
              {{ propertyName }} : {{ value }}
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-snackbar
      v-model="errorBox"
      data-testid="errorBox"
      centered
    >
      <div>{{ errorMessage }}</div>
      <template #action="{ attrs }">
        <v-btn
          color="white"
          text
          dark
          v-bind="attrs"
          @click="errorBox = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-form
      ref="editform"
    >
      <v-container>
        <v-row>
          <v-col class="col-12">
            <v-text-field
              v-model="course.title"
              label="Project Name"
              :rules="titleLength"
              required
              :disabled="!('title' in course.writeable)"
            />
          </v-col>
        </v-row>
        <v-row class="mb-5">
          <v-col class="col-4">
            <v-text-field
              v-model="course.common_name"
              label="Common Project Name"
              :rules="commonNameLength"
              required
              :disabled="!('common_name' in course.writeable)"
            />
          </v-col>
          <v-col class="col-3">
            <v-select
              v-model="course.revenue_school"
              :items="school"
              label="Revenue Schools"
              multiple
              :disabled="!('revenue_school' in course.writeable)"
              @input="revSchoolUpdated"
            />
          </v-col>
          <v-col class="col-2">
            <v-text-field
              v-model="course.subactivity"
              label="Subactivity"
              :disabled="!('subactivity' in course.writeable)"
              required
            />
          </v-col>
          <v-col class="col-3">
            <v-select
              v-model="course.status"
              :items="projectstatus"
              label="Status"
              :disabled="!('status' in course.writeable)"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="course.description"
              label="Course Description"
              outlined
              :disabled="!('description' in course.writeable)"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="course.summary"
              label="Course Short Summary"
              outlined
              :disabled="!('summary' in course.writeable)"
            />
          </v-col>
        </v-row>
        <v-card class="pa-5 mb-5">
          <v-card-subtitle>Run Metadata</v-card-subtitle>
          <v-row>
            <v-col class="col-3">
              <v-text-field
                v-model="course.prefix"
                label="Project Prefix"
                disabled
              />
            </v-col>
            <v-col class="col-2">
              <v-text-field
                v-model="course.sequence"
                label="Seq #"
                disabled
              />
            </v-col>
            <v-col class="col-2">
              <v-text-field
                v-model="course.version"
                label="Version"
                disabled
              />
            </v-col>
            <v-col class="col-2">
              <v-text-field
                v-model="course.run"
                label="Rerun #"
                disabled
              />
            </v-col>
            <v-col class="col-3">
              <v-text-field
                v-model="course.nickname"
                label="nickname"
                required
                disabled
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-6">
              <v-text-field
                v-model="quickfilledx"
                label="Quick-Fill edX"
                placeholder="course-v1:HarvardX+PH211x+1T2021"
                :disabled="!('program_run' in course.writeable) || !('program_code' in course.writeable) || !('program_id' in course.writeable)"
              />
            </v-col>
            <v-col class="col-6">
              <v-text-field
                v-model="quickfillhbso"
                label="Quick-Fill HBSO"
                placeholder="DSFB2106A04"
                :disabled="!('program_run' in course.writeable) || !('program_code' in course.writeable) || !('program_id' in course.writeable)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-3">
              <v-text-field
                v-model="course.program_run"
                label="Program Run"
                placeholder="e.g., 2T2021"
                :disabled="!('program_run' in course.writeable)"
              />
            </v-col><v-col class="col-3">
              <v-text-field
                v-model="course.program_code"
                label="Program Number"
                placeholder="e.g., AA123x"
                :disabled="!('program_code' in course.writeable)"
              />
            </v-col>
            <v-col class="col-6">
              <v-text-field
                v-model="course.program_id"
                label="Run ID"
                placeholder="e.g., HarvardX/AA123x/2T2021"
                hint="(Wave ID for HBSO. Course ID for edX)"
                :disabled="!('program_id' in course.writeable)"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="pa-5 mb-5">
          <v-card-subtitle>Dates (YYYY-MM-DD)</v-card-subtitle>
          <v-row>
            <v-col class="col-4 mt-3">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="launchDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="launchDateDisplay"
                      :rules="dateAfterRule"
                      clearable
                      :disabled="!('launch_date' in course.writeable) || course.fuzzy_launch_date !== null && course.fuzzy_launch_date.length > 0"
                      v-on="on"
                      @click:clear="course.launch_date = ''"
                      @change="launchTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> Launched Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.launch_date"
                    no-title
                    @change="launchDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col><v-col class="col-4 mt-3">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="endDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="endDateDisplay"
                      :rules="dateBeforeRule"
                      clearable
                      :disabled="!('end_date' in course.writeable) || course.fuzzy_launch_date !== null && course.fuzzy_launch_date.length > 0"
                      v-on="on"
                      @click:clear="course.end_date = ''"
                      @change="endTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> End Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.end_date"
                    no-title
                    @change="endDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
            <v-col class="col-4">
              <v-text-field
                v-model="course.fuzzy_launch_date"
                label="Approximate Launch & End Date"
                :disabled="!('launch_date' in course.writeable) || !('end_date' in course.writeable) || course.launch_date !== null && (course.launch_date.length > 0 || course.end_date.length > 0)"
                clearable
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-a col-4">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="marketingDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="marketingDateDisplay"
                      clearable
                      :rules="dateRules"
                      :disabled="!('marketing_launch_date' in course.writeable)"
                      v-on="on"
                      @click:clear="course.marketing_launch_date = ''"
                      @change="marketingTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> Marketing Launched Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.marketing_launch_date"
                    no-title
                    @change="marketingDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
            <v-col class="mx-a col-4">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="appOpenDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="appOpenDateDisplay"
                      clearable
                      :rules="applicationDateAfterRule"
                      :disabled="!('application_open_date' in course.writeable)"
                      v-on="on"
                      @click:clear="course.application_open_date = ''"
                      @change="appOpenTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> Application Open Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.application_open_date"
                    no-title
                    @change="appOpenDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
            <v-col class="mx-a col-4">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="appCloseDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="appCloseDateDisplay"
                      clearable
                      :rules="applicationDateBeforeRule"
                      :disabled="!('application_close_date' in course.writeable)"
                      v-on="on"
                      @click:clear="course.application_close_date = ''"
                      @change="appCloseTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> Application Close Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.application_close_date"
                    no-title
                    @change="appCloseDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-a col-4">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="enrollmentCutOffDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="enrollmentCutOffDateDisplay"
                      clearable
                      :rules="dateRules"
                      :disabled="!('enrollment_date' in course.writeable)"
                      v-on="on"
                      @click:clear="course.enrollment_date = ''"
                      @change="enrollmentTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> Enrollment Close Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.enrollment_date"
                    no-title
                    @change="enrollmentCutOffDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
            <v-col class="mx-a col-4">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="IDVCutOffDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="IDVCutOffDateDisplay"
                      clearable
                      :rules="dateRules"
                      :disabled="!('cert_enrollment_date' in course.writeable)"
                      v-on="on"
                      @click:clear="course.cert_enrollment_date = ''"
                      @change="certEnrollmentTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> Cert Enrollment Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.cert_enrollment_date"
                    no-title
                    @change="IDVCutOffDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
            <v-col class="mx-a col-4">
              <v-layout
                row
                wrap
              >
                <v-menu
                  v-model="sowDatePop"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  max-width="290px"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      class="mx-2"
                      :value="sowDateDisplay"
                      clearable
                      :rules="dateRules"
                      :disabled="!('sow_approval_date' in course.writeable)"
                      v-on="on"
                      @click:clear="course.sow_approval_date = ''"
                      @change="sowTxtUpdate"
                    >
                      <template slot="label">
                        <v-icon>mdi-calendar-month</v-icon> SOW Approval Date
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="course.sow_approval_date"
                    no-title
                    @change="sowDatePop = false"
                  />
                </v-menu>
              </v-layout>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="pa-5 mb-5">
          <v-card-subtitle>Certificate</v-card-subtitle>
          <v-row>
            <v-col class="col-3">
              <v-checkbox
                v-model="course.cert_available"
                label="Certificate Available"
                :disabled="!('cert_available' in course.writeable)"
              />
            </v-col>
            <v-col class="col-3">
              <v-text-field
                v-model="course.cert_price"
                number
                label="Certificate Price"
                :disabled="!course.cert_available || !('cert_price' in course.writeable)"
              />
            </v-col>
            <v-col class="col-3">
              <v-text-field
                v-model="course.cert_rate_to_certify"
                type="number"
                label="Rate to Certify"
                :disabled="!course.cert_available || !('cert_rate_to_certify' in course.writeable)"
                oninput="this.value = Math.round(this.value)"
                :rules="posIntRules"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="pa-5 mb-5">
          <v-card-subtitle>Other Info</v-card-subtitle>
          <v-row>
            <v-col class="col-3">
              <v-checkbox
                v-model="course.self_paced"
                label="Self-Paced"
                :disabled="!('self_paced' in course.writeable)"
              />
            </v-col>
            <v-col class="col-4">
              <v-checkbox
                v-model="course.faculty_agreement_signed"
                label="Faculty Agreement Signed"
                :disabled="!('faculty_agreement_signed' in course.writeable)"
              />
            </v-col>
            <v-col class="col-5">
              <v-checkbox
                v-model="course.video_archived"
                label="Course Videos Archived"
                :disabled="!('video_archived' in course.writeable)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-4">
              <v-text-field
                v-model="course.estimated_effort_min"
                label="Estimated hrs per week (Min)"
                type="number"
                :rules="lessThanMax"
                :disabled="!('estimated_effort_min' in course.writeable)"
                oninput="if (this.value < 1) {this.value = 0}"
                required
                @input="triggerEstimatedEffortValidation"
              />
            </v-col>
            <v-col class="col-4">
              <v-text-field
                v-model="course.estimated_effort_max"
                label="Estimated hrs per week (Max)"
                type="number"
                :rules="greaterThanMin"
                oninput="if (this.value < 1) {this.value = 0}"
                required
                :disabled="!('estimated_effort_max' in course.writeable)"
              />
            </v-col>
            <v-col class="col-4">
              <v-text-field
                v-model="course.duration_weeks"
                label="Course Length (in weeks)"
                type="number"
                :rules="posIntRules"
                required
                :disabled="!('duration_weeks' in course.writeable)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-4">
              <v-select
                v-model="course.enrollment_type"
                :items="enrollmenttype"
                label="Enrollment Type"
                :disabled="!('enrollment_type' in course.writeable)"
              />
            </v-col>
            <v-col class="col-4">
              <v-select
                v-model="course.delivery_platform"
                :items="deliveryplatform"
                label="Delivery Platform"
                :disabled="!('delivery_platform' in course.writeable)"
                @input="changeDeliveryPlatform"
              />
            </v-col>
            <v-col class="col-4">
              <v-select
                v-model="course.technical_platform"
                :items="technicalplatform"
                label="Technical Platform"
                :disabled="!('technical_platform' in course.writeable)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-6">
              <v-select
                v-model="course.sponsoring_school"
                :items="school"
                label="Affiliation"
                multiple
                :disabled="!('sponsoring_school' in course.writeable)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-6">
              <v-select
                v-model="course.vpal_discipline"
                :items="vpaldiscipline"
                label="VPAL Disciplines (Marketing)"
                multiple
                :disabled="!('vpal_discipline' in course.writeable)"
              />
            </v-col>
            <v-col class="col-6">
              <v-select
                item-value="pk"
                :items="filteredPlatformDiscipline"
                label="Platform Disciplines"
                no-data-text="No Disciplines for chosen Delivery Platform"
                multiple
                :value="platform_discipline_pk"
                :disabled="!('platform_discipline' in course.writeable)"
                @input="onPlatformDisciplineInput"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="pa-5 mb-5">
          <v-card-subtitle>URLs</v-card-subtitle>
          <v-row>
            <v-col class="col-12">
              <v-text-field
                v-model="course.enrollment_page_url"
                label="Enrollment Page Url"
                :disabled="!('enrollment_page_url' in course.writeable)"
              />
            </v-col>
            <v-col class="col-12">
              <v-text-field
                v-model="course.public_url"
                label="Public Url"
                :disabled="!('public_url' in course.writeable)"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-row>
          <v-col class="col-12">
            <v-card>
              <v-card-subtitle>Project Team Members</v-card-subtitle>
              <v-data-table
                :headers="teamHeaders"
                :items="course.team"
                :items-per-page="10"
                :hide-default-footer="course.team.length <= 10"
                :footer-props="{
                  showFirstLastPage: false,
                  itemsPerPageOptions: [5, 10, 20]
                }
                "
              >
                <template #item="{ item }">
                  <tr>
                    <td>
                      {{ item['person']['first_name'] }} {{ item['person']['last_name'] }}
                    </td>
                    <td>
                      <v-autocomplete
                        v-model="item.role"
                        :items="role"
                        :filter="filter"
                        label="Role"
                        :disabled="!('team' in course.writeable)"
                      />
                    </td>
                    <td>
                      <v-container>
                        <v-row>
                          <v-col class="col-12">
                            <v-btn
                              :disabled="!('team' in course.writeable)"
                              @click="deletePerson(item)"
                            >
                              <v-icon
                                small
                              >
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </td>
                  </tr>
                </template>
                <template #foot>
                  <td class="pa-5">
                    <v-autocomplete
                      v-model="addPerson"
                      :items="people"
                      :filter="filter"
                      item-text="name"
                      label="Add Person"
                      :disabled="!('team' in course.writeable)"
                    />
                  </td>
                  <td class="pa-5">
                    <v-autocomplete
                      v-model="addRole"
                      :items="role"
                      :filter="filter"
                      label="Add role"
                      :disabled="!('team' in course.writeable)"
                    />
                  </td>
                  <td class="pa-5 d-flex justify-center">
                    <v-btn
                      color="primary"
                      :disabled="!('team' in course.writeable)"
                      @click="addTeam"
                    >
                      Add
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-toolbar
      dense
      style="position: sticky; bottom: 0; z-index: 9999;"
    >
      <v-col class="col-6 d-flex justify-center">
        <v-btn
          color="primary"
          @click="saveChanges"
        >
          Update
        </v-btn>
      </v-col>
      <v-col class="col-6 d-flex justify-center">
        <v-btn @click="closeEdit">
          Discard Changes
        </v-btn>
      </v-col>
    </v-toolbar>
  </v-container>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'EditForm',
    props: {
      course: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data: () => ({
      errorBox: false,
      errorMessage: '',
      addPerson: '',
      addRole: '',
      enrollmentTypes: [],
      revenueSchools: [],
      affiliations: [],
      disciplines: [],
      edXSubjects: [],
      role: [],
      launchDatePop: false,
      endDatePop: false,
      appOpenDatePop: false,
      appCloseDatePop: false,
      IDVCutOffDatePop: false,
      enrollmentCutOffDatePop: false,
      sowDatePop: false,
      facDatePop: false,
      marketingDatePop: false,
      quickfilledx: '',
      quickfillhbso: '',
      show_messages: false,
      error_messages: [],
      db_errors: [],
      teamHeaders: [{
        text: 'Name',
        sortable: true,
        value: 'name',
        width: '60%'
      }, {
        text: 'Role on Team',
        sortable: true,
        value: 'role',
        width: '30%'
      }, {
        text: 'Actions',
        sortable: false,
        width: '10%'
      }],
      searchTeam: '',
      people: [],
      full_people: [],
      setup_options: [{
        'proper_name': 'Enrollment Type',
        'tech_name': 'enrollmenttype',
        'key': 'name',
      }, {
        'proper_name': 'Technical Platform',
        'tech_name': 'technicalplatform',
        'key': 'name'
      }, {
        'proper_name': 'Delivery Platform',
        'tech_name': 'deliveryplatform',
        'key': 'name'
      }, {
        'proper_name': 'School',
        'tech_name': 'school',
        'key': 'name',
        'par': 'description',
        'proper_par_name': 'Full School Name'
      }, {
        'proper_name': 'Platform Discipline',
        'tech_name': 'platformdiscipline',
        'key': 'name',
        'par': 'platform',
        'proper_par_name': 'Platform Name',
        'pk': 'pk'
      }, {
        'proper_name': 'VPAL Discipline',
        'tech_name': 'vpaldiscipline',
        'key': 'name'
      }, {
        'proper_name': 'Project Status',
        'tech_name': 'projectstatus',
        'key': 'name'
      }, {
        'proper_name': 'Role',
        'tech_name': 'role',
        'key': 'name'
      }],
      enrollmenttype: [],
      technicalplatform: [],
      deliveryplatform: [],
      school: [],
      platformdiscipline: [],
      vpaldiscipline: [],
      projectstatus: [],
      api_url_prefix: process.env.VUE_APP_KONDO_API_URL,
      people_api_url: process.env.VUE_APP_KONDO_API_URL + 'person/',
    }),
    computed: {
      platform_discipline_pk() {
        return this.course.platform_discipline.map(d => d.pk)
      },
      launchDateDisplay() {
        if (this.$refs.editform) {
          this.$refs.editform.validate()
        }
        return this.getDate(this.course.launch_date)
      },
      endDateDisplay() {
        if (this.$refs.editform) {
          this.$refs.editform.validate()
        }
        return this.getDate(this.course.end_date)
      },
      appOpenDateDisplay() {
        return this.getDate(this.course.application_open_date)
      },
      appCloseDateDisplay() {
        return this.getDate(this.course.application_close_date)
      },
      IDVCutOffDateDisplay() {
        return this.getDate(this.course.cert_enrollment_date)
      },
      enrollmentCutOffDateDisplay() {
        return this.getDate(this.course.enrollment_date)
      },
      sowDateDisplay() {
        return this.getDate(this.course.sow_approval_date)
      },
      marketingDateDisplay() {
        return this.getDate(this.course.marketing_launch_date)
      },
      filteredPlatformDiscipline() {
        return this.platformdiscipline.filter(d => d.par == this.course.delivery_platform)
      },
      dateRules () {
        const rules = []
        const ruleDateInput = v => !v || (v.match(/^\d{4}-\d{2}-\d{2}$/)!== null) || 'Date must match YYYY-MM-DD pattern'
        rules.push(ruleDateInput)
        return rules
      },
      integerOnly () {
        const rules = []
        const ruleInteger = v => !v || Number.isInteger(v) || 'Number must be an integer'
        rules.push(ruleInteger)
        return rules
      },
      dateAfterRule () {
        const rules = []
        const ruleDateInput = v => !v || (v.match(/^\d{4}-\d{2}-\d{2}$/)!== null) || 'Date must match YYYY-MM-DD pattern'
        const ruleAddEnd = v => !v || (v && (this.course.end_date !== null) && (this.course.end_date !== undefined) && (this.course.end_date !== '')) || 'Must add end date'
        const ruleAft = v => !v || v <= this.getDate(this.course.end_date) || 'Date should not be after End Date'
        rules.push(ruleDateInput)
        rules.push(ruleAddEnd)
        rules.push(ruleAft)
        return rules
      },
      dateBeforeRule () {
        const rules = []
        const ruleDateInput = v => !v || (v.match(/^\d{4}-\d{2}-\d{2}$/)!== null) || 'Date must match YYYY-MM-DD pattern'
        const ruleAddLaunch = v => !v || (v && (this.course.launch_date !== null) && (this.course.launch_date !== undefined) && (this.course.launch_date !== '')) || 'Must add launch date'
        const ruleBef = v => !v || v >= this.getDate(this.course.launch_date) || 'Date should not be before Launch Date'
        rules.push(ruleDateInput)
        rules.push(ruleAddLaunch)
        rules.push(ruleBef)
        return rules
      },
      applicationDateAfterRule () {
        const rules = []
        const ruleDateInput = v => !v || (v.match(/^\d{4}-\d{2}-\d{2}$/)!== null) || 'Date must match YYYY-MM-DD pattern'
        const ruleAddEnd = v => !v || (v && (this.course.application_close_date !== null) && (this.course.application_close_date !== undefined) && (this.course.application_close_date !== '')) || 'Must add close date'
        const ruleAft = v => !v || v <= this.getDate(this.course.application_close_date) || 'Date should not be after Close Date'
        rules.push(ruleDateInput)
        rules.push(ruleAddEnd)
        rules.push(ruleAft)
        return rules
      },
      applicationDateBeforeRule () {
        const rules = []
        const ruleDateInput = v => !v || (v.match(/^\d{4}-\d{2}-\d{2}$/)!== null) || 'Date must match YYYY-MM-DD pattern'
        const ruleAddLaunch = v => !v || (v && (this.course.application_open_date !== null) && (this.course.application_open_date !== undefined) && (this.course.application_open_date !== '')) || 'Must add open date'
        const ruleBef = v => !v || v >= this.getDate(this.course.application_open_date) || 'Date should not be before open date'
        rules.push(ruleDateInput)
        rules.push(ruleAddLaunch)
        rules.push(ruleBef)
        return rules
      },
      posIntRules () {
        const rules = []
        const ruleMin = v => parseInt(v, 10) >= 0 || 'Must be at least 0'
        rules.push(ruleMin)
        return rules
      },
      lessThanMax() {
        const rules = []
        const ruleMin = v => parseFloat(v) > -1 || 'Cannot be negative'
        const ruleLtMax = v => parseFloat(v) <= parseFloat(this.course.estimated_effort_max) || 'Cannot be more than max'
        rules.push(ruleMin)
        rules.push(ruleLtMax)
        return rules
      },
      greaterThanMin() {
        const rules = []
        const ruleGtMin = v => parseFloat(v) >= parseFloat(this.course.estimated_effort_min) || 'Cannot be less than min effort'
        rules.push(ruleGtMin)
        return rules
      },
      titleLength() {
        const rules = []
        const maxTitle = v => v.length < 500 || 'Must be max 500 chars'
        rules.push(maxTitle)
        return rules
      },
      commonNameLength() {
        const rules = []
        const maxNameLength = v => !v || v.length < 50 || 'Must be max 50 chars'
        rules.push(maxNameLength)
        return rules
      },
      moreThanOne() {
        const rules = []
        const gtOne = v => !v || parseFloat(v) > 0 || 'Duration must be bigger than zero weeks'
        rules.push(gtOne)
        return rules
      }
    },
    watch: {
      quickfilledx: function(val) {
        //course-v1:HarvardX+PH211x+1T2021
        let normalizedID = val.replace('course-v1:', '').replace(/\+/g, '/')
        let split_id = normalizedID.split('/')
        this.course.program_code = split_id[1]
        this.course.program_run = split_id[2]
        this.course.program_id = val
      },
      quickfillhbso: function(val) {
        try {
          this.course.program_run = val.substring(4)
          this.course.program_code = val.substring(0, 4)
          this.course.program_id = val
        } catch(e) {
          console.log(e)
        }
      }
    },
    mounted() {
      this.getChoices()
      this.getPeople()
    },
    methods: {
      getChoices () {
        // TODO: Try to get all these list values in one go
        for (const s of this.setup_options) {
          axios.get(this.api_url_prefix +s['tech_name']+'/')
            .then(e => {
              if ('par' in s){
                if ('pk' in s) {
                  this[s['tech_name']] = e.data.map(function(f) {
                    return {
                      'par': f[s['par']],
                      'text': f[s['key']],
                      'pk': f[s['pk']]
                    }
                  })
                } else {
                  this[s['tech_name']] = e.data.map(function(f) {
                    return {
                      'par': f[s['par']],
                      'text': f[s['key']]
                    }
                  })
                }

              } else {
                this[s['tech_name']] = e.data.map(function(f) {
                  return {
                    'text': f[s['key']]
                  }
                })
              }
            })
            //.then(g => this.values[s['tech_name']] = g)
        }
      },
      getVersionNum (nickname) {
        const regEx = /_v([0-9]+)/g
        const arr = [...nickname.matchAll(regEx)]
        return arr[0][1];
      },
      async getPeople () {
        //eventually this should call a new API call that gets the full list of people
        const { data } = await axios.get(
          this.people_api_url
        );
        this.people = data.map(p => (p.first_name + ' ' + p.last_name))
        this.full_people = data
      },
      filter (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
      },
      closeEdit () {
        this.$emit('closeEdit', false)
        this.quickfilledx = ''
        this.quickfillhbso = ''
      },
      onPlatformDisciplineInput (inputList) {
        this.course.platform_discipline = this.normalizeDiscipline(inputList)
      },
      saveChanges () {
        if (!this.validate()) {
          return
        }
        let self = this;
        let options = JSON.parse(JSON.stringify(this.course))
        if (options.fuzzy_launch_date && options.fuzzy_launch_date.length > 0) {
          options.is_fuzzy_launch_date = true
          options.launch_date = null
          options.end_date = null
        } else {
          options.is_fuzzy_launch_date = false
          options.launch_date = self.normalizeDate(options.launch_date)
          options.end_date = self.normalizeDate(options.end_date)
        }

        options.sow_approval_date = self.normalizeDate(options.sow_approval_date)
        options.enrollment_date = self.normalizeDate(options.enrollment_date)
        options.cert_enrollment_date = self.normalizeDate(options.cert_enrollment_date)
        options.marketing_launch_date = self.normalizeDate(options.marketing_launch_date)
        options.technical_platform = self.normalizeTechnicalPlatform(options.technical_platform)
        options.application_open_date = self.normalizeDate(options.application_open_date)
        options.application_close_date = self.normalizeDate(options.application_close_date)
        if (options.subactivity === '') {
          options.subactivity = null
        }

        axios.put(
            process.env.VUE_APP_KONDO_API_URL + 'project/' + this.course.nickname + '/',
            options
          ).then(() => {
            this.$emit('closeEdit', this.course)
            this.quickfilledx = ''
            this.quickfillhbso = ''
          }).catch(e => {
            self.errorBox = true
            self.db_errors = e.response.data.message
              let mess = `(${e.response.status}) ${e.response.statusText} ${e.response.data.message}`
              switch(e.response.status) {
                case 400:
                  self.errorMessage = mess + ` [Missing/Invalid Parameter]`
                  break
                case 409:
                  self.errorMessage = mess + ` [Nickname already exists]`
                  break
                case 401:
                  self.errorMessage = mess + ` [Log in required]`
                  break
                case 403:
                  self.errorMessage = mess + ` [Requires Permission]`
                  break
                default:
                  self.errorMessage = mess
              }
          })
        
      },
      getDate(d_str) {
        if (typeof(d_str) == 'undefined' || d_str === '' || d_str === null) {
          return ''
        }
        return new Date(d_str).toISOString().substring(0,10)
      },
      normalizeDate(dateStr) {
        if (dateStr && dateStr.length > 0) {
          return new Date(dateStr)
        } else {
          return null
        }
      },
      normalizeTechnicalPlatform(plat) {
        if (plat == "UNDEF") {
          return undefined
        }
        return plat
      },
      normalizeDiscipline(discDict) {
        let final_disc = []
        let inter_disc = []
        discDict.forEach(dis => {
          Array.prototype.push.apply(inter_disc, this.platformdiscipline.filter(p => p.pk == dis))
        })
        inter_disc.forEach(dis2 => {
          final_disc.push({
            'pk': dis2['pk'],
            'name': dis2['text'],
            'platform': dis2['par']
          })
        })
        return final_disc
      },
      revSchoolUpdated() {
        this.course.sponsoring_school = this.course.revenue_school.slice()
      },
      changeDeliveryPlatform () {
        this.course.platform_discipline = []
        // let current_disciplines = this.platformdiscipline.filter(d => this.course.platform_discipline.indexOf(d.text) > -1)
        // this.filteredPlatformDiscipline = current_disciplines.filter(d => d.par == this.course.delivery_platform)
        // console.log(this.filteredPlatformDiscipline)
        // this.course.platform_discipline = current_disciplines.map(e => e.text)
        // this.course.technical_platform = this.course.delivery_platform
      },
      validate () {
        console.log("SHOULD VALIDATE")
        const valid_message = this.$refs.editform.validate()
        if (!valid_message) {
          this.show_messages = true
          const errors = {};
          this.$refs.editform.inputs.forEach(e => {
              if (e.errorBucket && e.errorBucket.length) {
                errors[e.label] = e.errorBucket;
              }
            },
          );
          console.log(errors)
          this.error_messages = errors
        } else {
          this.show_messages = false
        }

        return this.$refs.editform.validate()
      },
      addTeam() {
        let personItem = this.full_people.filter(e => (e.first_name + " " + e.last_name) == this.addPerson)[0]
        this.course.team.push({
          project: this.course.nickname,
          person: personItem,
          role: this.addRole
        })
        this.addPerson = ""
        this.addRole = ""
      },
      deletePerson(item) {
        this.course.team = this.course.team.filter(e => e.pk != item.pk)
      },
      triggerEstimatedEffortValidation() {
        this.$refs.editform.validate()
      },
      triggerDateValidation() {
        this.$refs.editform.validate()
      },
      launchTxtUpdate(e) {
        this.course.launch_date = e
      },
      endTxtUpdate(e) {
        this.course.end_date = e
      },
      marketingTxtUpdate(e) {
        this.course.marketing_launch_date = e
      },
      appOpenTxtUpdate(e) {
        this.course.application_open_date = e
      },
      appCloseTxtUpdate(e) {
        this.course.application_close_date = e
      },
      enrollmentTxtUpdate(e) {
        this.course.enrollment_date = e
      },
      certEnrollmentTxtUpdate(e) {
        this.cert_enrollment_date = e
      },
      sowTxtUpdate(e) {
        this.sow_approval_date = e
      },
    }
  }
</script>

<style>
  .v-menu__content::-webkit-scrollbar{
    -webkit-appearance: none;
    width:  7px;
  }
  .v-menu__content::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 1px;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
  .v-menu__content {
    background: white;
  }

  .v-input.v-input--is-focused .v-icon {
    color: #1976d2!important;
    caret-color: #1976d2!important;
  }
</style>