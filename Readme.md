# Ray Experiment

_This project was generated with [create-empirica-app](https://github.com/empiricaly/create-empirica-app)._

This is an experiment powered by [Empirica](https://empirica.ly/) (here is a basic [tutorial](https://www.youtube.com/watch?v=K2YhEZey_58&list=PLPQelvUwyVgiawBDk3Sp74QMfL8RPgORW&index=2&ab_channel=Empirica) on how to set-up Empirica). Through this study, we want to investigate **how communication affects team performance**. The task requires that multiple people work together identifying symbols for multiple trials. 


# Experiment Details:
## The task
In this this experiment, participants are placed into teams of N people. Participants are assigned a set of symbols. One and only one of those symbols will be shared among the players. The participants task is to discover the shared symbol by communiucating with each other. Participants should communicate until they feel they have received enough information to correctly guess what the common symbol is. After a participant submits their guess, they are allowed to reconsider their answer in the case they change their mind.

After everyone on the team has submitted, the team will be told if everyone chose the right answer or not. Then, they move on to the next trial of the experiment. Throughout the experiements, there will be mid-game surveys for participants to fill out. They will be asked to describe the leadership dynamics of their group, how satisfied they are with their teammates, their personal performance. 


# Running this App Locally

## General  Setup
If you are using a windows operation system, follow the instructions [here](https://docsv1.empirica.ly/getting-started/setup/windows-instructions) to set up a Windows Subsystem for Linux (WSL). Empirica is built on industry-standard open-source web technologies which run best in Unix-like operating systems such as Linux and MacOS. 

If you haven't already:

- Install `Node.js` and `npm` here: [https://nodejs.org/en/](https://nodejs.org/en/)
- Install `Meteor` here: [https://www.meteor.com/install](https://www.meteor.com/install)

## Preparing this app
1. Download the repository (and unzip). Alternatively, from terminal just run `git clone https://github.com/itzdonaldxd/ray-experiment.git`
2. Go into the folder with `meteor npm install`

3. Install the required dependencies with `meteor npm install`

4. Create a settings file. i.e.`settings.json`. Within this file, add a JSON object. Fill in all of the data marked <>. The fields within the admins object are for accessing the admin page in the Empirica application. The fields within the galaxy.meteor.com object are for accessing the application's database (More details within the deployment guide)

```
{
    "admins": [
      {
        "username": "admin",
        "password": <password>
      }
    ],
    "galaxy.meteor.com": {
      "env": {
        "MONGO_URL": "mongodb+srv://<read&write username>:<read&write password>@<connection>/<database name>?retryWrites=true&w=majority",
        "MONGO_OPLOG_URL": "mongodb+srv://<oplog username>:<oplog password>@<connection>/local"
      }
    },
    "public": {
      "playerIdParam": "workerId",
  
      "playerIdParamExclusive": false,
  
      "debug_newPlayer": false,
  
      "debug_resetSession": false,
  
      "debug_resetDatabase": true,
  
      "debug_gameDebugMode": true
    }
  }

```

## Launching the app

1. You can now run the app on your local machine with: This can take a few minutes.

```
meteor --settings settings.json
```

2. This will start the app that you can access as a participant:
[https:/localhost:3000/](https:/localhost:3000/)

3. You can access the admin panel here:
[https:/localhost:3000/admin](https:/localhost:3000/admin). Log in with the credentials username: `admin` and the password you have in local.json

## Loading the factors and treatments

To use the app, you usually need to use treatments and factors. Some might be prepared in a `.yaml` file (e.g., `factors.yaml`). In the **admin panel**:
- click on the **Configuration** button
- click on **import**
- select the `.yaml` file you want to import the factors and treatments from
- wait a few seconds for the factors and treatments to be imported

## Testing the app

To run a game create a new `batch` with the games of treatments you want to use and click start on the batch.

Open a player tab by going to [https:/localhost:3000/](https:/localhost:3000/) or clicking on **open app**.

The player that you open with [https:/localhost:3000/](https:/localhost:3000/) is cached on your browser. Whenever you start a game with this player, your local app will keep that information. To play again there are multiple things you can do:
- Click on the **Reset current session** button on the header of a tab with your player to reset this player, and create a new game for this player to join.
- Click on the **New Player** button on the header of a tab with your player to open a new tab with a different player (you will see the id of that player in the title of the tab).
- Go to the **Players** tab in the admin panel and retire players that have finished or cancelled.

**The app will hot reload as you save changes to your code.**

# Structure of the App

## Client

All code in the `/client` directory will be ran on the client. The entry point
for your app on the client can be found in `/client/main.js`. In there you will
find more details about how to customize how a game _Round_ should be rendered,
what _Consent_ message and which _Intro Steps_ you want to present the players
with, etc.

The HTML root of you app in `/client/main.html` shouldn't generally be changed
much, other than to update the app's HTML `<head>`, which contains the app's
title, and possibly 3rd party JS and CSS imports.

All styling starts in `/client/main.less`, and is written in
[LESS](http://lesscss.org/), a simple superset of CSS. You can also add a plain
CSS files in `/client`.

The `/client/game`, `/client/intro`, `/client/exit` directories all contain
[React](https://reactjs.org/) components, which compose the UI of your app.
If you are new to React, we recommend you try out the official
[React Tutorial](https://reactjs.org/tutorial/tutorial.html).

## Server

Server-side code all starts in the `/server/main.js` file. In that file, we set
an important Empirica integration point, the `Empirica.gameInit`, which allows
to configure each game as they are initiated by Empirica.

From there we import 2 other files. First the `/server/callback.js` file, which
contains all the possible callbacks used in the lifecycle of a game. These
callbacks, such as `onRoundEnd`, offer powerful ways to add logic to a game in a
central point (the server), which is often preferable to adding all the logic on
the client.

Finally, the /server/bots.js file is where you can add bot definitions to your app.

## Public

The `/public` is here to host any static assets you might need in the game, such
as images. For example, if you add an image at `/public/my-logo.jpeg`, it will
be available in the app at `http://localhost:3000/my-logo.jpeg`.

# Learn more

- Empirica Website: [https://empirica.ly/](https://empirica.ly/)
- Empirica documentation: [https://docs.empirica.ly/](https://docs.empirica.ly/)
- Meteor Tutorial: [https://www.meteor.com/tutorials/react/creating-an-app](https://www.meteor.com/tutorials/react/creating-an-app)
- React Tutorial: [https://reactjs.org/tutorial/tutorial.html](https://reactjs.org/tutorial/tutorial.html)
- LESS Intro: [http://lesscss.org/#overview](http://lesscss.org/#overview)
- JavaScript Tutorial: [https://javascript.info/](https://javascript.info/)
