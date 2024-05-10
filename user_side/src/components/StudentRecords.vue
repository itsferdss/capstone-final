<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            label="Search Appointment"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn @click="dialog = true" prepend-icon="mdi-plus">Add New Appointment</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-for="appointment in filteredAppointments" :key="appointment.id">
          <v-card>
            <v-card-title>{{ appointment.title }}</v-card-title>
            <v-card-text>
              <div>Student: {{ appointment.student }}</div>
              <div>{{ appointment.description }}</div>
              <div>Date: {{ appointment.date }}</div>
              <v-btn @click="editAppointment(appointment)">Edit</v-btn>
              <v-btn @click="confirmDelete(appointment)">Delete</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>cd
        <v-card-title>Edit Appointment</v-card-title>
        <v-card-text>
          <v-text-field v-model="newAppointment.title" label="Title"></v-text-field>
          <v-text-field v-model="newAppointment.student" label="Student"></v-text-field>
          <v-textarea v-model="newAppointment.description" label="Description"></v-textarea>
          <v-text-field v-model="newAppointment.date" label="Date" type="date"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" @click="saveAppointment">Save</v-btn>
          <v-btn color="blue" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Action</v-card-title>
        <v-card-text>
          Are you sure you want to delete this appointment?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="deleteAppointment">Delete</v-btn>
          <v-btn color="blue" @click="cancelDelete">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      dialog: false,
      confirmDialog: false,
      editingAppointment: null,
      newAppointment: {
        title: '',
        student: '',
        description: '',
        date: '',
      },
      appointments: [
        {
          id: 1,
          title: 'Appointment 1',
          student: 'John Doe',
          description: 'Description 1',
          date: '2024-05-01',
        },
        {
          id: 2,
          title: 'Appointment 2',
          student: 'Jane Smith',
          description: 'Description 2',
          date: '2024-05-02',
        },
      ],
    };
  },
  computed: {
    filteredAppointments() {
      return this.appointments.filter(appointment =>
        appointment.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    editAppointment(appointment) {
      this.editingAppointment = appointment;
      this.newAppointment = { ...appointment };
      this.dialog = true;
    },
    saveAppointment() {
  if (this.editingAppointment) {
    // Show confirmation message before saving edits
    if (confirm('Are you sure you want to save changes?')) {
      Object.assign(this.editingAppointment, this.newAppointment);
      this.closeDialog();
    }
  } else {
    // Check if the title is already taken
    if (this.appointments.some(appointment => appointment.title.toLowerCase() === this.newAppointment.title.toLowerCase())) {
      alert('An appointment with the same title already exists. Please choose a different title.');
      return;
    }

    // Show confirmation message before adding new appointment
    if (confirm('Are you sure you want to add this appointment?')) {
      const id = this.appointments.length + 1;
      this.newAppointment.id = id;
      this.appointments.push({ ...this.newAppointment });
      this.closeDialog();
    }
  }
},

    closeDialog() {
      this.dialog = false;
      this.editingAppointment = null;
      this.newAppointment = {
        title: '',
        student: '',
        description: '',
        date: '',
      };
    },
    confirmDelete(appointment) {
      this.editingAppointment = appointment;
      this.confirmDialog = true;
    },
    cancelDelete() {
      this.editingAppointment = null;
      this.confirmDialog = false;
    },
    deleteAppointment() {
      if (this.editingAppointment) {
        const index = this.appointments.indexOf(this.editingAppointment);
        this.appointments.splice(index, 1);
        this.closeDialog();
        this.confirmDialog = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
