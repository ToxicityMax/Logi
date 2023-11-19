<template>
  <v-app-bar app color="primary">
        <v-app-bar-title>
          <v-icon icon="mdi-view-dashboard"/>
          LOGI: Log Ingestor and Dashboard
        </v-app-bar-title>
      <template v-slot:append>
        <v-dialog
          v-model="dialogBulk"
          persistent
          width="1024"
        >
          <template v-slot:activator="{ props }">
            <v-btn ripple v-bind="props" class="mybutton" text="Json Ingest"></v-btn>

          </template>
          <v-form ref="submitForm" @submit.prevent="submitBulk">
            <v-card>
              <v-card-title class="pt-5 ml-7">
                <div class="text-h6">Ingest Logs with JSON Array</div>
              </v-card-title>
              <v-card-text>
                <v-container>

                  <v-row>
                    <v-col>
                      <v-textarea v-model="jsonLogs" single-line variant="solo-filled" :rules="textRule"
                                  hint="Add json array of logs"
                                  persistent-hint>

                      </v-textarea>
                    </v-col>
                  </v-row>

                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialogBulk = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  type="submit"
                  @click="submitBulk"
                >
                  Save
                </v-btn>
                <v-snackbar
                  :timeout="3000"
                  v-model="snackBarBulk"
                  color="#ffcaaf"
                  elevation="24"
                >
                  {{ snackbarMessageBulk }}
                </v-snackbar>
              </v-card-actions>
            </v-card>
          </v-form>

        </v-dialog>
        <v-dialog
          v-model="dialogFile"
          id="fileInput"
          persistent
          width="1024"
        >
          <template v-slot:activator="{ props }">
            <v-btn ripple v-bind="props" class="mybutton" text="File Ingest"></v-btn>

          </template>
          <v-form ref="submitForm" @submit.prevent="submitFile">
            <v-card>
              <v-card-title class="pt-5 ml-7">
                <div class="text-h6">Ingest Logs with JSON file</div>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-file-input ref="file" v-model="logFile"
                                    @change="handleFileUpload"
                                    label="Json File input"></v-file-input>
                    </v-col>
                  </v-row>

                </v-container>
              </v-card-text>
              <v-snackbar
                :timeout="3000"
                v-model="snackBarFile"
                color="#ffcaaf"
                elevation="24"
              >
                {{ snackbarMessageFile }}
              </v-snackbar>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="dialogFile = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  type="submit"
                  @click="submitFile"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>

        </v-dialog>
      </template>
  </v-app-bar>
</template>

<script>
import logService from "@/services/log.service";

export default {
  data: () => {
    return {
      dialogBulk: false,
      dialogFile: false,
      jsonLogs: "",
      logFile: null,
      snackBarBulk: false,
      snackbarMessageBulk: '',
      snackBarFile: false,
      snackbarMessageFile: '',
      textRule: [
        value => {
          try {
            if (!Array.isArray(JSON.parse(value)))
              return "JSON Parse error. Should be a JSON array of logs"
          } catch (e) {
            return "JSON Parse error. Should be a JSON array of logs"
          }
          return true
        },
      ],
    }
  },
  methods: {
    async submitBulk() {
      try {
        JSON.parse(this.jsonLogs)
      } catch (e) {
        // raise Error
      }

      const response = await logService.ingestDataBulk(JSON.parse(this.jsonLogs)).catch((error) => {
        this.snackbarMessageBulk = error.response.data.message
        this.snackBarBulk = true
        setTimeout(() => {
          this.dialogBulk = false
        }, 3000)
      })

      // Success message
      this.snackbarMessageBulk = response.data.message
      this.snackBarBulk = true
      setTimeout(() => {
        this.dialogBulk = false
      }, 3000)
    },
    async submitFile() {
      // const fileInput = document.getElementById('fileInput');
      const form = new FormData()
      form.append("file", this.file)
      const response = await logService.ingestDataWithFile(form).catch((error) => {
        this.snackbarMessageFile = error.response.data.message
        this.snackBarFile = true
        setTimeout(() => {
          this.dialogFile = false
        }, 3000)
      })

      // Success message
      this.snackbarMessageFile = response.data.message
      this.snackBarFile = true
      setTimeout(() => {
        this.dialogFile = false
      }, 3000)
    },
    handleFileUpload(e) {
      this.file = e.target.files[0];
    }
  }
}
</script>

<style scoped>
.mybutton:hover {
  background-color: #2b2b2b !important;
  color: white !important;
}
</style>
