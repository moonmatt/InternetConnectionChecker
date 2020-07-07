# Internet Connection Checker

This tool allows you to make a costant checks on your Internet connection using the Speedtest.net API. I'm sorry if the code is not beautiful but I've made this just for myself in less than a day, however, it should work correctly.

# Screenshot

![Alt text](https://i.imgur.com/hVuKByr.png "A screenshot of the project")

# What you need

- A device that is always online, I'm using a Raspberry Pi 3 b+, you can use whatever you want, even a pc.
- An internet connection (obviously).
- Node.js installed on your device (https://nodejs.org/).

# Libraries needed

- Express (https://www.npmjs.com/package/express), needed for the website.
- Ejs (https://www.npmjs.com/package/ejs), needed for the frontend of the website.
- Moment (https://www.npmjs.com/package/moment), needed to get the current time.
- Node-Cron (https://www.npmjs.com/package/node-cron), needed to execute the speedtest frequently.

# How to get started

First of all, install Node.js, then create a folder, go on the command prompt, and type 
```bash
npm init
```
to initialize the project, then install all the required libraries (listed over).
At this point download this repo and move all the files and folders (/public, /views and app.js) to your project's folder.

Now everything should be ready, type in the console
```bash
node app.js
```
then visit the website localhost:1029 and wait for the first results to be shown.
If you want to change the frequency of the speedtest, open app.js with a text editor and change the crontab on the line number 15. At the moment it is set to run every 2 minutes.

# Conclusion

I hope you like this project, if you have any suggestion or improvement, please message me on Telegram, @moonmatt.
My website is https://moonmatt.cf

Reddit post: https://www.reddit.com/r/webdev/comments/hmga2d/i_noticed_my_connection_was_not_normal_ive_made_a/


