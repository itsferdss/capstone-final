<template>
  <div class="landing-page"> <!-- Change the <body> to a <div> and add a wrapper -->
    <header>
      <div class="topnav">
        <img class="logo" src="../assets/newlogo.png"/>
        <div class="logo-separator"></div>
        <img class="MVClogo" src="../assets/MVC_logo.png"/>
        <div class="nav-links">
          <a href="#section1" class="nav-link" :class="{ active: activeSection === 'section1' }">Home</a>
          <a href="#section2" class="nav-link" :class="{ active: activeSection === 'section2' }">About</a>
          <a href="#section3" class="nav-link" :class="{ active: activeSection === 'section3' }">Contact Us</a>
        </div>
      </div>
    </header>
    <div id="section1" class="full-height">
    <div class="content">
      <div class="background-overlay"></div>
      <div>
        <h1 class="Title">Elevate Your Look, <br> Enhance Your Sight</h1>
        <p class="subtitle">MVC Optical CLinic is one of the most trusted eye care business with a <br>
          focus on style and reliability. At MVC Optical Clinic, we blend trusted expertise<br>
           with fashionable solutions to keep your vision and style on point.  </p>
      </div>
      <div class="button-borders">
        <button class="primary-button" @click="goToLogin"> Shop Now!
        </button>
      </div>
    </div>
    <footer>
      <div class="footer">
        <div class="footer-item">
          <div class="icon-box">
            <i class="mdi mdi-stethoscope"></i>
          </div>
          <div class="text-content">
            <p class="miniTitle">Free Check-Up</p>
            <p class="miniSubTitle">Check now and you will know</p>
          </div>
        </div>
        <div class="footer-item">
          <div class="icon-box">
            <i class="mdi mdi-headset"></i>
          </div>
          <div class="text-content">
            <p class="miniTitle">24/7 Support</p>
            <p class="miniSubTitle">Check now and you will know</p>
          </div>
        </div>
        <div class="footer-item">
          <div class="icon-box">
            <i class="mdi mdi-cogs"></i>
          </div>
          <div class="text-content">
            <p class="miniTitle">Free Adjustment</p>
            <p class="miniSubTitle">Check now and you will know</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>

<!--SECTION 2-->
  <div class="full-height" id="section2">
      <div class="about">
        <h1>About us</h1>
      </div>
        <img class="echode" src="../assets/echode_logo.png"/>
      <div class="intro">
        <p>
          We are a dynamic partnership between IT students and MVC Optical Clinic, 
          united by a shared vision to revolutionize eye care through technology.<br>
          Our collaboration   blends technical expertise with industry insight to 
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
            <div class="team-member">
              <img src="/src/assets/gian.png" alt="Gian King Caampued" class="team-image">
              <p class="team-text">Gian King Caampued <br> <br>Hustler</p>
            </div>
            <div class="team-member">
              <img src="/src/assets/me.jpg" alt="Ferdinand C. Espiritu II" class="team-image">
              <p class="team-text">Ferdinand C. Espiritu II<br> <br> Hipster</p>
            </div>
            <div class="team-member">
              <img src="/src/assets/dm.jpg" alt="Denmark Lobo" class="team-image">
              <p class="team-text">Denmark Lobo<br> <br> Hacker</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--SECTION 3-->
    <div class="full-height" id="section3">
      <div class="model-container">
        <!-- Image with overlay -->
        <img class="model" src="../assets/model3.jpg" alt="Model"/>
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
            <div class="text-section">
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
      goToLogin: () => router.push('/login'),  // Use router to navigate
      activeSection,
    };
  },
};
</script>
<style lang="scss" scoped>
html {
  scroll-behavior: smooth; /* Smooth scrolling for anchor links */
}
.topnav {
  position: fixed;
  width: 100%;
  background-color: #016888; /* Dark blue background */
  margin-top: -20px;
  margin-left: 0;
  margin-right: 0;
  overflow: hidden;
  z-index: 100;
  padding: 0; /* Removed padding to use line-height */
  display: flex; /* Flexbox for better alignment */
  align-items: center;
}


#section1 {
  padding-top: 80px; /* Adjust this value to match the height of your navbar */
  /* The rest of your styles for section1 */
}

.logo-separator {
  height: 100px; /* Adjust height to match logos */
  width: 2px; /* Line thickness */
  background-color: black; /* Line color */
  margin: 0 20px; /* Space around the separator */
}

.nav-links {
  margin-left: auto; /* Pushes the nav links to the right */
  display: flex; /* Ensures that links align horizontally */
}

.nav-links a {
  color: black;
  display: block;
  text-align: center;
  padding: 30px 16px; /* Adjust padding for height */
  text-decoration: none;
  line-height: 25px; /* Matches the height of the .topnav */
  margin-top: 15px;
}

.nav-links a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.active {
  background-color: #083545;
  color: white;
}

.landing-page {
  font-family: Arial, sans-serif;
  margin: 0; /* Remove any default margins */
  padding: 0; /* Remove any default padding */
  min-height: 100vh; /* Ensure it covers the full height of the viewport */
  width: 100%; /* Full width */
}

.background-overlay {
  position: absolute; /* Position it absolutely to fill its parent */
  top: 0;
  left: 0;
  width: 100%;
  height: 119%;
  background-image: url('../assets/eyesbackground.jpg'); /* Your background image */
  background-size: cover;
  background-position: center;
  opacity: 0.9; /* Adjust opacity here */
  z-index: -1; /* Ensure it is behind the content */
}

.content {
  position: relative; /* Keep content above background image */
  z-index: 1; /* Ensure content is on top of background */
  padding: 20px;
  color: white; /* Adjust text color for better visibility on the background */
}

footer {
  background-color: #016888; /* Same dark blue as the top bar */
  color: white;
  text-align: center;
  padding: 40px 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  overflow: hidden;
}

.MVClogo, .logo {
  height: 60px;
  margin-top: 25px;
  margin-left: 20px; /* Adjusted margin */
  border-radius: 10px;
}

.Title{
  font-family: 'Times New Roman', Times, serif;
  color: rgb(17, 62, 100);
  font-weight: bold;
  font-size: 50px;
  margin-left: 30px;
  margin-top: 40px;
}

.subtitle{
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

// .primary-button:hover:before {
//  background-color: white;
// }

// .primary-button:hover:after {
//  background-color: white;
// }

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
    /* opacity: 0.3; */
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
    /* opacity: 0.3; */
 z-index: 0;
}

.shape {
 fill: #0E1822;
}

footer {
  background-color: #016888; /* Background color */
  color: white; /* Text color */
  padding: 30px; /* Padding around the footer */
}

.footer {
  display: flex; /* Flexbox for horizontal layout */
  flex-direction: row; /* Stack items vertically */
}

.footer-item {
  display: flex; /* Flexbox for icon and text alignment */
  align-items: left; /* Center items vertically */
  margin-bottom: 20px; /* Space between footer items */
  margin-left: 20px;
}

.icon-box {
  display: flex; /* Flexbox for centering icon */
  justify-content: center; /* Center icon horizontally */
  align-items: center; /* Center icon vertically */
  width: 40px; /* Width of the box */
  height: 40px; /* Height of the box */
  background-color: #03233c; /* Background color for the box */
  color: #c39f00; /* Icon color */
  border-radius: 10%; /* Make the box round */
  margin-top: -10px; /* Space between icon box and text */
  margin-right: 5px;
  margin-left: 10px;

}

.icon-box i {
  font-size: 24px; /* Icon size */
}

.text-content {
  display: flex; /* Flexbox for vertical stacking */
  flex-direction: column; /* Stack text vertically */
}

.miniTitle {
  margin: 0; /* Remove default margin */
  font-weight: bold; /* Bold for the main text */
  text-align: left;
}

.miniSubTitle {
  margin: 0; /* Remove default margin */
  font-size: 12px;
  color: rgb(194, 194, 194);
}

#section2 {
  position: relative; /* Establish a positioning context */
  height: 630px;
  background-color: white;
  margin: 0;
  padding: 0;
  margin-top: 100px;
  overflow: hidden; /* Ensure the image doesn't overflow */
}

.about {
  font-family: 'Times New Roman', Times, serif;
  text-align: center;
  position: relative; /* Ensure content is above the image */
  z-index: 1; /* Bring the text above the background image */
  margin-top: 100px;
}


.intro {
  margin-top: 50px;
  text-align: center;
  font-family: 'Times New Roman', Times, serif;
  position: relative; /* Ensure content is above the image */
  z-index: 1; /* Bring the text above the background image */
}

.echode {
  position: absolute; /* Position the image absolutely within #section2 */
  top: 0;
  left: 1;
  width: 600px; /* Stretch across the full width */
  height: 600px; /* Stretch across the full height */
  object-fit: cover; /* Maintain aspect ratio while covering the area */
  opacity: 0.3; /* Adjust opacity as needed */
  z-index: 0; /* Ensure the image stays behind the text */
  margin-left: 450px;
}

.nav-links a.active {
  background-color: #bbbdbe;
  color: white;
}

.team-images {
  display: flex; /* Align items in a row */
  justify-content: center; /* Center align horizontally */
  gap: 70px; /* Space between each team member */
  margin-top: 100px;
}

.team-member {
  text-align: center; /* Center-align the text and image */
}

.team-image {
  width: 150px; /* Adjust size as needed */
  height: 150px; /* Ensure height matches width for a perfect circle */
  border-radius: 50%; /* Makes the image round */
  object-fit: cover; /* Ensures the image covers the circle without distortion */
  display: block; /* Ensures the image is centered with the text */
  margin: 0 auto; /* Center image horizontally */
}

.team-text {
  margin-top: 10px; /* Space between image and text */
  font-family: Arial, sans-serif; /* Ensure consistency with other fonts */
  font-size: 16px; /* Adjust as needed */
  color: #333; /* Adjust color if needed */
}

#section3{
  height: 600px;
}

.model-container {
  position: relative;
  width: 100%;
  height: 350px; /* Height of the model image container */
  margin-top: 75px; /* Adjust margin if needed */
}

/* Model image styling */
.model {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the container */
}

/* Black overlay styling */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Black with 50% opacity */
}

/* Text on top of the overlay */
.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center text */
  color: white; /* Text color */
  text-align: center; /* Center align text */
  font-size: 24px; /* Adjust font size */
  font-weight: bold; /* Optional: Make the text bold */
}

/* Rectangle styling */
.rectangle-container {
  position: relative;
  width: 100%;
  bottom: 0; /* Stick the rectangle to the bottom */
}

.half-screen-rectangle {
  position: relative; /* Make it a positioning context for the text */
  width: 100%;
  height: 50vh; /* Or whatever height you need */
  background: #016888; /* Background color of the rectangle */
  color: black; /* Text color */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.rectangle-text {
  display: flex;
  justify-content: space-around; /* Distribute space evenly between children */
  width: 100%; /* Full width of the container */
  max-width: 1200px; /* Limit the width if needed */
  padding: 10px;
  box-sizing: border-box; /* Include padding and border in element's total width and height */
}

.rectangle-text > div {
  margin: 0 10px; /* Adjust spacing between sections */
  flex: 1; /* Allow each section to grow and shrink as needed */
}

.sec3Title{
  font-family: 'Times New Roman', Times, serif;
  font-size: 50px;
}

.lastBut{
  margin-top: -170px;
  margin-left: 575px;
}

.mvcInfo, .mvcAdd {
  font-family: 'Times New Roman', Times, serif;
  margin: 0; /* Reset margin */
}

.mvcInfo {
  margin-bottom: 10px; /* Space below the title text */
  font-weight: bold;
}

.mvcAdd {
  margin-top: 5px; /* Space above each address or contact detail */
}

</style>