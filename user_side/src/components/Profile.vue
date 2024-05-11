<template>
  <v-container>
    <!-- Parent's information -->
    <v-card class="mb-4">
      <v-card-title>Parent's Information</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <strong>First Name:</strong> {{ user.firstName }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Middle Name:</strong> {{ user.middleName }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Last Name:</strong> {{ user.lastName }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Suffix:</strong> {{ user.suffix }}
          </v-col>
          <v-col cols="12">
            <strong>Address:</strong> {{ user.address }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>Phone Number:</strong> {{ user.contact_number }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>Email:</strong> {{ user.email }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  <!-- Child's information -->
    <v-card class="mb-4">
      <v-card-title>Child's Information</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <strong>Child's Name:</strong> {{ childInfo.name }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Age:</strong> {{ childInfo.age }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Birthdate:</strong> {{ childInfo.birthdate }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!--Another child's information-->
     <v-card class="mb-4">
      <v-card-title>Child's Information</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <strong>Child's Name:</strong> {{ childInfo1.name }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Age:</strong> {{ childInfo1.age }}
          </v-col>
          <v-col cols="12" md="4">
            <strong>Birthdate:</strong> {{ childInfo1.birthdate }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
   
  <v-btn @click="openUpdateParentDialog" color="#35623D" dark style="font-weight: bold;">Update Information</v-btn>

<!--Dialog for update parent profile-->
<v-dialog v-model="updateParentDialog" max-width="1000px">
  <v-card>
    <v-card-title>
      <span class="text-h6 m-2">Update your information</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="user.full_name" label="Parent Name*" prepend-icon="mdi-account" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="user.address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="user.contact_number" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="user.email" label="Email" prepend-icon="mdi-mail" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="user.password" label="Password" prepend-icon="mdi-lock" :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordVisible ? 'text' : 'password'" @click:append="passwordVisible = !passwordVisible" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="user.confirm_password" label="Confirm Password" prepend-icon="mdi-lock" :append-icon="confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'" :type="confirmPasswordVisible ? 'text' : 'password'" @click:append="confirmPasswordVisible = !confirmPasswordVisible" required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="black" text @click="closeDialog">Cancel</v-btn>
      <v-btn color="black" text @click="saveUpdatedInfo">Update</v-btn>
    </v-card-actions>
  </v-card> 
</v-dialog>


  </v-container>
</template>

<script>
export default {
  data() {
    return {
      updateParentDialog: false,
      user: {
        firstName: 'Gian King',
        middleName: 'C',
        lastName: 'Caampued',
        suffix: 'Jr.',
        address: 'San Antonio, Zambales',
        contact_number: '09668109204',
        email: 'gian@example.com',
        full_name: 'Gian King Caampued',
        password: '123',
        confirm_password: '123',
      },
      passwordVisible: false,
      confirmPasswordVisible: false,
 
      childInfo: {
        name: 'Jovert Laureano',
        age: 5,
        birthdate: '2019-02-14',
      },
      childInfo1: {
        name: 'Bryce Laureano',
        age: 6,
        birthdate: '2018-05-13',
      },
    };
  },
  methods:{
    openUpdateParentDialog() {
      this.updateParentDialog = true;
    },
    closeDialog() {
      this.updateParentDialog = false;
    },
    saveNewUser() {
      // Logic to save new user
    }
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
