<template>
  <div class="landing-page"> <!-- Change the <body> to a <div> and add a wrapper -->
    <header>
      <div class="topnav">
        <img class="logo" src="../assets/newlogo.png" />
        <div class="logo-separator"></div>
        <img class="MVClogo" src="../assets/MVC_logo.png" />
        <div class="nav-links">
          <a href="#section1" class="nav-link" :class="{ active: activeSection === 'section1' }">Home</a>
          <a href="#section2" class="nav-link" :class="{ active: activeSection === 'section2' }">Offer</a>
          <a href="#section3" class="nav-link" :class="{ active: activeSection === 'section3' }">Team</a>
          <a href="#section4" class="nav-link" :class="{ active: activeSection === 'section4' }">Contact Us</a>
        </div>
      </div>
    </header>
    <div id="section1" class="full-height">
      <div class="content">
        <div class="background-overlay"></div>
        <div class="groupTitle">
          <h1 class="Title">Elevate Your Look, <br> Enhance Your Sight</h1>
          <p class="subtitle">MVC Optical CLinic is one of the most trusted eye <br>
            care business with a focus on style and reliability. <br>
            At MVC Optical Clinic, we blend trusted expertise <br>
            with fashionable solutionsto keep your vision and <br>
            style on point. </p>
        </div>
        <div class="button-borders">
          <button class="primary-button" @click="goToLogin"> Shop Now!
          </button>
        </div>
      </div>

    </div>
  </div>


  <div class="full-height" id="section2">
    <div class="about">
    </div>

    <div class="offers-section">
      <div class="offer-header">
        <h2>Our Services</h2>
        <p>What Service We Offer</p>
        <button class="all-services-button">All Services</button>
      </div>

      <div class="offers">
        <div class="offer-box">
          <img src="/src/assets/eyecare.jpg" alt="Eye Care" class="offer-image">
          <p class="offer-title">Eye Care</p>
          <p class="offer-text">"Comprehensive eye care services aimed at maintaining optimal vision health. Our expert
            team provides routine eye exams, personalized treatments, and preventive care to protect your eyes and
            improve
            your overall well-being."</p>
        </div>
        <div class="offer-box">
          <img src="/src/assets/retina-repair.jpg" alt="Retina Repair" class="offer-image">
          <p class="offer-title">Comprehensive Eye Refraction</p>
          <p class="offer-text">"An eye exam that measures a person's prescription for eyeglasses or contact lenses.
            Normal vision occurs when light is focused directly on the retina rather than in front or behind it."</p>

        </div>
        <div class="offer-box">
          <img src="/src/assets/vision-check.jpg" alt="Vision Check" class="offer-image">
          <p class="offer-title">Vision Check</p>
          <p class="offer-text">"Regular vision checks to ensure your eyes are in optimal condition. We provide thorough
            eye exams to detect vision problems early, helping you maintain clear and comfortable sight through
            personalized recommendations and treatments."</p>
        </div>
      </div>
    </div>
  </div>


  <div class="full-height" id="section3">
    <div class="about">
      <h1>About Us</h1>
    </div>
    <img class="echode" src="../assets/echode_logo.png" />
    <div class="intro">
      <p>
        We are a dynamic partnership between IT students and MVC Optical Clinic,
        united by a shared vision to revolutionize eye care through technology.<br>
        Our collaboration blends technical expertise with industry insight to
        create innovative solutions that enhance clinic operations and patient experiences. <br>
        IT students bring fresh, cutting-edge perspectives and technical skills, while MVC
        Optical Clinic provides valuable knowledge of eye care needs and practices. <br>
        Together, we are developing a state-of-the-art system that
        streamlines processes, improves patient management, and advances the quality of eye care.<br>
        Our mission is to leverage technology to make eye care more efficient, accessible, and effective,
        ultimately setting new standards in the industry.
      </p>
    </div>
    <div>
      <div class="team">
        <div class="team-images">
          <div class="team-member-box">
            <div class="team-member">
              <img src="/src/assets/gian.png" alt="Gian King Caampued" class="team-image">
              <p class="team-text">Gian King Caampued <br><br>Hustler</p>
            </div>
          </div>
          <div class="team-member-box">
            <div class="team-member">
              <img src="/src/assets/me.png" alt="Ferdinand C. Espiritu II" class="team-image">
              <p class="team-text">Ferdinand C. Espiritu II<br><br>Hipster</p>
            </div>
          </div>
          <div class="team-member-box">
            <div class="team-member">
              <img src="/src/assets/dm.jpg" alt="Denmark Lobo" class="team-image">
              <p class="team-text">Denmark Lobo<br><br>Hacker</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



  <!--SECTION 3-->
  <div class="full-height" id="section4">
    <div class="model-container">
      <!-- Image with overlay -->
      <img class="model" src="../assets/model3.jpg" alt="Model" />
      <div class="lastBut">
        <div class="button-borders">
          <button class="primary-button" @click="goToLogin"> Shop Now!
          </button>
        </div>
      </div>
      <!-- Black overlay with opacity -->
      <div class="overlay"></div>
      <!-- Text on top of the overlay -->
      <div class="overlay-text">
        <h2 class="sec3Title">Elevate Your Look, <br>Enhance Your Sight</h2>
      </div>
    </div>
    <!-- Rectangle at the bottom -->
    <div class="rectangle-container">
      <div class="half-screen-rectangle">
        <div class="rectangle-text">
          <div class="text-section">
            <i class="mdi mdi-office-building mvc-icon"></i>
            <div>
              <p class="mvcInfo">MVC Optical Clinic</p>
              <p class="mvcAdd">Mauricio Bldg, Brgy San Antonio,<br>Cabangan, Zambales</p>
            </div>
          </div>
          <div class="text-section">
            <i class="mdi mdi-phone mvc-icon"></i>
            <div>
              <p class="mvcInfo">Get in Touch</p>
              <p class="mvcAdd">+63 9668109204</p>
              <p class="mvcAdd">mvc@gmail.com</p>
            </div>
          </div>
          <div class="text-section">
            <i class="mdi mdi-share-variant mvc-icon"></i>
            <div>
              <p class="mvcInfo">Visit Us On</p>
              <p class="mvcAdd">Facebook</p>
              <p class="mvcAdd">Instagram</p>
            </div>
          </div>
          <div class="text-section-computer" :class="journey">
            <i class="mdi mdi-account-group mvc-icon"></i>
            <div>
              <p class="mvcInfo">Join Our Journey!</p>
              <p class="mvcAdd">Facebook</p>
              <p class="mvcAdd">Instagram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';  // Import useRouter from vue-router

export default {
  setup() {
    const router = useRouter();  // Define router using useRouter
    const activeSection = ref('section1');

    // Smooth scroll behavior for anchor links
    const handleAnchorClick = (event) => {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    };

    // Handle scroll events to update the active section
    const handleScroll = () => {
      const sections = document.querySelectorAll('.full-height');
      let currentSection = '';

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          currentSection = section.getAttribute('id');
        }
      });

      activeSection.value = currentSection;
    };

    onMounted(() => {
      // Attach event listeners
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', handleAnchorClick);
      });
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    });

    watch(activeSection, (newValue) => {
      const links = document.querySelectorAll('.nav-links a');
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === newValue);
      });
    });

    return {
      goToLogin: () => router.push('/products'),  // Use router to navigate
      activeSection,
    };
  },
};
</script>


<style lang="scss" scoped>
html {
  scroll-behavior: smooth;
  /* Smooth scrolling for anchor links */
}

.topnav {
  position: fixed;
  width: 100%;
  background-color: #016888;
  overflow: hidden;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 15%;
  padding: 20px;
}

.logo {
  height: 60px;
}

.MVClogo {
  height: 60px;
}


#section1 {
  padding-top: 80px;
  margin-bottom: -50px;
  height: 700px;
}

.logo-separator {
  height: 60px;
  width: 2px;
  background-color: #ffffff;
  margin: 0 20px;
}

.nav-links a.active {
  color: #ffffff;
}

.nav-links {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-link.active {
  color: #00aaff;
}

.nav-link::after {
  content: '';
  display: block;
  height: 2px;
  background-color: #00aaff;
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

.nav-link.active::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  margin: 0 15px;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  transition: color 0.3s;
}

.nav-links a {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin-left: 10px;
}

.topnav a.active {
  color: #B3D9E6;
}

.landing-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background-image: url('../assets/eyesbackground.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.9;
  z-index: -1;
  margin-bottom: 40px;
}

.content {
  position: relative;
  /* Keep content above background image */
  z-index: 1;
  /* Ensure content is on top of background */
  padding: 20px;
  color: white;
  /* Adjust text color for better visibility on the background */
  flex: 1;
}

.icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #03233c;
  color: #c39f00;
  border-radius: 10%;
  margin-right: 10px;
  /* Added to create space between the icon and text */
}

.icon-box i {
  font-size: 24px;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.miniTitle {
  margin: 0;
  font-weight: bold;
  text-align: left;
}

.miniSubTitle {
  margin: 0;
  font-size: 12px;
  color: rgb(194, 194, 194);
}

.Title {
  font-family: 'Times New Roman', Times, serif;
  color: rgb(17, 62, 100);
  font-weight: bold;
  font-size: 50px;
  margin-left: 30px;
  margin-top: 200px;
}

.subtitle {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: rgb(17, 62, 100);
  font-size: 13px;
  margin-left: 30px;
  margin-top: 15px;
}

.primary-button {
  font-family: 'Ropa Sans', sans-serif;
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.05rem;
  border: 1px solid #0E1822;
  padding: 0.8rem 2.1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %23FF4655 /* fill: %230E1822; */ %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
  background-color: #0E1822;
  background-size: 200%;
  background-position: 200%;
  background-repeat: no-repeat;
  transition: 0.3s ease-in-out;
  transition-property: background-position, border, color;
  position: relative;
  z-index: 1;
}

.primary-button:hover {
  border: 1px solid #FF4655;
  color: white;
  background-position: 40%;
}

.primary-button:before {
  content: "";
  position: absolute;
  background-color: #0E1822;
  width: 0.2rem;
  height: 0.2rem;
  top: -1px;
  left: -1px;
  transition: background-color 0.15s ease-in-out;
}

.primary-button:after {
  content: "";
  position: absolute;
  background-color: #FF4655;
  width: 0.3rem;
  height: 0.3rem;
  bottom: -1px;
  right: -1px;
  transition: background-color 0.15s ease-in-out;
}

.button-borders {
  position: relative;
  width: fit-content;
  height: fit-content;
  margin-left: 100px;
  margin-top: 100px;
}

.button-borders:before {
  content: "";
  position: absolute;
  width: calc(100% + 0.5em);
  height: 50%;
  left: -0.3em;
  top: -0.3em;
  border: 1px solid #0E1822;
  border-bottom: 0px;
}

.button-borders:after {
  content: "";
  position: absolute;
  width: calc(100% + 0.5em);
  height: 50%;
  left: -0.3em;
  bottom: -0.3em;
  border: 1px solid #0E1822;
  border-top: 0px;
  z-index: 0;
}

.shape {
  fill: #0E1822;
}

/* General Styles */
.offers-section {
  padding: 40px;
  background-color: #ffffff;
  max-width: 1200px;
  margin: 0 auto;
}

.offer-header {
  text-align: center;
  margin-bottom: 40px;
}

.offer-header h2 {
  font-size: 24px;
  color: #00af87;
  margin-bottom: 10px;
}

.offer-header p {
  font-size: 36px;
  color: #333;
  margin-bottom: 5px;
}

.all-services-button {
  background-color: #00af87;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.offers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.offer-box {
  width: 30%;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: left;
  padding: 20px;
  transition: transform 0.3s ease;
}

.offer-box:hover {
  transform: translateY(-5px);
}

.offer-image {
  width: 100%;
  height: 400px;
  border-bottom: 2px solid #00af87;
  margin-bottom: 15px;
}

.offer-title {
  font-size: 20px;
  color: #00af87;
  margin-bottom: 10px;
}

.offer-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.offer-link {
  font-size: 14px;
  color: #00af87;
  text-decoration: none;
  font-weight: bold;
}

#section3 {
  position: relative;
  height: 750px;
  background-color: white;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#section2 {
  position: relative;
  height: 1050px;
  background-color: white;
  margin: 0;
  padding: 0;
  overflow: hidden;
  margin-top: 50px;
}


.about {
  font-family: 'Times New Roman', Times, serif;
  text-align: center;
  position: relative;
  z-index: 1;
  margin-top: 100px;
}


.intro {
  margin-top: 50px;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
  position: relative;
  z-index: 1;
}

.echode {
  position: absolute;
  top: 0;
  left: 1;
  width: 600px;
  height: 600px;
  object-fit: cover;
  opacity: 0.3;

  margin-left: 450px;
}

.team-images {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}

.team-member-box {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 10px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: transform 0.2s;
  z-index: 1;
}

.team-member-box:hover {
  transform: translateY(-5px);
}

.team-image {
  width: 100%;
  height: auto;
  border-radius: 50%;
  margin-bottom: 15px;
}

.team-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.model-container {
  position: relative;
  width: 100%;
  height: 350px;
  margin-top: 75px;
}

.model {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.rectangle-container {
  position: relative;
  width: 100%;
  bottom: 0;
}

.half-screen-rectangle {
  position: relative;
  width: 100%;
  height: 50vh;
  background: #016888;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.rectangle-text {
  display: flex;
  justify-content: space-around;
  /* Distribute space evenly between children */
  width: 100%;
  /* Full width of the container */
  max-width: 1200px;
  /* Limit the width if needed */
  padding: 10px;
  box-sizing: border-box;
  /* Include padding and border in element's total width and height */
}

.rectangle-text>div {
  margin: 0 10px;
  /* Adjust spacing between sections */
  flex: 1;
  /* Allow each section to grow and shrink as needed */
}

.sec3Title {
  font-family: 'Times New Roman', Times, serif;
  font-size: 50px;
}

.lastBut {
  margin-top: -170px;
  margin-left: 575px;
}

.mvcInfo,
.mvcAdd {
  font-family: 'Times New Roman', Times, serif;
  margin: 0;
  /* Reset margin */
}

.mvcInfo {
  margin-bottom: 10px;
  /* Space below the title text */
  font-weight: bold;
}

.mvcAdd {
  margin-top: 5px;
  /* Space above each address or contact detail */
}

@media (max-width: 768px) {
  .topnav {
    position: fixed;
    width: 100%;
    background-color: #016888;
    overflow: hidden;
    z-index: 100;
    display: flex;
    align-items: center;
    height: 8%;
    padding: 20px;
  }
  .logo-separator {
    height: 50px;
  }

  .landing-page .content {
    padding: 10px;
    margin-top: 100px;
  }

  .Title {
    font-size: 30px;
    margin-left: 10px;
    margin-top: 140px;
  }

  .subtitle {
    font-size: 12px;
    margin-left: 10px;
    margin-top: 10px;
  }

  .button-borders {
    margin-left: 32%;
    margin-top: 130px;
  }

  .primary-button {
    font-size: 12px;
    padding: 0.5rem 1.5rem;
  }

  .offers-section {
    padding: 20px;
  }

  .offer-header h2 {
    font-size: 20px;
  }

  .offer-header p {
    font-size: 24px;
  }

  .offer-text {
    font-size: 12px;
  }

  .team-images {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .team-member-box {
    margin-bottom: 20px;
  }
  .nav-links{
    display: none;
  }
  .logo{
    height: 30px;
  }

  .MVClogo{
    width: 150px;
    height: 40px;
    border-radius: 10px;
  }

  .background-overlay{
    height: 250%;
    margin-top: -130px;
    width: 100%;
  }

  .groupTitle{
    margin-top: -150px;
  }

  .offer-box{
    width: 100%;
  }

  .lastBut{
    margin-left: 25px;
  }

  .rectangle-text {
    flex-direction: column; /* Stack items vertically */
  }
  
  .text-section {
    flex-direction: column; 
    text-align: left; 
    font-size: 12px;
  }

  .text-section-computer{
    display: none;
  }
  
  .mvc-icon {
    margin-bottom: 10px; /* Space between icon and text */
  }

  .sec3Title{
    font-size: 30px;
  }

  #section3{
    height: 100%;
  }

   #section2{
    height: 100%;
    margin-top: 200px;
  }
  
}

</style>