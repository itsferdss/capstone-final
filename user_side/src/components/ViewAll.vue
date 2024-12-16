<template>
  <div class="form-container">
    <h1>Patient Information Form</h1>
    <form @submit.prevent="submitForm">
      <!-- Customer and Email -->
      <div class="form-row">
        <div class="form-group">
          <label for="customer"> Name *</label>
          <input type="text" id="customer" v-model="form.customer" placeholder="First Name Last Name" required />
        </div>
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="form.email" placeholder="ex: myname@example.com" required />
        </div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password">Password *</label>
        <input type="password" id="password" v-model="form.password" placeholder="Password" required />
      </div>

      <!-- Birth Date -->
      <div class="form-row">
        <label for="birthDate">Birth Date *</label>
        <input type="date" id="birthDate" v-model="form.birthDate" required />
      </div>

      <!-- Age Display -->
      <div class="form-row" v-if="form.birthDate">
        <label for="age">Age</label>
        <input type="text" id="age" :value="age" disabled />
      </div>

      <!-- Address -->
      <div class="form-group">
        <label for="address">Address *</label>
        <input type="text" id="address" v-model="form.address" placeholder="Complete Address" required />
      </div>

      <!-- Contact Number -->
      <div class="form-group">
        <label for="contact">Contact Number *</label>
        <input type="tel" id="contact" v-model="form.contact" placeholder="e.g., +1234567890" required pattern="[\+]?[0-9]{10,15}" />
      </div>

      <!-- Prescription Section -->
      <div class="form-container-group">
  <h3>Prescription</h3>
  <table class="prescription-table">
    <thead>
      <tr>
        <th>Eye</th>
        <th>Sphere (SPH)</th>
        <th>Cylinder (CYL)</th>
        <th>Axis</th>
        <th>Best VA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>OD</td>
        <td><input type="text" v-model="form.prescription.rightSphere" placeholder="SPH" disabled /></td>
        <td><input type="text" v-model="form.prescription.rightCylinder" placeholder="CYL" disabled /></td>
        <td><input type="text" v-model="form.prescription.rightAxis" placeholder="Axis" disabled /></td>
        <td><input type="text" v-model="form.prescription.bestVA" placeholder="Best VA" disabled /></td>
        
      </tr>
      <tr>
        <td>OS</td>
        <td><input type="text" v-model="form.prescription.leftSphere" placeholder="SPH" disabled /></td>
        <td><input type="text" v-model="form.prescription.leftCylinder" placeholder="CYL" disabled /></td>
        <td><input type="text" v-model="form.prescription.leftAxis" placeholder="Axis" disabled /></td>
        <td><input type="text" v-model="form.prescription.bestVA" placeholder="Best VA" disabled /></td>
        </tr>

        <tr>
          <td></td>
          <td><input type="text" v-model="form.prescription.ReadingAd" placeholder="ReadingAd" disabled /></td>
        
        <td></td>
        <td><input type="text" v-model="form.prescription.pd" placeholder="PD" disabled /></td>
        <td></td>
        
      </tr>
    </tbody>
  </table>
</div>


      <!-- Spectacles Section -->
      <div class="form-container-group">
        <h3>Spectacles Preferences</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="frame">Frame</label>
            <input type="text" id="frame" v-model="form.frame" placeholder="Frame Brand" disabled />
          </div>
          <div class="form-group">
            <label for="leftEye">Lens</label>
            <input type="text" id="leftEye" v-model="form.frame" placeholder="Lens Type" disabled />
          </div>
        </div>
      </div>

      <!-- Medical History -->
      <div class="form-container-group">
        <h3>Medical Records</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="rightEye">Ocular</label>
            <input type="text" id="rightEye" v-model="form.Ocular" placeholder="Ocular History" disabled />
          </div>
          <div class="form-group">
            <label for="MedicalHistory">Medical History</label>
            <input type="text" id="MedicalHistory" v-model="form.Medical" placeholder="Medical History" disabled />
          </div>
        </div>
      </div>


      <!-- Submit Button -->
      <img src="../src/assets/mvc.jpg" alt="Submit Logo" class="submit-logo" />
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        customer: "",
        email: "",
        birthDate: "",
        address: "",
        contact: "",
        password: "",
        prescription: { rightEye: "", leftEye: "" },
        spectacles: { frameType: "", lensType: "" },
        ocularHistory: [],
        familyHistory: [],
        agreeToTerms: false,
        agreeToPrivacy: false,
      },
      ocularHistory: ["No previous ocular issues", "Wears glasses", "Has had surgery", "Other"],
      familyHistory: ["Glaucoma", "Macular Degeneration", "Diabetic Retinopathy", "Other"],
    };
  },
  computed: {
    age() {
      const birthDate = new Date(this.form.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      return m < 0 || (m === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
    },
  },
  methods: {
    submitForm() {
      if (!this.form.prescription.rightEye || !this.form.prescription.leftEye) {
        alert("Please complete your prescription details.");
        return;
      }
      if (!this.form.spectacles.frameType || !this.form.spectacles.lensType) {
        alert("Please select your spectacles preferences.");
        return;
      }
      alert("Form submitted successfully!");
      // Additional form submission logic
    },
    openTermsModal() {
      // Logic to open terms modal
    },
    openPrivacyPolicyModal() {
      // Logic to open privacy policy modal
    },
  },
};
</script>




<style scoped>
/* Existing styles here */

.form-group {
  margin-bottom: 15px;
}

input[type="tel"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;  
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1, h3 {
  color: #333;
  margin-bottom: 10px;
}

.form-group, .form-row {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}

.form-checkboxes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input[type="checkbox"] {
  margin-left: 0;
}

.terms-checkbox {
  display: flex;
  align-items: center;
}

.form-container-group {
  background-color: #e9ecef;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.submit-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #d32f2f;
}


.terms-modal, .privacy-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #d32f2f;
}

.prescription-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.prescription-table th,
.prescription-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  vertical-align: middle; /* Ensures inputs align properly within the table cells */
}

.prescription-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.prescription-table input {
  width: calc(100% - 10px); /* Ensures inputs stay within their cell's boundaries */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box; /* Prevents inputs from exceeding their container */
  background-color: #f9f9f9;
}

.submit-logo {
  width: 300px; /* Adjust size */
  height: auto;
  cursor: pointer;
  display: block;
  margin: 0 auto; /* Centers horizontally */
  text-align: center; /* Ensures it's centered within its container */
}


</style>