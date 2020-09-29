// require the discord.js module
let clientkey = "NzU5ODI5MTgxNjk2OTY2NjU2.X3DMEQ.6siy-aizb7OgSOUcZTWS7wkUB-o"
const Discord = require('discord.js');
const puppeteer = require('puppeteer-extra')
const $ = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
var AsciiTable = require('ascii-table')
var config = require('./botconfig.json')
puppeteer.use(StealthPlugin())
let browser
let page
function scrape(url) {
    return new Promise(resolve => {
        let resolvearry = []
        let index1 = 0
        $('tr', url).each(function () {
            console.log(index1);
            index1++
            let innerarray = []
            let index = 0
            $('td', $(this)).each(function () {
                let urltocheck = $(this).attr('href')

                if (index1 <= 29 && index1 >= 5) {

                    console.log("text  " + index + " " + $(this).text())
                    innerarray[index] = $(this).text()
                }

                index++
            });
            resolvearry.push(innerarray)
        });
        resolve(resolvearry)
    });
}
// create a new Discord client
const client = new Discord.Client();
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', async () => {
    console.log('Ready!');
    browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage()
});
// login to Discord with your app's token
client.login(config.discordkey);
client.on('message', async (message) => {
    let prefix = config.prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim()
    const command = args
    let a= command.replace(" ","%A0")
    await page.goto("https://secure.runescape.com/m=hiscore_oldschool/hiscorepersonal?user1=" + a)
    let linkarray = await scrape(await page.content())
    console.table(linkarray)
    // send back "Pong." to the channel the message was sent in
    let dingdong = linkarray.join()
    let botstuff = "bot call " + dingdong
    botstuff = dingdong.toString()
    var table = new AsciiTable(command)
    table.setHeading('Name', 'level','total level')
    linkarray.forEach(element => {
        //check for undefned
        if(element[1]){
            someText = element[1].replace(/(\r\n|\n|\r)/gm, "");
            table.addRow(someText, element[3],element[4])
        }
    });
    console.log(message.author.id)
    message.channel.send(table.toString());
});