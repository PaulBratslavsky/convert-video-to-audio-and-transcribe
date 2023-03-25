

Welcome to another Strapi Cloud video! In this video, I'm going to show you how to use the DEITS transfer feature to be able to transfer your local data up to your cloud application. 

## Deploying Your Initial Project
If you missed the video on how to deploy your initial project to Strapi Cloud, I'll make sure to share it somewhere here. Go check it out. 

## Adding Environmental Variables
The most important thing to consider is if you want to use the Deetz transfer feature, you need to provide the environmental variable. So in your admin.js file located in the config folder, you need to add this code snippet, transfer, and inside there, pass your token and include this line here. We are going to add this environmental variable inside our cloud application. I also went ahead and added it in my local instance as well.

## Creating a Transfer Token
Going into settings, clicking on the variables link, let's add our new variable. Click on add variable, enter the name, and we're going to add our value. Click save. Inside of our deploys, go ahead and re-trigger the deploy to make sure to include the new variables. 

## Transferring Data
Now let's go back into our terminal. So in our local project from which we want to transfer the data, let's type yarn strappy transfer dash dash two and insert our URL. Now it's going to ask us for our token. I hope you saved it somewhere safe. I'm going to go ahead and paste my token and press enter. Remember the transfer will delete all the data in the remote database and media files. So before importing data, make sure that you have all your databases and data backed up. 

## Final Test
Let's do the final test by checking it out on our deployed application. Here I am inside my deployed application. Go to content manager and voila! Look at that. We have our data now living in the cloud. That is super awesome. 

Thanks for joining us today and I hope you have a better understanding of how to use the Deetz transfer feature. If you have any questions, join our discord server and let us know in the comments. See you in the next video!