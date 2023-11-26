/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./Ghost/*.jpg",
  "./sprites/admin2/*.jpg",
  "./views/*.ejs",
  "./views/partials/*.ejs", 
  "./views/layouts/*.ejs",
  "./views/Pages/Teacher/*.ejs",
  "./views/Pages/Chat/*.ejs",
  "./views/Pages/admin/*.ejs",
    "./views/Pages/*.ejs"],
  theme: {

      screens: {
           'small'  : {"max": "700px"},
            'larger' : {"min" : "700px"}
            
      }
     ,
    extend: {
     
      backgroundImage: {
        'custom': "url(Default-Profile.png)",
         "admin_thing" : "url(sprites/admin2.jpg)"
      },
      height : {
         "full2" : "100vh",
         "wrapper" : "440px",
          
      },
      width : {
        "smpart" : "30%",
        "chat_width" : "500px"
         
     }

    },
  },
  plugins: [],
}

