<template>
  <v-container>
    <v-row>
      <v-col class="col-lg-6 col-md-6 col-sm-12">
        <v-container>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Project Title:
            </v-col>
            <v-col class="col-lg-8 col-md-9 col-sm-10 col-9">
              {{ course.title }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Common Name:
            </v-col>
            <v-col class="col-lg-8 col-md-9 col-sm-10 col-9">
              {{ course.common_name }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Nickname:
            </v-col>
            <v-col class="col-lg-3 col-md-9 col-sm-4 col-9">
              {{ course.nickname }}
            </v-col>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Course Run:
            </v-col>
            <v-col class="col-lg-3 col-md-9 col-sm-4 col-9">
              {{ course.program_run }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Course Number:
            </v-col>
            <v-col class="col-lg-3 col-md-9 col-sm-4 col-9">
              {{ course.program_code }}
            </v-col>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Course ID:
            </v-col>
            <v-col class="col-lg-3 col-md-9 col-sm-4 col-9">
              {{ course.program_id }}
            </v-col>
          </v-row>
          
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Status:
            </v-col>
            <v-col class="col-lg-8 col-md-9 col-sm-10 col-9">
              {{ course.status }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Description:
            </v-col>
            <v-col class="col-lg-8 col-md-9 col-sm-10 col-9">
              {{ course.description }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Short Summary:
            </v-col>
            <v-col class="col-lg-8 col-md-9 col-sm-10 col-9">
              {{ course.summary }}
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <v-container>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Subactivity:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ course.subactivity }}
            </v-col>
            <v-col
              v-if="!course.is_fuzzy_launch_date"
              class="text-caption col-lg-2 col-md-3 col-sm-2 col-3"
            >
              Launch Date:
            </v-col>
            <v-col
              v-if="!course.is_fuzzy_launch_date"
              class="col-lg-3 col-md-8 col-sm-4 col-9"
            >
              {{ getDate(course.launch_date) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-if="!course.is_fuzzy_launch_date"
              class="text-caption col-lg-2 col-md-3 col-sm-2 col-3"
            >
              End Date:
            </v-col>
            <v-col
              v-if="!course.is_fuzzy_launch_date"
              class="col-lg-3 col-md-8 col-sm-4 col-9"
            >
              {{ getDate(course.end_date) }}
            </v-col>
            <v-col
              v-if="course.is_fuzzy_launch_date"
              class="text-caption col-lg-3 col-md-3 col-sm-2 col-3"
            >
              Approx Launch Date:
            </v-col>
            <v-col
              v-if="course.is_fuzzy_launch_date"
              class="col-lg-3 col-md-8 col-sm-4 col-9"
            >
              {{ course.fuzzy_launch_date }}
            </v-col>
            <v-col class="text-caption col-lg-3 col-md-3 col-sm-2 col-3">
              SOW Approval Date:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ getDate(course.sow_approval_date) }}
            </v-col>
            <v-col class="text-caption col-lg-3 col-md-3 col-sm-2 col-3">
              Application Open Date:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ getDate(course.application_open_date) }}
            </v-col>
            <v-col class="text-caption col-lg-3 col-md-3 col-sm-2 col-3">
              Application Close Date:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ getDate(course.application_close_date) }}
            </v-col>
            <v-col class="text-caption col-lg-3 col-md-3 col-sm-2 col-3">
              Marketing Date:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ getDate(course.marketing_launch_date) }}
            </v-col>
            <v-col class="text-caption col-lg-3 col-md-3 col-sm-2 col-3">
              Course Enrollment Date:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ getDate(course.enrollment_date) }}
            </v-col>
            <v-col class="text-caption col-lg-3 col-md-3 col-sm-2 col-3">
              Cert Enrollment Date:
            </v-col>
            <v-col class="col-lg-3 col-md-8 col-sm-4 col-9">
              {{ getDate(course.cert_enrollment_date) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Enrollment Page URL:
            </v-col>
            <v-col class="col-lg-8 col-md-8 col-sm-10 col-9">
              <a :href="course.enrollment_page_url">{{ course.enrollment_page_url }}</a>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-caption col-lg-2 col-md-3 col-sm-2 col-3">
              Public URL:
            </v-col>
            <v-col class="col-lg-8 col-md-8 col-sm-10 col-9">
              <a :href="course.public_url">{{ course.public_url }}</a>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-lg-12">
        <v-card>
          <v-toolbar dark>
            <template #extension>
              <v-tabs
                v-model="tab"
                align-with-title
              >
                <v-tabs-slider />

                <v-tab
                  key="details"
                >
                  Details
                </v-tab>
                <v-tab
                  key="team"
                >
                  Team
                </v-tab>
                <v-tab
                  key="dissub"
                >
                  Discipline/edX Subject
                </v-tab>
                <v-tab
                  v-if="canAccessCredentials"
                  key="credentials"
                >
                  Credentials
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item
              key="details"
            >
              <v-card flat>
                <v-container>
                  <v-row>
                    <v-col class="col-lg-4 col-md-4 col-sm-12 col-12">
                      <v-container>
                        <v-row>
                          <v-col
                            v-if="course.cert_available"
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon color="green">
                              mdi-check-circle
                            </v-icon>
                          </v-col>
                          <v-col
                            v-else
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon>mdi-close-octagon</v-icon>
                          </v-col>
                          <v-col class="col-10 col-sm-10 col-md-10 col-lg-10">
                            IDV Verified Certificate
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            v-if="course.self_paced"
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon color="green">
                              mdi-check-circle
                            </v-icon>
                          </v-col>
                          <v-col
                            v-else
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon>mdi-close-octagon</v-icon>
                          </v-col>
                          <v-col class="col-10 col-sm-10 col-md-10 col-lg-10">
                            Self-paced
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            v-if="course.faculty_agreement_signed"
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon color="green">
                              mdi-check-circle
                            </v-icon>
                          </v-col>
                          <v-col
                            v-else
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon>mdi-close-octagon</v-icon>
                          </v-col>
                          <v-col class="col-10 col-sm-10 col-md-10 col-lg-10">
                            Faculty Agreements Signed
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            v-if="course.videos_archived"
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon color="green">
                              mdi-check-circle
                            </v-icon>
                          </v-col>
                          <v-col
                            v-else
                            class="col-1 col-sm-1 col-md-2 col-lg-2 text-right pr-2"
                          >
                            <v-icon>mdi-close-octagon</v-icon>
                          </v-col>
                          <v-col class="col-10 col-sm-10 col-md-10 col-lg-10">
                            Course Videos Archived
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                    <v-col class="col-lg-4 col-md-4 col-sm-12 col-12">
                      <v-container>
                        <v-row>
                          <v-col class="col-6 text-caption">
                            Enrollment Type: 
                          </v-col>
                          <v-col
                            v-if="course.enrollment_type !== ''"
                            class="col-6"
                          >
                            {{ course.enrollment_type }}
                          </v-col>
                          <v-col
                            v-else
                            class="col-6"
                          >
                            N/A
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6 text-caption">
                            Est. Effort (Min - Max): 
                          </v-col>
                          <v-col class="col-6">
                            {{ course.estimated_effort_min }} - {{ course.estimated_effort_max }} hrs
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6">
                            Course Length: 
                          </v-col>
                          <v-col class="col-6">
                            {{ course.duration_weeks }} weeks
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6">
                            Pass Rate to Certify: 
                          </v-col>
                          <v-col
                            v-if="course.cert_rate_to_certify !== ''"
                            class="col-6"
                          >
                            {{ course.cert_rate_to_certify }}
                          </v-col>
                          <v-col
                            v-else
                            class="col-6"
                          >
                            N/A
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6">
                            Cert Price: 
                          </v-col>
                          <v-col
                            v-if="course.cert_price !== -1"
                            class="col-6"
                          >
                            {{ course.cert_price }}
                          </v-col>
                          <v-col
                            v-else
                            class="col-6"
                          >
                            N/A
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                    <v-col class="col-lg-4 col-md-4 col-sm-12 col-12">
                      <v-container>
                        <v-row>
                          <v-col class="col-6">
                            Delivery Platform: 
                          </v-col>
                          <v-col
                            v-if="course.delivery_platform !== ''"
                            class="col-6"
                          >
                            {{ course.delivery_platform }}
                          </v-col>
                          <v-col
                            v-else
                            class="col-8"
                          >
                            N/A
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6">
                            Technical Platform: 
                          </v-col>
                          <v-col
                            v-if="course.technical_platform !== ''"
                            class="col-6"
                          >
                            {{ course.technical_platform }}
                          </v-col>
                          <v-col v-else>
                            N/A
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6">
                            Revenue School(s): 
                          </v-col>
                          <v-col
                            v-if="course.revenue_school.length > 0"
                            class="col-6"
                          >
                            {{ course.revenue_school.join(', ') }}
                          </v-col>
                          <v-col v-else>
                            N/A
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-6">
                            Sponsoring School(s): 
                          </v-col>
                          <v-col
                            v-if="course.sponsoring_school.length > 0"
                            class="col-6"
                          >
                            {{ course.sponsoring_school.join(', ') }}
                          </v-col>
                          <v-col v-else>
                            N/A
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item
              key="team"
            >
              <v-card flat>
                <v-data-table
                  :headers="teamHeaders"
                  :search="searchTeam"
                  :items="course.team"
                  :items-per-page="10"
                  :footer-props="{
                    showFirstLastPage: false,
                    itemsPerPageOptions: [5, 10, 20]
                  }
                  "
                >
                  <template #top>
                    <v-text-field
                      v-model="searchTeam"
                      label="Search"
                      class="mx-4"
                    />
                  </template>
                  <template #item="{ item }">
                    <tr>
                      <td>
                        {{ item['person']['first_name'] }} {{ item['person']['last_name'] }}
                      </td>
                      <td>
                        {{ item.role }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>
            <v-tab-item
              key="dissub"
            >
              <v-card flat>
                <v-card-text>
                  Platform Discipline:
                  <v-chip
                    v-for="d in course.platform_discipline"
                    :key="d.pk"
                  >
                    {{ d.name }}
                  </v-chip>
                </v-card-text>
                <v-card-text>
                  VPAL Disciplines (Marketing):
                  <v-chip
                    v-for="e in course.vpal_discipline"
                    :key="e"
                  >
                    {{ e }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item
              v-if="canAccessCredentials"
              key="credentials"
            >
              <v-card flat>
                <v-card-text>
                  <div v-if="!credentialLoading && credential === null && !credentialNotFound">
                    <v-btn @click="fetchCredentials">
                      Fetch LTI Credentials
                    </v-btn>
                  </div>
                  <div
                    v-if="credentialLoading"
                    class="text-center py-4"
                  >
                    <v-progress-circular indeterminate />
                  </div>
                  <div v-else-if="credentialNotFound">
                    <div>No credentials exist for this course.</div>
                    <v-btn
                      class="mt-2"
                      @click="requestCredentials"
                    >
                      Request Credentials
                    </v-btn>
                  </div>
                  <div v-else-if="credential && !credential.approved">
                    {{ credential.message }}
                  </div>
                  <v-container v-else-if="credential && credential.approved">
                    <v-row align="center">
                      <v-col class="text-caption col-2">
                        LTI Key:
                      </v-col>
                      <v-col class="col-8">
                        {{ credential.lti_key }}
                      </v-col>
                      <v-col class="col-2">
                        <v-btn
                          icon
                          small
                          @click="copyToClipboard(credential.lti_key, 'key')"
                        >
                          <v-icon small>
                            {{ credentialCopied === 'key' ? 'mdi-check' : 'mdi-content-copy' }}
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col class="text-caption col-2">
                        LTI Secret:
                      </v-col>
                      <v-col class="col-8">
                        {{ credential.lti_secret }}
                      </v-col>
                      <v-col class="col-2">
                        <v-btn
                          icon
                          small
                          @click="copyToClipboard(credential.lti_secret, 'secret')"
                        >
                          <v-icon small>
                            {{ credentialCopied === 'secret' ? 'mdi-check' : 'mdi-content-copy' }}
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import http from '@/http'
import getPermissionsFromCookie from '@/resources/permissions'

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
      searchTeam: '',
      write_perm: getPermissionsFromCookie(),
      credential: null,
      credentialLoading: false,
      credentialNotFound: false,
      credentialCopied: '',
      api_credential_url: process.env.VUE_APP_HXAT_API_URL + 'course/',
      kondo_api_url: process.env.VUE_APP_KONDO_API_URL,
      teamHeaders: [{
        text: 'Name',
        sortable: true,
        value: 'name',
        width: '70%'
      }, {
        text: 'Role on Team',
        sortable: true,
        value: 'role',
        width: '30%'
      }],
      tab: undefined,
      // course: {
      //   id: 'auto_id',
      //   created: 'date',
      //   created_by: 'string',
      //   modified: 'date',
      //   modified_by: 'string',
      //   project_title: 'Example Title',
      //   course_id: 'string',
      //   course_run: '',
      //   nickname: 'string',
      //   description: 'Example description of the project',
      //   //description_brief: 'string',
      //   type: 'string',
      //   //section_count: 'number',
      //   hrs_per_week: 1,
      //   launch_date: '2021-12-01',
      //   end_date: '2022-12-01',
      //   has_cert_honor_code: true,
      //   is_public: 'boolean',
      //   is_active: 'boolean',
      //   //v_discussion: '?',
      //   //pass_rate_to_certify: 'number',
      //   //count_asset_encumbrance
      //   //count_asset_encumbrance_approved
      //   //count_asset_encumbrance_denied
      //   //count_asset_encumbrance_has_use_rationale
      //   //count_asset_encumbrance_has_use_rationale_not_assessed
      //   //count_asset_encumbrance_needs_info
      //   //count_asset_encumbrance_ready_to_approve
      //   //count_assets
      //   //count_calendar
      //   //count_deliverables_expected
      //   //count_deliverables_under_construction
      //   url: 'string',
      //   rerun: 'string',
      //   version: 1,
      //   revenue_school: 'string',
      //   types: [],
      // }
    }),
    computed: {
      canAccessCredentials() {
        return this.write_perm.credentials
      }
    },
    watch: {
      'course.program_id'() {
        this.credential = null
        this.credentialNotFound = false
        this.credentialLoading = false
        this.credentialCopied = ''
      },
      tab(newTab) {
        if (newTab === 3) {
          this.credential = null
          this.credentialNotFound = false
          this.credentialLoading = false
          this.credentialCopied = ''
        }
      }
    },
    methods: {
      filter (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
      },
      getDate(d_str) {
        if (typeof(d_str) == 'undefined' || d_str === '' || d_str === null) {
          return ''
        }
        return new Date(d_str).toISOString().substring(0,10)
      },
      getVersionNum (nickname) {
        const regEx = /_v([0-9]+)/g
        const arr = [...nickname.matchAll(regEx)]
        return arr[0][1];
      },
      async fetchCredentials() {
        this.credential = null
        this.credentialNotFound = false
        this.credentialLoading = true
        this.credentialCopied = ''
        try {
          const { data } = await http.get(
            this.api_credential_url + this.course.program_id + '/credential/',
            { headers: { Authorization: `Bearer ${process.env.VUE_APP_HXAT_API_KEY}` } }
          )
          this.credential = data
        } catch (e) {
          if (e.response && e.response.status === 404) {
            this.credentialNotFound = true
          }
        } finally {
          this.credentialLoading = false
        }
      },
      async requestCredentials() {
        this.credentialNotFound = false
        this.credentialLoading = true
        this.credentialCopied = ''
        try {
          const body = { course_name: `${this.course.title} ${this.course.program_run}` }
          const previousCourseId = await this.getPreviousCourseId()
          if (previousCourseId) {
            body.previous_course_id = previousCourseId
          }
          const { data } = await http.post(
            this.api_credential_url + this.course.program_id + '/credential/',
            body,
            { headers: { Authorization: `Bearer ${process.env.VUE_APP_HXAT_API_KEY}` } }
          )
          this.credential = data
        } catch (e) {
          this.credentialNotFound = true
        } finally {
          this.credentialLoading = false
        }
      },
      async getPreviousCourseId() {
        try {
          const { data } = await http.get(
            this.kondo_api_url + 'projectps/' + this.course.prefix + '/' + this.course.sequence + '/?permission=true'
          )
          const all = data.projects
          const currentVersion = this.course.version
          const currentRun = this.course.run

          let predecessorNickname = null
          if (currentRun > 0) {
            const pred = all.find(p => p.version === currentVersion && p.run === currentRun - 1)
            if (pred) predecessorNickname = pred.nickname
          } else if (currentVersion > 1) {
            const prevVersionCourses = all.filter(p => p.version === currentVersion - 1)
            if (prevVersionCourses.length > 0) {
              const pred = prevVersionCourses.reduce((a, b) => a.run > b.run ? a : b)
              predecessorNickname = pred.nickname
            }
          }

          if (!predecessorNickname) return null

          const detail = await http.get(
            this.kondo_api_url + 'project/' + predecessorNickname + '/?permission=true'
          )
          return detail.data.program_id || null
        } catch {
          return null
        }
      },
      copyToClipboard(text, field) {
        navigator.clipboard.writeText(text).then(() => {
          this.credentialCopied = field
          setTimeout(() => { this.credentialCopied = '' }, 2000)
        })
      }
    },
  }
</script>