

# Transferring Data with Strapi Cloud
Welcome to another Strapi Cloud video! In this video, we're going to take our previously deployed application and show you how to use our Deetz transfer feature to move your local data up to your cloud application.

## Deployment
If you missed the video on how to deploy your initial project to Strapi Cloud, we'll make sure to share it somewhere here - go check it out!

## Environmental Variable
The most important thing to consider is if you want to use the Deetz transfer feature, you need to provide the environmental variable. So in our admin.js file located in the config folder, you need to add this code snippet, transfer, and inside there, pass your token and include this line. We are going to add this environmental variable inside our cloud application. I also went ahead and added it in my local instance as well.

## Error
If you forget to add your environmental variable when deploying your application to Strapi Cloud, you will run into this error. Server wasn't able to start properly because we're missing our transfer token salt.

## Settings
So let's go ahead fix this issue now. Going into settings, clicking on the variables link, let's add our new variable. Click on add variable, enter the name, and we're going to add our value. Click save. Inside of our deploys, go ahead and re-trigger the deploy to make sure to include the new variables.

## Transfer Token
To use the Deetz data transfer, we need to create a token. You could do so by going into settings under transfer tokens, create new transfer token. Let's give it a name, call it transfer my token. How original. Let's select unlimited for testing purposes and click save. Now this is going to be shown to you only once. So make sure when you copy the token, you put it somewhere safe.

## Transferring Data
In our local project from which we want to transfer the data, let's type yarn strappy transfer dash dash two and insert our URL. After providing the token, the transfer will delete all the data in the remote database and media files. So before importing data, make sure that you have all your databases and data backed up.

## Results
We succeeded in moving all our data from our local instance of Strapi to the cloud. Let's do the final test by checking it out on our deployed application. Go to content manager and voila! Look at that. We have our data now living in the cloud.

## Questions
If you have any questions go ahead and join our discord server - I'm going to make sure to link to it in the description below. And let us know any questions in the comments that you want us to answer in following videos. Thanks a lot for joining us today and I'll see you in the next video.