<template>
    <div>
        <img src="../assets/MVC_logo.png" class="mvcLogo">
    </div>
    <div class="form-container">
        <h1>Registration Form</h1>
        <form @submit.prevent="submitForm">
            <!-- Customer and Email -->
            <div class="form-row">
                <div class="form-group">
                    <label for="customer">Name *</label>
                    <input type="text" id="customer" v-model="form.full_name" placeholder="First Name Last Name"
                        required />
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
                <input type="date" id="birthDate" v-model="form.birthdate" required />
            </div>

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
                <input type="tel" id="contact" v-model="form.contact" placeholder="e.g., +1234567890" required
                    pattern="[\+]?[0-9]{10,15}" />
            </div>

            <!-- Ocular History Container -->
            <div class="form-container-group">
                <h3>Ocular History</h3>
                <div class="form-checkboxes">
                    <div v-for="(item, index) in ocular_history" :key="index" class="checkbox-item">
                        <input type="checkbox" :id="item" :value="item" v-model="form.ocular_history" />
                        <label :for="item">{{ item }}</label>
                    </div>
                </div>
                <!-- Input for Other Ocular History -->
                <div v-if="form.ocular_history.includes('Other')" class="form-group">
                    <label for="otherOcular">Please specify</label>
                    <input type="text" id="otherOcular" v-model="form.otherOcular_history"
                        placeholder="Specify other ocular history" />
                </div>
            </div>

            <!-- Medical History Container -->
            <div class="form-container-group">
                <h3>Medical History</h3>
                <div class="form-checkboxes">
                    <div v-for="(item, index) in medical_history" :key="index" class="checkbox-item">
                        <input type="checkbox" :id="item" :value="item" v-model="form.medical_history" />
                        <label :for="item">{{ item }}</label>
                    </div>
                </div>
                <!-- Input for Other Medical History -->
                <div v-if="form.medical_history.includes('Other')" class="form-group">
                    <label for="otherMedical">Please specify</label>
                    <input type="text" id="otherMedical" v-model="form.otherMedical_history"
                        placeholder="Specify other medical history" />
                </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="form-row">
                <div class="form-group terms-checkbox">
                    <input type="checkbox" id="terms" v-model="form.agreeToTerms" required />
                    <label for="terms">I agree to the <a href="/#/register" @click="openTermsModal">Terms and
                            Conditions</a></label>
                </div>
            </div>

            <!-- Privacy Policy -->
            <div class="form-row">
                <div class="form-group terms-checkbox">
                    <input type="checkbox" id="privacy" v-model="form.agreeToPrivacy" required />
                    <label for="privacy">I have read the <a href="/#/register" @click="openPrivacyPolicyModal">Privacy
                            Policy</a></label>
                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="submit-button">Sign Up!</button>
        </form>

        <!-- Modal for Age Error -->
        <div v-if="isUnderage || isOverage" class="error-modal">
            <div class="modal-content">
                <h2>Error: Age Restriction</h2>
                <p v-if="isUnderage">You must be at least 18 years old to register.</p>
                <p v-if="isOverage">You must be under 150 years old to register.</p>
                <button @click="closeErrorModal" class="close-button">Close</button>
            </div>
        </div>

        <!-- Modal for Terms and Conditions -->
        <div v-if="isTermsModalOpen" class="terms-modal" max-width="1300px">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="headerText">Terms and Conditions for Reserving Eyewear</h1>
                </div>
                <div class="modal-body">
                    <p>These Terms and Conditions govern the process of reserving eyewear through our website. By using
                        our
                        reservation system, you agree to comply with these terms. Please read them carefully before
                        reserving any eyewear.</p>

                    <h3>1. Eligibility</h3>
                    <p>You must be at least 18 years of age or have the consent of a parent or guardian to reserve
                        eyewear.
                        By reserving eyewear, you confirm that you meet the eligibility criteria.</p>

                    <h3>2. Reservation Process</h3>
                    <ul>
                        <li><strong>Reservation:</strong> By reserving eyewear through our website, you are indicating
                            your
                            intent to check and potentially purchase the eyewear in person at our physical store.</li>
                        <li><strong>Availability:</strong> Reservations are subject to availability. We strive to keep
                            our
                            stock up-to-date, but availability can change due to high demand.</li>
                        <li><strong>No Purchase Commitment:</strong> Reserving eyewear does not require immediate
                            purchase.
                            You are only reserving the item for future inspection in-store.</li>
                    </ul>

                    <h3>3. Reservation Confirmation</h3>
                    <p>Once you complete your reservation, you will receive a confirmation email with details about the
                        eyewear item(s) reserved and the store location. Please keep this confirmation for reference.
                        Reservations are held for <strong>[7]</strong> days after the reservation date.</p>

                    <h3>4. In-Store Inspection</h3>
                    <ul>
                        <li><strong>Time Limit:</strong> Upon visiting our store to view the reserved eyewear, you will
                            have
                            the opportunity to inspect the items. If the eyewear is suitable, you may proceed with the
                            purchase.</li>
                        <li><strong>Inspection Fees:</strong> There are no fees associated with reserving or inspecting
                            eyewear in-store unless specified otherwise for premium services.</li>
                    </ul>

                    <h3>5. Changes and Cancellations</h3>
                    <ul>
                        <li><strong>Modifications:</strong> If you wish to change your reserved eyewear selection,
                            please
                            contact us at least <strong>[X]</strong> hours before your scheduled appointment.</li>
                        <li><strong>Cancellations:</strong> You may cancel your reservation at any time prior to your
                            visit.
                            To cancel, please follow the instructions in your confirmation email or contact us directly.
                        </li>
                    </ul>

                    <h3>6. Payment Terms</h3>
                    <p>Payment for eyewear is due at the time of purchase in-store. We accept cash method only. Please
                        ensure you bring a valid form of payment when visiting our store.</p>

                    <h3>7. Product Availability and Pricing</h3>
                    <ul>
                        <li><strong>Pricing:</strong> All prices listed for eyewear are subject to change without
                            notice.
                            The price you will pay for the eyewear is the one in effect at the time of your in-store
                            purchase.</li>
                        <li><strong>Product Availability:</strong> Although we make every effort to maintain accurate
                            inventory levels, some products may be unavailable at the time of your store visit due to
                            factors beyond our control. We cannot guarantee the availability of a specific item.</li>
                    </ul>

                    <h3>8. Liability</h3>
                    <p>We are not liable for any loss, damage, or injury incurred as a result of reserving or inspecting
                        eyewear at our store. You assume all risks associated with the reservation process and in-store
                        visit.</p>

                    <h3>9. Privacy and Data Protection</h3>
                    <p>By reserving eyewear, you agree to our <a href="/#/register"
                            @click="openPrivacyPolicyModal">Privacy Policy</a>, which
                        outlines
                        how we collect, use, and protect your personal data. We will only use the information you
                        provide
                        for the purpose of processing your reservation and contacting you about your selected eyewear.
                    </p>

                    <h3>10. Use of Reserved Eyewear</h3>
                    <p>Any eyewear reserved through our website is for personal use only. Commercial use, resale, or
                        distribution of reserved eyewear is prohibited.</p>

                    <h3>11. Compliance with Local Laws</h3>
                    <p>By reserving eyewear through our platform, you agree to comply with all applicable local, state,
                        and
                        national laws and regulations.</p>

                    <h3>12. Contact Us</h3>
                    <p>If you have any questions or concerns about the reservation process or these Terms and
                        Conditions,
                        please contact us at:</p>
                    <p><strong>MVC Optical Clinic</strong></p>
                    <p>Phone: <strong>[Phone Number]</strong></p>
                    <p>Email: <strong>[Email Address]</strong></p>
                    <p>Address: <strong>Cabanggan, Zambales</strong></p>

                    <h3>Consent</h3>
                    <p>By proceeding with the reservation of eyewear, you acknowledge and accept these Terms and
                        Conditions.
                        If you do not agree with any part of these terms, please refrain from making a reservation.</p>

                    <button @click="closeTermsModal" class="close-button">Close</button>
                </div>
            </div>
        </div>

        <!-- Modal for Privacy Policy -->
        <div v-if="isPrivacyPolicyModalOpen" class="privacy-modal" max-width=" 1300px">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="headerText">Privacy and Policy</h1>
                </div>
                <div class="modal-body">
                    <p><strong>1. Introduction:</strong></p>
                    <p>We value your privacy and are committed to protecting your personal information.</p>

                    <p><strong>2. Information Collection:</strong></p>
                    <ul>
                        <li>We collect personal data such as name, email address, birthdate, and address when you fill
                            out
                            forms.</li>
                        <li>This data is used to process your order and improve our services.</li>
                    </ul>

                    <p><strong>3. Data Protection:</strong></p>
                    <ul>
                        <li>Your personal information is stored securely and we take reasonable precautions to protect
                            it.
                        </li>
                        <li>We do not share your data with third parties without your consent.</li>
                    </ul>

                    <button @click="closePrivacyPolicyModal" class="close-button">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            form: {
                full_name: "",
                email: "",
                birthdate: "",
                address: "",
                contact: "",
                password: "",
                ocular_history: [],
                medical_history: [],
                agreeToTerms: false,
                agreeToPrivacy: false,
                otherOcular: "",
                otherMedical: "",
            },
            ocular_history: ["No previous ocular issues", "Wears glasses", "Has had surgery", "Other"],
            medical_history: ["Glaucoma", "Macular Degeneration", "Diabetic Retinopathy", "Other"],
            isUnderage: false,
            isOverage: false,
            isTermsModalOpen: false,
            isPrivacyPolicyModalOpen: false,
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
            if (this.age < 5) {
                Swal.fire({
                    title: 'Error',
                    text: 'The patient is too young for validation. Age must be at least 5 years old.',
                    icon: 'error',
                });
                return; // Prevent form submission
            }

            // Merge "Other" fields into main history arrays if applicable
            if (this.form.ocular_history.includes("Other") && this.form.otherOcular_history) {
                this.form.ocular_history = this.form.ocular_history.filter(item => item !== "Other");
                this.form.ocular_history.push(this.form.otherOcular_history);
            }

            if (this.form.medical_history.includes("Other") && this.form.otherMedical) {
                this.form.medical_history = this.form.medical_history.filter(item => item !== "Other");
                this.form.medical_history.push(this.form.otherMedical);
            }

            // Send the patient data to the backend
            axios.post('/patients', this.form)
                .then(response => {
                    const patientId = response.data.id;  // Get the created patient's ID

                    console.log('Patient ID received from backend:', patientId);

                    // Ensure patient_id is present in formData
                    const today = new Date();
                    const formattedDate = today.toISOString().split('T')[0];  // Format as YYYY-MM-DD

                    // Ensure patient_id and date are present in formData
                    const formData = {
                        patient_id: patientId,
                        date: formattedDate,  // Include today's date
                        medical_history: this.form.medical_history.join(', '),
                        ocular_history: this.form.ocular_history.join(', '),
                    };
                    console.log("Form Data to be sent:", formData);

                    // Send the history data along with the patient ID
                    return axios.post(`/patients/${patientId}/history`, formData);
                })
                .then(() => {
                    this.resetForm();

                    Swal.fire({
                        title: 'Success',
                        text: 'Patient and medical/ocular history created successfully!',
                        icon: 'success',
                    });
                })
                .catch(error => {
                    console.error('Error during submission:', error);

                    Swal.fire({
                        title: 'Error',
                        text: error.response?.data?.patient_id || 'Failed to create patient history.',
                        icon: 'error',
                    });
                });
        },

        openTermsModal() {
            this.isTermsModalOpen = true;
        },
        closeTermsModal() {
            this.isTermsModalOpen = false;
        },
        openPrivacyPolicyModal() {
            this.isPrivacyPolicyModalOpen = true;
        },
        closePrivacyPolicyModal() {
            this.isPrivacyPolicyModalOpen = false;
        },
        closeErrorModal() {
            this.isUnderage = false;
            this.isOverage = false;
        },
        resetForm() {
            this.form = {
                full_name: "",
                email: "",
                birthdate: "",
                address: "",
                contact: "",
                password: "",
                ocular_history: [],
                medical_history: [],
                agreeToTerms: false,
                agreeToPrivacy: false,
                otherOcular: "",
                otherMedical: "",
            };
        },
    },
};
</script>


<style scoped>
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
    width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.form-group,
.form-row {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

input,
select {
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


.terms-modal,
.privacy-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    border-radius: 8px;
    width: 80%;
    max-height: 90%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 20px;
    
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

.form-container {
    width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h3 {
    color: #333;
    margin-bottom: 10px;
    text-align: center;
}

.form-group,
.form-row {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

input,
select {
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
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.terms-checkbox {
    display: flex;
    align-items: center;
}

.submit-button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #45a049;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 80%;
    max-width: 500px;
}

.close-button {
    background-color: #d9534f;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.close-button:hover {
    background-color: #c9302c;
}

.mvcLogo {
    width: 800px;
    margin-top: 20px;
    border-radius: 10px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
}

.modal-header { 
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
}

.modal-body {
    padding: 10px 0;
    font-size: 14px;
    line-height: 1.6;
    text-align: left;
}

.modal-body h3 {
    margin: 15px 0 10px;
    font-size: 16px;
    text-align: left;
    font-display: bold;
}

.modal-body ul {
    padding-left: 20px;
    list-style-type: disc;
}
.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.headerText{
    font-size: 30px;
    text-align: left;
}
@media (max-width: 768px) {
    .form-container{
        margin-top: 50px;
        widows: auto;
    }

    .submit-button {
        font-size: 20px;
    }

    .form-checkboxes {
        justify-content: start;
    }
}


</style>