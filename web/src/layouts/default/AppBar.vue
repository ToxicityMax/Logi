<template>
  <v-app-bar app color="primary">

    <v-row>
      <v-col
        cols="auto"
        class="me-auto"
      >
        <v-app-bar-title class="pl-16 ml-3">
          <v-icon icon="mdi-view-dashboard"/>
          LOGI: Log Ingestor and Dashboard
        </v-app-bar-title>
      </v-col>
      <v-col cols="auto">
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
                <div class="text-h6">Ingest Logs with JSON text</div>
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
              </v-card-actions>
            </v-card>
          </v-form>

        </v-dialog>
      </v-col>
      <v-col class="pr-16 mr-2" cols="auto">
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
      </v-col>
    </v-row>
    <!--    <v-row justify="end" no-gutters >-->
    <!--      <v-col>-->
    <!--        <v-app-bar-title>-->
    <!--          <v-icon icon="mdi-view-dashboard"/>-->
    <!--          LOGI: Log Ingestor and Dashboard-->
    <!--        </v-app-bar-title>-->
    <!--      </v-col>-->
    <!--      <v-col>-->
    <!--        <v-btn text="Ingest Logs"></v-btn>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

  </v-app-bar>
</template>

<script >
import logService from "@/services/log.service";

export default {
  data: () => {
    return {
      dialogBulk: false,
      dialogFile: false,
      jsonLogs: "",
      logFile: null,
      textRule: [
        value => {
          try {
            JSON.parse(value)
          } catch (e) {
            return "JSON Parse error"
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
      const response = await logService.ingestDataBulk(JSON.parse(this.jsonLogs))
      // Success message
      this.dialogBulk = false
    },
    async submitFile(e) {
      // const fileInput = document.getElementById('fileInput');
      const form =  new FormData()
      form.append("file", this.file)
      const response = await logService.ingestDataWithFile(form)
      // Success message
      this.dialogBulk = false
    },
    handleFileUpload(e){
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
