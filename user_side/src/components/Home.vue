
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
        <h1>Our Team</h1>
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
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: url("/src/assets/Background-pic.png");
    background-size: cover;
    background-position: center;
    }

.word{
    margin-top: 13%;
    margin-left: 150px;
    padding: 18px 25px;
}

.greet{
    color: #D2D5D4;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 50px;
    margin: 0;
}

.title{
    color:#D2D5D4 ;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 70px;
    margin: 0;
}

.subtitle{
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin: 10;
    font-size: 20px;
    color: #1F2530;
}

.main {
    position: relative;
}

#section1{
    height: 800px;
}

#section2{
    height: 800px;
    background-color: white;
}

</style>