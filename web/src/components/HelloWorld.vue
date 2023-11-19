<template>
  <!-- Main Content -->
  <v-container>
    <!-- Search Box -->
    <v-form ref="searchForm" v-on:submit.prevent="handleSearch">
      <v-row class="my-4">
        <v-col cols="7">
          <div class="font-weight-light text-h5 mb-2">Search</div>
          <v-text-field v-model="filters.searchText"
                        persistent-hint
                        hint="Ex: level:error,success fts:'Error in DB' spanID:r'<regex>' commit:*123 resourceID:abd* metadata.foo:bar"
                        single-line bg-color="#2B2B2B" solo flat border="4" clearable variant="solo"
                        :rules="searchRules" hide-details="auto" name="Search"
          ></v-text-field>
        </v-col>
        <v-col class="mt-10" cols="2">
          <v-text-field v-model="filters.startDate" type="datetime-local" label="Start Date"
                        bg-color="#2B2B2B" solo clearable variant="solo"
                        hide-details="auto" name="Search"></v-text-field>
        </v-col>
        <v-col class="mt-10" cols="2">
          <v-text-field v-model="filters.endDate" type="datetime-local" label="End Date"
                        bg-color="#2B2B2B" solo clearable variant="solo"
                        hide-details="auto" name="Search"></v-text-field>
        </v-col>
        <v-col class="mt-11" cols="1">
          <v-btn class="together" color="#ffcaaf" icon="mdi-magnify" rounded="0" type="submit"
                 @click="handleSearch"></v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-table class="pb-5" density="compact" hover>
      <thead>
      <tr>
        <th class="text-left">
          Level
        </th>
        <th class="text-left">
          TimeStamp
        </th>
        <th class="text-left">
          Message
        </th>
        <th class="text-left">
          resourceID
        </th>
        <th class="text-left">
          traceID
        </th>
        <th class="text-left">
          spanID
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(log,index) in logs"
        :key="index"
      >
        <td>{{ log.level }}</td>
        <td>{{ log.timestamp }}</td>
        <td class="d-inline-block text-truncate" style="max-width: 450px;">{{ log.message }}</td>
        <td>{{ log.resourceID }}</td>
        <td>{{ log.traceID }}</td>
        <td>{{ log.spanID }}</td>
      </tr>
      </tbody>
    </v-table>
    <v-pagination v-model="pagination.currentPage" :length="pagination.totalPages"
                  class="text-deep-orange-lighten-4"
                  @click="fetchData" border elevation="0"></v-pagination>
  </v-container>
</template>

<script lang="ts">
import {AxiosResponse} from "axios";
import logService from "@/services/log.service";
import socketService from "@/services/socket.service";
interface Log {
  level: string;
  message: string;
  resourceID: string;
  timestamp: Date;
  traceID: string;
  spanID: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
}
export default {
  data() {
    return {
      filters: {
        searchText: '',
        startDate: '',
        endDate: ''
      },
      searchRules: [
        // Todo-> validation here
      ],
      logs: [] as Log[] ,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        limit: 15 // Set the default limit
      },
    };
  },
  created() {

    this.fetchData();
    socketService.makeConnection();
    socketService.socket.on("log.created", this.handleLogCreated);
  },
  computed: {},
  methods: {
    async fetchData() {
      const response: AxiosResponse = await logService.search(this.filters, this.pagination.currentPage, this.pagination.limit)
      this.logs = response.data.results
      this.pagination.currentPage = response.data.currentPage
      this.pagination.totalPages = response.data.totalPages
    },
    handleLogCreated(data:any) {
      // Either call the API again or handle New incoming data
      // this.logs.unshift(data);
      this.fetchData()
      // this.$forceUpdate()
    },
    async handleSearch(data:any) {
      const {valid} = (this.$refs['searchForm'] as any).validate();
      this.fetchData()
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
.together {
  min-width: 0
}
</style>
