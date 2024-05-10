<template>
<div>
    <!--section1-->
    <div id="section1" class="full-height">
      <div class="background-container"></div>

      <div class="word">
        <h3 class="greet">Hello User!</h3>
        <h1 class="title">Welcome to Pediacare!</h1>
        <h5 class="subtitle">Empowering healthcare innovation</h5>
      </div>
    </div>

    <!--section2-->
    <div class="full-height" id="section2">
      <div class="about">
        <h1>About us</h1>
      </div>

      <div class="intro">
        <p>
          We are Team ECHODE, students of Gordon College, College of Computer Studies, BSIT-3B and 
          we are in-route of  developing a user-friendly platform for managing patient records, 
          tracking child growth, and enhancing communication between pediatricians and parents. The idea 
          for "Pedia Care" was born out of a desire to make a difference in the healthcare sector. Based  
          on experience and research we students identified the need for a digital solution to streamline 
          clinic operations and improve patient care.The project will result in a mobile application that 
          pediatricians can use in their clinics and parents can use to track their child's healthcare needs. 
          The application will feature digital record-keeping, growth tracking, vaccination schedules, and 
          communication tools.
        </p>
      </div>

     <div class="team">
        <h1>Our Team</h1>
          <div class="team-images">
            <div class="team-member">
              <img src="/src/assets/gian.png" alt="Team Member" class="team-image">
              <p class="team-text">Gian King Caampued <br> Hustler</p>
            </div>
            <div class="team-member">
              <img src="/src/assets/me.jpg" alt="Team Member" class="team-image">
              <p class="team-text">Ferdinand C. Espiritu II<br> Hipster</p>
            </div>
            <div class="team-member">
              <img src="/src/assets/dm.jpg" alt="Team Member" class="team-image">
              <p class="team-text">Denmark Lobo<br> Hacker</p>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

</script>


<style scoped>
html, body {
    margin: 0;
    padding: 0;
}

.background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-image: url("/src/assets/backround.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.word {
    margin-top: 13%;
    margin-left: 150px;
    padding: 18px 25px;
}

.greet {
    color: #D2D5D4;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 50px;
    margin: 0;
}

.title {
    color: #D2D5D4;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 70px;
    margin: 0;
}

.subtitle {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin: 10;
    font-size: 20px;
    color: #1F2530;
}

.main {
    position: relative;
}

#section1 {
    height: 100vh;
    margin: 0;
    padding: 0;
}

#section2 {
    height: 650px;
    background-color: white;
    margin: 0;
    padding: 0;
}

.about{
  text-align: center;
  margin-top: 0px;
}

.intro {
  text-align: center;
}

.team{
  text-align: center;
  margin-top: 70px;
}

.team-images {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.team-member {
  margin: 90px; /* Adjust spacing between team members */
  margin-top: 0px;
}

.team-image {
  width: 200px; /* Adjust the width of team images */
  height: 200px; /* Adjust the height of team images */
  border-radius: 50%; /* Make team images circular */
}

.team-text {
  margin-top: 10px; /* Adjust spacing between image and text */
  font-size: 20px; /* Adjust font size of text */
}
</style>