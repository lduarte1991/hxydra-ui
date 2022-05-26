<template>
  <v-container>
    <v-snackbar
      v-model="errorBox"
      top
      elevation="10"
      color="error"
    >
      {{ errorMessage }}
      <template #action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="errorBox = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="item in setup_options"
        :key="item.tech_name"
      >
        <v-expansion-panel-header>
          {{ item.proper_name }} <v-spacer /><v-btn
            :title="'Add new' + item.proper_name"
            max-width="30px"
            class="mr-10"
            @click.stop=""
            @click="add = !add; choiceSelected = item.tech_name"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item
            v-for="e in values[item.tech_name]"
            :key="e.value"
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-btn
                  title="Edit"
                  class=""
                  icon
                  small
                  @click="
                    awaitingEdit = e; choiceSelected = item.tech_name; editChoice()"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  title="Delete"
                  class="mr-5"
                  icon
                  small
                  @click="awaitingDelete = e; choiceSelected = item.tech_name; deleteChoice()"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                {{ e.value }} <span v-if="'par' in e">({{ e.par }})</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-divider class="mt-10 mb-10" />
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          People <v-spacer /><v-btn
            title="Add new"
            max-width="30px"
            class="mr-10"
            @click.stop=""
            @click="addPeople = true;"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="people"
            :items-per-page="50"
            :search="search"
            :custom-filter="filter"
            :footer-props="{
              showFirstLastPage: true,
              firstIcon: 'mdi-arrow-collapse-left',
              lastIcon: 'mdi-arrow-collapse-right',
              itemsPerPageOptions: [25, 50 -1]
            }
            "
          >
            <template #top>
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
              />
            </template>
            <template #item="{ item }">
              <tr>
                <td>
                  {{ item['first_name'] }}
                </td>
                <td>
                  {{ item['last_name'] }}
                </td>
                <td>
                  <div
                    v-for="e in item.email"
                    :key="e"
                  >
                    <a :href="'mailto:' + e">{{ e }}</a>
                  </div>
                </td>
                <td>
                  <div
                    v-for="a in item.affiliation"
                    :key="a"
                  >
                    {{ a }}
                  </div>
                </td>
                <td>
                  <v-container>
                    <v-row>
                      <v-col class="col-4">
                        <v-icon
                          small
                          class="mr-2"
                          @click="editPerson(item)"
                        >
                          mdi-pencil
                        </v-icon>
                      </v-col>
                      <v-col class="col-4">
                        <v-icon
                          small
                          @click="deletePerson(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </v-col>
                    </v-row>
                  </v-container>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog
      v-model="add"
      width="80%"
      style="background: white"
    >
      <v-card class="px-20">
        <v-container>
          <v-text-field
            v-model="newChoice"
            :label="(isEditingChoice ? 'Update ' : 'Add New ') + (choiceSelected ? setup_options.filter(e => e.tech_name == choiceSelected)[0].proper_name : 'Choice')"
          />
          <v-text-field
            v-if="(choiceSelected ? 'par' in setup_options.filter(e => e.tech_name == choiceSelected)[0] : false)"
            v-model="newPar"
            :label="(isEditingChoice ? 'Update ' : 'Add New ') + (choiceSelected ? setup_options.filter(e => e.tech_name == choiceSelected)[0].proper_par_name : 'Description')"
          />
          <v-btn
            v-if="!isEditingChoice"
            color="#483682"
            dark
            class="mr-5"
            @click="addChoicePopup()"
          >
            Add
          </v-btn>
          <v-btn
            v-if="isEditingChoice"
            color="#483682"
            dark
            class="mr-5"
            @click="updateChoicePopup()"
          >
            Update
          </v-btn>
          <v-btn @click="add = false; isEditingChoice = false">
            Cancel
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addPeople"
      width="80%"
      style="background: white"
    >
      <v-card class="px-10">
        <v-container>
          <v-text-field
            v-model="newFirstName"
            class="mx-10"
            placeholder="First Name"
          />
          <v-text-field
            v-model="newLastName"
            class="mx-10"
            placeholder="Last Name"
          />
          <v-text-field
            v-model="newEmail"
            class="mx-10"
            placeholder="Email"
          />
          <v-text-field
            v-model="newAffiliation"
            class="mx-10"
            placeholder="Affiliation(s)"
            :rules="schoolCheck"
          />
          <v-btn
            v-if="isEditingPerson"
            color="#483682"
            dark
            class="mr-5"
            @click="editMode = true; updatePerson()"
          >
            Update
          </v-btn>
          <v-btn
            v-if="!isEditingPerson"
            color="#483682"
            dark
            class="mr-5"
            @click="editMode = false; addNewPerson()"
          >
            Update
          </v-btn>
          <v-btn @click="addPeople = false">
            Cancel
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- <v-dialog
      v-model="debugDialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          fixed
          bottom
          right
          color="green"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon small>mdi-bug</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          Debug API
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field label="API URL Prefix" v-model="api_url_prefix" @input="getChoices"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field label="People API URL Prefix" v-model="people_api_url" @input="getPeople"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="debugDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'KondoChoice',
    props: {
      choiceType: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data: () => ({
      add: false,
      addPeople: false,
      editMode: false,
      choiceHeaders:[{
        text: 'Value',
        sortable: true,
        value: 'value'
      }],
      search: '',
      idRef: '',
      isEditingChoice: false,
      isEditingPerson: false,
      enrollmenttype: [],
      technicalplatform: [],
      newChoice: undefined,
      newPar: undefined,
      deliveryplatform: [],
      school: [],
      //affiliations: [],
      platformdiscipline: [],
      projectstatus: [],
      choiceSelected: undefined,
      awaitingDelete: undefined,
      awaitingEdit: undefined,
      people: [],
      errorBox: false,
      errorMessage: "",
      headers: [{
        text: 'First Name',
        sortable: true,
        value: 'first_name',
      }, {
        text: 'Last Name',
        sortable: true,
        value: 'last_name',
      }, {
        text: 'Email',
        sortable: true,
        value: 'email',
      }, {
        text: 'Affiliation(s)',
        sortable: true,
        value: 'affiliation',
      }, {
        text: 'Actions',
        sortable: false,
        align: 'center',
      }],
      api_url_prefix: process.env.VUE_APP_KONDO_API_URL,
      people_api_url: process.env.VUE_APP_KONDO_API_URL + 'person/',
      debugDialog: false,
      newFirstName: '',
      newLastName: '',
      newEmail: [],
      newAffiliation: [],
      setup_options: [{
        'proper_name': 'Project Common Name',
        'tech_name': 'projectcommonname',
        'key': 'name',
      },{
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
        'proper_par_name': 'Platform Name'
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
      }]
    }),
    computed: {
      values() {
        let newValues = {}
        for (const s of this.setup_options) {
          newValues[s['tech_name']] = this[s['tech_name']]
        }
        return newValues
      },
      schoolCheck () {
        const rules = []
        const checkSchool = school_str => {
          let schools = this.school
          let allFound = true
          let school_list = typeof(school_str) == "string" ? school_str.split(',') : []
          school_list.forEach(s => {
            let found = false
            schools.forEach(sch => {
              console.log(sch)
              if (s.trim() == sch.value) {found = true}
            })
            if (!found) {allFound = false}
          })
          return allFound
        }
        const schoolVerify = v => !v || (checkSchool(v) && v.indexOf(' ') == -1) || 'Affiliation(s) must be a valid school acronym, i.e. HBS,HKS (No spaces allowed)'
        rules.push(schoolVerify)
        return rules
      },
    },
    mounted() {
      this.getChoices()
      this.getPeople()
    },
    methods: {
      getChoices () {
        if (!axios) {
          return {}
        }
        // TODO: Try to get all these list values in one go
        for (const s of this.setup_options) {
          axios.get(this.api_url_prefix +s['tech_name']+'/')
            .then(e => {
              if ('par' in s){
                this[s['tech_name']] = e.data.map(function(f) {
                  return {
                    'par': f[s['par']],
                    'value': f[s['key']]
                  }
                })
              } else {
                this[s['tech_name']] = e.data.map(function(f) {
                  return {
                    'value': f[s['key']]
                  }
                })
              }
            })
            .catch(function(err) {
              console.log("Error: ", err)
              self.errorBox = true
              self.errorMessage = "API could not be reached. Delete did not happen"
            })
        }
      },
      addChoicePopup () {
        let options = {}
        let hasPar = false
        let choice = this.setup_options.filter( e => e.tech_name == this.choiceSelected)[0]
        options[choice.key] = this.newChoice
        if ('par' in choice) {
          options[choice.par] = this.newPar
          hasPar = true
        }
        if (!axios) {
          return
        }
        axios.post(
          this.api_url_prefix + this.choiceSelected+'/',
          options
        )
          .then(data => {
            let chosen = this.values[this.choiceSelected]
            if (hasPar) {
              chosen.push({
                'value': this.newChoice,
                'par': this.newPar
              })
            } else {
              chosen.push({
                'value': this.newChoice
              })

            }
            chosen.sort((firstItem, secondItem) => firstItem.value.toLowerCase() < secondItem.value.toLowerCase() ? -1 : 1)
            this.add = false
            this.newChoice = ''
            this.newPar = ''
            this.choiceSelected = ''
            console.log(data)
          })
          .catch(err => {
            console.log("Error: ", err.response.data.message[0])
            this.errorBox = true
            this.errorMessage = "Value was not created. " + err.response.data.message[0] 
          })
        
      },
      addNewPerson () {
        console.log("Adding new person", this.editMode)
        if (this.editMode) {
          this.finishEditing()
        } else {
          let person = {
            'first_name': this.newFirstName,
            'last_name': this.newLastName,
            'email': this.newEmail.length == 0 ? [] : this.newEmail.split(','),
            'affiliation': this.newAffiliation.length == 0 ? [] : this.newAffiliation.split(',')
          }
          axios.post(
            this.api_url_prefix +'person/',
            person
          ).then(() => {
            this.people.push(person)
            this.people.sort((firstItem, secondItem) => firstItem.last_name.toLowerCase() < secondItem.last_name.toLowerCase() ? -1 : 1)
            this.addPeople = false
            this.choiceSelected = ''
            this.newFirstName = ''
            this.newLastName = ''
            this.newEmail = []
            this.newAffiliation = []
          }).catch(err => {
            console.log("Error: ", err.response.data.message[0])
            this.errorBox = true
            this.errorMessage = "Value was not created. " + err.response.data.message[0]
          })
          
        }
      },
      editPerson (person) {
        this.newEmail = person.email.join(',')
        this.isEditingPerson = true
        this.newFirstName = person.first_name
        this.newLastName = person.last_name
        this.newAffiliation = person.affiliation.join(',')
        this.idRef = person.pk
        this.addPeople = true
        this.editMode = true
      },
      updatePerson() {
        let email_to_send = this.newEmail.length == 0 ? [] : this.newEmail.split(',')
        let affiliation_to_send = this.newAffiliation.length == 0 ? [] : this.newAffiliation.split(',')
        let person = {
          'first_name': this.newFirstName,
          'last_name': this.newLastName,
          'email': email_to_send,
          'affiliation': affiliation_to_send
        }
        axios.put(
            this.api_url_prefix +'person/' + this.idRef + '/',
            person
          ).then(() => {
            this.finishEditing()
            this.people.sort((firstItem, secondItem) => firstItem.last_name.toLowerCase() < secondItem.last_name.toLowerCase() ? -1 : 1)
          })
        this.isEditingPerson = false
      },
      finishEditing () {
        let foundIndex = -1
        let found = undefined
        for (let k = 0; k < this.people.length; k++) {
          let person = this.people[k]
          if (person.pk == this.idRef) {
            foundIndex = k
            person.first_name = this.newFirstName,
            person.last_name = this.newLastName,
            person.email = this.newEmail.length == 0 ? [] : this.newEmail.split(',')
            person.affiliation = this.newAffiliation.length == 0 ? [] : this.newAffiliation.split(',')
            found = person
          }
        }
        this.$set(this.people, foundIndex, found)
        this.addPeople = false
        this.choiceSelected = ''
        this.newFirstName = ''
        this.newLastName = ''
        this.newEmail = []
        this.newAffiliation = []
      },
      deletePerson (person) {
        this.people = this.people.filter(e => e.id !== person.id)
      },
      async deleteChoice() {
        let self = this
        await axios.delete(
          this.api_url_prefix + this.choiceSelected + '/' + self.awaitingDelete.value.replace(' ', '-') + '/'
        )
          .then(e => {
            let cat = this.values[this.choiceSelected]
            cat = cat.filter(e => e.value !== this.awaitingDelete.value)
            this[this.choiceSelected] = cat
            this.values[this.choiceSelected] = cat
            this.choiceSelected = ''
            this.awaitingDelete = ''
            console.log("Was deleted:", e)
          })
          .catch(function(err) {
            console.log("Error: ", err)
            self.errorBox = true
            self.errorMessage = "API could not be reached. Delete did not happen"
          })
      },
      async editChoice() {
        this.add = true
        this.isEditingChoice = true
        let choice = this.setup_options.filter( e => e.tech_name == this.choiceSelected)[0]
        if ('par' in choice) {
          this.newPar = this.awaitingEdit.par
        }
        this.newChoice = this.awaitingEdit.value
      },
      async updateChoicePopup() {
        let options = {}
        let hasPar = false
        let choice = this.setup_options.filter( e => e.tech_name == this.choiceSelected)[0]
        options[choice.key] = this.newChoice
        if ('par' in choice) {
          options[choice.par] = this.newPar
          hasPar = true
        }
        let self = this
        axios.put(
          this.api_url_prefix + this.choiceSelected+'/'+this.awaitingEdit.value+'/',
          options
        )
          .then(data => {
            let chosen = this.values[this.choiceSelected]
            let newChoices = chosen.map(function(e) {

              if(e.value == self.awaitingEdit.value) {
                let possChoice = {
                  'value': self.newChoice
                }
                if(hasPar) {
                  possChoice['par'] = self.newPar
                }
                return possChoice
              }
              return e
            })
            newChoices.sort((firstItem, secondItem) => firstItem.value.toLowerCase() < secondItem.value.toLowerCase() ? -1 : 1)
            this.values[this.choiceSelected] = newChoices
            this.add = false
            this.isEditingChoice = false
            this.newChoice = ''
            this.newPar = ''
            this.choiceSelected = ''
            console.log(data)
          })
          .catch(function(err) {
            console.log("Error: ", err)
            self.errorBox = true
            self.errorMessage = "API could not be reached. Update did not happen"
          })
      },
      async getListFromAPI () {
        // return await axios.get(
        //   apiurl
        // ).then(data => console.log(data.data))
      },
      async getPeople () {
        //eventually this should call a new API call that gets the full list of people
        if (!axios) {
          return
        }
        await axios.get(
          this.people_api_url
        ).then(data => {
          this.people = data.data
        })
        
      },
      filter (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
      },
    }
  }
</script>